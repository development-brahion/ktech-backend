import { LeaveRequest } from "../../models/index.js";
import { apiHTTPResponse, logMessage } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import crudService from "../../services/crudService.js";

export const getLeaveRequestList = async (req, res) => {
  try {
    Object.assign(req.body, {
      select:
        "name applyDate startDate endDate leaveType leaveStatus reason remarks",
      populate: "name:name,email,role|leaveType:name",
      sortBy: "applyDate",
      sortOrder: "desc",
    });

    return crudService.getList(LeaveRequest, CONSTANTS.BOOLEAN_FALSE)(req, res);
  } catch (error) {
    logMessage("Error in getLeaveRequestList controller", error, "error");
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

export const updateLeaveRequest = async (req, res) => {
  try {
    return crudService.update(
      LeaveRequest,
      "Leave request updated successfully.",
      CONSTANTS.BOOLEAN_TRUE,
      CONSTANTS.BOOLEAN_FALSE,
      CONSTANTS.BOOLEAN_FALSE
    )(req, res);
  } catch (error) {
    logMessage("Error in updateLeaveRequest controller", error, "error");
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
