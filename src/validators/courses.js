import {
  fileObjectJoiSchema,
  objectIdValidation,
  optionalString,
  requiredArrayWithMinimumLength,
  requiredBoolean,
  requiredNumber,
  requiredString,
} from "../utils/joiValidationDataType.js";

const baseCourseSchema = {
  courseName: requiredString(1, Number.MAX_SAFE_INTEGER),
  description: optionalString(0, 500),
  template: requiredString(1, Number.MAX_SAFE_INTEGER),
  mainImageUrl: fileObjectJoiSchema(),
  language: requiredArrayWithMinimumLength(
    objectIdValidation("language id"),
    1,
  ),
  category: requiredArrayWithMinimumLength(
    objectIdValidation("category id"),
    1,
  ),
  actualPrice: requiredNumber(1, Number.MAX_SAFE_INTEGER),
  sellingPrice: requiredNumber(1, Number.MAX_SAFE_INTEGER),
  duration: requiredNumber(1, Number.MAX_SAFE_INTEGER),
  totalLectures: requiredNumber(1, Number.MAX_SAFE_INTEGER),
};

const joiValidation = {
  "/enable-disable": {
    _id: objectIdValidation("id"),
    status: requiredBoolean(),
  },
  "/create": baseCourseSchema,
  "/update": {
    _id: objectIdValidation("id"),
    ...baseCourseSchema,
  },
};

export default joiValidation;
