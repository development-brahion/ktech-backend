import { apiHTTPResponse, logMessage } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import { Department, Designation } from "../../models/index.js";
import crudService from "../../services/crudService.js";
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
