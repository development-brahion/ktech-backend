import mongoose from "mongoose";
import { logMessage } from "../utils/globalFunction.js";

const { DB_STRING } = process.env;

export async function connectDB() {
  try {
    const start = Date.now();

    await mongoose.connect(DB_STRING, {
      serverSelectionTimeoutMS: 5000,
    });

    const end = Date.now();
    logMessage(`✅ DB Connected in ${end - start}ms`, null, "log");
  } catch (error) {
    logMessage("❌ DB Connection Error", error, "error");
  }
}
