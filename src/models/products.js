import mongoose from "mongoose";
import { FileDbSchema } from "./fileDb.js";

const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    pname: {
      type: String,
      required: true,
    },
    pcategory: {
      type: mongoose.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    sellingprice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pimage: [FileDbSchema],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
