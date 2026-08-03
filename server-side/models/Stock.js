import mongoose from "mongoose";

const StockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    unit: {
      type: String,
      enum: [, "gm", "ml", "pcs", "pack"],
      required: true,
    },


    currentStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    minimumStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    costPerUnit: {
      type: Number,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    expiryDate: {
      type: Date,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Stock = mongoose.models.Stock || mongoose.model("Stock", StockSchema);

export default Stock;