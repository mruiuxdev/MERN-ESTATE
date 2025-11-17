import express from "express";
import { configDotenv } from "dotenv";
import connectDB from "./utils/db.js";

configDotenv();

const port = process.env.PORT;
if (!port) {
  throw new Error("PORT is not defined in environment variables");
}

connectDB();

const app = express();

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
