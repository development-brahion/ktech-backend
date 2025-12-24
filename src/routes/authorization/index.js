import { Router } from "express";
import controllers from "../../controller/index.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

const router = Router();

router.post(
  "/signIn",
  validationMiddleware("authorization"),
  controllers.authorizationController.signIn
);

router.post(
  "/forgotpassword",
  validationMiddleware("authorization"),
  controllers.authorizationController.forgotPassword
);

export default router;
