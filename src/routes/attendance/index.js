import { Router } from "express";
import controllers from "../../controller/index.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

const router = Router();

router.get(
  "/teachers/view",
  validationMiddleware("attendances", "teachers"),
  controllers.attendanceController.teacherAttendanceViewInRange,
);

router.post(
  "/teachers/mark-attendance",
  validationMiddleware("attendances", "teachers"),
  controllers.attendanceController.markTeacherAttendance,
);

router.get(
  "/students/view",
  validationMiddleware("attendances", "students"),
  controllers.attendanceController.studentAttendanceViewInRange,
);

router.post(
  "/students/mark-attendance",
  validationMiddleware("attendances", "students"),
  controllers.attendanceController.markStudentAttendance,
);

export default router;
