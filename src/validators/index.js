import commonValidators from "./common.js";
import authorization from "./authorization.js";
import website from "./website.js";
import courses from "./courses.js";
import inquires from "./inquires.js";
import employee from "./employee.js";
import students from "./student.js";
import commerce from "./commerce.js";
import users from "./users.js";
import examinations from "./examinations.js";
import requests from "./requests.js";

const moduleValidators = {
  authorization,
  website,
  courses,
  inquires,
  employee,
  students,
  commerce,
  users,
  examinations,
  requests,
};

const validators = {
  commonValidators,
  moduleValidators,
};

export default validators;
