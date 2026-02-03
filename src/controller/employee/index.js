import {
  Department,
  Designation,
  Goal,
  LeaveType,
  ReferralAmount,
  Role,
  User,
} from "../../models/index.js";
import {
  apiHTTPResponse,
  hashAndEncryptPassword,
  logMessage,
} from "../../utils/globalFunction.js";
import { nameStatusController } from "../common.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import crudService from "../../services/crudService.js";
import {
  findOneByQueryLeanWithSelect,
  updateAndCreateDocumentByQueryAndData,
} from "../../services/serviceGlobal.js";
import mongoose from "mongoose";

const departmentMessages = {
  create: "Department created successfully",
  update: "Department updated successfully",
  status: "Department status updated successfully",
  delete: "Department deleted successfully",
  exists: "Department already exists",
  fetched: "Department fetched successfully",
};

const designationMessages = {
  create: "Designation created successfully",
  update: "Designation updated successfully",
  status: "Designation status updated successfully",
  delete: "Designation deleted successfully",
  exists: "Designation already exists",
  fetched: "Designation fetched successfully",
};

const roleMessages = {
  create: "Role created successfully",
  delete: "Role deleted successfully",
  exists: "Role already exists",
  fetched: "Role fetched successfully",
};

const goalMessages = {
  create: "Goal created successfully",
  delete: "Goal deleted successfully",
  exists: "Goal already exists",
  fetched: "Goal fetched successfully",
};

const leaveTypeMessages = {
  create: "Leave type created successfully",
  update: "Leave type updated successfully",
  status: "Leave type status updated successfully",
  delete: "Leave type deleted successfully",
  exists: "Leave type already exists",
  fetched: "Leave type fetched successfully",
};

const teachersMessages = {
  update: "Teacher updated successfully",
  status: "Teacher status updated successfully",
  exists: "Teacher already exists",
  fetched: "Teacher fetched successfully",
};

export const {
  list: departmentList,
  create: createDepartment,
  update: updateDepartment,
  enableDisable: enableDisableDepartment,
  softDelete: softDeleteDepartment,
  allDocs: allDepartments,
  singleDocument: getDepartmentDocument,
} = nameStatusController(Department, departmentMessages, "Department");

export const {
  list: designationList,
  create: createDesignation,
  update: updateDesignation,
  enableDisable: enableDisableDesignation,
  softDelete: softDeleteDesignation,
  allDocs: allDesignations,
  singleDocument: getDesignationDocument,
} = nameStatusController(Designation, designationMessages, "Designation");

export const {
  list: roleList,
  create: createRole,
  softDelete: softDeleteRole,
  allDocs: allRoles,
} = nameStatusController(Role, roleMessages, "Role");

export const {
  list: goalList,
  create: createGoal,
  softDelete: softDeleteGoal,
  allDocs: allGoals,
} = nameStatusController(Goal, goalMessages, "Goal");

export const {
  list: leaveTypeList,
  create: createLeaveType,
  update: updateLeaveType,
  enableDisable: enableDisableLeaveType,
  softDelete: softDeleteLeaveType,
  allDocs: allLeaveTypes,
} = nameStatusController(LeaveType, leaveTypeMessages, "Leave type");

export const { enableDisable: enableDisableTeacher } = nameStatusController(
  User,
  teachersMessages,
  "Teacher",
);

export const teacherList = async (req, res) => {
  try {
    const baseQuery = req.body?.query
      ? typeof req.body.query === "string"
        ? JSON.parse(req.body.query)
        : req.body.query
      : {};

    baseQuery.role = "Teacher";

    Object.assign(req.body, {
      query: baseQuery,
      select:
        "name status email phoneNo department designation address role dateOfBirth dateOfJoining profilephoto _id",
      populate: "department:name|designation:name",
      sortBy: req.body.sortBy || "name",
      sortOrder: req.body.sortOrder || "asc",
    });

    return crudService.getList(User, CONSTANTS.BOOLEAN_TRUE)(req, res);
  } catch (error) {
    logMessage("Error in teacher list", error, "error");
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

export const allTeachers = async (req, res) => {
  try {
    const baseQuery = req.body?.query
      ? typeof req.body.query === "string"
        ? JSON.parse(req.body.query)
        : req.body.query
      : {};

    baseQuery.role = "Teacher";

    Object.assign(req.body, {
      query: baseQuery,
      select:
        "name status email phoneNo department designation role profilephoto _id",
      populate: "department:name|designation:name",
      sortBy: req.body.sortBy || "name",
      sortOrder: req.body.sortOrder || "asc",
    });

    return crudService.getALLDocuments(User, CONSTANTS.BOOLEAN_FALSE)(req, res);
  } catch (error) {
    logMessage("Error in teacher all list", error, "error");
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

export const updateTeacher = async (req, res) => {
  try {
    return crudService.update(
      User,
      teachersMessages.update,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in teacher update", error, "error");
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

export const updateTeacherPassword = async (req, res) => {
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
    logMessage("Error in teacher update password", error, "error");
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

export const updateReferralAmountPanel = async (req, res) => {
  try {
    const inputData = req.body;

    if (!inputData || Object.keys(inputData).length === 0) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "No data provided to update home panel",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE,
      );
    }

    const { statusCode } = await updateAndCreateDocumentByQueryAndData(
      ReferralAmount,
      {},
      inputData,
    );

    if (statusCode === CONSTANTS.OK) {
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
        CONSTANTS.HTTP_BAD_REQUEST,
        CONSTANTS_MSG.FAILED_MSG,
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }
  } catch (error) {
    logMessage("Error in updateReferralAmountPanel controller", error, "error");
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

export const getReferralAmountPanel = async (req, res) => {
  try {
    const { statusCode, data } = await findOneByQueryLeanWithSelect(
      ReferralAmount,
      {},
      "-_id -__v -updatedAt -createdAt",
    );

    if (statusCode === CONSTANTS.OK || statusCode === CONSTANTS.NOT_FOUND) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS[statusCode === CONSTANTS.OK ? "HTTP_OK" : "HTTP_NOT_FOUND"],
        CONSTANTS_MSG[
          [statusCode === CONSTANTS.OK ? "SUCCESS_MSG" : "DATA_NOT_FOUND"]
        ],
        data,
        statusCode,
      );
    } else {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        CONSTANTS_MSG.FAILED_MSG,
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }
  } catch (error) {
    logMessage("Error in getReferralAmountPanel controller", error, "error");
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

export const assignGoalToTeacher = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { teacherId, goalId } = req.body;

    const teacher = await User.findOne({ _id: teacherId }, null, { session });

    if (!teacher) {
      await session.abortTransaction();
      session.endSession();

      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_NOT_FOUND,
        "Teacher not found",
        CONSTANTS.DATA_NULL,
        CONSTANTS.NOT_FOUND,
      );
    }

    const goal = await Goal.findOne({ _id: goalId }, null, { session });

    if (!goal) {
      await session.abortTransaction();
      session.endSession();

      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_NOT_FOUND,
        "Goal not found",
        CONSTANTS.DATA_NULL,
        CONSTANTS.NOT_FOUND,
      );
    }

    const alreadyExist = goal.assignTo.find(
      (item) => String(item.user) === String(teacherId),
    );

    if (alreadyExist) {
      await session.abortTransaction();
      session.endSession();

      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Goal already assigned to teacher",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }

    goal.assignTo.push({
      user: teacherId,
      assignDate: new Date(),
    });

    await goal.save({ session });

    await session.commitTransaction();
    session.endSession();

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      "Goal assigned to teacher successfully",
      CONSTANTS.DATA_NULL,
      CONSTANTS.OK,
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    logMessage("Error in assignGoalToTeacher controller", error, "error");

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

export const assignRoleToTeacher = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { teacherId, roleId } = req.body;

    const teacher = await User.findOne({ _id: teacherId }, null, { session });

    if (!teacher) {
      await session.abortTransaction();
      session.endSession();

      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_NOT_FOUND,
        "Teacher not found",
        CONSTANTS.DATA_NULL,
        CONSTANTS.NOT_FOUND,
      );
    }

    const role = await Role.findOne({ _id: roleId }, null, { session });

    if (!role) {
      await session.abortTransaction();
      session.endSession();

      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_NOT_FOUND,
        "Role not found",
        CONSTANTS.DATA_NULL,
        CONSTANTS.NOT_FOUND,
      );
    }

    const alreadyExist = role.assignTo.find(
      (item) => String(item.user) === String(teacherId),
    );

    if (alreadyExist) {
      await session.abortTransaction();
      session.endSession();

      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Role already assigned to teacher",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }

    role.assignTo.push({
      user: teacherId,
      assignDate: new Date(),
    });

    await role.save({ session });

    await session.commitTransaction();
    session.endSession();

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      "Role assigned to teacher successfully",
      CONSTANTS.DATA_NULL,
      CONSTANTS.OK,
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    logMessage("Error in assignRoleToTeacher controller", error, "error");

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
