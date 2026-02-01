import {
  dateSchema,
  objectIdValidation,
  optionalEnum,
  optionalString,
  requiredNumber,
} from "../utils/joiValidationDataType.js";

const joiValidation = {
  "/course-installments": {
    id: objectIdValidation("id"),
  },
  "/admissions": {
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
  "/admissions/view": {
    _id: objectIdValidation("id"),
    select: optionalString(0, Number.MAX_SAFE_INTEGER),
    populate: optionalString(0, Number.MAX_SAFE_INTEGER),
  },
};

export default joiValidation;
