import Stock from '../models/Stock.js';
import { convertToBaseUnit, convertFromBaseUnit } from '../utils/inventoryUnitUtils.js';

const buildDisplayPayload = (stock) => {
  const item = stock.toObject();
  item.displayStock = convertFromBaseUnit(item.currentStock, item.baseUnit, item.displayUnit);
  item.displayUnit = item.displayUnit || item.baseUnit;
  return item;
};

export const createStock = async (req, res) => {
  try {
    const { name, category, currentStock, minimumStock, purchaseUnit, displayUnit, costPerBaseUnit, sellingPrice, status } = req.body;

    const baseUnit = String(req.body.baseUnit || 'pcs').trim().toLowerCase();
    const baseQuantity = convertToBaseUnit(currentStock, purchaseUnit || baseUnit);

    const stock = await Stock.create({
      name,
      category,
      sku: req.body.sku || `${String(name || 'STOCK').toUpperCase().replace(/\s+/g, '-')}-${Date.now()}`,
      baseUnit,
      purchaseUnit: purchaseUnit || baseUnit,
      displayUnit: displayUnit || purchaseUnit || baseUnit,
      currentStock: baseQuantity,
      minimumStock: Number(minimumStock || 0),
      costPerBaseUnit: Number(costPerBaseUnit || 0),
      sellingPrice: Number(sellingPrice || 0),
      status: status || 'active',
    });

    return res.status(201).json({
      success: true,
      message: 'Stock created successfully in base units.',
      data: buildDisplayPayload(stock),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: stocks.length,
      data: stocks.map(buildDisplayPayload),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found.' });
    }

    return res.status(200).json({ success: true, data: buildDisplayPayload(stock) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found.' });
    }

    if (req.body.currentStock !== undefined && req.body.purchaseUnit !== undefined) {
      const baseQuantity = convertToBaseUnit(req.body.currentStock, req.body.purchaseUnit || stock.purchaseUnit || stock.baseUnit);
      req.body.currentStock = baseQuantity;
    }

    Object.assign(stock, req.body);
    await stock.save();

    return res.status(200).json({ success: true, message: 'Stock updated successfully.', data: buildDisplayPayload(stock) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found.' });
    }

    return res.status(200).json({ success: true, message: 'Stock deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};