import mongoose from 'mongoose';
import Stock from '../models/Stock.js';
import Inventory from '../models/Inventory.js';
import { convertToBaseUnit, validateStockAvailability } from '../utils/inventoryUnitUtils.js';

export const createInventoryTransaction = async ({
  stockId,
  transactionType,
  quantity,
  previousStock,
  newStock,
  referenceType = '',
  referenceId = '',
  note = '',
  createdBy = 'system',
  session,
}) => {
  if (!stockId) {
    throw new Error('stockId is required');
  }

  const transaction = await Inventory.create(
    [
      {
        stock: stockId,
        transactionType,
        quantity: Number(quantity || 0),
        previousStock: Number(previousStock || 0),
        newStock: Number(newStock || 0),
        referenceType,
        referenceId,
        note,
        createdBy,
      },
    ],
    { session }
  );

  return transaction[0];
};

export const updateStock = async ({
  stockId,
  delta,
  transactionType,
  referenceType = '',
  referenceId = '',
  note = '',
  createdBy = 'system',
  session,
}) => {
  const stock = await Stock.findById(stockId).session(session);
  if (!stock) {
    throw new Error('Stock not found');
  }

  const previousStock = Number(stock.currentStock || 0);
  const nextStock = previousStock + Number(delta || 0);

  if (nextStock < 0) {
    throw new Error('Insufficient stock');
  }

  stock.currentStock = nextStock;
  stock.status = nextStock > 0 ? 'active' : 'inactive';
  await stock.save({ session });

  await createInventoryTransaction({
    stockId,
    transactionType,
    quantity: Math.abs(Number(delta || 0)),
    previousStock,
    newStock: nextStock,
    referenceType,
    referenceId,
    note,
    createdBy,
    session,
  });

  return stock;
};

export const applyPurchaseToStock = async ({
  stockId,
  quantity,
  unit,
  referenceType = 'purchase',
  referenceId = '',
  note = '',
  createdBy = 'system',
  session,
}) => {
  const baseQuantity = convertToBaseUnit(quantity, unit);
  return updateStock({
    stockId,
    delta: baseQuantity,
    transactionType: 'purchase',
    referenceType,
    referenceId,
    note,
    createdBy,
    session,
  });
};

export const applyRecipeConsumptionToStock = async ({
  stockId,
  quantity,
  unit,
  referenceType = 'sale',
  referenceId = '',
  note = '',
  createdBy = 'system',
  session,
}) => {
  const stock = await Stock.findById(stockId).session(session);
  if (!stock) {
    throw new Error('Stock not found');
  }

  const baseQuantity = convertToBaseUnit(quantity, unit);
  const availability = validateStockAvailability(stock, baseQuantity);
  if (!availability.isAvailable) {
    throw new Error(availability.reason);
  }

  return updateStock({
    stockId,
    delta: -baseQuantity,
    transactionType: 'sale',
    referenceType,
    referenceId,
    note,
    createdBy,
    session,
  });
};
