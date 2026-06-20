import Today from "../models/Today.js";

// GET all
export const getToday = async (req, res) => {
  try {
    const today = await Today.find();
    res.status(200).json({
      success: true,
      today,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET single
export const getsingleToday = async (req, res) => {
  try {
    const today = await Today.findById(req.params.id);

    if (!today) {
      return res.status(404).json({
        success: false,
        message: "today menu items not found",
      });
    }

    res.status(200).json({
      success: true,
      today,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE
export const createToday = async (req, res) => {
  try {
    const today = await Today.create(req.body);

    res.status(201).json({
      success: true,
      message: "today items added successfully",
      today,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE
export const updateToday = async (req, res) => {
  try {
    const today = await Today.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "updated successfully",
      today,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE
export const deletToday = async (req, res) => {
  try {
    await Today.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};