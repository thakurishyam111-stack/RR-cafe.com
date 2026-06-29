// const express = require("express");
// const cors = require("cors");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use("/api/users", userRoutes);

// // Health check route
// app.get("/api/health", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Server is running",
//   });
// });

// // Basic route
// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Welcome to cafe Management API",
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

// // Error handler
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({
//     success: false,
//     message: "Internal server error",
//     error: err.message,
//   });
// });

// module.exports = app;
