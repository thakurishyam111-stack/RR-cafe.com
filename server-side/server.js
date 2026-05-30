import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";


import userRoutes from "./routes/user.js";
import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/order.js";
import adminRoutes from "./routes/admin.js";



dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Database Connect
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Server Running");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
