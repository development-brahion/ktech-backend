import {
  apiHTTPResponse,
  logMessage,
  parseStartDate,
  parseEndDate,
} from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import crudService from "../../services/crudService.js";
import mongoose from "mongoose";
import { Admission, Attendance } from "../../models/index.js";

export const teacherAttendanceViewInRange = async (req, res) => {
  try {
    const { teacherId, startDate, endDate } = req.body;

    const query = {
      user: new mongoose.Types.ObjectId(teacherId),
      date: {
        $gte: parseStartDate(startDate),
        $lte: parseEndDate(endDate),
      },
    };

    const pipeline = [
      { $match: query },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: "%d-%m-%Y",
                date: "$date",
              },
            },
            userid: "$user",
            status: { $ifNull: ["$status", "Absent"] },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id.date",
          userid: "$_id.userid",
          status: "$_id.status",
          count: 1,
        },
      },
      { $sort: { date: 1 } },
    ];

    return crudService.executeAggregation(Attendance, pipeline)(req, res);
  } catch (error) {
    logMessage("Error in teacher attendance list", error, "error");

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

export const studentAttendanceViewInRange = async (req, res) => {
  try {
    const { studentId, courseId, startDate, endDate } = req.body;

    const query = {
      user: new mongoose.Types.ObjectId(studentId),
      course: new mongoose.Types.ObjectId(courseId),
      date: {
        $gte: parseStartDate(startDate),
        $lte: parseEndDate(endDate),
      },
    };

    const pipeline = [
      { $match: query },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: "%d-%m-%Y",
                date: "$date",
              },
            },
            userid: "$user",
            course: "$course",
            status: { $ifNull: ["$status", "Absent"] },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id.date",
          userid: "$_id.userid",
          status: "$_id.status",
          course: "$_id.course",
          count: 1,
        },
      },
      { $sort: { date: 1 } },
    ];

    return crudService.executeAggregation(Attendance, pipeline)(req, res);
  } catch (error) {
    logMessage("Error in student attendance list", error, "error");

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

export const markTeacherAttendance = async (req, res) => {
  try {
    const { teacherId, status, date } = req.body;

    const attendanceDate = new Date(date);

    let attendance = await Attendance.findOne({
      user: teacherId,
      date: attendanceDate,
    });

    if (attendance) {
      attendance.status = status;
      await attendance.save();

      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_OK,
        "Teacher attendance updated successfully",
        CONSTANTS.DATA_NULL,
        CONSTANTS.OK,
      );
    }

    attendance = await Attendance.create({
      user: teacherId,
      status,
      date: attendanceDate,
    });

    if (!attendance) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        CONSTANTS_MSG.FAILED_MSG,
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      "Teacher attendance marked successfully",
      CONSTANTS.DATA_NULL,
      CONSTANTS.OK,
    );
  } catch (error) {
    logMessage("Error in mark teacher attendance", error, "error");

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

export const markStudentAttendance = async (req, res) => {
  try {
    const { studentId, courseId, status, date } = req.body;

    const attendanceDate = new Date(date);

    const admission = await Admission.findOne({
      user: studentId,
      course: courseId,
    });

    if (!admission) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Admission not found for this course",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }

    let attendance = await Attendance.findOne({
      user: studentId,
      course: courseId,
      date: attendanceDate,
    });

    if (attendance) {
      attendance.status = status;
      await attendance.save();

      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_OK,
        "Student attendance updated successfully",
        CONSTANTS.DATA_NULL,
        CONSTANTS.OK,
      );
    }

    attendance = await Attendance.create({
      user: studentId,
      course: courseId,
      batch: admission.batch,
      status,
      date: attendanceDate,
    });

    if (!attendance) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        CONSTANTS_MSG.FAILED_MSG,
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      "Student attendance marked successfully",
      CONSTANTS.DATA_NULL,
      CONSTANTS.OK,
    );
  } catch (error) {
    console.error("Student attendance error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const teacherMyAttendances = async (req, res) => {
  try {
    const { id } = req.user;
    const { page = 1, size = 10, fromDate, toDate } = req.body;

    const skip = (page - 1) * size;

    const match = {
      user: new mongoose.Types.ObjectId(id),
    };

    if (fromDate || toDate) {
      match.date = {};

      if (fromDate) {
        match.date.$gte = parseStartDate(fromDate);
      }

      if (toDate) {
        match.date.$lte = parseEndDate(toDate);
      }
    }

    const pipeline = [
      { $match: match },

      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$user" },

      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                totalPresent: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "Present"] }, 1, 0],
                  },
                },
                totalAbsent: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "Absent"] }, 1, 0],
                  },
                },
                totalLeave: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "Leave"] }, 1, 0],
                  },
                },
                total: { $sum: 1 },
              },
            },
          ],
          list: [
            { $sort: { date: -1 } },
            { $skip: skip },
            { $limit: Number(size) },

            {
              $project: {
                _id: 1,
                date: 1,
                status: 1,
                user: 1,
              },
            },
          ],

          total: [{ $count: "count" }],
        },
      },

      {
        $project: {
          list: 1,

          total: {
            $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0],
          },

          totalPresent: {
            $ifNull: [{ $arrayElemAt: ["$summary.totalPresent", 0] }, 0],
          },

          totalAbsent: {
            $ifNull: [{ $arrayElemAt: ["$summary.totalAbsent", 0] }, 0],
          },

          totalLeave: {
            $ifNull: [{ $arrayElemAt: ["$summary.totalLeave", 0] }, 0],
          },
        },
      },
    ];

    return crudService.executeAggregation(
      Attendance,
      pipeline,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in teacherMyAttendance", error, req, res);
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.FAILED_MSG,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const attendanceListByRole = async (req, res) => {
  try {
    const {
      page = 1,
      size = 10,
      fromDate,
      toDate,
      type,
      userId,
      courseId,
    } = req.body;

    const skip = (page - 1) * size;

    const match = {};

    if (fromDate || toDate) {
      match.date = {};
      if (fromDate) match.date.$gte = parseStartDate(fromDate);
      if (toDate) match.date.$lte = parseEndDate(toDate);
    }

    if (userId) {
      match.user = new mongoose.Types.ObjectId(userId);
    }

    if (courseId) {
      match.course = new mongoose.Types.ObjectId(courseId);
    }

    const pipeline = [
      { $match: match },

      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline: [
            ...(type ? [{ $match: { role: type } }] : []),
            {
              $project: {
                _id: 1,
                name: 1,
                role: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$user" },

      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
          pipeline: [{ $project: { _id: 1, courseName: 1 } }],
        },
      },
      {
        $unwind: {
          path: "$course",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "batches",
          localField: "batch",
          foreignField: "_id",
          as: "batch",
          pipeline: [
            {
              $project: {
                _id: 1,
                startTime: 1,
                endTime: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$batch",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $facet: {
          list: [
            { $sort: { date: -1 } },
            { $skip: skip },
            { $limit: Number(size) },

            {
              $project: {
                _id: 1,
                date: 1,
                status: 1,
                user: 1,
                course: 1,
                batch: 1,
              },
            },
          ],

          total: [{ $count: "count" }],
        },
      },

      {
        $project: {
          list: 1,
          total: {
            $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0],
          },
        },
      },
    ];

    return crudService.executeAggregation(
      Attendance,
      pipeline,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (err) {
    logMessage("Error in attendanceListByRole", err, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.FAILED_MSG,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};
