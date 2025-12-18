import mongoose from "mongoose";

const { Schema } = mongoose;

const productCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ProductCategory = mongoose.model("ProductCategory", productCategorySchema);

export default ProductCategory;
