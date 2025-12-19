import commonValidators from "./common.js";
import authorization from "./authorization.js";

const moduleValidators = {
  authorization,
};

const validators = {
  commonValidators,
  moduleValidators,
};


export default validators;