import commonValidators from "./common.js";
import authorization from "./authorization.js";
import website from "./website.js";
import courses from "./courses.js";
import inquires from "./inquires.js";
import employee from "./employee.js";
import student from "./student.js";
import commerce from "./commerce.js";
import users from "./users.js";

const moduleValidators = {
  authorization,
  website,
  courses,
  inquires,
  employee,
  student,
  commerce,
  users,
};

const validators = {
  commonValidators,
  moduleValidators,
};

export default validators;
