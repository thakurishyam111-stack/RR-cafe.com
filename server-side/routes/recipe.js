import express from "express";
import {
  createOrUpdateRecipe,
  deleteRecipe,
  getAllRecipes,
  getRecipeByMenuId,
} from "../controllers/recipeController.js";

const router = express.Router();

router.get("/", getAllRecipes);
router.get("/:menuId", getRecipeByMenuId);
router.post("/", createOrUpdateRecipe);
router.put("/:menuId", createOrUpdateRecipe);
router.delete("/:menuId", deleteRecipe);

export default router;
