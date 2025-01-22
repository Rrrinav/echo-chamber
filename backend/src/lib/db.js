import mongoose from "mongoose";
import dotenv from "dotenv";

export const connectToDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Connected to DB");
  } catch (error) {
    console.error("Failed to connect to DB", error);
  }
}
