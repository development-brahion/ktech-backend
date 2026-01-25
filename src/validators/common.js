import {
  optionalString,
  optionalEnum,
  requiredNumber,
  requiredBoolean,
  dateSchema,
  objectIdValidation,
} from "../utils/joiValidationDataType.js";

const joiValidation = {
  "/list": {
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

  "/all-documents": {
    keyWord: optionalString(0, 500),
    sortBy: optionalString(0, 50),
    sortOrder: optionalEnum(["asc", "desc"]),
    select: optionalString(0, 10000),
    searchFields: optionalString(0, 10000),
    populate: optionalString(0, 10000),
    query: optionalString(0, 10000),
    fromDate: dateSchema("From Date"),
    toDate: dateSchema("To Date"),
  },

  "/single-document": {
    _id: objectIdValidation("id"),
    select: optionalString(0, Number.MAX_SAFE_INTEGER),
    populate: optionalString(0, Number.MAX_SAFE_INTEGER),
  },

  "/soft-delete": {
    _id: objectIdValidation("id"),
  },

  "/enable-disable": {
    _id: objectIdValidation("id"),
    isDisable: requiredBoolean(),
  },

  "/view-document": {
    _id: objectIdValidation("id"),
    select: optionalString(0, Number.MAX_SAFE_INTEGER),
    populate: optionalString(0, Number.MAX_SAFE_INTEGER),
  },
  "/upload": {
    module: optionalEnum(["default", "admin","profile","instructor","student","company","job"]),
  },
};

export default joiValidation;
