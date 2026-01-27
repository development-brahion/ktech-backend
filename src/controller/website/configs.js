import { apiHTTPResponse, logMessage } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import { Config } from "../../models/index.js";
import {
  findOneByQueryLeanWithSelect,
  updateAndCreateDocumentByQueryAndData,
} from "../../services/serviceGlobal.js";

export const updateConfigPanel = async (req, res) => {
  try {
    const inputData = req.body;

    if (!inputData || Object.keys(inputData).length === 0) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "No data provided to update config panel",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE,
      );
    }

    const { statusCode } = await updateAndCreateDocumentByQueryAndData(
      Config,
      {},
      inputData,
    );

    if (statusCode === CONSTANTS.OK) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_OK,
        CONSTANTS_MSG.SUCCESS_MSG,
        CONSTANTS.DATA_NULL,
        CONSTANTS.OK,
      );
    } else {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        CONSTANTS_MSG.FAILED_MSG,
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }
  } catch (error) {
    logMessage("Error in updateConfigPanel controller", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE,
    );
  }
};

export const getConfigPanel = async (req, res) => {
  try {
    const { statusCode, data } = await findOneByQueryLeanWithSelect(
      Config,
      {},
      "-_id companyName facebook twitter instagram youtube websiteName companyPhoneNo companyAddress companyLogo",
    );

    if (statusCode === CONSTANTS.OK || statusCode === CONSTANTS.NOT_FOUND) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS[statusCode === CONSTANTS.OK ? "HTTP_OK" : "HTTP_NOT_FOUND"],
        CONSTANTS_MSG[
          [statusCode === CONSTANTS.OK ? "SUCCESS_MSG" : "DATA_NOT_FOUND"]
        ],
        data,
        statusCode,
      );
    } else {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        CONSTANTS_MSG.FAILED_MSG,
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }
  } catch (error) {
    logMessage("Error in getConfigPanel controller", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE,
    );
  }
};

export const getConfigTemplatesPanel = async (req, res) => {
  try {
    const { statusCode, data } = await findOneByQueryLeanWithSelect(
      Config,
      {},
      "-_id templates",
    );

    if (statusCode === CONSTANTS.OK || statusCode === CONSTANTS.NOT_FOUND) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS[statusCode === CONSTANTS.OK ? "HTTP_OK" : "HTTP_NOT_FOUND"],
        CONSTANTS_MSG[
          [statusCode === CONSTANTS.OK ? "SUCCESS_MSG" : "DATA_NOT_FOUND"]
        ],
        data,
        statusCode,
      );
    } else {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        CONSTANTS_MSG.FAILED_MSG,
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }
  } catch (error) {
    logMessage("Error in getConfigTemplatesPanel controller", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE,
    );
  }
};
