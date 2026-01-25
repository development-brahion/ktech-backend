import mongoose from "mongoose";
import { FileDbSchema } from "./fileDb.js";
const { Schema } = mongoose;

const testimonialSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageUrl: FileDbSchema,
    rating: {
      type: Number,
    },
    text: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
