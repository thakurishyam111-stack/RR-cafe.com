# ☕ Deurali Cafe Management System

![Version](https://img.shields.io/badge/version-2.0.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-success)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)
![License](https://img.shields.io/badge/license-MIT-orange)

A complete **Cafe Management System** built with **Next.js, Express.js, MongoDB, and Mongoose**. The system is designed for real-world cafe operations including menu management, inventory, recipes, orders, billing, purchases, suppliers, customers, stock management, waste management, and reporting.

---

# 📌 Project Overview

The system provides three different user roles:

- 👑 Admin
- 💰 Cashier
- 🙋 Customer

Each role has different permissions and responsibilities.

---

# 🚀 Technology Stack

## Frontend

- Next.js
- React.js
- Tailwind CSS
- Axios
- React Icons
- React Hook Form
- SweetAlert2
- Framer Motion

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
- Multer
- Cloudinary (Optional)
- Nodemailer
- Cookie Parser
- Dotenv
- Morgan

---

## Database

- MongoDB
- Mongoose ODM

Collections include:

```
Users
Customers
Menus
Categories
Recipes
Ingredients
Suppliers
Purchases
PurchaseItems
Stocks
StockMovements
Orders
OrderItems
Bills
Payments
Expenses
Waste
Tables
Notifications
Settings
Roles
Permissions
Logs
```

---





# 👑 Admin Features

Admin has complete access to the system.

### Dashboard

- View sales
- View revenue
- View profit
- View stock status
- View notifications

### User Management

- Add Users
- Edit Users
- Delete Users
- Assign Roles

### Menu Management

- Add Menu
- Update Menu
- Delete Menu
- Upload Images

### Category Management

- Create Categories
- Update Categories
- Delete Categories

### Inventory

- View Stock
- Stock Adjustment
- Low Stock Alert

### Purchase Management

- Create Purchase
- Update Purchase
- Supplier Purchase History

### Supplier Management

- Add Supplier
- Edit Supplier
- Delete Supplier

### Recipe Management

- Create Recipe
- Update Recipe
- Ingredient Calculation

### Waste Management

- Record Waste
- Waste Report

### Customer Management

- View Customers
- Customer Purchase History

### Reports

- Daily Report
- Monthly Report
- Yearly Report
- Sales Report
- Purchase Report
- Profit Report

### Settings

- Cafe Information
- Tax
- Discount
- Roles
- Permissions

---

# 💰 Cashier Features

Cashier only handles customer sales.

- Login
- Create Order
- Search Customer
- Add Customer
- Generate Bill
- Apply Discount
- Receive Payment
- Print Invoice
- Update Order Status
- View Today's Orders

Cashier cannot

- Delete Users
- Delete Purchases
- Modify Recipes
- Change Settings

---

# 🙋 Customer Features

Customer can

- Register
- Login
- View Menu
- Search Food
- Place Order
- Track Order
- View Order History
- Update Profile
- View Today's Special

---

# 🌐 Frontend Features

- Authentication
- Responsive Design
- Dashboard
- Customer Pages
- Menu Pages
- Today Special
- Category Filtering
- Search
- Cart
- Billing
- Reports
- Admin Panel
- Cashier Panel
- Customer Panel
- Protected Routes
- Toast Notifications
- Loading UI
- Dark Mode (Future)

---

# ⚙ Backend Features

- REST API
- JWT Authentication
- Authorization
- CRUD APIs
- MongoDB Transactions
- Services Layer
- Error Handling
- Validation
- Image Upload
- Logging
- Inventory Management
- Recipe Calculation
- Purchase System
- Stock Movement
- Billing System

---

# 🍃 MongoDB Features

Collections

```
Users
Customers
Menus
Categories
Recipes
Ingredients
Purchases
Suppliers
Stocks
Orders
Bills
Payments
Expenses
Waste
Tables
Settings
Notifications
Logs
```

Relationships

```
Supplier
     │
Purchase
     │
Purchase Item
     │
Stock
     │
Recipe
     │
Menu
     │
Order
     │
Bill
```

---

# 🔒 Authentication

- JWT Access Token
- Password Hashing
- Protected Routes
- Role Based Access Control
- Secure API

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/thakurishyam11-stack/RR-cafe.com
```

---

## Install Client

```bash
cd client
npm install
```

---

## Install Server

```bash
cd server
npm install
```

---

## Environment Variables

```
PORT=8080

MONGO_URI=mongodb://127.0.0.1:27017/CafeDB

JWT_SECRET=shyamsecret


---

## Start Backend

```bash
npm run dev
```

---

## Start Frontend

```bash
npm run dev
```

---

# 📌 API Modules

- Authentication
- Users
- Customers
- Categories
- Menus
- Recipes
- Ingredients
- Suppliers
- Purchases
- Stocks
- Orders
- Bills
- Payments
- Waste
- Reports
- Dashboard

---

# 📊 Future Improvements

- QR Ordering
- Online Payment
- Kitchen Display System
- SMS Notification
- Email Notification
- Loyalty Program
- Multi Branch Support
- Offline Mode
- AI Sales Prediction
- AI Recipe Recommendation

---

# 📝 Version History

## Version 1.0.0

Initial Release

- Authentication
- Admin Dashboard
- Menu CRUD
- Category CRUD
- Customer CRUD
- Basic Billing
- Order Management
- Responsive UI

---

## Version 2.0.0

Major Upgrade

- Inventory Management
- Supplier Management
- Purchase Module
- Recipe Module
- Ingredient Management
- Waste Management
- Dashboard Analytics
- Reports
- Services Layer
- Better Folder Structure
- JWT Security Improvements

---

## Version 2.0.1

Latest Stable Release

- Improved UI/UX
- Better API Structure
- Optimized Database Relations
- Performance Improvements
- Bug Fixes
- Better Error Handling
- Protected Routes
- Improved Validation
- Inventory Optimization
- Responsive Admin Dashboard

---

# 👨‍💻 Author

**Shyam Thakuri**

BCA Student | MERN Stack Developer

GitHub: https://github.com/thakurishyam111-stack

Email: thakurishyam111@gmail.com

# ⭐ Support

If you like this project, don't forget to give it a ⭐ on GitHub.

Happy Coding ❤️