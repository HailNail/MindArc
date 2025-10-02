# 🛒 E-Commerce MERN App

## 📌 Overview

A full-stack **E-Commerce application** built with the **MERN stack (MongoDB, Express, React, Node.js)**.

Users can **browse and buy products, pay securely with Stripe (test mode)**, and manage their accounts.  
Admins can **manage users, categories, products, and orders** via a protected dashboard.

---

## ✨ Features

### 🧑 User

- 🔑 Register & login with JWT authentication (httpOnly cookies)
- 👤 Update profile & password
- 🛍️ Browse products by category
- 🛒 Add/remove items from cart
- 💳 Checkout & pay using **Stripe test mode**
- 📦 View order history

### 👨‍💼 Admin

- 👥 Manage users (CRUD)
- 📂 Manage categories
- 📦 Manage products (CRUD with images)
- 📑 Manage orders (view/update status)
- 📊 Dashboard overview

---

## 🛠️ Tech Stack

- **Frontend**: React, Redux Toolkit, Radix UI, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Auth**: JWT + Cookies
- **Payments**: Stripe (test mode)

---

## ⚙️ Installation

### 1. Clone the repo

```bash
git clone https://github.com/your-username/ecommerce-mern-app.git
cd ecommerce-mern-app
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a **.env** file:

```bash
PORT=5000
MONGO_URI=your-mongo-uri
JWT_SECRET=your-secret
STRIPE_SECRET_KEY=your-stripe-secret
```

Run backend in dev mode

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm start
```
