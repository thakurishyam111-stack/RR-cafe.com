import mongoose from "mongoose";
import Order from "../models/Order.js";

export const handalCancle = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return
      res.status(404).json({
        success: false,
        message: "Order not found ",
      });
    }
    if (order.status !== "pending") {
      return
      res.json({
        success: false,
        message: "This Order can not be cancelled",
      });
    }

    order.status = "cancelled";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    })


  } catch (exception) {
    console.log(exception)
    res.json({
      success: false,
      message: exception.message
    })

  }
}

export const getKitchen =async (req, res) => {
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
}

export const updateOrderStatus =async (req, res) => {
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
}
