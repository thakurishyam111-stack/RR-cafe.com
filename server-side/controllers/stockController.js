import Stock from "../models/Stock.js";

// ============================
// Create Stock
// ============================

export const createStock = async (req, res) => {
  try {
    const stock = await Stock.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Stock created successfully.",
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
// Get All Stocks
// ============================

export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: stocks.length,
      data: stocks,
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
// Update Stock
// ============================

export const updateStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found.",
      });
    }

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