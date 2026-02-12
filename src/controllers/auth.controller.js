// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import { User } from "../models/user.model.js";

// const generateToken = (res, userId) => {
//   const token = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
//     expiresIn: "7d"
//   });

// res.cookie("accessToken", token, {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production",
//   sameSite: "none", //"strict"
//   maxAge: 7 * 24 * 60 * 60 * 1000
// });
// };


// export const register = async (req, res) => {
//   const { username, email, password } = req.body;

//   const exists = await User.findOne({ email });
//   if (exists) return res.status(400).json({ message: "User already exists" });

//   const user = await User.create({ username, email, password });
//   generateToken(res, user._id);

//   res.status(201).json({ user });
// };

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).json({ message: "Invalid credentials" });

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//   generateToken(res, user._id);
//   res.json({ user });
// };

// export const logout = (req, res) => {
//   res.clearCookie("accessToken");
//   res.json({ message: "Logged out successfully" });
// };

// export const getProfile = async (req, res) => {
//   const user = await User.findById(req.user.id).select("-password");
//   res.json(user);
// };

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

// ✅ 1. SECURE TOKEN GENERATOR
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7d"
  });

  // Dynamic Check: Are we in Production (HTTPS) or Dev (HTTP)?
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("accessToken", token, {
    httpOnly: true,       // 🔒 Javascript cannot read this (Protects against XSS)
    secure: isProduction, // 🔒 True in Prod (HTTPS), False in Dev (HTTP)
    
    // 🔄 CRITICAL FIX: 
    // "Lax" ensures the cookie works on Localhost (fixing your logout issue).
    // "None" ensures the cookie works on Vercel/Render (cross-site).
    sameSite: isProduction ? "none" : "lax", 
    
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ username, email, password });
    
    // Set the Secure Cookie (Hidden from JS)
    generateToken(res, user._id);

    // ✅ SAFE RESPONSE: Send user info, but NEVER the token string
    res.status(201).json({ user });
    
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Set the Secure Cookie (Hidden from JS)
    generateToken(res, user._id);
    
    // ✅ SAFE RESPONSE: Send user info, but NEVER the token string
    res.json({ user });
    
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  // 🧹 CLEANUP: You must match the exact same attributes to delete the cookie
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax", 
  });
  
  res.json({ message: "Logged out successfully" });
};

export const getProfile = async (req, res) => {
  try {
    // req.user is set by your 'protect' middleware
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
