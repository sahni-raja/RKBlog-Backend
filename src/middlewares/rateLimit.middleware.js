import rateLimit from "express-rate-limit";

/* ================= GENERAL API LIMIT ================= */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // max requests per IP
  message: {
    message: "Too many requests, please try again later"
  },
  standardHeaders: true,
  legacyHeaders: false
});

/* ================= AUTH ROUTES LIMIT ================= */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // only 10 login/register attempts
  message: {
    message: "Too many auth attempts, please try again later"
  }
});
