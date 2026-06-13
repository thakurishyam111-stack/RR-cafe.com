import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

//bill generator
const generateBillNo = () => {
  const date = new Date();
  const random = Math.floor(1000 + Math.random() * 9000);

  return `CAF-${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}-${random}`;
};
// CREATE ORDER
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
//bill fetch
router.get("/billNo/:billNo", async (req, res) => {
  try {
    const order = await Order.findOne({
      billNo: req.params.billNo,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Bill Not Found",
      });
    }

    // ❗ IMPORTANT: only approved order can be shown
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