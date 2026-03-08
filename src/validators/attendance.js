import {
  dateSchema,
  dateSchemaRequired,
  defaultDateSchema,
  objectIdValidation,
  optionalObjectId,
  requiredEnum,
  requiredNumber,
} from "../utils/joiValidationDataType.js";

const joiValidation = {
  teachers: {
    "/teachers/view": {
      startDate: dateSchemaRequired("From Date"),
      endDate: dateSchemaRequired("To Date"),
      teacherId: objectIdValidation("teacher id"),
    },
    "/teachers/mark-attendance": {
      teacherId: objectIdValidation("teacher id"),
      status: requiredEnum(["Present", "Absent", "Leave"]),
      date: defaultDateSchema("Date"),
    },
    "/teachers/my-attendances": {
      page: requiredNumber(1, Number.MAX_SAFE_INTEGER),
      size: requiredNumber(1, Number.MAX_SAFE_INTEGER),
      fromDate: dateSchema("From Date"),
      toDate: dateSchema("To Date"),
    },
  },
  students: {
    "/students/view": {
      startDate: dateSchemaRequired("From Date"),
      endDate: dateSchemaRequired("To Date"),
      studentId: objectIdValidation("student id"),
      courseId: objectIdValidation("course id"),
    },
    "/students/mark-attendance": {
      studentId: objectIdValidation("student id"),
      courseId: objectIdValidation("course id"),
      status: requiredEnum(["Present", "Absent", "Leave"]),
      date: defaultDateSchema("Date"),
    },
  },
  "/list": {
    page: requiredNumber(1, Number.MAX_SAFE_INTEGER),
    size: requiredNumber(1, Number.MAX_SAFE_INTEGER),
    fromDate: dateSchema("From Date"),
    toDate: dateSchema("To Date"),
    type: requiredEnum(["Student", "Teacher"]),
    userId: optionalObjectId("user id"),
    courseId: optionalObjectId("course id"),
  },
};

export default joiValidation;
