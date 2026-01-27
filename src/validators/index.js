import commonValidators from "./common.js";
import authorization from "./authorization.js";
import website from "./website.js";
import courses from "./courses.js";

const moduleValidators = {
  authorization,
  website,
  courses,
};

const validators = {
  commonValidators,
  moduleValidators,
};

export default validators;
