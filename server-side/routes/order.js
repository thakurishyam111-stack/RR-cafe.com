import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
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
  try {
    const { customerName, phone, table, items, total } = req.body;

    if (!table || !items?.length) {
      return res.status(400).json({
        success: false,
        message: "Table and items are required",
      });
    }

    const selectedTable = await Table.findById(table);
    if (!selectedTable) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    const normalizedPhone = String(phone || "").trim();
    const normalizedCustomerName = String(customerName || "Guest").trim();

    // 1. Check if an active unpaid order exists for this table
    let existingOrder = await Order.findOne({
      number: selectedTable.tableNo,
      paymentStatus: "unpaid",
      status: { $ne: "rejected" },
    }).sort({ createdAt: -1 });

    if (existingOrder) {
      if (String(existingOrder.phone || "").trim() && normalizedPhone && String(existingOrder.phone).trim() !== normalizedPhone) {
        return res.status(409).json({
          success: false,
          message: "This table is already occupied by another customer. Please choose another table.",
        });
      }

      existingOrder.items = [...existingOrder.items];
      items.forEach((newItem) => {
        const existingItemIndex = existingOrder.items.findIndex(
          (i) => String(i.menuId || i.title) === String(newItem.menuId || newItem.title)
        );

        if (existingItemIndex > -1) {
          existingOrder.items[existingItemIndex].quantity = Number(existingOrder.items[existingItemIndex].quantity || 0) + Number(newItem.quantity || 1);
        } else {
          existingOrder.items.push({
            ...newItem,
            status: "Pending",
            estimatedTime: Number(newItem.estimatedTime || 15),
          });
        }
      });

      existingOrder.total = Number(existingOrder.total || 0) + Number(total || 0);
      existingOrder.customerName = normalizedCustomerName || existingOrder.customerName;
      existingOrder.phone = normalizedPhone || existingOrder.phone;
      existingOrder.status = normalizeOrderStatus(existingOrder.status);
      if (existingOrder.status === "served") {
        existingOrder.status = "approved";
      }

      await existingOrder.save();
      selectedTable.status = "occupied";
      await selectedTable.save();

      return res.status(200).json({
        success: true,
        message: "Items added to current table order",
        order: existingOrder,
      });
    }

    // 2. If NO active order exists, create a fresh order
    selectedTable.status = "occupied";
    await selectedTable.save();

    const newOrder = await Order.create({
      billNo: generateBillNo(),
      customerName: normalizedCustomerName || "Guest",
      phone: normalizedPhone || "",
      number: selectedTable.tableNo,
      items: items.map((item) => ({
        ...item,
        status: "Pending",
        estimatedTime: Number(item.estimatedTime || 15),
      })),
      total,
      status: "pending",
      paymentStatus: "unpaid",
      paymentMethod: "Unknown",
    });

    return res.status(201).json({
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
      await Table.findOneAndUpdate({ tableNo: updatedOrder.number }, { status: "available" });
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
