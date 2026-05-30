// models/Order.js

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
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
        enum: ["pending", "approved", "rejected"],
      default: "pending", 
    },
    
  },
  { timestamps: true }
);

const Order = mongoose.model(
  "Order",
  orderSchema
);

export default Order;