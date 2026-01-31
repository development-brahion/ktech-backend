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

const publicPathsForV1 = [
  `${API_END_POINT_V1}health`,
  `${API_END_POINT_V1}auth/signIn`,
  `${API_END_POINT_V1}auth/forgotpassword`,
  `${API_END_POINT_V1}auth/resetpassword`,
  `${API_END_POINT_V1}website/home`,
  `${API_END_POINT_V1}website/course-faq`,
  `${API_END_POINT_V1}website/about-us`,
  `${API_END_POINT_V1}website/terms-and-conditions`,
  `${API_END_POINT_V1}website/privacy-policy`,
  `${API_END_POINT_V1}website/why-us`,
  `${API_END_POINT_V1}website/refund-policy`,
  `${API_END_POINT_V1}website/queries/submit`,
];

const publicPaths = [...publicPathsForV1, /^\/uploads(\/.*)?$/];

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
            ERROR_TRUE,
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
            ERROR_TRUE,
          );
        }

        return apiHTTPResponse(
          req,
          res,
          HTTP_SERVICE_UNAVAILABLE,
          "Service temporarily unavailable. Please try again later.",
          DATA_NULL,
          SERVICE_UNAVAILABLE,
          ERROR_TRUE,
        );
      }

      next();
    });
  };
};
