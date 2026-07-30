import express from "express";
import userController from "../controllers/userController.js";
import auth from "../middleware/authMiddleware.js";

const { signup, login, getUserProfile, getAllUsers } = userController;
const router = express.Router();

// registration and authentication endpoints
router.post("/register", signup);
router.post("/login", login);

// profile and admin user list
router.get("/profile", auth, getUserProfile);
// admin only in production, but auth middleware protects for now
router.get("/", auth, getAllUsers);

export default router;