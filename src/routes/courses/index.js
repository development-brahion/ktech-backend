import { Router } from "express";
import controllers from "../../controller/index.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

const router = Router();
const planRouter = Router();

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

planRouter.get(
  "/list",
  validationMiddleware("", "", true),
  controllers.courseController.planList,
);

planRouter.get(
  "/all-documents",
  validationMiddleware("", "", true),
  controllers.courseController.allPlans,
);

planRouter.post(
  "/create",
  validationMiddleware("courses", "plans"),
  controllers.courseController.createPlan,
);

planRouter.post(
  "/update",
  validationMiddleware("courses", "plans"),
  controllers.courseController.updatePlan,
);

planRouter.post(
  "/enable-disable",
  validationMiddleware("courses", "plans"),
  controllers.courseController.enableDisablePlan,
);

planRouter.delete(
  "/soft-delete",
  validationMiddleware("", "", true),
  controllers.courseController.softDeletePlan,
);

planRouter.get(
  "/single-document",
  validationMiddleware("", "", true),
  controllers.courseController.getPlanDocument,
);

router.use("/plans", planRouter);

export default router;
