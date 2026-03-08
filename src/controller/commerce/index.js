import { Product, ProductCategory } from "../../models/index.js";
import { nameStatusController } from "../common.js";

const categoryMessages = {
  create: "Category created successfully",
  update: "Category updated successfully",
  status: "Category status updated successfully",
  delete: "Category deleted successfully",
  exists: "Category already exists",
};

const productMessages = {
  create: "Product created successfully",
  update: "Product updated successfully",
  delete: "Product deleted successfully",
  exists: "Product already exists",
};

export const {
  list: categoryList,
  create: createCategory,
  update: updateCategory,
  softDelete: softDeleteCategory,
  allDocs: allCategories,
} = nameStatusController(ProductCategory, categoryMessages, "Product category");

export const {
  list: productList,
  create: createProduct,
  update: updateProduct,
  softDelete: softDeleteProduct,
} = nameStatusController(Product, productMessages, "Product");
