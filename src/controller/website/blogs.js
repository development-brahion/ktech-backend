import { apiHTTPResponse, logMessage } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import { Blog } from "../../models/index.js";
import crudService from "../../services/crudService.js";
import { findOneByQueryLean } from "../../services/serviceGlobal.js";

const languageMessages = {
  create: "Blog created successfully",
  update: "Blog updated successfully",
  status: "Blog status updated successfully",
  delete: "Blog deleted successfully",
  exists: "Blog already exists",
};

export const list = async (req, res) => {
  try {
    return crudService.getList(Blog,CONSTANTS.BOOLEAN_TRUE)(req, res);
  } catch (error) {
    logMessage("Error in list blog", error, "error");
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
    const { title } = req.body;

    const { statusCode } = await findOneByQueryLean(Blog, {
      title: { $regex: title.trim(), $options: "i" },
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
      Blog,
      languageMessages.create,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in create blog", error, "error");
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
    const { title, _id } = req.body;

    const { statusCode } = await findOneByQueryLean(Blog, {
      _id: { $ne: _id },
      title: { $regex: title.trim(), $options: "i" },
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
      Blog,
      languageMessages.update,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in update blog", error, "error");
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
      Blog,
      languageMessages.status,
      CONSTANTS.BOOLEAN_TRUE,
      "Blog",
      CONSTANTS.BLANK_OBJECT,
      CONSTANTS.BLANK_OBJECT,
      "status",
    )(req, res);
  } catch (error) {
    logMessage("Error in enable/disable blog", error, "error");
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
      Blog,
      languageMessages.delete,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in delete blog", error, "error");
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
    return crudService.getALLDocuments(Blog, CONSTANTS.BOOLEAN_FALSE)(
      req,
      res,
    );
  } catch (error) {
    logMessage("Error in get all blog", error, "error");
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
