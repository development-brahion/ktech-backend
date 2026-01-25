import { Router } from "express";
import controllers from "../../controller/index.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

const router = Router();

router.post(
  "/signIn",
  validationMiddleware("authorization"),
  controllers.authorizationController.signIn,
);

router.post(
  "/forgotpassword",
  validationMiddleware("authorization"),
  controllers.authorizationController.forgotPassword,
);

router.post(
  "/resetpassword",
  validationMiddleware("authorization"),
  controllers.authorizationController.resetPassword,
);

router.get(
  "/profile",
  validationMiddleware("authorization"),
  controllers.authorizationController.viewProfile,
);

router.post(
  "/change-password",
  validationMiddleware("authorization"),
  controllers.authorizationController.changePassword,
);

router.post(
  "/update-profile-photo",
  validationMiddleware("authorization"),
  controllers.authorizationController.updateProfilePhoto,
);

export default router;
