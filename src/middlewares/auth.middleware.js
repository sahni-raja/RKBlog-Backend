import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {

    const token = req.cookies?.accessToken;

    
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded;
    
    next();
    
  } catch (error) {

    if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Session expired, please login again" });
    }
    
    return res.status(401).json({ message: "Invalid token" });
  }
};
