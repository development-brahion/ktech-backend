import { Answer, Examination } from "../../models/index.js";
import { apiHTTPResponse, logMessage } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import crudService from "../../services/crudService.js";
import { findOneByQueryLean } from "../../services/serviceGlobal.js";

export const getExaminationList = async (req, res) => {
  try {
    const baseQuery = req.body?.query
      ? typeof req.body.query === "string"
        ? JSON.parse(req.body.query)
        : req.body.query
      : {};

    if (!baseQuery.type) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Please provide type of examination.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }

    let select = "";
    let populate = "";
    const sortBy = req.body.sortBy || "createdAt";
    const sortOrder = req.body.sortOrder || "desc";

    switch (baseQuery.type) {
      case "Role":
        select =
          "role examtitle examduration passingPercentage type createAt isDraft";
        populate = "role:name,course|role.course:courseName";
        break;
      case "Goal":
        select =
          "goal examtitle examduration passingPercentage type createAt isDraft";
        populate = "goal:name,designation|role.designation:name";
        break;
      default:
        select =
          "course batch examtitle examduration passingPercentage type createAt isDraft";
        populate = "course:courseName|batch:startTime,endTime";
    }

    Object.assign(req.body, {
      select,
      populate,
      sortBy,
      sortOrder,
      query: baseQuery,
    });

    return crudService.getList(Examination, CONSTANTS.BOOLEAN_FALSE)(req, res);
  } catch (error) {
    logMessage("Error in get examination list", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getExaminationDetails = async (req, res) => {
  try {
    return crudService.getById(Examination)(req, res);
  } catch (error) {
    logMessage("Error in get examination details", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const createExamination = async (req, res) => {
  try {
    return crudService.create(
      Examination,
      "Examination created successfully",
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in create examination", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const updateExamination = async (req, res) => {
  try {
    const { _id } = req.body;

    const { statusCode, data } = await findOneByQueryLean(Examination, {
      _id,
      isDeleted: CONSTANTS.BOOLEAN_FALSE,
    });

    if (statusCode !== CONSTANTS.OK) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_NOT_FOUND,
        "Examination not found",
        CONSTANTS.DATA_NULL,
        CONSTANTS.NOT_FOUND,
      );
    }

    if (!data.isDraft) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Update is not allowed on this examination.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }
    return crudService.update(
      Examination,
      "Examination updated successfully",
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in update examination", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getExaminationResultList = async (req, res) => {
  try {
    Object.assign(req.body, {
      select: "userId examination result marks type createdAt",
      populate: "userId:name,email,role|examination:examtitle",
    });

    return crudService.getList(Answer, CONSTANTS.BOOLEAN_FALSE)(req, res);
  } catch (error) {
    logMessage("Error in get examination result list", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getExaminationResultDetails = async (req, res) => {
  try {
    Object.assign(req.body, {
      select: "userId examination result marks type createdAt studentanswer",
      populate:
        "userId:name,email,role|examination:examtitle,passingPercentage,questions",
    });

    return crudService.getById(Answer)(req, res);
  } catch (error) {
    logMessage("Error in get examination result details", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};
