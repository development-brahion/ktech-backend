import { apiHTTPResponse, logMessage } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import { Category } from "../../models/index.js";
import crudService from "../../services/crudService.js";
import { findOneByQueryLean } from "../../services/serviceGlobal.js";

const languageMessages = {
  create: "Category created successfully",
  update: "Category updated successfully",
  status: "Category status updated successfully",
  delete: "Category deleted successfully",
  exists: "Category already exists",
};

export const list = async (req, res) => {
  try {
    return crudService.getList(Category, CONSTANTS.BOOLEAN_TRUE)(req, res);
  } catch (error) {
    logMessage("Error in list languages", error, "error");
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

    const { statusCode } = await findOneByQueryLean(Category, {
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
      Category,
      languageMessages.create,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in create category", error, "error");
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

    const { statusCode } = await findOneByQueryLean(Category, {
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
      Category,
      languageMessages.update,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in update category", error, "error");
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
      Category,
      languageMessages.status,
      CONSTANTS.BOOLEAN_TRUE,
      "Category",
      CONSTANTS.BLANK_OBJECT,
      CONSTANTS.BLANK_OBJECT,
      "status",
    )(req, res);
  } catch (error) {
    logMessage("Error in enable/disable category", error, "error");
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
      Category,
      languageMessages.delete,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in delete category", error, "error");
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
    return crudService.getALLDocuments(Category, CONSTANTS.BOOLEAN_FALSE)(
      req,
      res,
    );
  } catch (error) {
    logMessage("Error in get all languages", error, "error");
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
