# ☕ Cafe Digitalization System (MERN Stack)

A professional **Cafe Digitalization Web Application** built using the MERN stack.
This system allows customers to view the menu, place orders, and enables the admin to manage menu items and orders efficiently.

---

# 🚀 Features

### Customer Side

* View digital cafe menu
* Browse food items
* Place orders
* Responsive landing page

### Admin Side

* Add menu items
* Edit / Delete menu items
* Manage orders
* View order status

---

# 🛠 Tech Stack

Frontend

* React.js

Backend

* Node.js
* Express.js

Database

* MongoDB

---

# 📁 Project Structure

```
cafe-digitalization
│
├── client
│
└── server
```

---

# 📂 Frontend Structure (client)

```
client
│
├── public
│   └── index.html
│
├── src
│
│   ├── assets
│   │   ├── images
│   │   └── icons
│
│   ├── components
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── MenuCard.jsx
│   │   ├── ReviewCard.jsx
│   │   └── Footer.jsx
│
│   ├── pages
│   │   ├── Home.jsx
│   │   ├── Menu.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   └── Order.jsx
│
│   ├── services
│   │   └── api.js
│
│   ├── context
│   │   └── AuthContext.jsx
│
│   ├── styles
│   │   └── main.css
│
│   ├── App.jsx
│   └── main.jsx
│
└── package.json
```

---

# ⚙️ Backend Structure (server)

```
server
│
├── config
│   └── db.js
│
├── controllers
│   ├── menuController.js
│   ├── orderController.js
│   └── userController.js
│
├── models
│   ├── Menu.js
│   ├── Order.js
│   └── User.js
│
├── routes
│   ├── menuRoutes.js
│   ├── orderRoutes.js
│   └── userRoutes.js
│
├── middleware
│   └── authMiddleware.js
│
├── utils
│   └── helpers.js
│
├── server.js
└── package.json
```

---

# 🗄 Database Models

### Menu

```
name
price
category
image
description
```

### Order

```
customerName
items
tableNumber
totalPrice
status
date
```

### User

```
name
email
password
role
```

---

# 🔗 API Routes

```
GET     /api/menu
POST    /api/menu

GET     /api/orders
POST    /api/orders

POST    /api/login
POST    /api/register
```

---

# ▶️ Installation

Clone the repository

```
git clone https://github.com/yourusername/cafe-digitalization.git
```

### Install Frontend

```
cd client
npm install
npm run dev
```

### Install Backend

```
cd server
npm install
npm run start
```

---

# 🌐 Future Improvements

* QR Code Menu
* Online Payment Integration
* Real-time Order Tracking
* Admin Analytics Dashboard

---

# 👨‍💻 Author

Shyam Thakuri
BCA Student | Nepal 🇳🇵

---

# ⭐ Support

If you like this project, please give it a **star ⭐ on GitHub**.
