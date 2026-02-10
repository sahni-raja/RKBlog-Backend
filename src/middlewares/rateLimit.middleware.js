// import rateLimit from "express-rate-limit";

// export const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, 
//   max: 200, 
//   message: {
//     message: "Too many requests, please try again later"
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

// export const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 10, 
//   message: {
//     message: "Too many auth attempts, please try again later"
//   }
// });
import rateLimit from "express-rate-limit";

// Keep API limiter as IP-based (This protects your server from DDoS)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, 
  message: {
    message: "Too many requests, please try again later"
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Update Auth limiter to track by EMAIL, not IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Allow 10 login attempts per email per 15 mins
  message: {
    message: "Too many login attempts for this account, please try again later"
  },
  standardHeaders: true,
  legacyHeaders: false,
  
  keyGenerator: (req, res) => {
   
    return req.body.email || req.ip;
  }
});
