import { Router } from "express";
import controllers from "../../controller/index.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

const router = Router();

router.get(
  "/home",
  validationMiddleware("website", "", false, ["GET"]),
  controllers.websiteController.getHomePanel,
);

router.post(
  "/home",
  validationMiddleware("website"),
  controllers.websiteController.updateHomePanel,
);

export default router;
