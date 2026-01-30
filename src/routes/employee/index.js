import { Router } from "express";
import controllers from "../../controller/index.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

const router = Router();
const departmentRouter = Router();
const designationRouter = Router();
const roleRouter = Router();
const goalRouter = Router();
const leaveTypeRouter = Router();

departmentRouter.get(
  "/list",
  validationMiddleware("", "", true),
  controllers.employeeController.departmentList,
);

departmentRouter.get(
  "/all-documents",
  validationMiddleware("", "", true),
  controllers.employeeController.allDepartments,
);

departmentRouter.post(
  "/create",
  validationMiddleware("employee", "departments"),
  controllers.employeeController.createDepartment,
);

departmentRouter.post(
  "/update",
  validationMiddleware("employee", "departments"),
  controllers.employeeController.updateDepartment,
);

departmentRouter.post(
  "/enable-disable",
  validationMiddleware("employee", "departments"),
  controllers.employeeController.enableDisableDepartment,
);

departmentRouter.delete(
  "/soft-delete",
  validationMiddleware("", "", true),
  controllers.employeeController.softDeleteDepartment,
);

departmentRouter.get(
  "/single-document",
  validationMiddleware("", "", true),
  controllers.employeeController.getDepartmentDocument,
);

designationRouter.get(
  "/list",
  validationMiddleware("", "", true),
  controllers.employeeController.designationList,
);

designationRouter.get(
  "/all-documents",
  validationMiddleware("", "", true),
  controllers.employeeController.allDesignations,
);

designationRouter.post(
  "/create",
  validationMiddleware("employee", "designations"),
  controllers.employeeController.createDesignation,
);

designationRouter.post(
  "/update",
  validationMiddleware("employee", "designations"),
  controllers.employeeController.updateDesignation,
);

designationRouter.post(
  "/enable-disable",
  validationMiddleware("employee", "designations"),
  controllers.employeeController.enableDisableDesignation,
);

designationRouter.delete(
  "/soft-delete",
  validationMiddleware("", "", true),
  controllers.employeeController.softDeleteDesignation,
);

designationRouter.get(
  "/single-document",
  validationMiddleware("", "", true),
  controllers.employeeController.getDesignationDocument,
);

roleRouter.get(
  "/list",
  validationMiddleware("", "", true),
  controllers.employeeController.roleList,
);

roleRouter.get(
  "/all-documents",
  validationMiddleware("", "", true),
  controllers.employeeController.allRoles,
);

roleRouter.post(
  "/create",
  validationMiddleware("employee", "roles"),
  controllers.employeeController.createRole,
);

roleRouter.delete(
  "/soft-delete",
  validationMiddleware("", "", true),
  controllers.employeeController.softDeleteRole,
);

goalRouter.get(
  "/list",
  validationMiddleware("", "", true),
  controllers.employeeController.goalList,
);

goalRouter.get(
  "/all-documents",
  validationMiddleware("", "", true),
  controllers.employeeController.allGoals,
);

goalRouter.post(
  "/create",
  validationMiddleware("employee", "goals"),
  controllers.employeeController.createGoal,
);

goalRouter.delete(
  "/soft-delete",
  validationMiddleware("", "", true),
  controllers.employeeController.softDeleteGoal,
);

leaveTypeRouter.get(
  "/list",
  validationMiddleware("", "", true),
  controllers.employeeController.leaveTypeList,
);

leaveTypeRouter.get(
  "/all-documents",
  validationMiddleware("", "", true),
  controllers.employeeController.allLeaveTypes,
);

leaveTypeRouter.post(
  "/create",
  validationMiddleware("employee", "leaveTypes"),
  controllers.employeeController.createLeaveType,
);

leaveTypeRouter.post(
  "/update",
  validationMiddleware("employee", "leaveTypes"),
  controllers.employeeController.updateLeaveType,
);

leaveTypeRouter.post(
  "/enable-disable",
  validationMiddleware("employee", "leaveTypes"),
  controllers.employeeController.enableDisableLeaveType,
);

leaveTypeRouter.delete(
  "/soft-delete",
  validationMiddleware("", "", true),
  controllers.employeeController.softDeleteLeaveType,
);

router.use("/departments", departmentRouter);
router.use("/designations", designationRouter);
router.use("/roles", roleRouter);
router.use("/goals", goalRouter);
router.use("/leave-types", leaveTypeRouter);

export default router;
