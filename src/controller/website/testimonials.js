import { apiHTTPResponse, logMessage } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import { Testimonial } from "../../models/index.js";
import crudService from "../../services/crudService.js";
import { findOneByQueryLean } from "../../services/serviceGlobal.js";

const languageMessages = {
  create: "Testimonial created successfully",
  update: "Testimonial updated successfully",
  status: "Testimonial status updated successfully",
  delete: "Testimonial deleted successfully",
  exists: "Testimonial already exists",
};

export const list = async (req, res) => {
  try {
    return crudService.getList(Testimonial, CONSTANTS.BOOLEAN_TRUE)(req, res);
  } catch (error) {
    logMessage("Error in list testimonials", error, "error");
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

    const { statusCode } = await findOneByQueryLean(Testimonial, {
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
      Testimonial,
      languageMessages.create,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in create testimonial", error, "error");
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

    const { statusCode } = await findOneByQueryLean(Testimonial, {
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
      Testimonial,
      languageMessages.update,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in update testimonial", error, "error");
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
      Testimonial,
      languageMessages.status,
      CONSTANTS.BOOLEAN_TRUE,
      "Testimonial",
      CONSTANTS.BLANK_OBJECT,
      CONSTANTS.BLANK_OBJECT,
      "status",
    )(req, res);
  } catch (error) {
    logMessage("Error in enable/disable testimonial", error, "error");
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
      Testimonial,
      languageMessages.delete,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in delete testimonial", error, "error");
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
    return crudService.getALLDocuments(Testimonial, CONSTANTS.BOOLEAN_FALSE)(
      req,
      res,
    );
  } catch (error) {
    logMessage("Error in get all testimonials", error, "error");
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
