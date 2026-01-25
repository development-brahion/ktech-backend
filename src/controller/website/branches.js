import { apiHTTPResponse, logMessage } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import { Branch } from "../../models/index.js";
import crudService from "../../services/crudService.js";
import { findOneByQueryLean } from "../../services/serviceGlobal.js";

const languageMessages = {
  create: "Branch created successfully",
  update: "Branch updated successfully",
  status: "Branch status updated successfully",
  delete: "Branch deleted successfully",
  exists: "Branch already exists",
};

export const list = async (req, res) => {
  try {
    return crudService.getList(Branch, CONSTANTS.BOOLEAN_TRUE)(req, res);
  } catch (error) {
    logMessage("Error in list branches", error, "error");
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

export const create = async (req, res) => {
  try {
    const { name } = req.body;

    const { statusCode } = await findOneByQueryLean(Branch, {
      name: { $regex: name.trim(), $options: "i" },
      isDeleted: CONSTANTS.BOOLEAN_FALSE,
    });

    if (statusCode === CONSTANTS.OK) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_CONFLICT,
        languageMessages.exists,
        CONSTANTS.DATA_NULL,
        CONSTANTS.CONFLICT,
      );
    }

    return crudService.create(
      Branch,
      languageMessages.create,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in create branch", error, "error");
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

export const update = async (req, res) => {
  try {
    const { name, _id } = req.body;

    const { statusCode } = await findOneByQueryLean(Branch, {
      _id: { $ne: _id },
      name: { $regex: name.trim(), $options: "i" },
      isDeleted: CONSTANTS.BOOLEAN_FALSE,
    });

    if (statusCode === CONSTANTS.OK) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_CONFLICT,
        languageMessages.exists,
        CONSTANTS.DATA_NULL,
        CONSTANTS.CONFLICT,
      );
    }

    return crudService.update(
      Branch,
      languageMessages.update,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in update branch", error, "error");
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

export const enableDisable = async (req, res) => {
  try {
    return crudService.enableDisable(
      Branch,
      languageMessages.status,
      CONSTANTS.BOOLEAN_TRUE,
      "Branch",
      CONSTANTS.BLANK_OBJECT,
      CONSTANTS.BLANK_OBJECT,
      "status",
    )(req, res);
  } catch (error) {
    logMessage("Error in enable/disable branch", error, "error");
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

export const softDelete = async (req, res) => {
  try {
    return crudService.softDelete(
      Branch,
      languageMessages.delete,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in delete branch", error, "error");
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

export const allDocs = async (req, res) => {
  try {
    return crudService.getALLDocuments(Branch, CONSTANTS.BOOLEAN_FALSE)(
      req,
      res,
    );
  } catch (error) {
    logMessage("Error in get all branches", error, "error");
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
