import { Router } from "express";
import controllers from "../../controller/index.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";

const router = Router();
const categoryRouter = Router();
const productRouter = Router();

categoryRouter.get(
  "/list",
  validationMiddleware("", "", true),
  controllers.commerceController.categoryList,
);

categoryRouter.get(
  "/all-documents",
  validationMiddleware("", "", true),
  controllers.commerceController.allCategories,
);

categoryRouter.post(
  "/create",
  validationMiddleware("employee", "departments"),
  controllers.commerceController.createCategory,
);

categoryRouter.post(
  "/update",
  validationMiddleware("employee", "departments"),
  controllers.commerceController.updateCategory,
);

categoryRouter.delete(
  "/soft-delete",
  validationMiddleware("", "", true),
  controllers.commerceController.softDeleteCategory,
);

productRouter.get(
  "/list",
  validationMiddleware("", "", true),
  controllers.commerceController.productList,
);

productRouter.post(
  "/create",
  validationMiddleware("commerce", "products"),
  controllers.commerceController.createProduct,
);

productRouter.post(
  "/update",
  validationMiddleware("commerce", "products"),
  controllers.commerceController.updateProduct,
);

productRouter.delete(
  "/soft-delete",
  validationMiddleware("", "", true),
  controllers.commerceController.softDeleteProduct,
);

router.use("/categories", categoryRouter);
router.use("/products", productRouter);

export default router;
