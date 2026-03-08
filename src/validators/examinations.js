import {
  dateSchema,
  objectIdValidation,
  optionalEnum,
  optionalObjectId,
  optionalString,
  requiredArrayWithMinimumLength,
  requiredBoolean,
  requiredEnum,
  requiredNumber,
  requiredObject,
  requiredString,
} from "../utils/joiValidationDataType.js";

const baseRoleExamSchema = {
  examtitle: requiredString(1, Number.MAX_SAFE_INTEGER),
  examduration: requiredObject({
    hours: requiredNumber(1, Number.MAX_SAFE_INTEGER),
    minutes: requiredNumber(0, Number.MAX_SAFE_INTEGER),
  }),
  passingPercentage: requiredNumber(0, 100),
  questions: requiredArrayWithMinimumLength(
    requiredObject({
      question: requiredString(1, Number.MAX_SAFE_INTEGER),
      option_1: requiredString(1, Number.MAX_SAFE_INTEGER),
      option_2: requiredString(1, Number.MAX_SAFE_INTEGER),
      option_3: requiredString(1, Number.MAX_SAFE_INTEGER),
      option_4: requiredString(1, Number.MAX_SAFE_INTEGER),
      answer: requiredString(1, Number.MAX_SAFE_INTEGER),
    }),
  ),
  role: objectIdValidation("role id"),
  isDraft: requiredBoolean(),
  type: requiredEnum(["Role"]),
};

const baseGoalExamSchema = {
  examtitle: requiredString(1, Number.MAX_SAFE_INTEGER),
  examduration: requiredObject({
    hours: requiredNumber(1, Number.MAX_SAFE_INTEGER),
    minutes: requiredNumber(0, Number.MAX_SAFE_INTEGER),
  }),
  passingPercentage: requiredNumber(0, 100),
  questions: requiredArrayWithMinimumLength(
    requiredObject({
      question: requiredString(1, Number.MAX_SAFE_INTEGER),
      option_1: requiredString(1, Number.MAX_SAFE_INTEGER),
      option_2: requiredString(1, Number.MAX_SAFE_INTEGER),
      option_3: requiredString(1, Number.MAX_SAFE_INTEGER),
      option_4: requiredString(1, Number.MAX_SAFE_INTEGER),
      answer: requiredString(1, Number.MAX_SAFE_INTEGER),
    }),
  ),
  goal: objectIdValidation("goal id"),
  isDraft: requiredBoolean(),
  type: requiredEnum(["Goal"]),
};

const baseStudentExamSchema = {
  examtitle: requiredString(1, Number.MAX_SAFE_INTEGER),
  examduration: requiredObject({
    hours: requiredNumber(1, Number.MAX_SAFE_INTEGER),
    minutes: requiredNumber(0, Number.MAX_SAFE_INTEGER),
  }),
  passingPercentage: requiredNumber(0, 100),
  questions: requiredArrayWithMinimumLength(
    requiredObject({
      question: requiredString(1, Number.MAX_SAFE_INTEGER),
      option_1: requiredString(1, Number.MAX_SAFE_INTEGER),
      option_2: requiredString(1, Number.MAX_SAFE_INTEGER),
      option_3: requiredString(1, Number.MAX_SAFE_INTEGER),
      option_4: requiredString(1, Number.MAX_SAFE_INTEGER),
      answer: requiredString(1, Number.MAX_SAFE_INTEGER),
    }),
  ),
  course: objectIdValidation("course id"),
  batch: objectIdValidation("batch id"),
  isDraft: requiredBoolean(),
  type: requiredEnum(["Student"]),
};

const joiValidation = {
  "/role/create": baseRoleExamSchema,
  "/role/update": {
    _id: objectIdValidation("examination id"),
    ...baseRoleExamSchema,
  },
  "/goal/create": baseGoalExamSchema,
  "/goal/update": {
    _id: objectIdValidation("examination id"),
    ...baseGoalExamSchema,
  },
  "/student/create": baseStudentExamSchema,
  "/student/update": {
    _id: objectIdValidation("examination id"),
    ...baseStudentExamSchema,
  },
  "/result/list": {
    keyWord: optionalString(0, 500),
    sortBy: optionalString(0, 50),
    sortOrder: optionalEnum(["asc", "desc"]),
    page: requiredNumber(1, Number.MAX_SAFE_INTEGER),
    size: requiredNumber(1, Number.MAX_SAFE_INTEGER),
    select: optionalString(0, 10000),
    searchFields: optionalString(0, 10000),
    populate: optionalString(0, 10000),
    query: optionalString(0, 10000),
    fromDate: dateSchema("From Date"),
    toDate: dateSchema("To Date"),
  },
  "/result/view": {
    _id: objectIdValidation("id"),
  },
  "/hallticket/list": {
    keyWord: optionalString(0, 500),
    sortBy: optionalString(0, 50),
    sortOrder: optionalEnum(["asc", "desc"]),
    page: requiredNumber(1, Number.MAX_SAFE_INTEGER),
    size: requiredNumber(1, Number.MAX_SAFE_INTEGER),
    select: optionalString(0, 10000),
    searchFields: optionalString(0, 10000),
    populate: optionalString(0, 10000),
    query: optionalString(0, 10000),
    fromDate: dateSchema("From Date"),
    toDate: dateSchema("To Date"),
  },
  "/hallticket/add": {
    user_id: objectIdValidation("user id"),
    examination_id: objectIdValidation("examination id"),
    admission_id: objectIdValidation("admission id"),
  },
  "/submit": {
    examId: objectIdValidation("examination id"),
    studentanswer: requiredArrayWithMinimumLength(
      optionalString(0, Number.MAX_SAFE_INTEGER),
    ),
    type: requiredEnum(["Role", "Goal", "Student"]),
    roleId: optionalObjectId("role id"),
    goalId: optionalObjectId("goal id"),
  },
  "/student/my-exams": {
    page: requiredNumber(1, Number.MAX_SAFE_INTEGER),
    size: requiredNumber(1, Number.MAX_SAFE_INTEGER),
  },
};

export default joiValidation;
