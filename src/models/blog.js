import mongoose from "mongoose";

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
    thumbnailImageUrl: {
      type: String,
    },
    mainImageUrl: {
      type: String,
    },
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
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
