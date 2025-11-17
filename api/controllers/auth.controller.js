import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const signUp = async (req, res) => {
  const { username, email, password } = req.body || {};

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "username, email and password are required" });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: String(username).trim() }],
    });

    if (existing) {
      return res
        .status(409)
        .json({ error: "User with given email or username already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      username: String(username).trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const saved = await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: saved._id,
        username: saved.username,
        email: saved.email,
        createdAt: saved.createdAt,
      },
    });
  } catch (error) {
    console.error("signUp error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
