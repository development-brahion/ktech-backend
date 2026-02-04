import {
  objectIdValidation,
  optionalString,
  requiredEnum,
} from "../utils/joiValidationDataType.js";

 const joiValidation = {
  leaves: {
    "/update-status": {
      _id: objectIdValidation("id"),
      leaveStatus: requiredEnum(["Pending", "Approved", "Rejected"]),
      remarks: optionalString(0, Number.MAX_SAFE_INTEGER),
    },
  },
};

export default joiValidation;
