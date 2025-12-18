import { apiHTTPResponse, logMessage } from "../utils/globalFunction.js";
import {
  DATA_NULL,
  HTTP_SERVICE_UNAVAILABLE,
  SERVICE_UNAVAILABLE,
  ERROR_TRUE,
} from "../utils/constants.js";

const { MAINTENANCE } = process.env;

function maintenance(req, res, next) {
  try {
    if (MAINTENANCE && MAINTENANCE.toLowerCase() === "true") {
      return apiHTTPResponse(
        req,
        res,
        HTTP_SERVICE_UNAVAILABLE,
        "Service temporarily unavailable due to maintenance.",
        DATA_NULL,
        SERVICE_UNAVAILABLE,
        ERROR_TRUE
      );
    }
    next();
  } catch (error) {
    logMessage("Error in maintenance middleware", error, "error");
    next(error);
  }
}

export default maintenance;
