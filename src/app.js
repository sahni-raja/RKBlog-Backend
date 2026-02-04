// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// import authRoutes from "./routes/auth.routes.js";
// import postRoutes from "./routes/post.routes.js";

// import commentRoutes from "./routes/comment.routes.js";
// import profileRoutes from "./routes/profile.routes.js";
// import dashboardRoutes from "./routes/dashboard.routes.js";
// import notificationRoutes from "./routes/notification.routes.js";
// import followRoutes from "./routes/follow.routes.js";

// import helmet from "helmet";
// import { apiLimiter, authLimiter } from "./middlewares/rateLimit.middleware.js";





// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true
//   })
// );

// // app.use(express.json());
// app.use(cookieParser());

// app.use("/api/auth", authRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/profile", profileRoutes);
// app.use("/api/dashboard", dashboardRoutes);

// app.use("/api/notifications", notificationRoutes);

// app.use("/api/follow", followRoutes);

// // Security headers
// app.use(helmet());

// // Limit JSON body size
// app.use(express.json({ limit: "10kb" }));

// export default app;

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

/* ================= SECURITY FIRST ================= */

// Security headers
app.use(helmet());

// Hide Express info
app.disable("x-powered-by");

/* ================= CORS ================= */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

/* ================= BODY & COOKIES ================= */

// Limit JSON body size (protects against payload attacks)
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ================= RATE LIMITING ================= */

// General API rate limit
app.use("/api", apiLimiter);

// Strict rate limit for auth routes
app.use("/api/auth", authLimiter);

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/users", userRoutes);


export default app;
