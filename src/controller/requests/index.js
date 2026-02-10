import { Goal, LeaveRequest, Role } from "../../models/index.js";
import { apiHTTPResponse, logMessage } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import crudService from "../../services/crudService.js";
import mongoose from "mongoose";

export const getLeaveRequestList = async (req, res) => {
  try {
    const baseQuery = req.body.query
      ? typeof req.body.query === "string"
        ? JSON.parse(req.body.query)
        : req.body.query
      : {};

    if (["Student", "Teacher"].includes(req.user.role)) {
      baseQuery.name = req.user.id;
    }
    Object.assign(req.body, {
      select:
        "name applyDate startDate endDate leaveType leaveStatus reason remarks",
      populate: "name:name,email,role|leaveType:name",
      sortBy: "applyDate",
      sortOrder: "desc",
      query: baseQuery,
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
      CONSTANTS.BOOLEAN_FALSE,
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

export const roleExamRequestList = async (req, res) => {
  try {
    const { roleId, page, size } = req.body;

    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(roleId),
          isDeleted: false,
        },
      },
      {
        $unwind: {
          path: "$assignTo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "assignTo.user",
          foreignField: "_id",
          as: "assignTo.user",
        },
      },
      {
        $unwind: {
          path: "$assignTo.user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          days: 1,
          teacherId: "$assignTo.user._id",
          teacherName: "$assignTo.user.name",
          teacherEmail: "$assignTo.user.email",
          assignDate: "$assignTo.assignDate",
          isvalid: "$assignTo.isvalid",
          status: "$assignTo.status",
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $skip: (page - 1) * size },
            { $limit: size },
            {
              $project: {
                _id: 1,
                name: 1,
                days: 1,
                teacherId: 1,
                teacherName: 1,
                teacherEmail: 1,
                assignDate: 1,
                isvalid: 1,
                status: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          list: "$data",
          total: {
            $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0],
          },
        },
      },
    ];
    return crudService.executeAggregation(
      Role,
      pipeline,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in roleExamRequestList controller", error, "error");
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

export const goalExamRequestList = async (req, res) => {
  try {
    const { goalId, page, size } = req.body;

    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(goalId),
          isDeleted: false,
        },
      },
      {
        $unwind: {
          path: "$assignTo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "assignTo.user",
          foreignField: "_id",
          as: "assignTo.user",
        },
      },
      {
        $unwind: {
          path: "$assignTo.user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          duration: 1,
          teacherId: "$assignTo.user._id",
          teacherName: "$assignTo.user.name",
          teacherEmail: "$assignTo.user.email",
          assignDate: "$assignTo.assignDate",
          isvalid: "$assignTo.isvalid",
          status: "$assignTo.status",
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $skip: (page - 1) * size },
            { $limit: size },
            {
              $project: {
                _id: 1,
                name: 1,
                duration: 1,
                teacherId: 1,
                teacherName: 1,
                teacherEmail: 1,
                assignDate: 1,
                isvalid: 1,
                status: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          list: "$data",
          total: {
            $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0],
          },
        },
      },
    ];
    return crudService.executeAggregation(
      Goal,
      pipeline,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in goalExamRequestList controller", error, "error");
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

export const updateRoleExamRequestStatus = async (req, res) => {
  try {
    const { _id, teacherId, status } = req.body;

    const updatedData = await Role.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(_id),
        "assignTo.user": new mongoose.Types.ObjectId(teacherId),
      },
      {
        $set: {
          "assignTo.$.status": status,
        },
      },
      { new: true },
    );

    if (!updatedData) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_NOT_FOUND,
        "Record not found",
        CONSTANTS.DATA_NULL,
        CONSTANTS.NOT_FOUND,
      );
    }

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      "Status updated successfully",
      CONSTANTS.DATA_NULL,
      CONSTANTS.OK,
    );
  } catch (error) {
    logMessage("Error in updateRoleExamRequestStatus", error, "error");
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

export const updateGoalExamRequestStatus = async (req, res) => {
  try {
    const { _id, teacherId, status } = req.body;

    const updatedData = await Goal.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(_id),
        "assignTo.user": new mongoose.Types.ObjectId(teacherId),
      },
      {
        $set: {
          "assignTo.$.status": status,
        },
      },
      { new: true },
    );

    if (!updatedData) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_NOT_FOUND,
        "Goal assignment not found",
        CONSTANTS.DATA_NULL,
        CONSTANTS.NOT_FOUND,
      );
    }

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      "Goal status updated successfully",
      CONSTANTS.DATA_NULL,
      CONSTANTS.OK,
    );
  } catch (error) {
    logMessage("Error in updateGoalExamRequestStatus", error, "error");
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

export const applyForRequest = async (req, res) => {
  try {
    Object.assign(req.body, {
      name: req.user.id,
    });

    return crudService.create(
      LeaveRequest,
      "Leave request applied successfully",
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in applyForRequest", error, "error");
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

export const assignedRoleList = async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.body;

    const userId = new mongoose.Types.ObjectId(req.user.id);

    const pipeline = [
      {
        $match: {
          isDeleted: false,
          "assignTo.user": userId,
        },
      },

      {
        $unwind: {
          path: "$assignTo",
          preserveNullAndEmptyArrays: false,
        },
      },

      {
        $match: {
          "assignTo.user": userId,
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "assignTo.user",
          foreignField: "_id",
          as: "assignTo.user",
        },
      },

      {
        $unwind: {
          path: "$assignTo.user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },

      {
        $unwind: {
          path: "$course",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,
          name: 1,
          days: 1,
          teacherId: "$assignTo.user._id",
          teacherName: "$assignTo.user.name",
          teacherEmail: "$assignTo.user.email",
          assignDate: "$assignTo.assignDate",
          isvalid: "$assignTo.isvalid",
          status: "$assignTo.status",
          course: "$course._id",
          courseName: "$course.courseName",
        },
      },

      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: (page - 1) * size }, { $limit: size }],
        },
      },

      {
        $project: {
          list: "$data",
          total: {
            $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0],
          },
        },
      },
    ];

    return crudService.executeAggregation(
      Role,
      pipeline,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in assignedRoleList controller", error, "error");
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

export const assignedGoalList = async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.body;

    const userId = new mongoose.Types.ObjectId(req.user.id);

    const pipeline = [
      {
        $match: {
          isDeleted: false,
          "assignTo.user": userId,
        },
      },

      {
        $unwind: {
          path: "$assignTo",
          preserveNullAndEmptyArrays: false,
        },
      },

      {
        $match: {
          "assignTo.user": userId,
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "assignTo.user",
          foreignField: "_id",
          as: "assignTo.user",
        },
      },

      {
        $unwind: {
          path: "$assignTo.user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "designations",
          localField: "designation",
          foreignField: "_id",
          as: "designation",
        },
      },

      {
        $unwind: {
          path: "$designation",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,
          name: 1,
          duration: 1,
          teacherId: "$assignTo.user._id",
          teacherName: "$assignTo.user.name",
          teacherEmail: "$assignTo.user.email",
          assignDate: "$assignTo.assignDate",
          isvalid: "$assignTo.isvalid",
          status: "$assignTo.status",
          designation: "$designation._id",
          designationName: "$designation.name",
        },
      },

      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: (page - 1) * size }, { $limit: size }],
        },
      },

      {
        $project: {
          list: "$data",
          total: {
            $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0],
          },
        },
      },
    ];

    return crudService.executeAggregation(
      Goal,
      pipeline,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in assignedGoalList controller", error, "error");
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
