import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Recipe from "../models/recipe.js";
import Stock from "../models/Stock.js";
import Table from "../models/Table.js"

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

    // 1. Check if an active unpaid order exists for this table
    let existingOrder = await Order.findOne({
      number: selectedTable.tableNo,
      paymentStatus: "unpaid",
    });

    if (existingOrder) {
      // --- Customer le purano bill natiri item add garyo ---

      // Items push or update quantity logic
      items.forEach((newItem) => {
        const existingItemIndex = existingOrder.items.findIndex(
          (i) => String(i.menuId || i.title) === String(newItem.menuId || newItem.title)
        );

        if (existingItemIndex > -1) {
          // Yo item pahile nai thiyo bhane quantity ra subtotal badhaune
          existingOrder.items[existingItemIndex].quantity += Number(newItem.quantity || 1);
        } else {
          // Naya item thapne
          existingOrder.items.push(newItem);
        }
      });

      // Total calculate/update
      existingOrder.total = Number(existingOrder.total || 0) + Number(total || 0);

      // Status reset to pending/preparing if needed for kitchen tracking
      if (existingOrder.status === "approved" || existingOrder.status === "Ready") {
        existingOrder.status = "pending"; // kitchen le punah review garnuparcha
      }

      await existingOrder.save();

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
      customerName: customerName || "Guest",
      phone: phone || "",
      number: selectedTable.tableNo,
      items,
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

// update order payment status to paid and update table status to available
router.put("/payment/:id", async (req, res) => {
  try {
    const { method } = req.body;
    const paymentMethod = normalizePaymentMethod(method);

    // 1. Order status paid banaune
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus: "paid",
        paymentMethod,
      },
      { new: true }
    );

    // Order bhetiena vane pahile nai exit garchha
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 2. Table status lai occupied bata available ma switch garne
    if (updatedOrder.number) {
      await Table.findOneAndUpdate(
        { tableNo: updatedOrder.number },
        { status: "available" }
      );
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


//order for kitchen 

router.get("/kitchen", async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $in: ["pending", "approved"] },
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

    console.log("Order ID:", orderId);
    console.log("Item ID:", itemId);
    console.log(order.items);

    const item = order.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    item.status = status;

    const allReady = order.items.every((i) =>
      i._id.toString() === itemId
        ? status === "Ready"
        : i.status === "Ready"
    );

    order.status = allReady ? "Ready" : "Preparing";

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
