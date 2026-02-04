import {
  confirmPasswordValidation,
  emailValidation,
  fileObjectJoiSchema,
  objectIdValidation,
  optionalArrayWithMinimumLength,
  passwordValidation,
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
  teachers: {
    "/enable-disable": {
      _id: objectIdValidation("id"),
      status: requiredBoolean(),
    },
    "/update": {
      _id: objectIdValidation("id"),
      name: requiredString(1, Number.MAX_SAFE_INTEGER),
      email: emailValidation(),
      phoneNo: requiredNumber(1, Number.MAX_SAFE_INTEGER),
      address: requiredString(1, Number.MAX_SAFE_INTEGER),
      designation: objectIdValidation("designation id"),
      department: objectIdValidation("department id"),
      dateOfBirth: requiredString(1, Number.MAX_SAFE_INTEGER),
      dateOfJoining: requiredString(1, Number.MAX_SAFE_INTEGER),
      profilephoto: optionalArrayWithMinimumLength(fileObjectJoiSchema(), 1),
    },
    "/update-password": {
      _id: objectIdValidation("id"),
      password: passwordValidation(8, 30),
      confirmPassword: confirmPasswordValidation(8, 30),
    },
    "/assign-role": {
      teacherId: objectIdValidation("teacher id"),
      roleId: objectIdValidation("role id"),
    },
    "/assign-goal": {
      teacherId: objectIdValidation("teacher id"),
      goalId: objectIdValidation("goal id"),
    },
    "/assign-task": {
      teacherId: objectIdValidation("teacher id"),
      title: requiredString(1, Number.MAX_SAFE_INTEGER),
      description: requiredString(1, Number.MAX_SAFE_INTEGER),
    },
    "/tasks": {
      page: requiredNumber(1, Number.MAX_SAFE_INTEGER),
      size: requiredNumber(1, Number.MAX_SAFE_INTEGER),
    },
  },
  "/referral-amount": {
    amount: requiredNumber(1, Number.MAX_SAFE_INTEGER),
  },
};

export default joiValidation;
