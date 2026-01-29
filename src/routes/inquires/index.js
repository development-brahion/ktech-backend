import { Router } from "express";
import controllers from "../../controller/index.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

const router = Router();
const sourceRouter = Router();
const statusRouter = Router();

sourceRouter.get(
  "/list",
  validationMiddleware("", "", true),
  controllers.inquireController.sourceList,
);

sourceRouter.get(
  "/all-documents",
  validationMiddleware("", "", true),
  controllers.inquireController.allSources,
);

sourceRouter.post(
  "/create",
  validationMiddleware("inquires", "source"),
  controllers.inquireController.createSource,
);

sourceRouter.post(
  "/update",
  validationMiddleware("inquires", "source"),
  controllers.inquireController.updateSource,
);

sourceRouter.post(
  "/enable-disable",
  validationMiddleware("inquires", "source"),
  controllers.inquireController.enableDisableSource,
);

sourceRouter.delete(
  "/soft-delete",
  validationMiddleware("", "", true),
  controllers.inquireController.softDeleteSource,
);

statusRouter.get(
  "/list",
  validationMiddleware("", "", true),
  controllers.inquireController.statusList,
);

statusRouter.get(
  "/all-documents",
  validationMiddleware("", "", true),
  controllers.inquireController.allStatus,
);

statusRouter.post(
  "/create",
  validationMiddleware("inquires", "status"),
  controllers.inquireController.createStatus,
);

statusRouter.post(
  "/update",
  validationMiddleware("inquires", "status"),
  controllers.inquireController.updateStatus,
);

statusRouter.post(
  "/enable-disable",
  validationMiddleware("inquires", "status"),
  controllers.inquireController.enableDisableStatus,
);

statusRouter.delete(
  "/soft-delete",
  validationMiddleware("", "", true),
  controllers.inquireController.softDeleteStatus,
);

router.use("/source", sourceRouter);
router.use("/status", statusRouter);

export default router;
