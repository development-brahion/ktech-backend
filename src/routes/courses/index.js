import { Router } from "express";
import controllers from "../../controller/index.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

const router = Router();

router.get(
  "/list",
  validationMiddleware("", "", true),
  controllers.courseController.list,
);

router.get(
  "/all-documents",
  validationMiddleware("", "", true),
  controllers.courseController.allDocs,
);

router.post(
  "/create",
  validationMiddleware("courses"),
  controllers.courseController.create,
);

router.post(
  "/update",
  validationMiddleware("courses"),
  controllers.courseController.update,
);

router.post(
  "/enable-disable",
  validationMiddleware("courses"),
  controllers.courseController.enableDisable,
);

router.delete(
  "/soft-delete",
  validationMiddleware("", "", true),
  controllers.courseController.softDelete,
);

router.get(
  "/single-document",
  validationMiddleware("", "", true),
  controllers.courseController.getDocument,
);

export default router;
