import { Router } from "express";
import controllers from "../../controller/index.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

const router = Router();

router.get(
  "/list",
  validationMiddleware("", "", true),
  controllers.websiteController.languages.list,
);

router.get(
  "/all-documents",
  validationMiddleware("", "", true),
  controllers.websiteController.languages.allDocs,
);

router.post(
  "/create",
  validationMiddleware("website", "languages"),
  controllers.websiteController.languages.create,
);

router.post(
  "/update",
  validationMiddleware("website", "languages"),
  controllers.websiteController.languages.update,
);

router.post(
  "/enable-disable",
  validationMiddleware("website", "languages"),
  controllers.websiteController.languages.enableDisable,
);

router.delete(
  "/soft-delete",
  validationMiddleware("", "", true),
  controllers.websiteController.languages.softDelete,
);

export default router;
