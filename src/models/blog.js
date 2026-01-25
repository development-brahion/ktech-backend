import mongoose from "mongoose"
import {FileDbSchema} from "./fileDb.js";
const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnailImage:FileDbSchema, 
    mainImageUrl: FileDbSchema,
    language: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Language",
      },
    ],
    category: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Category",
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
