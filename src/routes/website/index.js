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

router.get(
  "/configs",
  validationMiddleware("website", "", false, ["GET"]),
  controllers.websiteController.configs.getConfigPanel,
);

router.post(
  "/configs",
  validationMiddleware("website", "", false),
  controllers.websiteController.configs.updateConfigPanel,
);

router.use("/languages", languageRoutes);
router.use("/category", categoryRoutes);
router.use("/blogs", blogRoutes);
router.use("/branches", branchRoutes);
router.use("/testimonials", testimonialRoutes);

router.get(
  "/course-faq",
  validationMiddleware("website", "", false, ["GET"]),
  controllers.websiteController.courseFaq.getCourseFaqPanel,
);

router.post(
  "/course-faq",
  validationMiddleware("website", "", false),
  controllers.websiteController.courseFaq.updateCourseFaqPanel,
);

router.get(
  "/about-us",
  validationMiddleware("website", "", false, ["GET"]),
  controllers.websiteController.cms.getAboutUsPanel,
);

router.post(
  "/about-us",
  validationMiddleware("website", "", false),
  controllers.websiteController.cms.updateAboutUsPanel,
);

router.get(
  "/terms-and-conditions",
  validationMiddleware("website", "", false, ["GET"]),
  controllers.websiteController.cms.getTermsAndConditionsPanel,
);

router.post(
  "/terms-and-conditions",
  validationMiddleware("website", "", false),
  controllers.websiteController.cms.updateTermsAndConditionsPanel,
);

router.get(
  "/privacy-policy",
  validationMiddleware("website", "", false, ["GET"]),
  controllers.websiteController.cms.getPrivacyPolicyPanel,
);

router.post(
  "/privacy-policy",
  validationMiddleware("website", "", false),
  controllers.websiteController.cms.updatePrivacyPolicyPanel,
);

router.get(
  "/why-us",
  validationMiddleware("website", "", false, ["GET"]),
  controllers.websiteController.cms.getWhyUsPanel,
);

router.post(
  "/why-us",
  validationMiddleware("website", "", false),
  controllers.websiteController.cms.updateWhyUsPanel,
);

router.get(
  "/configs/templates",
  validationMiddleware("website", "", false, ["GET"]),
  controllers.websiteController.configs.getConfigTemplatesPanel,
);

router.post(
  "/configs/templates",
  validationMiddleware("website", "", false),
  controllers.websiteController.configs.updateConfigPanel,
);

router.get(
  "/refund-policy",
  validationMiddleware("website", "", false, ["GET"]),
  controllers.websiteController.cms.getRefundPolicyPanel,
);

router.post(
  "/refund-policy",
  validationMiddleware("website", "", false),
  controllers.websiteController.cms.updateRefundPolicyPanel,
);

router.get(
  "/queries",
  validationMiddleware("website"),
  controllers.websiteController.cms.getQueryList,
);

router.post(
  "/queries/submit",
  validationMiddleware("website"),
  controllers.websiteController.cms.submitQuery,
);

export default router;
