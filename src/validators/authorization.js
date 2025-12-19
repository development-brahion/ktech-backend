import {
  emailValidation,
  requiredString,
} from "../utils/joiValidationDataType.js";

const joiValidation = {
  "/signIn": {
    email: emailValidation(),
    password: requiredString(4, 30),
  },
};

export default joiValidation;
