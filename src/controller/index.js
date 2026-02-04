import * as authorizationController from "./authorization/index.js";
import * as filesController from "./files/index.js";
import * as websiteController from "./website/index.js";
import * as courseController from "./courses/index.js";
import * as inquireController from "./inquires/index.js";
import * as employeeController from "./employee/index.js";
import * as studentController from "./student/index.js";
import * as commerceController from "./commerce/index.js";
import * as userController from "./user/index.js";
import * as examinationController from "./examinations/index.js";
import * as requestController from "./requests/index.js";

const controllers = {
  authorizationController,
  filesController,
  websiteController,
  courseController,
  inquireController,
  employeeController,
  studentController,
  commerceController,
  userController,
  examinationController,
  requestController,
};

export default controllers;
