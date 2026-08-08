import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";


import userRoutes from "./routes/user.js";
import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/order.js";
import adminRoutes from "./routes/admin.js";
import todayRoutes from "./routes/today.js";
import staffRoutes from "./routes/staff.js";
import stockRoutes from "./routes/stock.js";
import wasteRoutes from "./routes/waste.js"
import purchaseRoutes from "./routes/purchase.js"
import supplierRoute from "./routes/supplier.js"
import recipeRoutes from "./routes/recipe.js"
import tableRoutes from "./routes/table.js"
import inventoryRoutes from "./routes/inventory.js"

//dotenv config 
dotenv.config();

const app = express();

app.use(cors({
  origin:"*"
}));

// const limit = ratelimit({
  
// })
app.use(express.json());

// Database Connect
connectDB();
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/today", todayRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/waste", wasteRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/supplier", supplierRoute);
app.use("/api/recipes", recipeRoutes);
app.use("/api/table", tableRoutes);
app.use("/api/inventory", inventoryRoutes);

app.get("/", (req, res) => {
  res.send("Server Running");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("      **************")
  console.log(`🚀 Server running on port ${PORT}`);
});
