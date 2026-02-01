import { Router } from "express";
import controllers from "../../controller/index.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

const router = Router();

router.get(
  "/all-documents",
  validationMiddleware("", "", true),
  controllers.studentController.getAllStudents,
);

router.get(
  "/course-installments",
  validationMiddleware("students"),
  controllers.studentController.getStudentEnrolledCoursesWithInstallments,
);

export default router;
