import { Router } from "express";
import controllers from "../../controller/index.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

const router = Router();

router.get(
  "/list",
  validationMiddleware("", "", true),
  controllers.websiteController.category.list,
);

router.get(
  "/all-documents",
  validationMiddleware("", "", true),
  controllers.websiteController.category.allDocs,
);

router.post(
  "/create",
  validationMiddleware("website", "category"),
  controllers.websiteController.category.create,
);

router.post(
  "/update",
  validationMiddleware("website", "category"),
  controllers.websiteController.category.update,
);

router.post(
  "/enable-disable",
  validationMiddleware("website", "category"),
  controllers.websiteController.category.enableDisable,
);

router.delete(
  "/soft-delete",
  validationMiddleware("", "", true),
  controllers.websiteController.category.softDelete,
);

export default router;
