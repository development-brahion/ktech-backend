import Joi from "joi";
import multer from "multer";
import {
  joiValidatorFunction,
  apiHTTPResponse,
  logMessage,
} from "../utils/globalFunction.js";

import * as CONSTANTS from "../utils/constants.js";
import validators from "../validators/index.js";

const { commonValidators, moduleValidators } = validators;

const parseFormDataFields = (body) => {
  const parsedBody = { ...body };

  Object.keys(body).forEach((key) => {
    let value = body[key];
    if (key === "query") {
      return;
    }
    if (typeof value === "string") {
      const lowerCaseValue = value.toLowerCase().trim();

      if (lowerCaseValue === "true") {
        parsedBody[key] = true;
        return;
      }

      if (lowerCaseValue === "false") {
        parsedBody[key] = false;
        return;
      }
    }

    if (
      typeof value === "string" &&
      (value.startsWith("[") || value.startsWith("{"))
    ) {
      try {
        const parsedValue = JSON.parse(value);

        if (typeof parsedValue === "object" && parsedValue !== null) {
          parsedBody[key] = parsedValue;
        }
        if (typeof parsedValue === "array" && parsedValue !== null) {
          parsedBody[key] = parsedValue;
        }
      } catch (e) {
        logMessage(
          `Could not parse field '${key}' as JSON. Keeping as string.`,
          e.message,
          "warn",
        );
      }
    }
  });

  return parsedBody;
};

const validationMiddleware =
  (moduleName, role, useCommon = false, skipMethods = []) =>
  async (req, res, next) => {
    try {
      const method = req.method.toUpperCase();

      if (skipMethods.includes(method)) {
        req.body = {};
        return next();
      }

      const path = req.path;


      const schemaObject = useCommon
        ? commonValidators[path] || {}
        : role
          ? moduleValidators[moduleName]?.[role]?.[path] || {}
          : moduleValidators[moduleName]?.[path] || {};

      const schema = Joi.object(schemaObject);

      const bodyToValidate = parseFormDataFields(req.body);

      const errorMessages = await joiValidatorFunction(schema, bodyToValidate);

      if (errorMessages) {
        return apiHTTPResponse(
          req,
          res,
          CONSTANTS.HTTP_BAD_REQUEST,
          errorMessages,
          CONSTANTS.DATA_NULL,
          CONSTANTS.BAD_REQUEST,
          CONSTANTS.ERROR_TRUE,
        );
      }

      req.body = bodyToValidate;
      next();
    } catch (error) {
      logMessage("Error in validation middleware", error, "error");
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
        "Internal server error during validation.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.INTERNAL_SERVER_ERROR,
        CONSTANTS.ERROR_TRUE,
      );
    }
  };

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    let errorMessage = "File upload error.";

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      errorMessage = `File upload error: Too many files were submitted for field '${err.field}'.`;
    } else if (err.code === "LIMIT_FILE_COUNT") {
      errorMessage = `File upload error: Too many files were submitted for field '${err.field}'.`;
    } else if (err.code === "LIMIT_FILE_SIZE") {
      errorMessage = `File upload error: Too many files were submitted for field '${err.field}'.`;
    } else {
      errorMessage = `File upload error: ${err.message}`;
    }
    logMessage(errorMessage, err, "error");

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      errorMessage,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE,
    );
  }

  next(err);
};

export { validationMiddleware, multerErrorHandler };
