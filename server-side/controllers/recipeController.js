import Recipe from "../models/recipe.js";

export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      recipes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRecipeByMenuId = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ menuId: req.params.menuId });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found for this menu.",
      });
    }

    return res.status(200).json({
      success: true,
      recipe,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createOrUpdateRecipe = async (req, res) => {
  try {
    const { menuId, menuTitle, ingredients, preparationTime, servingSize, instructions } = req.body;

    if (!menuId || !menuTitle) {
      return res.status(400).json({
        success: false,
        message: "menuId and menuTitle are required.",
      });
    }

    const existingRecipe = await Recipe.findOne({ menuId });

    if (existingRecipe) {
      const updatedRecipe = await Recipe.findOneAndUpdate(
        { menuId },
        {
          menuTitle,
          ingredients: ingredients || [],
          preparationTime: preparationTime || "20",
          servingSize: servingSize || "1",
          instructions: instructions || "",
        },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        message: "Recipe updated successfully.",
        recipe: updatedRecipe,
      });
    }

    const newRecipe = await Recipe.create({
      menuId,
      menuTitle,
      ingredients: ingredients || [],
      preparationTime: preparationTime || "20",
      servingSize: servingSize || "1",
      instructions: instructions || "",
    });

    return res.status(201).json({
      success: true,
      message: "Recipe created successfully.",
      recipe: newRecipe,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({ menuId: req.params.menuId });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Recipe deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
