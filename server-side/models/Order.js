import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    billNo: {
      type: String,
      unique: true,
      required: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    number: {
      type: Number,
      required: true,
    },

    items: [
      {
        menuId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
        },
        title: String,
        price: Number,
        quantity: Number,
        image: String,
        category: String,
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "preparing",
        "ready",
        "ready_to_serve",
        "Served",
        "served",
      ],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },

    paymentMethod: {
      type: String,
      default: "Unknown",
    },

    cancellationReason: {
      type: String,
      default: "",
    },

    customerMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;