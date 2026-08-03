import Stock from "../models/Stock.js";

// ============================
// Helper Function: Normalize Unit & Quantity
// ============================
const normalizeStockData = (unit, quantity) => {
  let baseUnit = unit ? unit.toLowerCase() : unit;
  let baseQuantity = Number(quantity) || 0;

  if (baseUnit === "kg") {
    baseUnit = "gm";
    baseQuantity = baseQuantity * 1000;
  } else if (baseUnit === "ltr" || baseUnit === "liter" || baseUnit === "l") {
    baseUnit = "ml";
    baseQuantity = baseQuantity * 1000;
  }

  return { unit: baseUnit, currentStock: baseQuantity };
};

// ============================
// Create Stock (Purchase Item)
// ============================
export const createStock = async (req, res) => {
  try {
    const { name, category, unit, currentStock, minStockAlert } = req.body;

    // Unit ra Quantity lai gm / ml ma normalize gareko
    const { unit: baseUnit, currentStock: baseQuantity } = normalizeStockData(
      unit,
      currentStock
    );

    const stock = await Stock.create({
      ...req.body,
      unit: baseUnit, // Always saved as 'gm' or 'ml' (or pcs, etc.)
      currentStock: baseQuantity,
    });

    return res.status(201).json({
      success: true,
      message: "Stock created successfully in base unit.",
      data: stock,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Get All Stocks (With Display Unit Mapping)
// ============================
export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ createdAt: -1 });

    const formattedStocks = stocks.map((stock) => {
      const item = stock.toObject();

      // Display logic: 1000gm vanda dherai vaye kg ma, 1000ml vanda dherai vaye L ma dekhaune
      if (item.unit === "gm" && item.currentStock >= 1000) {
        item.displayStock = item.currentStock / 1000;
        item.displayUnit = "kg";
      } else if (item.unit === "ml" && item.currentStock >= 1000) {
        item.displayStock = item.currentStock / 1000;
        item.displayUnit = "L";
      } else {
        item.displayStock = item.currentStock;
        item.displayUnit = item.unit;
      }

      return item;
    });

    return res.status(200).json({
      success: true,
      count: formattedStocks.length,
      data: formattedStocks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Get Single Stock
// ============================
export const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: stock,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Update Stock Details / Add Manual Stock
// ============================
export const updateStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found.",
      });
    }

    // Input ma kg / ltr aayo vane gm / ml ma convert garne
    if (req.body.unit && req.body.currentStock !== undefined) {
      const { unit: baseUnit, currentStock: baseQuantity } = normalizeStockData(
        req.body.unit,
        req.body.currentStock
      );
      req.body.unit = baseUnit;
      req.body.currentStock = baseQuantity;
    }

    Object.assign(stock, req.body);
    await stock.save();

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully.",
      data: stock,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Deduct Stock For Recipe Sale (Direct gm/ml Deduction)
// ============================
export const deductStockForRecipe = async (req, res) => {
  try {
    const { stockId, recipeQty } = req.body; // recipeQty must be in gm or ml

    const stock = await Stock.findById(stockId);

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock item not found.",
      });
    }

    if (stock.currentStock < recipeQty) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${stock.name}. Available: ${stock.currentStock}${stock.unit}`,
      });
    }

    // Direct subtraction since DB stock and Recipe quantity are both in base units (gm/ml)
    stock.currentStock -= Number(recipeQty);
    await stock.save();

    return res.status(200).json({
      success: true,
      message: "Stock deducted successfully.",
      data: stock,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Delete Stock
// ============================
export const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Stock deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};