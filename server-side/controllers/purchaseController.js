import mongoose from "mongoose";
import Purchase from "../models/Purchase.js";
import Stock from "../models/Stock.js";
import Supplier from "../models/supplier.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const resolveSupplier = async (supplierInput) => {
    if (!supplierInput) return null;

    if (typeof supplierInput === "object" && supplierInput._id) {
        return supplierInput._id;
    }

    const rawValue = String(supplierInput).trim();
    if (!rawValue) return null;

    if (mongoose.Types.ObjectId.isValid(rawValue)) {
        const foundSupplier = await Supplier.findById(rawValue);
        return foundSupplier?._id ?? null;
    }

    const foundSupplier = await Supplier.findOne({
        $or: [
            { supplierName: { $regex: new RegExp(`^${escapeRegex(rawValue)}$`, "i") } },
            { supplierCode: { $regex: new RegExp(`^${escapeRegex(rawValue)}$`, "i") } },
        ],
    });

    return foundSupplier?._id ?? null;
};

const syncStockFromPurchaseItem = async (item) => {
    const itemName = (item.stock || "").toString().trim();
    if (!itemName) {
        throw new Error("Each purchase item must include a stock name.");
    }

    const quantity = Number(item.quantity || 0);
    const purchasePrice = Number(item.purchasePrice || 0);
    const unit = item.unit || "pcs";

    let stockItem = await Stock.findOne({
        name: { $regex: new RegExp(`^${escapeRegex(itemName)}$`, "i") },
    });

    if (!stockItem) {
        const randomSku = `RAW-${itemName.toUpperCase().replace(/\s+/g, "-")}-${Math.floor(1000 + Math.random() * 9000)}`;

        stockItem = await Stock.create({
            name: itemName,
            sku: randomSku,
            category: "General",
            unit,
            currentStock: quantity,
            minimumStock: 5,
            costPerUnit: purchasePrice,
            sellingPrice: purchasePrice * 1.2,
            status: "active",
        });
    } else {
        stockItem.currentStock = Math.max(0, Number(stockItem.currentStock || 0) + quantity);
        stockItem.unit = unit;
        stockItem.costPerUnit = purchasePrice || stockItem.costPerUnit || 0;
        stockItem.sellingPrice = stockItem.sellingPrice || purchasePrice * 1.2;
        await stockItem.save();
    }

    return {
        stock: stockItem._id,
        quantity,
        unit,
        purchasePrice,
        total: Number(item.total || quantity * purchasePrice),
    };
};

// 1. GET ALL PURCHASES (Populated fields for clean UI)
export const getPurchase = async (req, res) => {
    try {
        const purchase = await Purchase.find().populate("items.stock");
        return res.status(200).json({
            success: true,
            purchase,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// 2. GET SINGLE PURCHASE
export const singlePurchae = async (req, res) => {
    try {
        const purchaseitem = await Purchase.findById(req.params.id).populate("items.stock");

        if (!purchaseitem) {
            return res.status(404).json({
                success: false,
                message: "Purchase items not found",
            });
        }

        return res.status(200).json({
            success: true,
            Purchase: purchaseitem,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// 3. ADD PURCHASE (With smart stock creation or adjustment)
export const addPurchase = async (req, res) => {
    try {
        const { purchaseNumber, supplier, items, subTotal, discount, grandTotal, paymentStatus, paymentMethod, paidAmount, dueAmount, note } = req.body;
        const resolvedSupplier = await resolveSupplier(supplier);
        if (!resolvedSupplier) {
            return res.status(400).json({
                success: false,
                message: "Supplier not found. Please select a valid supplier.",
            });
        }

        const processedItems = [];
        for (const item of items || []) {
            const processedItem = await syncStockFromPurchaseItem(item);
            processedItems.push(processedItem);
        }

        const purchase = await Purchase.create({
            purchaseNumber,
            supplier: resolvedSupplier,
            items: processedItems,
            subTotal: Number(subTotal || 0),
            discount: Number(discount || 0),
            grandTotal: Number(grandTotal || 0),
            paymentStatus,
            paymentMethod,
            paidAmount: Number(paidAmount || 0),
            dueAmount: Number(dueAmount || 0),
            note,
        });

        return res.status(201).json({
            success: true,
            message: "Purchase added successfully and stock synchronized!",
            data: purchase,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// 4. UPDATE PURCHASE (Smart calculation to avoid stock imbalance)
export const updatePurchase = async (req, res) => {
    try {

        const oldPurchase = await Purchase.findById(req.params.id);

        if (!oldPurchase) {
            return res.status(404).json({ success: false, message: "Purchase not found" });
        }

        for (const oldItem of oldPurchase.items || []) {
            const stock = await Stock.findById(oldItem.stock);
            if (stock) {
                stock.currentStock = Math.max(0, Number(stock.currentStock || 0) - Number(oldItem.quantity || 0));
                await stock.save();
            }
        }

        const resolvedSupplier = await resolveSupplier(req.body.supplier);
        if (!resolvedSupplier) {
            return res.status(400).json({
                success: false,
                message: "Supplier not found. Please select a valid supplier.",
            });
        }

        const processedItems = [];
        for (const item of req.body.items || []) {
            const processedItem = await syncStockFromPurchaseItem(item);
            processedItems.push(processedItem);
        }

        const updatedBody = {
            ...req.body,
            supplier: resolvedSupplier,
            items: processedItems,
            subTotal: Number(req.body.subTotal || 0),
            discount: Number(req.body.discount || 0),
            grandTotal: Number(req.body.grandTotal || 0),
            paidAmount: Number(req.body.paidAmount || 0),
            dueAmount: Number(req.body.dueAmount || 0),
        };
        const purchaseitems = await Purchase.findByIdAndUpdate(
            req.params.id,
            updatedBody,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Purchase updated and stock balances adjusted successfully!",
            purchase: purchaseitems,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// 5. DELETE PURCHASE (Reverts the stock levels back)
export const deletePurchase = async (req, res) => {
    try {
        const purchase = await Purchase.findById(req.params.id);
        if (!purchase) {
            return res.status(404).json({
                success: false,
                message: "Purchase items not found",
            });
        }

        for (const item of purchase.items || []) {
            const stock = await Stock.findById(item.stock);
            if (stock) {
                stock.currentStock = Math.max(0, Number(stock.currentStock || 0) - Number(item.quantity || 0));
                await stock.save();
            }
        }

        await Purchase.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Purchase deleted and stock reverted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};