import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

const router = express.Router();


// ===============================
// 🟢 ADMIN REGISTER
// ===============================
router.post("/register", async (req, res) => {
  try {

    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    if (email.length > 100) {
      return res.status(400).json({
        success: false,
        message: "email length is too long"
      })
    }
    if (password.length < 8 || password.length > 64) {
      return res.status(400).json({
        success: false,
        message: "password length is between 8 and 64 characters "
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Admin Registered Successfully",
      admin,
    });

  } catch (error) {


    res.status(500).json({
      message: "Server Error",
    });

  }
});


// ===============================
// 🔵 ADMIN LOGIN
// ===============================
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    console.log("EMAIL:", email);

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );

    res.json({
      success: true,
      message: "Login Success",
      token,
      admin,
    });

  } catch (error) {

    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });

  }
});

export default router;