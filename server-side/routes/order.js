import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// CREATE ORDER
router.post("/create", async (req, res) => {
  try {
    const { customerName, phone, tableNumber, items, total } =
      req.body;

    if (
      !customerName ||
      !phone ||
      !tableNumber ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const newOrder = await Order.create({
      customerName,
      phone,
      number: parseInt(tableNumber),
      items,
      total,
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
// APPROVE ORDER
router.put("/approve/:id", async (req, res) => {
  try {

    const updatedOrder =
      await Order.findByIdAndUpdate(
        req.params.id,
        {
          status: "approved",
        },
        {
          new: true,
        }
      );

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

// GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

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
// REJECT ORDER
router.put("/reject/:id", async (req, res) => {
  try {

    const updatedOrder =
      await Order.findByIdAndUpdate(
        req.params.id,
        {
          status: "rejected",
        },
        {
          new: true,
        }
      );

    res.status(200).json({
      success: true,
      message: "Order Rejected",
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

// DELETE ORDER
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

export default router;