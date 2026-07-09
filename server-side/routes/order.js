import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Recipe from "../models/recipe.js";
import Stock from "../models/Stock.js";

const router = express.Router();

const generateBillNo = () => {
  const date = new Date();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `CAF-${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}-${random}`;
};

const escapeRegex = (value) => String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizePaymentMethod = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (["cash", "cash payment", "cashpayment"].includes(normalized)) return "Cash";
  if (["esewa", "e-sewa", "e sewa"].includes(normalized)) return "eSewa";
  if (["khalti", "khalti payment"].includes(normalized)) return "Khalti";
  if (["online", "online payment", "qr", "bank transfer"].includes(normalized)) return "Online";
  return "Unknown";
};

const reduceStockForApprovedOrder = async (order) => {
  if (!order?.items?.length) return;

  for (const item of order.items) {
    const orderQty = Number(item.quantity || 1);
    if (orderQty <= 0) continue;

    let recipe = null;
    if (item.menuId) {
      recipe = await Recipe.findOne({ menuId: item.menuId });
    }

    if (!recipe && item.title) {
      recipe = await Recipe.findOne({
        menuTitle: { $regex: new RegExp(`^${escapeRegex(item.title)}$`, "i") },
      });
    }

    if (!recipe?.ingredients?.length) continue;

    for (const ingredient of recipe.ingredients) {
      const ingredientQty = Number(ingredient.quantity || 0) * orderQty;
      if (!ingredient.name || ingredientQty <= 0) continue;

      const stockItem = await Stock.findOne({
        name: { $regex: new RegExp(`^${escapeRegex(ingredient.name)}$`, "i") },
      });

      if (!stockItem) continue;

      stockItem.currentStock = Math.max(0, Number(stockItem.currentStock || 0) - ingredientQty);
      stockItem.status = stockItem.currentStock > 0 ? "active" : "inactive";
      await stockItem.save();
    }
  }
};

router.post("/create", async (req, res) => {
  try {
    const { customerName, phone, tableNumber, items, total } = req.body;

    if (!customerName || !phone || !tableNumber || !items?.length) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const newOrder = await Order.create({
      billNo: generateBillNo(),
      customerName,
      phone,
      number: parseInt(tableNumber),
      items,
      total,
      status: "pending",
      paymentStatus: "unpaid",
      paymentMethod: "Unknown",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.put("/approve/:id", async (req, res) => {
  try {
    const existingOrder = await Order.findById(req.params.id);

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (existingOrder.status === "approved") {
      return res.status(200).json({
        success: true,
        message: "Order already approved",
        order: existingOrder,
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    await reduceStockForApprovedOrder(updatedOrder);

    res.status(200).json({
      success: true,
      message: "Order Approved",
      order: updatedOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.put("/reject/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order rejected successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.put("/payment/:id", async (req, res) => {
  try {
    const { method } = req.body;
    const paymentMethod = normalizePaymentMethod(method);

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus: "paid",
        paymentMethod,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Payment marked as paid via ${paymentMethod}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Order Deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.get("/billNo/:billNo", async (req, res) => {
  try {
    const order = await Order.findOne({ billNo: req.params.billNo });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Bill Not Found",
      });
    }

    if (order.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Order not approved yet",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
