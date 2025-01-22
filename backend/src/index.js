import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import { connectToDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
  console.log("Hello World");
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
  connectToDB()
});
