import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { normalizedTrim, normalizedTrimLowerCase } from "../utils/normalize.js";
import { errorHandler } from "../utils/error.js";

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body || {};

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "username, email and password are required" });
  }

  try {
    const existing = await User.findOne({
      $or: [
        { email: normalizedTrimLowerCase(email) },
        { username: normalizedTrim(username) },
      ],
    });

    if (existing) {
      return res
        .status(409)
        .json({ error: "User with given email or username already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      username: normalizedTrim(username),
      email: normalizedTrimLowerCase(email),
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
    next(errorHandler(500, "Error function sign up"));
  }
};
