import http from "http";
import app from "./app.js";
import { logMessage } from "./utils/globalFunction.js";
import { connectDB } from "./config/db.js";

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      logMessage(`🚀 Server running on port ${PORT}`, null, "log");
    });
  } catch (err) {
    logMessage("❌ Error during server startup", err, "error");
    process.exit(1);
  }
})();
