import { Inquiry, Source, Status } from "../../models/index.js";
import {
  findByQueryLeanWithSelect,
  findOneByQueryLean,
  updateDocumentByQueryAndData,
} from "../../services/serviceGlobal.js";
import { crudController, nameStatusController } from "../common.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import {
  apiHTTPResponse,
  guessedTimezone,
  logMessage,
  momentTZ,
  parseDateUTC,
} from "../../utils/globalFunction.js";

const sourceMessages = {
  create: "Source created successfully",
  update: "Source updated successfully",
  status: "Source status updated successfully",
  delete: "Source deleted successfully",
  exists: "Source already exists",
};

const statusMessages = {
  create: "Status created successfully",
  update: "Status updated successfully",
  status: "Status status updated successfully",
  delete: "Status deleted successfully",
  exists: "Status already exists",
};

const inquiryMessages = {
  create: "Inquiry created successfully",
  update: "Inquiry updated successfully",
  delete: "Inquiry deleted successfully",
  fetched: "Inquiry fetched successfully",
  remarkAdded: "Remark added successfully",
  notFound: "Inquiry not found",
};

export const {
  list: sourceList,
  create: createSource,
  update: updateSource,
  enableDisable: enableDisableSource,
  softDelete: softDeleteSource,
  allDocs: allSources,
} = nameStatusController(Source, sourceMessages, "Source");

export const {
  list: statusList,
  create: createStatus,
  update: updateStatus,
  enableDisable: enableDisableStatus,
  softDelete: softDeleteStatus,
  allDocs: allStatus,
} = nameStatusController(Status, statusMessages, "Status");

export const {
  list: inquiryList,
  create: createInquiry,
  update: updateInquiry,
  softDelete: softDeleteInquiry,
  update: moveToAdmission,
  singleDocument: getInquiryDocument,
} = crudController(Inquiry, inquiryMessages, "Inquiry");

export const addRemark = async (req, res) => {
  try {
    const { _id, remarks, dateAndTime } = req.body;

    const { statusCode, data } = await findOneByQueryLean(Inquiry, {
      _id: _id,
      isDeleted: CONSTANTS.BOOLEAN_FALSE,
    });

    if (statusCode === CONSTANTS.OK) {
      const newFollowUpRemarks = [
        ...(data.followUpRemarks || []),
        {
          remarks: remarks,
          dateAndTime: dateAndTime || new Date(),
        },
      ];

      const { statusCode: newStatusCode } = await updateDocumentByQueryAndData(
        Inquiry,
        { _id: _id },
        { followUpRemarks: newFollowUpRemarks },
      );

      if (newStatusCode === CONSTANTS.OK) {
        return apiHTTPResponse(
          req,
          res,
          CONSTANTS.HTTP_OK,
          inquiryMessages.remarkAdded,
          CONSTANTS.DATA_NULL,
          CONSTANTS.HTTP_OK,
        );
      } else {
        return apiHTTPResponse(
          req,
          res,
          newStatusCode === CONSTANTS.NOT_FOUND
            ? CONSTANTS.HTTP_NOT_FOUND
            : CONSTANTS.HTTP_BAD_REQUEST,
          newStatusCode === NOT_FOUND
            ? inquiryMessages.notFound
            : CONSTANTS_MSG.FAILED_MSG,
          CONSTANTS.DATA_NULL,
          newStatusCode === NOT_FOUND
            ? CONSTANTS.NOT_FOUND
            : CONSTANTS.BAD_REQUEST,
        );
      }
    } else {
      return apiHTTPResponse(
        req,
        res,
        statusCode === CONSTANTS.NOT_FOUND
          ? CONSTANTS.HTTP_NOT_FOUND
          : CONSTANTS.HTTP_BAD_REQUEST,
        statusCode === NOT_FOUND
          ? inquiryMessages.notFound
          : CONSTANTS_MSG.FAILED_MSG,
        CONSTANTS.DATA_NULL,
        statusCode === NOT_FOUND ? CONSTANTS.NOT_FOUND : CONSTANTS.BAD_REQUEST,
      );
    }
  } catch (error) {
    logMessage("Error in add remark", error, "error");
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

export const followUps = async (req, res) => {
  try {
    const start = momentTZ.tz(guessedTimezone).startOf("day").toDate();
    const end = momentTZ.tz(guessedTimezone).endOf("day").toDate();

    const query = {
      isDeleted: CONSTANTS.BOOLEAN_FALSE,
      followUpDate: {
        $gte: start,
        $lte: end,
      },
    };

    const { data } = await findByQueryLeanWithSelect(
      Inquiry,
      query,
      "name phoneNo followUpDate",
    );

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      CONSTANTS_MSG.SUCCESS_MSG,
      data ?? [],
      CONSTANTS.HTTP_OK,
    );
  } catch (error) {
    logMessage("Error in follow ups", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.SERVER_ERROR,
    );
  }
};
