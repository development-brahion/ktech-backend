import "dotenv/config";
import express from "express";
import morgan from "morgan";
import path from "path";
import cors from "cors";

import errorHandler from "./middlewares/errorHandler.js";
import maintenance from "./middlewares/maintenance.js";
import jwt from "./middlewares/jwt.js";
import {
  ipClientAdd,
  mergeParamsToBody,
} from "./middlewares/commonMiddleware.js";

import {
  BOOLEAN_FALSE,
  BOOLEAN_TRUE,
  DATA_NULL,
  NOT_FOUND,
} from "./utils/constants.js";

import routes from "./routes/index.js";

const app = express();
const { API_END_POINT_V1 } = process.env;

/* =======================
   CORS – allow all (TEMP)
======================= */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// handle preflight
app.options("*", cors());

/* =======================
   Body parsers
======================= */
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: BOOLEAN_TRUE, limit: "200mb" }));

/* =======================
   Static uploads
======================= */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* =======================
   Logger
======================= */
app.use(morgan("dev"));

/* =======================
   Middlewares
======================= */
app.use(maintenance);
app.use(jwt());
app.use(mergeParamsToBody);
app.use(ipClientAdd);

/* =======================
   Routes
======================= */
app.use(`${API_END_POINT_V1}`, routes);

/* =======================
   404 handler
======================= */
app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found",
    code: NOT_FOUND,
    error: BOOLEAN_TRUE,
    data: DATA_NULL,
  });
});

/* =======================
   Global error handler
======================= */
app.use(errorHandler);

export default app;
