import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7d"
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("accessToken", token, {
    httpOnly: true,       //  Javascript cannot read this (Protects against XSS)
    secure: isProduction, //  True in Prod (HTTPS), False in Dev (HTTP)
    
  
    sameSite: isProduction ? "none" : "lax", 
    
    maxAge: 7 * 24 * 60 * 60 * 1000 
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

    // SAFE RESPONSE: Send user info, but NEVER the token string
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
    
    res.json({ user });
    
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax", 
  });
  
  res.json({ message: "Logged out successfully" });
};

export const getProfile = async (req, res) => {
  try {
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
