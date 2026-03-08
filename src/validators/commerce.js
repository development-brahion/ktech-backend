import {
  fileObjectJoiSchema,
  objectIdValidation,
  optionalArrayWithMinimumLength,
  requiredNumber,
  requiredString,
} from "../utils/joiValidationDataType.js";

const baseProductSchema = {
  name: requiredString(1, Number.MAX_SAFE_INTEGER),
  category: objectIdValidation("category id"),
  mrp: requiredNumber(1, Number.MAX_SAFE_INTEGER),
  sellingPrice: requiredNumber(1, Number.MAX_SAFE_INTEGER),
  discount: requiredNumber(0, 100),
  description: requiredString(1, Number.MAX_SAFE_INTEGER),
  image: optionalArrayWithMinimumLength(fileObjectJoiSchema(), 1),
};

const joiValidation = {
  categories: {
    "/create": {
      name: requiredString(1, Number.MAX_SAFE_INTEGER),
    },
    "/update": {
      _id: objectIdValidation("id"),
      name: requiredString(1, Number.MAX_SAFE_INTEGER),
    },
  },
  products: {
    "/create": baseProductSchema,
    "/update": {
      _id: objectIdValidation("id"),
      ...baseProductSchema,
    },
  },
};

export default joiValidation;
