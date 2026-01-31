import commonValidators from "./common.js";
import authorization from "./authorization.js";
import website from "./website.js";
import courses from "./courses.js";
import inquires from "./inquires.js";
import employee from "./employee.js";
import student from "./student.js";
import commerce from "./commerce.js";

const moduleValidators = {
  authorization,
  website,
  courses,
  inquires,
  employee,
  student,
  commerce
};

const validators = {
  commonValidators,
  moduleValidators,
};

export default validators;
