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

  const cleanEmail = normalizedTrimLowerCase(email);
  const cleanUsername = normalizedTrim(username);

  try {
    const existing = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });

    if (existing) {
      return next(
        errorHandler(409, "User with given email or username already exists")
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      username: cleanUsername,
      email: cleanEmail,
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

  const cleanEmail = normalizedTrimLowerCase(email);

  try {
    const existing = await User.findOne({ email: cleanEmail });

    if (!existing) {
      await bcryptjs.compare(
        password,
        "$2a$10$invalidsaltinvalidsaltinv.u7uZHiogX9UO"
      );
      return next(errorHandler(400, "Invalid credentials"));
    }

    const matchedPassword = await bcryptjs.compare(password, existing.password);
    if (!matchedPassword) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    const token = jwt.sign({ id: existing._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: pass, ...rest } = existing._doc;

    return res
      .cookie("access_token", token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        // sameSite: "strict",
        // maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ message: "Logged in successfully", user: rest });
  } catch (error) {
    console.error("Sign In error:", error);
    next(errorHandler(500, "Error function sign in"));
  }
};

export const google = async (req, res, next) => {
  const { email, name, photo } = req.body || {};

  if (!email) {
    return next(errorHandler(400, "Email is required"));
  }

  const cleanEmail = normalizedTrimLowerCase(email);

  try {
    let user = await User.findOne({ email: cleanEmail });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      const { password, ...rest } = user._doc;

      return res
        .cookie("access_token", token, {
          httpOnly: true,
          // secure: process.env.NODE_ENV === "production",
          // sameSite: "strict",
          // maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({ message: "Logged in successfully", user: rest });
    }

    const randomPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const hashedPassword = await bcryptjs.hash(randomPassword, 10);

    const generatedUsername =
      (name ? name.split(" ").join("").toLowerCase() : "user") +
      Math.random().toString(36).slice(-4);

    user = new User({
      username: normalizedTrim(generatedUsername),
      email: cleanEmail,
      password: hashedPassword,
      avatar: photo || null,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password, ...rest } = user._doc;

    return res
      .cookie("access_token", token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        // sameSite: "strict",
        // maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ message: "Logged in successfully", user: rest });
  } catch (error) {
    console.error("Google Sign In error:", error);
    next(errorHandler(500, "Error function sign in with Google"));
  }
};
