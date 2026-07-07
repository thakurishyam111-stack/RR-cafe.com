import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    supplierCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    supplierName: {
      type: String,
      required: true,
      trim: true,
    },

    contactPerson: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    address: {
      type: String,
      trim: true,
    },

    panNumber: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Supplier", supplierSchema);