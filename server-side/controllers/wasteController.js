import Waste from "../models/Waste.js";

// Get all waste items
export const getwaste = async (req, res) => {
  try {
    const wastes = await Waste.find();
    res.status(200).json({
      success: true,
      waste: wastes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a single waste item
export const getSinglewaste = async (req, res) => {
  try {
    const wasteItem = await Waste.findById(req.params.id);

    if (!wasteItem) {
      return res.status(404).json({
        success: false,
        message: "Waste item not found",
      });
    }

    res.status(200).json({
      success: true,
      waste: wasteItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add waste items
export const createwaste = async (req, res) => {
  try {
    const wasteItem = await Waste.create(req.body);

    res.status(201).json({
      success: true,
      message: "Waste item added successfully",
      waste: wasteItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update waste items
export const updatewaste = async (req, res) => {
  try {
    const wasteItem = await Waste.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Waste updated successfully",
      waste: wasteItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete waste items
export const deletewaste = async (req, res) => {
  try {
    await Waste.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Waste deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};