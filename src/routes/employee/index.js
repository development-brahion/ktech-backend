import { Router } from "express";
import controllers from "../../controller/index.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

const router = Router();
const departmentRouter = Router();
const designationRouter = Router();

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

router.use("/departments", departmentRouter);
router.use("/designations", designationRouter);

export default router;
