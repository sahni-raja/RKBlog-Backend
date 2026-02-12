// import jwt from "jsonwebtoken";

// export const protect = (req, res, next) => {
//   try {
//     const token = req.cookies.accessToken;

//     if (!token) {
//       return res.status(401).json({ message: "Not authenticated" });
//     }

//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    // 1. SAFETY CHECK: Ensure cookies object exists before accessing it
    // This prevents a server crash (500 Error) if cookie-parser fails.
    const token = req.cookies?.accessToken;

    // 2. STRICT SECURITY: If no cookie, stop here.
    // We do NOT check headers. This ensures only HttpOnly cookies are used.
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // 3. VALIDATION: Verify the token
    // If the secret is wrong or token is expired, verify() throws an error
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 4. SUCCESS: Attach user info to request
    req.user = decoded;
    
    next();
    
  } catch (error) {
    // 5. ERROR HANDLING:
    // Differentiate between "Expired" and "Invalid" (Optional but helpful)
    if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Session expired, please login again" });
    }
    
    return res.status(401).json({ message: "Invalid token" });
  }
};
