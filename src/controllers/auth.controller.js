import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7d"
  });

res.cookie("accessToken", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none", //"strict"
  maxAge: 7 * 24 * 60 * 60 * 1000
});
};


export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ username, email, password });
  generateToken(res, user._id);

  res.status(201).json({ user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  generateToken(res, user._id);
  res.json({ user });
};

export const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.json({ message: "Logged out successfully" });
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};
