import { Router } from "express";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import controllers from "../../controller/index.js";

const router = Router();

router.get(
  "/list",
  validationMiddleware("", "", true),
  controllers.userController.getUserList,
);

router.post(
  "/create",
  validationMiddleware("users"),
  controllers.userController.createUser,
);

router.post(
  "/update",
  validationMiddleware("users"),
  controllers.userController.updateUser,
);

router.post(
  "/enable-disable",
  validationMiddleware("users"),
  controllers.userController.enableDisableUser,
);

router.post(
  "/update-password",
  validationMiddleware("users"),
  controllers.userController.updatePassword,
);

export default router;
