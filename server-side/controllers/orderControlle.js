// import express from "express";
// import mongoose from "mongoose";
// import Order from "../models/Order.js";
// import Menu from "../models/menu.js";
// import Recipe from "../models/recipe.js";
// import Stock from "../models/Stock.js";
// import Table from "../models/Table.js";
// import { evaluateRecipeStockAvailability } from "../utils/stockRecipeLogic.js";

// export const CreateOrder =async (req, res) => {

//   const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(String(value || ""));
//   const normalizeString = (value, fallback = "") => String(value || "").trim() || fallback;

//   try {
//     const { customerName, phone, paymentMethod, table, tableNumber, qrToken, items } = req.body;

//     if (!Array.isArray(items) || !items.length) {
//       return res.status(400).json({ success: false, message: "Please select at least one item." });
//     }

//     const normalizedPhone = normalizeString(phone);
//     const normalizedCustomerName = normalizeString(customerName, "Guest");
//     const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);

//     let selectedTable = null;
//     if (normalizeString(qrToken)) {
//       selectedTable = await Table.findOne({ qrToken: normalizeString(qrToken) });
//     }

//     if (!selectedTable && normalizeString(tableNumber)) {
//       const parsedNumber = Number(String(tableNumber).trim());
//       if (!Number.isFinite(parsedNumber) || parsedNumber <= 0) {
//         return res.status(400).json({ success: false, message: "Invalid table number." });
//       }
//       selectedTable = await Table.findOne({ tableNo: parsedNumber });
//     }

//     if (!selectedTable && table) {
//       if (isValidObjectId(table)) {
//         selectedTable = await Table.findById(table);
//       } else {
//         const parsedTableNo = Number(String(table).trim());
//         if (Number.isFinite(parsedTableNo) && parsedTableNo > 0) {
//           selectedTable = await Table.findOne({ tableNo: parsedTableNo });
//         }
//       }
//     }

//     if (!selectedTable) {
//       return res.status(404).json({ success: false, message: "Table not found." });
//     }

//     if (["reserved", "cleaning"].includes(selectedTable.status)) {
//       return res.status(400).json({ success: false, message: "This table is currently unavailable." });
//     }

//     const builtItems = [];
//     const validationErrors = [];

//     const normalizedItems = items.map((item) => ({
//       ...item,
//       menuId: item.menuId || item._id || item.itemId || item.id,
//       quantity: item.quantity ?? 0,
//     }));

//     for (const item of normalizedItems) {
//       if (!item || !item.menuId || !isValidObjectId(item.menuId)) {
//         validationErrors.push("Each item must contain a valid menuId or itemId.");
//         continue;
//       }

//       const quantity = Number(item.quantity);
//       if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
//         validationErrors.push("Each item quantity must be a positive whole number.");
//         continue;
//       }

//       const menu = await Menu.findById(item.menuId);
//       if (!menu) {
//         validationErrors.push(`Menu item not found for menuId: ${item.menuId}`);
//         continue;
//       }

//       builtItems.push({
//         menuId: menu._id,
//         title: menu.title,
//         price: Number(menu.price || 0),
//         quantity,
//         image: menu.image || "",
//         category: menu.category || "",
//       });
//     }

//     if (validationErrors.length) {
//       return res.status(400).json({ success: false, message: "Invalid order items.", errors: [...new Set(validationErrors)] });
//     }

//     if (!builtItems.length) {
//       return res.status(400).json({ success: false, message: "Please select at least one valid item." });
//     }

//     const computedTotal = builtItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
//     const filter = { number: selectedTable.tableNo, paymentStatus: "unpaid", status: { $ne: "rejected" } };
//     const update = {
//       $push: { items: { $each: builtItems } },
//       $inc: { total: computedTotal },
//       $setOnInsert: {
//         billNo: generateBillNo(),
//         customerName: normalizedCustomerName,
//         phone: normalizedPhone,
//         number: selectedTable.tableNo,
//         table: selectedTable._id,
//         status: "pending",
//         paymentStatus: "unpaid",
//         paymentMethod: normalizedPaymentMethod || "Unknown",
//       },
//     };
//     const options = { upsert: true, new: true, returnDocument: "after", rawResult: true };

//     const result = await Order.findOneAndUpdate(filter, update, options);
//     let orderDoc = result?.value;
//     const createdNew = Boolean(
//       result?.lastErrorObject?.upserted || result?.lastErrorObject?.updatedExisting === false
//     );

//     if (!orderDoc) {
//       orderDoc = await Order.findOne(filter).sort({ updatedAt: -1 });
//     }

//     if (!orderDoc) {
//       return res.status(500).json({ success: false, message: "Failed to create order." });
//     }

//     if (!createdNew) {
//       const updates = {};
//       if ((!orderDoc.phone || orderDoc.phone === "") && normalizedPhone) {
//         updates.phone = normalizedPhone;
//       }
//       if ((orderDoc.customerName === "" || orderDoc.customerName === "Guest") && normalizedCustomerName && normalizedCustomerName !== "Guest") {
//         updates.customerName = normalizedCustomerName;
//       }
//       if (Object.keys(updates).length) {
//         await Order.findByIdAndUpdate(orderDoc._id, { $set: updates }, { returnDocument: "after" });
//       }
//     }

//     if (selectedTable.status !== "occupied") {
//       selectedTable.status = "occupied";
//       await selectedTable.save();
//     }

//     return res.status(createdNew ? 201 : 200).json({
//       success: true,
//       message: createdNew ? "Order placed successfully." : "New items added to your unpaid order successfully.",
//       order: orderDoc,
//     });
//   } catch (error) {
//     console.error("POST /api/orders/create error:", error);
//     if (error?.message?.includes("Invalid table identifier")) {
//       return res.status(400).json({ success: false, message: error.message });
//     }
//     if (error?.message?.includes("Please select at least one")) {
//       return res.status(400).json({ success: false, message: error.message });
//     }
//     return res.status(500).json({ success: false, message: "Failed to create order." });
//   }
// }