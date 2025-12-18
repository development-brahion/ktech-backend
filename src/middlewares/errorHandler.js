import { apiHTTPResponse, logMessage } from "../utils/globalFunction.js";
import * as CONSTANT from "../utils/constants.js";

function errorHandler(err, req, res) {
  try {
    if (typeof res?.status !== "function") {
      logMessage("`res` is not a valid response object", err, "error");
      return;
    }

    if (err.type === "entity.parse.failed") {
      logMessage("Entity parsing failed", err, "error");
      return apiHTTPResponse(
        req,
        res,
        CONSTANT.HTTP_BAD_REQUEST,
        "Invalid request body. Please check the provided data.",
        CONSTANT.DATA_NULL,
        CONSTANT.BAD_REQUEST,
        CONSTANT.ERROR_TRUE
      );
    }

    if (typeof err === "string") {
      logMessage("String error occurred", err, "error");
      return apiHTTPResponse(
        req,
        res,
        CONSTANT.HTTP_BAD_REQUEST,
        err || "An error occurred",
        CONSTANT.DATA_NULL,
        CONSTANT.BAD_REQUEST,
        CONSTANT.ERROR_TRUE
      );
    }

    if (err.name === "UnauthorizedError") {
      logMessage("Unauthorized error occurred", err, "error");
      return apiHTTPResponse(
        req,
        res,
        CONSTANT.HTTP_UNAUTHORIZED,
        "Invalid or expired authentication token",
        CONSTANT.DATA_NULL,
        CONSTANT.INVALID_TOKEN,
        CONSTANT.ERROR_TRUE
      );
    }

    if (err.name === "ValidationError") {
      logMessage("Validation error occurred", err, "error");
      return apiHTTPResponse(
        req,
        res,
        CONSTANT.HTTP_UNPROCESSABLE_ENTITY,
        err.message,
        err.details || CONSTANT.DATA_NULL,
        CONSTANT.VALIDATION_ERROR,
        CONSTANT.ERROR_TRUE
      );
    }

    if (err.isApiError) {
      logMessage("API error occurred", err, "error");
      return apiHTTPResponse(
        req,
        res,
        err.statusCode || CONSTANT.HTTP_BAD_REQUEST,
        err.message,
        err.data || CONSTANT.DATA_NULL,
        err.code || CONSTANT.BAD_REQUEST,
        CONSTANT.ERROR_TRUE
      );
    }
    logMessage("Unknown error occurred", err, "error");

    return apiHTTPResponse(
      req,
      res,
      CONSTANT.HTTP_INTERNAL_SERVER_ERROR,
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
      CONSTANT.DATA_NULL,
      CONSTANT.INTERNAL_SERVER_ERROR,
      CONSTANT.ERROR_TRUE
    );
  } catch (innerErr) {
    logMessage("Error in errorHandler", innerErr, "error");
    if (typeof res?.status === "function") {
      return res.status(500).json({
        message: "Internal error while processing the error",
        code: CONSTANT.INTERNAL_SERVER_ERROR,
        error: true,
        data: null,
      });
    }
  }
}

export default errorHandler;
