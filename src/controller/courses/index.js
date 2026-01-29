import { apiHTTPResponse, logMessage } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import { Batch, Course, CoursePlans } from "../../models/index.js";
import crudService from "../../services/crudService.js";
import { findOneByQueryLean } from "../../services/serviceGlobal.js";
import { nameStatusController } from "../common.js";

const courseMessages = {
  create: "Course created successfully",
  update: "Course updated successfully",
  status: "Course status updated successfully",
  delete: "Course deleted successfully",
  exists: "Course already exists",
  fetched: "Course fetched successfully",
};

const planMessages = {
  create: "Course plan created successfully",
  update: "Course plan updated successfully",
  status: "Course plan status updated successfully",
  delete: "Course plan deleted successfully",
  exists: "Course plan already exists",
  fetched: "Course plan fetched successfully",
};

const batchMessages = {
  create: "Batch created successfully",
  update: "Batch updated successfully",
  status: "Batch status updated successfully",
  delete: "Batch deleted successfully",
  exists: "Batch with same time already exists",
  fetched: "Batch fetched successfully",
  notFound: "Batch not found",
  assignSeatError: "Total seats cannot be less than already assigned seats",
};

export const list = async (req, res) => {
  try {
    return crudService.getList(Course, CONSTANTS.BOOLEAN_TRUE)(req, res);
  } catch (error) {
    logMessage("Error in list course", error, "error");
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
    const { courseName } = req.body;

    const { statusCode } = await findOneByQueryLean(Course, {
      courseName: { $regex: courseName.trim(), $options: "i" },
      isDeleted: CONSTANTS.BOOLEAN_FALSE,
    });

    if (statusCode === CONSTANTS.OK) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_CONFLICT,
        courseMessages.exists,
        CONSTANTS.DATA_NULL,
        CONSTANTS.CONFLICT,
      );
    }

    return crudService.create(
      Course,
      courseMessages.create,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in create course", error, "error");
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
    const { courseName, _id } = req.body;

    const { statusCode } = await findOneByQueryLean(Course, {
      _id: { $ne: _id },
      courseName: { $regex: courseName.trim(), $options: "i" },
      isDeleted: CONSTANTS.BOOLEAN_FALSE,
    });

    if (statusCode === CONSTANTS.OK) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_CONFLICT,
        courseMessages.exists,
        CONSTANTS.DATA_NULL,
        CONSTANTS.CONFLICT,
      );
    }

    return crudService.update(
      Course,
      courseMessages.update,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in update course", error, "error");
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
      Course,
      courseMessages.status,
      CONSTANTS.BOOLEAN_TRUE,
      "Course",
      CONSTANTS.BLANK_OBJECT,
      CONSTANTS.BLANK_OBJECT,
      "status",
    )(req, res);
  } catch (error) {
    logMessage("Error in enable/disable course", error, "error");
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
      Course,
      courseMessages.delete,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in delete course", error, "error");
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
    return crudService.getALLDocuments(Course, CONSTANTS.BOOLEAN_FALSE)(
      req,
      res,
    );
  } catch (error) {
    logMessage("Error in get all course", error, "error");
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

export const getDocument = async (req, res) => {
  try {
    return crudService.getById(
      Course,
      courseMessages.fetched,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in get course", error, "error");
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

export const {
  list: planList,
  create: createPlan,
  update: updatePlan,
  enableDisable: enableDisablePlan,
  softDelete: softDeletePlan,
  allDocs: allPlans,
  singleDocument: getPlanDocument,
} = nameStatusController(CoursePlans, planMessages, "Course plan");

export const {
  list: batchList,
  enableDisable: enableDisableBatch,
  softDelete: softDeleteBatch,
  allDocs: allBatches,
  singleDocument: getBatchDocument,
} = nameStatusController(Batch, batchMessages, "Batch");

export const createBatch = async (req, res) => {
  try {
    const { startTime, endTime, courses, totalSeat } = req.body;

    const existingBatch = await Batch.findOne({
      startTime,
      endTime,
      isDeleted: false,
    }).lean();

    if (existingBatch) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_CONFLICT,
        batchMessages.exists,
        CONSTANTS.DATA_NULL,
        CONSTANTS.CONFLICT,
      );
    }

    const batchData = {
      startTime,
      endTime,
      courses,
      totalSeat,
      availableSeat: totalSeat,
    };

    await Batch.create(batchData);

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_CREATED,
      batchMessages.create,
      CONSTANTS.DATA_NULL,
      CONSTANTS.SUCCESS,
    );
  } catch (error) {
    logMessage("Error in create batch", error, "error");
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

export const updateBatch = async (req, res) => {
  try {
    const { _id, startTime, endTime, totalSeat, courses } = req.body;

    const existingBatch = await Batch.findOne({
      _id,
      isDeleted: false,
    });

    if (!existingBatch) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_NOT_FOUND,
        batchMessages.notFound,
        CONSTANTS.DATA_NULL,
        CONSTANTS.NOT_FOUND,
      );
    }

    if (startTime && endTime) {
      const timeConflict = await Batch.findOne({
        _id: { $ne: _id },
        startTime,
        endTime,
        isDeleted: false,
      }).lean();

      if (timeConflict) {
        return apiHTTPResponse(
          req,
          res,
          CONSTANTS.HTTP_CONFLICT,
          batchMessages.exists,
          CONSTANTS.DATA_NULL,
          CONSTANTS.CONFLICT,
        );
      }
    }

    const inputData = {
      startTime,
      endTime,
      courses,
    };

    if (totalSeat !== undefined) {
      const assignedSeats =
        existingBatch.totalSeat - existingBatch.availableSeat;

      inputData.totalSeat = totalSeat;
      inputData.availableSeat = totalSeat - assignedSeats;

      if (inputData.availableSeat < 0) {
        return apiHTTPResponse(
          req,
          res,
          CONSTANTS.HTTP_BAD_REQUEST,
          batchMessages.assignSeatError,
          CONSTANTS.DATA_NULL,
          CONSTANTS.BAD_REQUEST,
        );
      }
    }

    await Batch.findByIdAndUpdate(
      _id,
      { $set: inputData },
      {
        new: true,
      },
    );

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      batchMessages.update,
      CONSTANTS.DATA_NULL,
      CONSTANTS.OK,
    );
  } catch (error) {
    logMessage("Error in update batch", error, "error");
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
