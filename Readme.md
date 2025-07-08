# Vidtube-backend

Sure! Here's a rewritten version of your README with the same structure and meaning, but using different wording. The author section has been left blank as requested.

---

# 📦 Chai Backend Server

A fully operational backend application developed as part of the **Chai aur Backend Assignment** by [Hitesh Choudhary](https://github.com/hiteshchoudhary). This backend includes essential features such as user authentication, video uploads, playlists, tweet functionality, likes system, subscriptions, dashboard analytics, and more — all built with **Node.js**, **Express.js**, and **MongoDB**.

---

## 📁 Project Structure

```
root/
├── public/               # Static resources (e.g., uploaded video files)
│   └── temp/
├── src/
│   ├── controllers/      # Handlers for each route
│   ├── models/           # Mongoose schema definitions
│   ├── middlewares/      # Custom middleware (auth checks, error handling, etc.)
│   ├── constants/        # App-wide constants and enums
│   ├── DB/               # Database connection setup
│   ├── utils/            # Helper and utility functions
│   ├── routes/           # API route definitions
│   ├── app.js            # Main Express app setup
│   └── index.js          # Server startup file
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Core Functionalities

* ✅ JWT authentication and token validation
* ✅ Full video CRUD with creator info using aggregation
* ✅ Paginated comment system
* ✅ Simple tweet creation/editing/deletion
* ✅ Like/unlike functionality (videos & comments)
* ✅ Subscriptions system (toggle-based)
* ✅ Playlist CRUD operations
* ✅ Channel dashboard with insights (likes, views, subs, etc.)
* ✅ All endpoints verified through **Postman**

---

## 🧰 Technologies Used

* **Runtime**: Node.js + Express.js
* **Database**: MongoDB with Mongoose ODM
* **Authentication**: JWT with access/refresh tokens
* **Environment**: ECMAScript Modules (`type: "module"`)
* **Additional Packages**:
  `dotenv`, `mongoose-aggregate-paginate-v2`, custom error classes, `asyncHandler`, and more

---

## 🔐 Configurations (.env)

Create a `.env` file at the project root and add:

```env
MONGO_URI=your_mongodb_connection_string
PORT=your_app_port
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=token_expiry_time
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=refresh_token_expiry_time
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🛠️ Getting Started Locally

```bash
git clone https://github.com/your-username/Vidtube-Backend.git
cd chai-backend
npm install
npm run dev
```

---

## 📮 API Testing

All the APIs have been thoroughly tested with **Postman**. Each endpoint returns clean JSON responses with meaningful error descriptions.

---

## 📌 Author

**Your Name**
GitHub: [your-github-handle]()

---

## 🙏 Credits

A huge thanks to **[Hitesh Choudhary](https://github.com/hiteshchoudhary)** sir for creating the wonderful **Chai aur Backend** series that guided the development of this project.

---
