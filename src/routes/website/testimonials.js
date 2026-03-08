import { Router } from "express";
import controllers from "../../controller/index.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

const router = Router();

router.get(
  "/list",
  validationMiddleware("", "", true),
  controllers.websiteController.testimonials.list,
);

router.get(
  "/all-documents",
  validationMiddleware("", "", true),
  controllers.websiteController.testimonials.allDocs,
);

router.post(
  "/create",
  validationMiddleware("website", "testimonials"),
  controllers.websiteController.testimonials.create,
);

router.post(
  "/update",
  validationMiddleware("website", "testimonials"),
  controllers.websiteController.testimonials.update,
);

router.post(
  "/enable-disable",
  validationMiddleware("website", "testimonials"),
  controllers.websiteController.testimonials.enableDisable,
);

router.delete(
  "/soft-delete",
  validationMiddleware("", "", true),
  controllers.websiteController.testimonials.softDelete,
);

export default router;
