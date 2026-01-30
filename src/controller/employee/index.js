import {
  Department,
  Designation,
  Goal,
  LeaveType,
  Role,
} from "../../models/index.js";
import { nameStatusController } from "../common.js";

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
