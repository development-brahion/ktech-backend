import { Admission, User } from "../../models/index.js";
import { apiHTTPResponse, logMessage } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";

import crudService from "../../services/crudService.js";

export const getAllStudents = async (req, res) => {
  try {
    const baseQuery = req.body?.query
      ? typeof req.body.query === "string"
        ? JSON.parse(req.body.query)
        : req.body.query
      : {};

    Object.assign(req.body, {
      select: req.body.select || "name email",
      query: {
        ...baseQuery,
        role: "Student",
      },
      sortBy: req.body.sortBy || "name",
      sortOrder: req.body.sortOrder || "asc",
    });

    return crudService.getALLDocuments(User, CONSTANTS.BOOLEAN_FALSE)(req, res);
  } catch (error) {
    logMessage("Error getting all students", error, "error");
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

export const getStudentEnrolledCoursesWithInstallments = async (req, res) => {
  try {
    const { id } = req.body;

    req.body = {
      query: { user: id },
      select: "name email course installments",
      populate:
        "course:courseName|installments:name,status,amount,date,paymentStatus,receiptNumber,paymentmode,transctionId",
      sortBy: "course.courseName",
      sortOrder: "asc",
    };

    return crudService.getALLDocuments(Admission, CONSTANTS.BOOLEAN_FALSE)(
      req,
      res,
    );
  } catch (error) {
    logMessage("Error in get student enrolled courses", error, "error");
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

export const getAdmissionsList = async (req, res) => {
  try {
    Object.assign(req.body, {
      searchFields: "name email phoneNo",
      sortBy: req.body.sortBy || "createdAt",
      sortOrder: req.body.sortOrder || "desc",
      select:
        "name email phoneNo referralCode type rollNo course admissionDate createdAt",
      populate: "course:courseName",
    });
    return crudService.getList(Admission, CONSTANTS.BOOLEAN_TRUE)(req, res);
  } catch (error) {
    logMessage("Error in get admission list", error, "error");
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

export const getAdmissionDetails = async (req, res) => {
  try {
    return crudService.getById(Admission)(req, res);
  } catch (error) {
    logMessage("Error in get admission details", error, "error");
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
