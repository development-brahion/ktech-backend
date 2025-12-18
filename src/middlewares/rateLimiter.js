import { apiHTTPResponse } from "../utils/globalFunction.js";
import * as CONSTANTS from "../utils/constants.js";
import * as CONSTANTS_MSG from "../utils/constantsMessage.js";
import rateLimit from "express-rate-limit";

export const createRateLimiter = (windowMinutes, maxRequests, message) => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) =>
      apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_TOO_MANY_REQUESTS,
        message || CONSTANTS_MSG.TOO_MANY_ATTEMPTS,
        CONSTANTS.DATA_NULL,
        CONSTANTS.TOO_MANY_REQUESTS
      ),
  });
};

export const loginLimiter = createRateLimiter(
  15,
  5,
  "Too many login attempts. Please try again after 15 minutes."
);

export const otpLimiter = createRateLimiter(
  10,
  3,
  "Too many OTP requests. Please try again later."
);

export const defaultLimiter = createRateLimiter(
  1,
  30,
  "Too many requests. Please try again shortly."
);

export const pinLimiter = createRateLimiter(
  10,
  5,
  "Too many pin requests. Please try again later."
);
