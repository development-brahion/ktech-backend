import {
  dateSchema,
  emailValidation,
  objectIdValidation,
  optionalString,
  requiredBoolean,
  requiredNumber,
  requiredString,
} from "../utils/joiValidationDataType.js";

const baseInquirySchema = {
  name: requiredString(1, Number.MAX_SAFE_INTEGER),
  email: emailValidation(),
  phoneNo: requiredNumber(1, Number.MAX_SAFE_INTEGER),
  course: objectIdValidation("course id"),
  followUpDate: requiredString(1, Number.MAX_SAFE_INTEGER),
  remarks: requiredString(1, Number.MAX_SAFE_INTEGER),
  source: objectIdValidation("source id"),
  status: objectIdValidation("status id"),
};

const joiValidation = {
  source: {
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
  status: {
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
  "/create": baseInquirySchema,
  "/update": {
    _id: objectIdValidation("id"),
    ...baseInquirySchema,
  },
  "/move-to-admission": {
    _id: objectIdValidation("id"),
    isAdmissionDone: requiredBoolean(),
  },
  "/add-remark": {
    _id: objectIdValidation("id"),
    remarks: requiredString(1, Number.MAX_SAFE_INTEGER),
    dateAndTime: optionalString(0, Number.MAX_SAFE_INTEGER),
  },
 
};

export default joiValidation;
