import {
  objectIdValidation,
  requiredArrayWithMinimumLength,
  requiredBoolean,
  requiredNumber,
  requiredString,
} from "../utils/joiValidationDataType.js";

const joiValidation = {
  departments: {
    "/create": {
      name: requiredString(1, Number.MAX_SAFE_INTEGER),
    },
    "/update": {
      _id: objectIdValidation("id"),
      name: requiredString(1, Number.MAX_SAFE_INTEGER),
    },
    "/enable-disable": {
      _id: objectIdValidation("id"),
      status: requiredBoolean(),
    },
  },
  designations: {
    "/create": {
      name: requiredString(1, Number.MAX_SAFE_INTEGER),
      salary: requiredNumber(1, Number.MAX_SAFE_INTEGER),
    },
    "/update": {
      _id: objectIdValidation("id"),
      name: requiredString(1, Number.MAX_SAFE_INTEGER),
      salary: requiredNumber(1, Number.MAX_SAFE_INTEGER),
    },
    "/enable-disable": {
      _id: objectIdValidation("id"),
      status: requiredBoolean(),
    },
  },
  roles: {
    "/create": {
      name: requiredString(1, Number.MAX_SAFE_INTEGER),
      course: objectIdValidation("course id"),
      days: requiredNumber(1, Number.MAX_SAFE_INTEGER),
    },
  },
  goals: {
    "/create": {
      name: requiredString(1, Number.MAX_SAFE_INTEGER),
      designation: objectIdValidation("course id"),
      department: objectIdValidation("department id"),
      role: requiredArrayWithMinimumLength(objectIdValidation("role id")),
      salary: requiredNumber(1, Number.MAX_SAFE_INTEGER),
      duration: requiredNumber(1, Number.MAX_SAFE_INTEGER),
    },
  },
  leaveTypes: {
    "/create": {
      name: requiredString(1, Number.MAX_SAFE_INTEGER),
    },
    "/update": {
      _id: objectIdValidation("id"),
      name: requiredString(1, Number.MAX_SAFE_INTEGER),
    },
    "/enable-disable": {
      _id: objectIdValidation("id"),
      status: requiredBoolean(),
    },
  },
};

export default joiValidation;
