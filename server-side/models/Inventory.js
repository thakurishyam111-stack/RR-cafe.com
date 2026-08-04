import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock',
      required: true,
      index: true,
    },
    transactionType: {
      type: String,
      enum: ['purchase', 'sale', 'waste', 'adjustment'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    previousStock: {
      type: Number,
      required: true,
      min: 0,
    },
    newStock: {
      type: Number,
      required: true,
      min: 0,
    },
    referenceType: {
      type: String,
      default: '',
      trim: true,
    },
    referenceId: {
      type: String,
      default: '',
      trim: true,
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
    createdBy: {
      type: String,
      default: 'system',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);

export default Inventory;