import { expressjwt as jwt } from "express-jwt";
import { apiHTTPResponse } from "../utils/globalFunction.js";
import {
  DATA_NULL,
  HTTP_UNAUTHORIZED,
  HTTP_SERVICE_UNAVAILABLE,
  SERVICE_UNAVAILABLE,
  ERROR_TRUE,
  UNAUTHORIZED,
} from "../utils/constants.js";

const { JWT_SECRET_KEY, API_END_POINT_V1 } = process.env;

const publicPaths = [`${API_END_POINT_V1}auth/login,`];

const jwtMiddleware = jwt({
  secret: JWT_SECRET_KEY,
  algorithms: ["HS256"],
  credentialsRequired: true,
  requestProperty: "user",
}).unless({
  path: publicPaths,
});

export default () => {
  return (req, res, next) => {
    jwtMiddleware(req, res, (err) => {
      if (err) {
        if (
          err.name === "UnauthorizedError" &&
          err.inner?.name === "TokenExpiredError"
        ) {
          return apiHTTPResponse(
            req,
            res,
            HTTP_UNAUTHORIZED,
            "Session expired. Please log in again.",
            DATA_NULL,
            "TOKEN_EXPIRED",
            ERROR_TRUE
          );
        }

        if (err.name === "UnauthorizedError") {
          return apiHTTPResponse(
            req,
            res,
            HTTP_UNAUTHORIZED,
            "Access denied. Please log in to continue.",
            DATA_NULL,
            UNAUTHORIZED,
            ERROR_TRUE
          );
        }

        return apiHTTPResponse(
          req,
          res,
          HTTP_SERVICE_UNAVAILABLE,
          "Service temporarily unavailable. Please try again later.",
          DATA_NULL,
          SERVICE_UNAVAILABLE,
          ERROR_TRUE
        );
      }

      next();
    });
  };
};
