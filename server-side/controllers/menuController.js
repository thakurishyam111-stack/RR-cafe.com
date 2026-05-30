import Menu from "../models/menu.js";


// Get All Menu Items
export const getMenus = async (req, res) => {
  try {
    const menus = await Menu.find();

    res.status(200).json({
      success: true,
      menus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get Single Menu Item
export const getSingleMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      menu,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Create Menu Item
export const createMenu = async (req, res) => {
  try {
    const menu = await Menu.create(req.body);

    res.status(201).json({
      success: true,
      message: "Menu item added successfully",
      menu,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Update Menu Item
export const updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Menu updated successfully",
      menu,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete Menu Item
export const deleteMenu = async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Menu deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};