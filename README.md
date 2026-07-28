# 🏥 LRC Medi+ Healthcare — Full MERN Stack Web Application

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Google_DeepMind-8E75B2?logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

A modern, full-stack healthcare e-commerce and medical equipment rental portal serving Navi Mumbai and the Mumbai metro area. **LRC Medi+ Healthcare** provides seamless monthly rentals and outright purchase options for hospital beds, electric/manual wheelchairs, oxygen concentrators, surgical equipment, daily medicines, and emergency healthcare supplies.

---

## ✨ Key Features & Capabilities

### 🛒 E-Commerce & Monthly Rental System
- **Dual Purchase Modes**: Rent medical equipment on a monthly plan (1–12 months) or buy outright.
- **Dynamic Price Calculation**: Instant rental total updates based on selected duration and quantity.
- **Medicines & Daily Healthcare Catalog**: Searchable medicine store sorted by category (Pain Relief, First Aid, Vitamins, Diabetes Care).
- **Prescription Upload Support**: Option for customers to link doctor prescriptions during checkout.
- **Cash / UPI on Delivery**: Flexible checkout methods for customer convenience.

### 🎠 Admin-Managed Dynamic Hero Carousel & Branding Pamphlets
- **Auto-Sliding Hero Banner**: Auto-looping 4-second image slider on the homepage with smooth transitions, left/right arrows, and dot indicators.
- **Admin Pamphlet Control**: Admin can upload custom promo photos, announcement pamphlets, or special rental offer banners directly from the dashboard.

### 🤖 24/7 Gemini AI Healthcare Assistant
- **Integrated Chatbot Widget**: Instant advice on equipment rentals, features, delivery areas, and contact details.
- **Smart Fail-Safe**: Intelligent local keyword fallback mechanism ensuring 100% chatbot uptime even if network or API keys are unavailable.

### 👨‍⚕️ Comprehensive Admin Control Center
- **Product Management**: Add, edit, or delete equipment and medicines with live image file uploads, pricing, stock status, and prescription tags.
- **Image File Upload**: Built-in file uploader (`multer`) supporting drag & drop or direct URL input.
- **Hero Banner Manager**: Live banner preview, upload, and deletion.
- **Order & Rental Management**: Real-time status update pipeline (`Pending` ➔ `Processing` ➔ `Shipped` ➔ `Delivered` / `Cancelled`).
- **User Database**: Complete customer registration records and order history.

### 🌓 UI/UX & Design System
- **Light & Dark Theme Toggle**: Global theme context switching.
- **Fully Responsive**: Mobile-first design for smartphones, tablets, and desktops.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, React Router DOM v6, Vite, Context API, Vanilla CSS Design System |
| **Backend** | Node.js, Express.js (ES Modules), Multer (File Uploads), JWT Authentication |
| **Database** | MongoDB & Mongoose ODM |
| **AI Integration** | Google Gemini AI (`generateContent API`) |
| **Icons & Typography** | FontAwesome 6, Google Fonts (*Outfit* & *Plus Jakarta Sans*) |
| **Deployment** | Vercel (Frontend & Serverless Functions), MongoDB Atlas (Cloud DB) |

---

## 📁 Repository Structure

```
LRC_Healthcare/
├── client/                     # Vite React Frontend
│   ├── public/                 # Static public assets
│   ├── src/
│   │   ├── components/         # Reusable Navbar, Footer, Chatbot, ProductCard
│   │   ├── context/            # AuthContext, CartContext, ThemeContext
│   │   ├── pages/              # HomePage, StorePage, MedicinesPage, ProductDetailPage, CartPage, AdminDashboard, ProfilePage
│   │   ├── services/           # Axios API instance with JWT interceptor
│   │   ├── App.jsx             # React Router routing setup
│   │   └── index.css           # Global design system & responsive styling
│   └── vite.config.js          # Vite config & API dev proxy
├── server/                     # Express API Server
│   ├── config/                 # MongoDB database connection setup
│   ├── controllers/            # Auth, Product, Order, Chat, Banner controllers
│   ├── middleware/             # JWT Protect & Admin authorization middleware
│   ├── models/                 # Mongoose schemas (User, Product, Order, Banner, Prescription)
│   ├── routes/                 # Express API routes
│   ├── uploads/                # Local directory for uploaded product/banner images
│   └── server.js               # Express application entry point
├── api/                        # Vercel serverless function bridge
│   └── index.js
├── vercel.json                 # Vercel routing & serverless configuration
├── package.json                # Root package configuration
└── README.md                   # Project documentation
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) running locally (`mongodb://127.0.0.1:27017`) OR a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI.

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Vivekshinde427/LRC-Mediplus-Healthcare.git
cd LRC-Mediplus-Healthcare

# Install root, server, and client dependencies
npm run install-all
```

### 2. Configure Environment Variables
Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/lrc_healthcare
JWT_SECRET=lrc_healthcare_super_secret_jwt_key_2026
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Application
From the root directory, start both the Express server and Vite React client simultaneously:

```bash
npm run dev
```

- **Frontend Application**: `http://localhost:3000`
- **Backend Express Server**: `http://localhost:5000`

---

## 🔐 Default Admin Credentials

To log in as administrator and access the Admin Control Center:

- **Email**: `mediiplus.healthcare@gmail.com`
- **Password**: `AdminPassword123!`

*(Note: If the database is empty, click **Seed MongoDB Data** inside the Admin Dashboard or call `POST /api/seed` to populate sample equipment and the admin account).*

---

## 🌐 Deploying to Vercel (Production)

### How Database Access Works Online
In local development, the app connects to your local laptop database (`mongodb://127.0.0.1:27017`). When deployed online, Vercel connects over the internet to **MongoDB Atlas** (a free, cloud-hosted MongoDB database), making the site accessible to everyone worldwide!

### Steps to Deploy:
1. **Push code to GitHub**:
   ```bash
   git add .
   git commit -m "Production release"
   git push origin main
   ```
2. **Import in Vercel**:
   - Connect your GitHub repo to [Vercel](https://vercel.com).
   - Framework Preset: `Vite`.
3. **Set Environment Variables in Vercel Dashboard**:
   - `MONGODB_URI`: Your MongoDB Atlas Connection String (`mongodb+srv://...`)
   - `JWT_SECRET`: `your_jwt_secret_key`
   - `GEMINI_API_KEY`: Your Gemini API Key
4. Click **Deploy**!

---

## 📜 License & Copyright

© 2026 **LRC Medi+ Healthcare**. Built with care for quality healthcare delivery.
