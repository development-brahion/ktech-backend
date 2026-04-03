// import "dotenv/config";
// import express from "express";
// import session from "express-session";
// import morgan from "morgan";
// import path from "path";

// import errorHandler from "./middlewares/errorHandler.js";
// import maintenance from "./middlewares/maintenance.js";
// import jwt from "./middlewares/jwt.js";
// import {
//   ipClientAdd,
//   mergeParamsToBody,
// } from "./middlewares/commonMiddleware.js";

// import {
//   BOOLEAN_FALSE,
//   BOOLEAN_TRUE,
//   DATA_NULL,
//   NOT_FOUND,
// } from "./utils/constants.js";
// import corsMiddleware from "./middlewares/corsMiddleware.js";
// import routes from "./routes/index.js";

// const app = express();
// const { API_END_POINT_V1, SESSION_SECRET_KEY } = process.env;
// console.log("CWD:", process.cwd());
// app.use(corsMiddleware());
// app.use(express.json({ limit: "200mb" }));
// app.use(express.urlencoded({ extended: BOOLEAN_TRUE, limit: "200mb" }));
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// app.use(morgan("dev"));
// app.use(
//   session({
//     secret: SESSION_SECRET_KEY,
//     resave: BOOLEAN_FALSE,
//     saveUninitialized: BOOLEAN_TRUE,
//   })
// );

// app.use(maintenance);
// app.use(jwt());
// app.use(mergeParamsToBody);
// app.use(ipClientAdd);

// app.use(`${API_END_POINT_V1}`, routes);

// app.use((req, res) => {
//   res.status(404).json({
//     message: "API endpoint not found",
//     code: NOT_FOUND,
//     error: BOOLEAN_TRUE,
//     data: DATA_NULL,
//   });
// });

// app.use(errorHandler);

// export default app;


import "dotenv/config";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import path from "path";

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
import corsMiddleware from "./middlewares/corsMiddleware.js";
import routes from "./routes/index.js";

const app = express();
const { API_END_POINT_V1, SESSION_SECRET_KEY } = process.env;

// ✅ Debug
console.log("CWD:", process.cwd());

/**
 * ✅ 1. STATIC FILES (MUST BE FIRST)
 * This ensures /uploads NEVER goes to API or JWT
 */
app.use(
  "/uploads",
  express.static("/root/k-tech-new/ktech-backend/uploads")
);

/**
 * ✅ 2. BASIC MIDDLEWARES
 */
app.use(corsMiddleware());
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: BOOLEAN_TRUE, limit: "200mb" }));
app.use(morgan("dev"));

app.use(
  session({
    secret: SESSION_SECRET_KEY,
    resave: BOOLEAN_FALSE,
    saveUninitialized: BOOLEAN_TRUE,
  })
);

/**
 * ✅ 3. CUSTOM MIDDLEWARES
 */
app.use(maintenance);

/**
 * ✅ 4. JWT (uploads already excluded)
 */
app.use(jwt());

app.use(mergeParamsToBody);
app.use(ipClientAdd);

/**
 * ✅ 5. ROUTES
 */
app.use(`${API_END_POINT_V1}`, routes);

/**
 * ❌ 404 HANDLER
 */
app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found",
    code: NOT_FOUND,
    error: BOOLEAN_TRUE,
    data: DATA_NULL,
  });
});

/**
 * ❌ ERROR HANDLER
 */
app.use(errorHandler);

export default app;