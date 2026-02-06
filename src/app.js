import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import followRoutes from "./routes/follow.routes.js";
import userRoutes from "./routes/user.routes.js";


import {
  apiLimiter,
  authLimiter
} from "./middlewares/rateLimit.middleware.js";

const app = express();

// Security headers
app.use(helmet());

// Hide Express info
app.disable("x-powered-by");

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true
//   })
// );
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "https://rkblog-frontend.vercel.app", // when you deploy frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);


// Limit JSON body size (protects against payload attacks)
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("RKBlog Backend is running 🚀");
});

// General API rate limit
app.use("/api", apiLimiter);

// Strict rate limit for auth routes
app.use("/api/auth", authLimiter);


app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/users", userRoutes);


export default app;
