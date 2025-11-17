import express from "express";
import { configDotenv } from "dotenv";
import connectDB from "./utils/db.js";
import authRouter from "./routes/auth.router.js";
import userRouter from "./routes/user.route.js";

configDotenv();

const port = process.env.PORT;
if (!port) {
  throw new Error("PORT is not defined in environment variables");
}

connectDB();

const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
