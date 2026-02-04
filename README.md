# 📝 RKBlog – Backend

**RKBlog** is a modern **social blogging platform backend** where users can register, log in, create posts, explore blogs from all users, interact socially, and receive real-time notifications.  
It is built using **Node.js**, **Express.js**, and **MongoDB**, following clean architecture and production-ready practices.

> ❌ No admin concept  
> 👤 Only users (public & authenticated)  
> 🌍 All posts are publicly visible  
> 🤝 Follow system is social (not feed-restricted)

---

## 🚀 Features

- 🔐 **User Authentication**
  - JWT-based authentication using **HTTP-only cookies**
  - Secure login, register, logout

- ✍️ **Post Management**
  - Create, update, delete blog posts
  - Upload images using **Cloudinary**
  - Tags support
  - Public post exploration

- ❤️ **Social Interactions**
  - Like / Unlike posts
  - Bookmark / Unbookmark posts
  - Comment on posts
  - Reply to comments (nested comments)

- 👥 **Follow System**
  - Follow / Unfollow users
  - Followers & following count
  - Followers visible on public profile

- 👤 **User Dashboard**
  - My posts
  - My liked posts
  - My bookmarked posts
  - My comments
  - Followers & following
  - Activity statistics

- 🔔 **Notifications System**
  - Notifications for:
    - Likes
    - Comments
    - Replies
    - Follows
  - Stored in database
  - **Real-time notifications using Socket.io**
  - Mark one / mark all as read
  - Clear notifications

- 🔐 **Security & Performance**
  - Rate limiting (general + auth routes)
  - Secure cookies
  - Helmet security headers
  - Payload size limits
  - Express fingerprint hidden

---

## 🛠️ Tech Stack

### 🔧 Backend

- **Node.js**
- **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** (HTTP-Only Cookies)
- **Cloudinary** (Image Storage)
- **Socket.io** (Real-Time Notifications)
- **Helmet** (Security Headers)
- **express-rate-limit** (API Protection)
- **dotenv**, **cors**, **cookie-parser**

---

## 📁 Project Structure
📦 RKBlog-backend/server
├── 📂 src
│ ├── 📂 controllers   # Business logic (auth, posts, comments, follow, notifications)
│ ├── 📂 models        # Mongoose schemas
│ ├── 📂 routes        # API routes
│ ├── 📂 middlewares   # Auth, rate limiting, multer
│ ├── 📂 utils         # Cloudinary, notification helpers
│ ├── 📂 db            # MongoDB connection
│ ├── 📜 socket.js     # Socket.io setup
│ ├── 📜 app.js        # Express app configuration
│ └── 📜 index.js      # Server entry point
│
├── 📜 .env            # Environment variables
├── 📜 package.json
└── 📜 README.md


---

## 🔐 Authentication

- JWT is stored in **HTTP-Only cookies**
- Cookies are secured using:
  - `httpOnly`
  - `sameSite`
  - `secure` (in production)
- No tokens stored in localStorage

---

## 🔑 API Overview

### Auth Routes
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me


### Post Routes
POST /api/posts
GET /api/posts
GET /api/posts/:postId
PUT /api/posts/:postId
DELETE /api/posts/:postId
PUT /api/posts/:postId/like
PUT /api/posts/:postId/bookmark


### Comment Routes
POST /api/comments/:postId
POST /api/comments/:postId/:commentId/reply
GET /api/comments/:postId
DELETE /api/comments/:commentId


### Follow Routes
PUT /api/follow/:userId


### Dashboard (Private)
GET /api/dashboard

### Public User Profile
GET /api/users/:userId

### Notification Routes
GET /api/notifications
PUT /api/notifications/:id/read
PUT /api/notifications/read-all
DELETE /api/notifications/clear-all
DELETE /api/notifications/clear-read


---

## 🔔 Real-Time Notifications

- Implemented using **Socket.io**
- Notifications are:
  - Saved in database
  - Pushed instantly if user is online
- Offline users receive notifications on next login

---

## 🔐 Security Measures

- Rate limiting for all APIs
- Strict rate limiting for auth routes
- Secure HTTP headers using Helmet
- Payload size limits to prevent abuse
- CORS restricted to frontend origin
- Express fingerprint hidden


---
### Notes

No admin role in the system

All posts are publicly visible

Follow system is social, not restrictive

Backend is fully production-ready

👨‍💻 Author

Raja Kumar
B.Tech CSE | Full-Stack Developer

---

## ⚙️ Environment Variables

Create a `.env` file in the root with:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


---

## 🚀 Installation & Running

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Steps

```bash
git clone https://github.com/your-username/RKBlog-backend.git
cd RKBlog-backend
npm install
npm run dev
Server will run on:

http://localhost:5000

