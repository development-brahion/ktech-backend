import { Router } from "express";
import controllers from "../../controller/index.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

const router = Router();
const leaveRouter = Router();
const roleRouter = Router();
const goalRouter = Router();

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

roleRouter.get(
  "/list",
  validationMiddleware("requests", "roles"),
  controllers.requestController.roleExamRequestList,
);

goalRouter.get(
  "/list",
  validationMiddleware("requests", "goals"),
  controllers.requestController.goalExamRequestList,
);

roleRouter.post(
  "/update-status",
  validationMiddleware("requests", "roles"),
  controllers.requestController.updateRoleExamRequestStatus,
);

goalRouter.post(
  "/update-status",
  validationMiddleware("requests", "goals"),
  controllers.requestController.updateGoalExamRequestStatus,
);

router.use("/leaves", leaveRouter);
router.use("/roles", roleRouter);
router.use("/goals", goalRouter);

export default router;
