// import mongoose from "mongoose";
// import { logMessage } from "../utils/globalFunction.js";

// const { DB_STRING } = process.env;

// export async function connectDB() {
//   try {
//     const start = Date.now();

//     await mongoose.connect(DB_STRING, {
//       serverSelectionTimeoutMS: 5000,
//     });

//     const end = Date.now();
//     logMessage(`✅ DB Connected in ${end - start}ms`, null, "log");
//   } catch (error) {
//     logMessage("❌ DB Connection Error", error, "error");
//   }
// }

import mongoose from "mongoose";
import { logMessage } from "../utils/globalFunction.js";

const { DB_STRING } = process.env;

export async function connectDB() {
  const start = Date.now();

  try {
    await mongoose.connect(DB_STRING, {
      serverSelectionTimeoutMS: 5000,
    });

    const end = Date.now();
    logMessage(`✅ DB Connected in ${end - start}ms`, null, "log");

    // Optional but recommended logs
    mongoose.connection.on("disconnected", () => {
      logMessage("⚠️ MongoDB disconnected", null, "error");
    });

    mongoose.connection.on("error", (err) => {
      logMessage("❌ MongoDB error", err, "error");
    });
  } catch (error) {
    logMessage("❌ DB Connection Error", error, "error");

    // ✅ IMPORTANT: stop server startup if DB fails
    throw error;
  }
}
