import commonValidators from "./common.js";
import authorization from "./authorization.js";
import website from "./website.js";

const moduleValidators = {
  authorization,
  website,
};

const validators = {
  commonValidators,
  moduleValidators,
};

export default validators;
