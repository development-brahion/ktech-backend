import {
  confirmPasswordValidation,
  emailValidation,
  objectIdValidation,
  optionalNumber,
  passwordValidation,
  requiredBoolean,
  requiredEnum,
  requiredNumber,
  requiredOptionalString,
  requiredString,
} from "../utils/joiValidationDataType.js";

const joiValidation = {
  "/create": {
    name: requiredString(1, Number.MAX_SAFE_INTEGER),
    email: emailValidation(),
    phoneNo: requiredNumber(1, Number.MAX_SAFE_INTEGER),
    address: requiredString(1, Number.MAX_SAFE_INTEGER),
    role: requiredEnum(["Admin", "Teacher"]),
    password: passwordValidation(8, 30),
    confirmPassword: confirmPasswordValidation(8, 30),
    department: requiredOptionalString("role", "Teacher", 0, 24),
    designation: requiredOptionalString("role", "Teacher", 0, 24),
    dateOfBirth: requiredString(1, Number.MAX_SAFE_INTEGER),
    dateOfJoining: requiredString(1, Number.MAX_SAFE_INTEGER),
    amount: optionalNumber(0, Number.MAX_SAFE_INTEGER),
    salary: optionalNumber(0, Number.MAX_SAFE_INTEGER),
  },
  "/update": {
    _id: objectIdValidation("id"),
    name: requiredString(1, Number.MAX_SAFE_INTEGER),
    email: emailValidation(),
    phoneNo: requiredNumber(1, Number.MAX_SAFE_INTEGER),
    address: requiredString(1, Number.MAX_SAFE_INTEGER),
    role: requiredEnum(["Admin", "Teacher"]),
    department: requiredOptionalString("role", "Teacher", 0, 24),
    designation: requiredOptionalString("role", "Teacher", 0, 24),
    dateOfBirth: requiredString(1, Number.MAX_SAFE_INTEGER),
    dateOfJoining: requiredString(1, Number.MAX_SAFE_INTEGER),
    amount: optionalNumber(0, Number.MAX_SAFE_INTEGER),
    salary: optionalNumber(0, Number.MAX_SAFE_INTEGER),
  },
  "/enable-disable": {
    _id: objectIdValidation("id"),
    status: requiredBoolean(),
  },
  "/update-password": {
    _id: objectIdValidation("id"),
    password: passwordValidation(8, 30),
    confirmPassword: confirmPasswordValidation(8, 30),
  },
};

export default joiValidation;
