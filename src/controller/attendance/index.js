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
