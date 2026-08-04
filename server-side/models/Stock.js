import mongoose from 'mongoose';

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
    baseUnit: {
      type: String,
      enum: ['gm', 'ml', 'pcs'],
      required: true,
      default: 'pcs',
    },
    purchaseUnit: {
      type: String,
      default: 'pcs',
      trim: true,
    },
    displayUnit: {
      type: String,
      default: 'pcs',
      trim: true,
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
    costPerBaseUnit: {
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
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const Stock = mongoose.models.Stock || mongoose.model('Stock', StockSchema);

export default Stock;