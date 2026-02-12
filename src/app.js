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

app.use(helmet());

app.disable("x-powered-by");

const allowedOrigins = [
  "http://localhost:5173",
   "http://localhost:5173/",
  "https://rkblog-frontend.vercel.app", // when you deploy frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
  
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


app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("RKBlog Backend is running 🚀");
});

app.use("/api", apiLimiter);

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
