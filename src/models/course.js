import mongoose from "mongoose";
import { FileDbSchema } from "./fileDb.js";

const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    template: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    mainImageUrl: FileDbSchema,
    language: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Language",
      },
    ],
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
    actualPrice: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    totalLectures: {
      type: Number,
      required: true,
    },
    isDeleted:{
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Courses = mongoose.model("Courses", courseSchema);

export default Courses;
