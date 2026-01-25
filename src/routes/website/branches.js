import { Router } from "express";
import controllers from "../../controller/index.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

const router = Router();

router.get(
  "/list",
  validationMiddleware("", "", true),
  controllers.websiteController.branches.list,
);

router.get(
  "/all-documents",
  validationMiddleware("", "", true),
  controllers.websiteController.branches.allDocs,
);

router.post(
  "/create",
  validationMiddleware("website", "branches"),
  controllers.websiteController.branches.create,
);

router.post(
  "/update",
  validationMiddleware("website", "branches"),
  controllers.websiteController.branches.update,
);

router.post(
  "/enable-disable",
  validationMiddleware("website", "branches"),
  controllers.websiteController.branches.enableDisable,
);

router.delete(
  "/soft-delete",
  validationMiddleware("", "", true),
  controllers.websiteController.branches.softDelete,
);

export default router;
