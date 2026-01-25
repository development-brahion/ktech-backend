import { Router } from "express";
import controllers from "../../controller/index.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import languageRoutes from "./languages.js";
import categoryRoutes from "./category.js";
import blogRoutes from "./blogs.js";
import branchRoutes from "./branches.js";
import testimonialRoutes from "./testimonials.js";

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
router.use("/category", categoryRoutes);
router.use("/blogs", blogRoutes);
router.use("/branches", branchRoutes);
router.use("/testimonials", testimonialRoutes);

export default router;
