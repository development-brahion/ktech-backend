import { Router } from "express";
import controllers from "../../controller/index.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import languageRoutes from "./languages.js";
const router = Router();

router.get(
  "/home",
  validationMiddleware("website", "", false, ["GET"]),
  controllers.websiteController.home.getHomePanel,
);

router.post(
  "/home",
  validationMiddleware("website"),
  controllers.websiteController.home.updateHomePanel,
);

router.use("/languages", languageRoutes);

export default router;
