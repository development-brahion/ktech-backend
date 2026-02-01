import { objectIdValidation } from "../utils/joiValidationDataType.js";

const joiValidation = {
  "/course-installments": {
    id: objectIdValidation("id"),
  },
};

export default joiValidation;
