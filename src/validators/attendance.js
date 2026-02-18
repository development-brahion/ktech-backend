import {
  dateSchemaRequired,
  defaultDateSchema,
  objectIdValidation,
  requiredEnum,
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
};

export default joiValidation;
