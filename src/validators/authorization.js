import {
  confirmPasswordValidation,
  emailValidation,
  passwordChangeSchema,
  passwordValidation,
  requiredString,
} from "../utils/joiValidationDataType.js";

const joiValidation = {
  "/signIn": {
    email: emailValidation(),
    password: requiredString(4, 30),
  },
  "/forgotpassword": {
    email: emailValidation(),
  },
  "/resetpassword": {
    token: requiredString(10, Number.MAX_SAFE_INTEGER),
    password: passwordValidation(8, 30),
    confirmPassword: confirmPasswordValidation(8, 30),
  },
  "/change-password": passwordChangeSchema(),
};

export default joiValidation;
