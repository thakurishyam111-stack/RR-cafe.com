# ☕ Cafe Management System

A modern Cafe Management System built with the MERN Stack to manage menu items, customer orders, billing, tables, and admin operations efficiently.

---

## 🚀 Features

### 👨‍💼 Admin Panel

* Admin Login Authentication
* Dashboard Overview
* Manage Menu Items

  * Add Menu Item
  * Update Menu Item
  * Delete Menu Item
  * View Menu Item
* Manage Categories
* Manage Tables
* View Customer Orders
* Order Status Management
* Billing Management
* Sales Reports

### 🍽️ Customer Features

* Browse Menu
* Search Food Items
* View Food Details
* Add Items to Cart
* Place Order
* View Order Summary
* Generate Bill
* Online Payment Support (Optional)

### 🧾 Billing System

* Auto Bill Number Generation
* Customer Name Validation
* Phone Number Validation
* Table Number Validation
* Order Amount Calculation
* Tax Calculation
* Grand Total Calculation
* Print Bill

---

# 🛠️ Tech Stack

## Frontend

* Next.js
* React.js
* Tailwind CSS
* Axios
* React Icons

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

---

# 📁 Project Structure

```bash
cafe-management-system/
│
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── menu/
│   │   ├── orders/
│   │   ├── billing/
│   │   └── reports/
│   │   └── revenue/
│   │   └── customer/
│   │   └── today special/
│   │
│   ├── customer/
│   │   ├── menu/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── order/
│   │   └── home/
│   │   └── map/
│   │   └── service/
│   │   └── today special/
│   │
│   ├── login/
│   ├── register/
│   └── page.jsx
│
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Sidebar.jsx
│   ├── MenuCard.jsx
│   ├── Cart.jsx
│   ├── BillCard.jsx
│   ├── OrderTable.jsx
│   └── Loader.jsx
│
├── models/
│   ├── User.js
│   ├── Menu.js
│   ├── Order.js
│   ├── Bill.js
│   └── Table.js
│
├── routes/
│   ├── authRoutes.js
│   ├── menuRoutes.js
│   ├── orderRoutes.js
│   ├── billRoutes.js
│   └── tableRoutes.js
│
├── controllers/
│   ├── authController.js
│   ├── menuController.js
│   ├── orderController.js
│   ├── billController.js
│   └── tableController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
│
├── public/
│   ├── images/
│   └── logo.png
│
├── utils/
│   └── generateBillNo.js
│
├── server.js
├── package.json
├── .env
└── README.md
```

---
# ☕ RR Cafe Management System V2.0.0

A modern, full-stack Cafe Management System built with **Next.js**, **Node.js**, **Express.js**, **MongoDB**, and **Tailwind CSS**.

This project is designed to manage every aspect of a café including billing, inventory, purchases, recipes, staff, customers, reports, and business analytics.

---

# 🚀 Tech Stack

### Frontend

* Next.js
* React.js
* TypeScript
* Tailwind CSS
* Shadcn UI

### Backend

* Node.js
* Express.js
* REST API

### Database

* MongoDB
* Mongoose

### Authentication

* JWT
* Role Based Access Control

---

# 📦 Version Roadmap

---

# Version 2.0.0 – Inventory & Business Management

## 🎯 Goal

Transform the café POS into a complete Inventory Management System.

## ✨ New Features

### 📦 Inventory Management

* Add Stock
* Edit Stock
* Delete Stock
* Stock Categories
* Unit Management
* Minimum Stock Alert
* Expiry Date Support
* Barcode Support
* Batch Number
* Stock History
* Current Stock
* Damaged Stock Tracking

---

### 🛒 Purchase Management

* Supplier Management
* Purchase Orders
* Purchase Invoice
* Purchase History
* Pending Purchases
* Completed Purchases
* Purchase Return
* Purchase Reports

---

### 🏪 Supplier Module

* Add Supplier
* Edit Supplier
* Delete Supplier
* Supplier Contact Information
* Supplier Payment History
* Supplier Due Balance

---

### 🧾 Sales Management

* Sales History
* Daily Sales
* Monthly Sales
* Cancel Sale
* Return Item
* Discount Management
* VAT Support
* Multiple Payment Methods

---

### 📊 Reports

* Sales Report
* Purchase Report
* Stock Report
* Profit Report
* Expense Report

---

### 👨‍💼 Employee Management

* Employee Profile
* Salary Information
* Attendance
* Role Management
* Permission Management

---

### 💰 Expense Management

* Daily Expenses
* Monthly Expenses
* Expense Categories
* Expense Reports

---

### 🔔 Notifications

* Low Stock Alert
* Out of Stock Alert
* New Purchase Notification
* Sales Notification

---

### ⚙️ System Improvements

* Better Dashboard
* Faster APIs
* Better UI
* Mobile Responsive
* Dark Mode

---

# Version 2.5.0 – Smart Restaurant ERP

## 🎯 Goal

Upgrade the café system into a professional Restaurant ERP solution.

## 🍔 Recipe Management

* Create Recipe
* Edit Recipe
* Delete Recipe
* Recipe Cost Calculation
* Ingredients List
* Portion Size
* Auto Ingredient Deduction

---

## 🍽️ Menu Management

* Menu Categories
* Combo Meals
* Seasonal Menu
* Available / Unavailable Status
* Menu Images

---

## 🧮 Production Management

* Kitchen Production
* Daily Production
* Batch Cooking
* Production Cost

---

## 🗑 Waste Management

* Food Waste
* Ingredient Waste
* Damage Tracking
* Waste Reports

---

## 📈 Business Analytics

* Revenue Analytics
* Expense Analytics
* Profit Analytics
* Customer Analytics
* Best Selling Items
* Worst Selling Items
* Sales Trends

---

## 👥 Customer Management

* Customer Profiles
* Loyalty Points
* Membership
* Customer Purchase History
* Birthday Rewards

---

## 🎁 Promotions

* Coupon System
* Discount Campaign
* Happy Hour Pricing
* Combo Discounts

---

## 📅 Reservation Management

* Table Reservation
* Booking Calendar
* Reservation Status
* Customer Notifications

---

## 📦 Advanced Inventory

* Multi-Warehouse Support
* Warehouse Transfer
* Inventory Adjustment
* Inventory Audit

---

## 📲 QR Ordering

* QR Menu
* Customer Self Ordering
* Digital Bill
* Online Payment

---

## 💳 Finance

* Cash Flow
* Daily Closing
* Tax Reports
* Profit & Loss
* Balance Summary

---

## 🔐 Security

* Two Factor Authentication
* Login History
* Activity Logs
* Device Management

---

## ☁ Backup

* Automatic Backup
* Restore Backup
* Export Data
* Import Data

---

## 📡 Future Integrations

* eSewa
* Khalti
* Fonepay
* SMS Gateway
* Email Notification
* WhatsApp Notification
* Printer Integration
* Barcode Scanner
* QR Scanner

---

# 🎯 Long-Term Vision

Build RR Cafe Management System into a complete Restaurant ERP platform capable of managing:

* POS Billing
* Inventory
* Purchase
* Sales
* Recipes
* Kitchen
* Waste
* Employees
* Customers
* Finance
* Reports
* Analytics
* Reservations
* Loyalty Program
* Multi-Branch Operations
* Online Ordering
* Delivery Management

---

# 📌 Current Status

| Version | Status                         |
| ------- | ------------------------------ |
| 1.x     | ✅ Basic POS                    |
| 2.0.0   | 🚧 Inventory & Purchase System |
| 2.5.0   | 🚧 Smart Restaurant ERP        |
| 3.0.0   | 🔜 Multi Branch & Cloud ERP    |

---

Developed with ❤️ by **Shyam Thakuri**


# 📦 Installation

## Clone Repository

```bash
https://github.com/thakurishyam111-stack/RR-cafe.com
```

## Move Project Folder

```bash
cd RR-cafe.com
```

## Install Dependencies

```bash
npm install
```

or

```bash
pnpm install
```

---

# ⚙️ Environment Variables

Create a `.env` file:

```env
MONGO_URI=mongodb://127.0.0.1:27017/CafeDB
PORT=8080
JWT_SECRET=shyamsecret

---

# ▶️ Run Project

## Development

```bash
npm run dev
```

or

```bash
pnpm dev
```

## Production

```bash
npm run build
npm start
```

---

# 📊 Database Collections

### Users

```json
{
  "_id": "",
  "name": "",
  "email": "",
  "password": "",
  "role": "admin"
}
```

### Menu

```json
{
  "_id": "",
  "name": "",
  "price": 0,
  "category": "",
  "image": ""
}
```

### Orders

```json
{
  "_id": "",
  "customerName": "",
  "phone": "",
  "tableNo": "",
  "items": [],
  "totalAmount": 0,
  "status": "Pending"
}
```

### Bills

```json
{
  "_id": "",
  "billNo": "",
  "orderId": "",
  "totalAmount": 0,
  "paymentStatus": "Paid"
}
```

---

# 🔒 Security Features

* JWT Authentication
* Protected Routes
* Password Hashing
* Input Validation
* Error Handling

---

# 📈 Future Enhancements

* QR Menu Ordering
* eSewa Payment Integration
* Khalti Payment Integration
* Receipt PDF Download
* Real-time Order Tracking
* Kitchen Dashboard
* Inventory Management

---

# 👨‍💻 Author

**Shyam Shah Thakuri**

BCA Student | MERN Stack Developer | Nepal 🇳🇵

---

# ⭐ Support

If you like this project, please give it a ⭐ on GitHub.
