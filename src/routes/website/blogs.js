import { Router } from "express";
import controllers from "../../controller/index.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

const router = Router();

router.get(
  "/list",
  validationMiddleware("", "", true),
  controllers.websiteController.blogs.list,
);

router.get(
  "/all-documents",
  validationMiddleware("", "", true),
  controllers.websiteController.blogs.allDocs,
);

router.post(
  "/create",
  validationMiddleware("website", "blogs"),
  controllers.websiteController.blogs.create,
);

router.post(
  "/update",
  validationMiddleware("website", "blogs"),
  controllers.websiteController.blogs.update,
);

router.post(
  "/enable-disable",
  validationMiddleware("website", "blogs"),
  controllers.websiteController.blogs.enableDisable,
);

router.delete(
  "/soft-delete",
  validationMiddleware("", "", true),
  controllers.websiteController.blogs.softDelete,
);

export default router;
