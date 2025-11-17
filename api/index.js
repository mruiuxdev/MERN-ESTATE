import express from "express";
import { configDotenv } from "dotenv";

configDotenv();
const PORT = process.env.port;

const app = express();

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
