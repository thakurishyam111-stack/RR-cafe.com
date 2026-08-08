import express from "express";
import {
  getToday,
  createToday,
  getsingleToday,
  updateToday,
  deletToday,
} from "../controllers/todayController.js";

const router = express.Router();

router.get("/", getToday);
router.get("/:id", getsingleToday);
router.post("/add", createToday);
router.put("/:id", updateToday);
router.delete("/:id", deletToday);

export default router;