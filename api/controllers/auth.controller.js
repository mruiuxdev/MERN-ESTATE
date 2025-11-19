import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { normalizedTrim, normalizedTrimLowerCase } from "../utils/normalize.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body || {};

  if (!username || !email || !password) {
    return next(errorHandler(400, "username, email and password are required"));
  }

  try {
    const existing = await User.findOne({
      $or: [
        { email: normalizedTrimLowerCase(email) },
        { username: normalizedTrim(username) },
      ],
    });

    if (existing) {
      return next(
        errorHandler(409, "User with given email or username already exists")
      );
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
    console.error("Sign Up error:", error);
    next(errorHandler(500, "Error function sign up"));
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return next(errorHandler(400, "email and password are required"));
  }

  try {
    const existing = await User.findOne({
      email: normalizedTrimLowerCase(email),
    });
    if (!existing) {
      return next(errorHandler(400, "User not found"));
    }

    const matchedPassword = bcryptjs.compareSync(password, existing.password);
    if (!matchedPassword) {
      return next(errorHandler(401, "Invalid credential"));
    }

    const token = jwt.sign({ id: existing._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = existing._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    console.error("Sign In error:", error);
    next(errorHandler(500, "Error function sign in"));
  }
};
