import express from "express";
import {
  getMenus,
  getSingleMenu,
  createMenu,
  updateMenu,
  deleteMenu,
} from "../controllers/menuController.js";

const router = express.Router();


// Get All Menu Items
router.get("/", getMenus);


// Get Single Menu Item
router.get("/:id", getSingleMenu);


// Create Menu Item
router.post("/add", createMenu);


// Update Menu Item
router.put("/:id", updateMenu);


// Delete Menu Item
router.delete("/:id", deleteMenu);


export default router;