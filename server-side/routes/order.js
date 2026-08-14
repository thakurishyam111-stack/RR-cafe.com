import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Menu from "../models/menu.js";
import Recipe from "../models/recipe.js";
import Stock from "../models/Stock.js";
import Table from "../models/Table.js";
import { evaluateRecipeStockAvailability } from "../utils/stockRecipeLogic.js";

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

const normalizeOrderStatus = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (["approved", "approve"].includes(normalized)) return "approved";
  if (["rejected", "reject"].includes(normalized)) return "rejected";
  if (["preparing", "prep", "in progress"].includes(normalized)) return "preparing";
  if (["ready", "ready to serve", "ready_to_serve", "ready-to-serve"].includes(normalized)) return "ready_to_serve";
  if (["served", "serve", "service complete"].includes(normalized)) return "served";
  return "pending";
};

const normalizeItemStatus = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (["pending", "queued", "queue"].includes(normalized)) return "Pending";
  if (["preparing", "prep", "cooking"].includes(normalized)) return "Preparing";
  if (["ready", "ready to serve", "ready_to_serve", "ready-to-serve"].includes(normalized)) return "Ready";
  if (["served", "serve", "service complete"].includes(normalized)) return "Served";
  return "Pending";
};

const syncTableStateForOrder = async (order, nextStatus) => {
  if (!order?.number) return;

  const targetStatus = nextStatus === "rejected" || nextStatus === "served" ? "available" : "occupied";
  await Table.findOneAndUpdate({ tableNo: order.number }, { status: targetStatus });
};

const buildStockCancellationMessage = (missingIngredients = []) => {
  if (!missingIngredients.length) return "";

  const details = missingIngredients
    .map((ingredient) => {
      const unitText = ingredient.unit ? ` ${ingredient.unit}` : "";
      return `${ingredient.name} (${ingredient.needed}${unitText})`;
    })
    .join(", ");

  return `Your order was canceled because the following ingredients are currently out of stock: ${details}.`;
};

const validateAndReduceStockForApprovedOrder = async (order) => {
  if (!order?.items?.length) {
    return { canFulfill: true, missingIngredients: [], message: "" };
  }

  const stockItems = await Stock.find({ status: "active" });
  const plannedReductions = [];
  const missingIngredients = [];

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

    const evaluation = evaluateRecipeStockAvailability(recipe.ingredients, stockItems, orderQty);

    if (!evaluation.canFulfill) {
      missingIngredients.push(...evaluation.missingIngredients);
      continue;
    }

    for (const entry of evaluation.requiredQuantities) {
      plannedReductions.push({
        name: entry.name,
        unit: entry.unit,
        requiredQuantity: entry.requiredQuantity,
      });
    }
  }

  if (missingIngredients.length) {
    return {
      canFulfill: false,
      missingIngredients,
      message: buildStockCancellationMessage(missingIngredients),
    };
  }

  for (const reduction of plannedReductions) {
    const stockItem = await Stock.findOne({
      name: { $regex: new RegExp(`^${escapeRegex(reduction.name)}$`, "i") },
    });

    if (!stockItem) continue;

    stockItem.currentStock = Math.max(0, Number(stockItem.currentStock || 0) - Number(reduction.requiredQuantity || 0));
    stockItem.status = stockItem.currentStock > 0 ? "active" : "inactive";
    await stockItem.save();
  }

  return { canFulfill: true, missingIngredients: [], message: "" };
};

// Create or Update Order (Append items if active order exists)
router.post("/create", async (req, res) => {
  const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(String(value || ""));
  const normalizeString = (value, fallback = "") => String(value || "").trim() || fallback;

  try {
    const { customerName, phone, paymentMethod, table, tableNumber, qrToken, items } = req.body;

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ success: false, message: "Please select at least one item." });
    }

    const normalizedPhone = normalizeString(phone);
    const normalizedCustomerName = normalizeString(customerName, "Guest");
    const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);

    let selectedTable = null;
    if (normalizeString(qrToken)) {
      selectedTable = await Table.findOne({ qrToken: normalizeString(qrToken) });
    }

    if (!selectedTable && normalizeString(tableNumber)) {
      const parsedNumber = Number(String(tableNumber).trim());
      if (!Number.isFinite(parsedNumber) || parsedNumber <= 0) {
        return res.status(400).json({ success: false, message: "Invalid table number." });
      }
      selectedTable = await Table.findOne({ tableNo: parsedNumber });
    }

    if (!selectedTable && table) {
      if (isValidObjectId(table)) {
        selectedTable = await Table.findById(table);
      } else {
        const parsedTableNo = Number(String(table).trim());
        if (Number.isFinite(parsedTableNo) && parsedTableNo > 0) {
          selectedTable = await Table.findOne({ tableNo: parsedTableNo });
        }
      }
    }

    if (!selectedTable) {
      return res.status(404).json({ success: false, message: "Table not found." });
    }

    if (["reserved", "cleaning"].includes(selectedTable.status)) {
      return res.status(400).json({ success: false, message: "This table is currently unavailable." });
    }

    const builtItems = [];
    const validationErrors = [];

    const normalizedItems = items.map((item) => ({
      ...item,
      menuId: item.menuId || item._id || item.itemId || item.id,
      quantity: item.quantity ?? 0,
    }));

    for (const item of normalizedItems) {
      if (!item || !item.menuId || !isValidObjectId(item.menuId)) {
        validationErrors.push("Each item must contain a valid menuId or itemId.");
        continue;
      }

      const quantity = Number(item.quantity);
      if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
        validationErrors.push("Each item quantity must be a positive whole number.");
        continue;
      }

      const menu = await Menu.findById(item.menuId);
      if (!menu) {
        validationErrors.push(`Menu item not found for menuId: ${item.menuId}`);
        continue;
      }

      builtItems.push({
        menuId: menu._id,
        title: menu.title,
        price: Number(menu.price || 0),
        quantity,
        image: menu.image || "",
        category: menu.category || "",
      });
    }

    if (validationErrors.length) {
      return res.status(400).json({ success: false, message: "Invalid order items.", errors: [...new Set(validationErrors)] });
    }

    if (!builtItems.length) {
      return res.status(400).json({ success: false, message: "Please select at least one valid item." });
    }

    const computedTotal = builtItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const filter = { number: selectedTable.tableNo, paymentStatus: "unpaid", status: { $ne: "rejected" } };
    const update = {
      $push: { items: { $each: builtItems } },
      $inc: { total: computedTotal },
      $setOnInsert: {
        billNo: generateBillNo(),
        customerName: normalizedCustomerName,
        phone: normalizedPhone,
        number: selectedTable.tableNo,
        table: selectedTable._id,
        status: "pending",
        paymentStatus: "unpaid",
        paymentMethod: normalizedPaymentMethod || "Unknown",
      },
    };
    const options = { upsert: true, new: true, returnDocument: "after", rawResult: true };

    const result = await Order.findOneAndUpdate(filter, update, options);
    let orderDoc = result?.value;
    const createdNew = Boolean(
      result?.lastErrorObject?.upserted || result?.lastErrorObject?.updatedExisting === false
    );

    if (!orderDoc) {
      orderDoc = await Order.findOne(filter).sort({ updatedAt: -1 });
    }

    if (!orderDoc) {
      return res.status(500).json({ success: false, message: "Failed to create order." });
    }

    if (!createdNew) {
      const updates = {};
      if ((!orderDoc.phone || orderDoc.phone === "") && normalizedPhone) {
        updates.phone = normalizedPhone;
      }
      if ((orderDoc.customerName === "" || orderDoc.customerName === "Guest") && normalizedCustomerName && normalizedCustomerName !== "Guest") {
        updates.customerName = normalizedCustomerName;
      }
      if (Object.keys(updates).length) {
        await Order.findByIdAndUpdate(orderDoc._id, { $set: updates }, { returnDocument: "after" });
      }
    }

    if (selectedTable.status !== "occupied") {
      selectedTable.status = "occupied";
      await selectedTable.save();
    }

    return res.status(createdNew ? 201 : 200).json({
      success: true,
      message: createdNew ? "Order placed successfully." : "New items added to your unpaid order successfully.",
      order: orderDoc,
    });
  } catch (error) {
    console.error("POST /api/orders/create error:", error);
    if (error?.message?.includes("Invalid table identifier")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error?.message?.includes("Please select at least one")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: "Failed to create order." });
  }
});

// Get active unpaid order for a table by qrToken
router.get("/qr/:qrToken/active", async (req, res) => {
  try {
    const { qrToken } = req.params;
    const table = await Table.findOne({ qrToken });
    if (!table) {
      return res.status(404).json({ success: false, message: "Invalid table QR code" });
    }

    const activeOrder = await Order.findOne({ number: table.tableNo, paymentStatus: "unpaid", status: { $ne: "rejected" } }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      table: {
        id: table._id,
        tableNo: table.tableNo,
        status: table.status,
      },
      activeOrder: activeOrder || null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
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

    const stockCheck = await validateAndReduceStockForApprovedOrder(existingOrder);

    if (!stockCheck.canFulfill) {
      existingOrder.status = "rejected";
      existingOrder.cancellationReason = stockCheck.message;
      existingOrder.customerMessage = stockCheck.message;
      await existingOrder.save();
      await syncTableStateForOrder(existingOrder, "rejected");

      return res.status(200).json({
        success: false,
        canceled: true,
        message: stockCheck.message,
        order: existingOrder,
      });
    }

    existingOrder.status = "approved";
    existingOrder.cancellationReason = "";
    existingOrder.customerMessage = "";
    await existingOrder.save();

    if (existingOrder?.number) {
      await syncTableStateForOrder(existingOrder, "approved");
    }

    res.status(200).json({
      success: true,
      message: "Order Approved",
      order: existingOrder,
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

    if (updatedOrder?.number) {
      await syncTableStateForOrder(updatedOrder, "rejected");
    }

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

// update order payment status to paid and update table status to available
router.put("/payment/:id", async (req, res) => {
  try {
    const { method } = req.body;
    const paymentMethod = normalizePaymentMethod(method);

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus: "paid",
        paymentMethod,
        status: "served",
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (updatedOrder?.number) {
      await Table.findOneAndUpdate(
        { tableNo: updatedOrder.number }, 
        { status: "available"},);
    }

    res.status(200).json({
      success: true,
      message: `Payment marked as paid via ${paymentMethod}`,
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const normalizedStatus = normalizeOrderStatus(status);

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (normalizedStatus === "approved") {
      const stockCheck = await validateAndReduceStockForApprovedOrder(order);

      if (!stockCheck.canFulfill) {
        order.status = "rejected";
        order.cancellationReason = stockCheck.message;
        order.customerMessage = stockCheck.message;
        await syncTableStateForOrder(order, "rejected");
        await order.save();

        return res.status(200).json({
          success: false,
          canceled: true,
          message: stockCheck.message,
          order,
        });
      }
    }

    order.status = normalizedStatus;
    if (normalizedStatus === "approved") {
      order.cancellationReason = "";
      order.customerMessage = "";
    }

    if (normalizedStatus === "served") {
      order.items = order.items.map((item) => ({ ...item.toObject?.(), status: "Served" }));
    } else if (normalizedStatus === "ready_to_serve") {
      order.items = order.items.map((item) => ({ ...item.toObject?.(), status: "Ready" }));
    } else if (normalizedStatus === "preparing") {
      order.items = order.items.map((item) => ({ ...item.toObject?.(), status: "Preparing" }));
    } else if (normalizedStatus === "approved") {
      order.items = order.items.map((item) => ({ ...item.toObject?.(), status: item.status || "Pending" }));
    }

    if (normalizedStatus === "rejected") {
      await syncTableStateForOrder(order, "rejected");
    } else if (normalizedStatus === "served") {
      await syncTableStateForOrder(order, "served");
    } else {
      await syncTableStateForOrder(order, normalizedStatus);
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
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

    if (order.status === "rejected") {
      return res.status(200).json({
        success: true,
        order,
        message: order.customerMessage || "Your order was canceled.",
      });
    }

    if (order.status !== "approved") {
      return res.status(200).json({
        success: true,
        order,
        message: "Order is still pending or being processed.",
      });
    }
    if(order.status ==="approved"|| "preparing"|| "ready_to_serve"|| "served"){
      return res.status(200).json({
        success: true,
        order,
        message: "Order is being processed.",
      });
    }

    res.status(200).json({
      success: true,
      order,
      message: "Order approved.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


//order for kitchen 

router.get("/kitchen", async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $in: ["pending", "approved", "preparing", "ready_to_serve", "served"] },
      paymentStatus: "unpaid",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// update status of order from kitchen 
router.put("/:orderId/items/:itemId", async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const item = order.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    item.status = normalizeItemStatus(status);

    const normalizedItemStatuses = order.items.map((entry) => normalizeItemStatus(entry.status));
    const allServed = normalizedItemStatuses.every((entryStatus) => entryStatus === "Served");
    const allReadyOrServed = normalizedItemStatuses.every((entryStatus) => entryStatus === "Ready" || entryStatus === "Served");

    if (allServed) {
      order.status = "served";
    } else if (allReadyOrServed) {
      order.status = "ready_to_serve";
    } else if (normalizedItemStatuses.some((entryStatus) => entryStatus === "Preparing" || entryStatus === "Ready" || entryStatus === "Served")) {
      order.status = "preparing";
    } else {
      order.status = normalizeOrderStatus(order.status) || "approved";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Item status updated successfully",
      order,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
