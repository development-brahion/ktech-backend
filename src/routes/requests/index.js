import { Router } from "express";
import controllers from "../../controller/index.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

const router = Router();
const leaveRouter = Router();

leaveRouter.get(
  "/list",
  validationMiddleware("", "", true),
  controllers.requestController.getLeaveRequestList,
);

leaveRouter.post(
  "/update-status",
  validationMiddleware("requests", "leaves"),
  controllers.requestController.updateLeaveRequest,
);

router.use("/leaves", leaveRouter);

export default router;
