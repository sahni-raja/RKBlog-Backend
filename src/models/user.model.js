import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    likes: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }
],
bookmarks: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }
],
followers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
],
following: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
],


  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export const User = mongoose.model("User", userSchema);
