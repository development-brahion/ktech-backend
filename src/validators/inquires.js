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

const baseVisitorSchema = {
  name: requiredString(1, Number.MAX_SAFE_INTEGER),
  meetingWith: requiredString(1, Number.MAX_SAFE_INTEGER),
  phoneNo: requiredNumber(1, Number.MAX_SAFE_INTEGER),
  totalPerson: requiredNumber(1, Number.MAX_SAFE_INTEGER),
  date: requiredString(1, Number.MAX_SAFE_INTEGER),
  followUpDate: requiredString(1, Number.MAX_SAFE_INTEGER),
  inTime: requiredString(1, Number.MAX_SAFE_INTEGER),
  outTime: requiredString(1, Number.MAX_SAFE_INTEGER),
  purpose: requiredString(1, Number.MAX_SAFE_INTEGER),
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
  visitors: {
    "/create": baseVisitorSchema,
    "/update": {
      _id: objectIdValidation("id"),
      ...baseVisitorSchema,
    },
  },
};

export default joiValidation;
