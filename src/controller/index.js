import * as authorizationController from "./authorization/index.js";
import * as filesController from "./files/index.js";
import * as websiteController from "./website/index.js";
import * as courseController from "./courses/index.js";
import * as inquireController from "./inquires/index.js";
import * as employeeController from "./employee/index.js";
import * as studentController from "./student/index.js";

const controllers = {
  authorizationController,
  filesController,
  websiteController,
  courseController,
  inquireController,
  employeeController,
  studentController,
};

export default controllers;
