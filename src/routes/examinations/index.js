import { Router } from "express";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import controller from "../../controller/index.js";
const router = Router();

router.get(
  "/list",
  validationMiddleware("", "", true),
  controller.examinationController.getExaminationList,
);

router.get(
  "/single-document",
  validationMiddleware("", "", true),
  controller.examinationController.getExaminationDetails,
);

router.post(
  "/role/create",
  validationMiddleware("examinations"),
  controller.examinationController.createExamination,
);

router.post(
  "/role/update",
  validationMiddleware("examinations"),
  controller.examinationController.updateExamination,
);

router.post(
  "/goal/create",
  validationMiddleware("examinations"),
  controller.examinationController.createExamination,
);

router.post(
  "/goal/update",
  validationMiddleware("examinations"),
  controller.examinationController.updateExamination,
);

router.post(
  "/student/create",
  validationMiddleware("examinations"),
  controller.examinationController.createExamination,
);

router.post(
  "/student/update",
  validationMiddleware("examinations"),
  controller.examinationController.updateExamination,
);

router.get(
  "/result/list",
  validationMiddleware("examinations"),
  controller.examinationController.getExaminationResultList,
);

router.get(
  "/result/view",
  validationMiddleware("examinations"),
  controller.examinationController.getExaminationResultDetails,
);

export default router;
