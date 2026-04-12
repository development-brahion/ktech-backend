import {
  apiHTTPResponse,
  generateReferralCode,
  hashAndEncryptPassword,
  logMessage,
} from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import crudService from "../../services/crudService.js";
import {
  Admission,
  Attendance,
  Inquiry,
  LeaveRequest,
  Task,
  User,
} from "../../models/index.js";
import {
  findOneByQueryLean,
  updateDocumentByQueryAndData,
} from "../../services/serviceGlobal.js";
import { nameStatusController } from "../common.js";
import mongoose from "mongoose";

export const getUserList = async (req, res) => {
  try {
    Object.assign(req.body, {
      select:
        "name status email phoneNo address role department designation dateOfBirth dateOfJoining amount referralCode salary createdAt",
      populate: "department:name|designation:name",
      searchFields: "name email phoneNo",
      sortBy: req.body.sortBy || "createdAt",
      sortOrder: req.body.sortOrder || "desc",
    });

    return crudService.getList(User, CONSTANTS.BOOLEAN_TRUE)(req, res);
  } catch (error) {
    logMessage("Error in grt user list", error, "error");
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

export const createUser = async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();

    const { statusCode } = await findOneByQueryLean(
      User,
      { email: normalizedEmail },
      { statusCode: 1 },
    );

    if (statusCode === CONSTANTS.OK) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_CONFLICT,
        "Email already exist.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.CONFLICT,
      );
    }

    const { hashedPassword, encryptedPassword } =
      await hashAndEncryptPassword(password);

    const referralCode = generateReferralCode();

    const newUser = new User({
      ...rest,
      email,
      password: hashedPassword,
      originalPassword: encryptedPassword,
      referralCode,
      adminId: req.user.id,
    });

    await newUser.save();

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      CONSTANTS_MSG.SUCCESS_MSG,
      CONSTANTS.DATA_NULL,
      CONSTANTS.OK,
    );
  } catch (error) {
    logMessage("Error in create user", error, "error");
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

export const updatePassword = async (req, res) => {
  try {
    const { _id, password } = req.body;

    const userData = await User.findOne({
      _id,
    });

    if (!userData) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_NOT_FOUND,
        "User not found",
        CONSTANTS.DATA_NULL,
        CONSTANTS.NOT_FOUND,
      );
    }

    const { hashedPassword, encryptedPassword } =
      await hashAndEncryptPassword(password);

    userData.password = hashedPassword;
    userData.originalPassword = encryptedPassword;

    await userData.save();

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      "Password updated successfully",
      CONSTANTS.DATA_NULL,
      CONSTANTS.OK,
    );
  } catch (error) {
    logMessage("Error in user update password", error, "error");
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

export const updateUser = async (req, res) => {
  try {
    const { _id, email, ...rest } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();

    if (normalizedEmail) {
      const { statusCode } = await findOneByQueryLean(
        User,
        {
          email: normalizedEmail,
          _id: { $ne: _id },
        },
        { _id: 1 },
      );

      if (statusCode === CONSTANTS.OK) {
        return apiHTTPResponse(
          req,
          res,
          CONSTANTS.HTTP_CONFLICT,
          "Email already exist.",
          CONSTANTS.DATA_NULL,
          CONSTANTS.CONFLICT,
        );
      }
    }

    const updatePayload = {
      ...rest,
    };

    if (normalizedEmail) {
      updatePayload.email = normalizedEmail;
    }

    const { statusCode: newStatusCode } = await updateDocumentByQueryAndData(
      User,
      { _id },
      updatePayload,
    );

    if (newStatusCode === CONSTANTS.OK) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_OK,
        CONSTANTS_MSG.SUCCESS_MSG,
        CONSTANTS.DATA_NULL,
        CONSTANTS.OK,
      );
    } else {
      return apiHTTPResponse(
        req,
        res,
        newStatusCode === CONSTANTS.NOT_FOUND
          ? CONSTANTS.HTTP_NOT_FOUND
          : CONSTANTS.HTTP_BAD_REQUEST,
        newStatusCode === CONSTANTS.NOT_FOUND
          ? CONSTANTS_MSG.DATA_NOT_FOUND
          : CONSTANTS_MSG.FAILED_MSG,
        CONSTANTS.DATA_NULL,
        newStatusCode === CONSTANTS.NOT_FOUND
          ? CONSTANTS.NOT_FOUND
          : CONSTANTS.BAD_REQUEST,
      );
    }
  } catch (error) {
    logMessage("Error in update user", error, "error");
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

export const { enableDisable: enableDisableUser, allDocs: allUsers } =
  nameStatusController(User, {}, "User");

export const getDashBoardData = async (req, res) => {
  try {
    const { id } = req.user;

    const matchStage = {
      adminId: new mongoose.Types.ObjectId(id),
      isDeleted: false,
    };

    const today = new Date();

    const countsPromise = Promise.all([
      User.countDocuments({ ...matchStage, role: "Student" }),
      User.countDocuments({ ...matchStage, role: "Teacher" }),
      Admission.countDocuments(matchStage),
      Inquiry.countDocuments(matchStage),
    ]);

    const todayBirthdayPromise = User.aggregate([
      {
        $match: {
          ...matchStage,
          role: { $in: ["Student", "Teacher"] },
          dateOfBirth: { $ne: null },
        },
      },
      {
        $addFields: {
          birthDay: { $dayOfMonth: "$dateOfBirth" },
          birthMonth: { $month: "$dateOfBirth" },
        },
      },
      {
        $match: {
          birthDay: today.getDate(),
          birthMonth: today.getMonth() + 1,
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phoneNo: 1,
          role: 1,
          dateOfBirth: 1,
          profilephoto: { $arrayElemAt: ["$profilephoto", 0] },
        },
      },
    ]);

    const upcomingBirthdayPromise = User.aggregate([
      {
        $match: {
          ...matchStage,
          role: { $in: ["Student", "Teacher"] },
          dateOfBirth: { $ne: null },
        },
      },
      {
        $addFields: {
          nextBirthday: {
            $dateFromParts: {
              year: { $year: new Date() },
              month: { $month: "$dateOfBirth" },
              day: { $dayOfMonth: "$dateOfBirth" },
            },
          },
        },
      },
      {
        $addFields: {
          nextBirthday: {
            $cond: [
              { $lt: ["$nextBirthday", new Date()] },
              {
                $dateFromParts: {
                  year: { $add: [{ $year: new Date() }, 1] },
                  month: { $month: "$dateOfBirth" },
                  day: { $dayOfMonth: "$dateOfBirth" },
                },
              },
              "$nextBirthday",
            ],
          },
        },
      },
      {
        $addFields: {
          diffDays: {
            $divide: [
              { $subtract: ["$nextBirthday", new Date()] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $match: {
          diffDays: { $gte: 1, $lte: 7 },
        },
      },
      {
        $sort: { diffDays: 1 },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phoneNo: 1,
          role: 1,
          dateOfBirth: 1,
          nextBirthday: 1,
          profilephoto: { $arrayElemAt: ["$profilephoto", 0] },
        },
      },
    ]);

    const [
      [studentCount, teacherCount, admissionsCount, inquiriesCount],
      todayBirthdays,
      upcomingBirthdays,
    ] = await Promise.all([
      countsPromise,
      todayBirthdayPromise,
      upcomingBirthdayPromise,
    ]);

    const data = {
      studentCount,
      teacherCount,
      admissionsCount,
      inquiriesCount,
      todayBirthdays,
      upcomingBirthdays,
      lastRefreshedAt: new Date(),
    };

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      "Dashboard data fetched successfully",
      data,
    );
  } catch (error) {
    logMessage("Error in get dashboard data", error, "error");

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

export const getMyDashboard = async (req, res) => {
  try {
    const { id, role } = req.user;
    const userId = new mongoose.Types.ObjectId(id);
    const today = new Date();

    const attendanceStatsPromise = Attendance.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const leaveStatsPromise = LeaveRequest.aggregate([
      { $match: { name: userId } },
      {
        $group: {
          _id: "$leaveStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskStatsPromise = Task.aggregate([
      {
        $match: {
          isDeleted: false,
          "assignTo.user": userId,
        },
      },
      {
        $unwind: "$assignTo",
      },
      {
        $match: {
          "assignTo.user": userId,
        },
      },
      {
        $group: {
          _id: "$assignTo.status",
          count: { $sum: 1 },
        },
      },
    ]);

    if (role === "Student") {
      const [attendanceStats, leaveStats, studentData, totalAdmissions] =
        await Promise.all([
          attendanceStatsPromise,
          leaveStatsPromise,

          Admission.findOne({
            user: userId,
            dateOfBirth: { $ne: null },
          }).lean(),

          Admission.countDocuments({
            user: userId,
            isDeleted: false,
          }),
        ]);

      let isBirthday = false;
      if (studentData?.dateOfBirth) {
        const dob = new Date(studentData.dateOfBirth);
        isBirthday =
          dob.getDate() === today.getDate() &&
          dob.getMonth() === today.getMonth();
      }

      const attendance = {
        Present: attendanceStats.find((a) => a._id === "Present")?.count || 0,
        Absent: attendanceStats.find((a) => a._id === "Absent")?.count || 0,
        Leave: attendanceStats.find((a) => a._id === "Leave")?.count || 0,
      };

      const total = attendance.Present + attendance.Absent + attendance.Leave;

      attendance.percentage = total
        ? ((attendance.Present / total) * 100).toFixed(2)
        : 0;

      const leave = {
        Pending: leaveStats.find((l) => l._id === "Pending")?.count || 0,
        Approved: leaveStats.find((l) => l._id === "Approved")?.count || 0,
        Rejected: leaveStats.find((l) => l._id === "Rejected")?.count || 0,
      };

      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_OK,
        "Student dashboard",
        {
          role,
          isBirthday,
          birthdayMessage: isBirthday
            ? `🎉 Happy Birthday ${studentData?.name || ""}!`
            : null,
          attendance,
          leave,
          totalAdmissions,
          lastRefreshedAt: new Date(),
        },
        CONSTANTS.OK,
      );
    }

    if (role === "Teacher") {
      const [attendanceStats, leaveStats, teacherData, taskStats] =
        await Promise.all([
          attendanceStatsPromise,
          leaveStatsPromise,
          User.findById(userId).lean(),
          taskStatsPromise,
        ]);

      let isBirthday = false;
      if (teacherData?.dateOfBirth) {
        const dob = new Date(teacherData.dateOfBirth);
        isBirthday =
          dob.getDate() === today.getDate() &&
          dob.getMonth() === today.getMonth();
      }

      const attendance = {
        Present: attendanceStats.find((a) => a._id === "Present")?.count || 0,
        Absent: attendanceStats.find((a) => a._id === "Absent")?.count || 0,
        Leave: attendanceStats.find((a) => a._id === "Leave")?.count || 0,
      };

      const total = attendance.Present + attendance.Absent + attendance.Leave;

      attendance.percentage = total
        ? ((attendance.Present / total) * 100).toFixed(2)
        : 0;

      const leave = {
        Pending: leaveStats.find((l) => l._id === "Pending")?.count || 0,
        Approved: leaveStats.find((l) => l._id === "Approved")?.count || 0,
        Rejected: leaveStats.find((l) => l._id === "Rejected")?.count || 0,
      };

      const tasks = {
        Pending: taskStats.find((t) => t._id === "Pending")?.count || 0,
        "In-Progress":
          taskStats.find((t) => t._id === "In-Progress")?.count || 0,
        Completed: taskStats.find((t) => t._id === "Completed")?.count || 0,
      };

      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_OK,
        "Teacher dashboard",
        {
          role,
          isBirthday,
          birthdayMessage: isBirthday
            ? `🎉 Happy Birthday ${teacherData?.name || ""}!`
            : null,
          attendance,
          leave,
          tasks,
          lastRefreshedAt: new Date(),
        },
        CONSTANTS.OK,
      );
    }

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Invalid role",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
    );
  } catch (error) {
    logMessage("Error in getMyDashboard", error, "error");

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      "Internal Server Error",
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};
