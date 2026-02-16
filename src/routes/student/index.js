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

router.get(
  "/admissions",
  validationMiddleware("students"),
  controllers.studentController.getAdmissionsList,
);

router.get(
  "/admissions/view",
  validationMiddleware("students"),
  controllers.studentController.getAdmissionDetails,
);

router.get(
  "/admissions/all-documents",
  validationMiddleware("students"),
  controllers.studentController.getAllAdmissions,
);

router.post(
  "/create-new-admission",
  validationMiddleware("students"),
  controllers.studentController.createAdmission,
);

router.post(
  "/update-admission",
  validationMiddleware("students"),
  controllers.studentController.updateAdmission,
);

router.post(
  "/re-admission",
  validationMiddleware("students"),
  controllers.studentController.reAdmitStudent,
);

export default router;
