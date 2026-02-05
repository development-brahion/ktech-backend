import {
  objectIdValidation,
  optionalString,
  requiredEnum,
  requiredNumber,
} from "../utils/joiValidationDataType.js";

const joiValidation = {
  leaves: {
    "/update-status": {
      _id: objectIdValidation("id"),
      leaveStatus: requiredEnum(["Pending", "Approved", "Rejected"]),
      remarks: optionalString(0, Number.MAX_SAFE_INTEGER),
    },
  },
  roles: {
    "/list": {
      roleId: objectIdValidation("role id"),
      page: requiredNumber(1, Number.MAX_SAFE_INTEGER),
      size: requiredNumber(1, Number.MAX_SAFE_INTEGER),
    },
    "/update-status": {
      _id: objectIdValidation("id"),
      teacherId: objectIdValidation("teacher id"),
      status: requiredEnum(["Approved", "Rejected"]),
    },
  },
  goals: {
    "/list": {
      goalId: objectIdValidation("goal id"),
      page: requiredNumber(1, Number.MAX_SAFE_INTEGER),
      size: requiredNumber(1, Number.MAX_SAFE_INTEGER),
    },
    "/update-status": {
      _id: objectIdValidation("id"),
      teacherId: objectIdValidation("teacher id"),
      status: requiredEnum(["Approved", "Rejected"]),
    },
  },
};

export default joiValidation;
