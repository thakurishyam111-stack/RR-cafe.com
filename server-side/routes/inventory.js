import express from 'express';
import Inventory from '../models/Inventory.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const transactions = await Inventory.find().populate('stock').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
