import mongoose from "mongoose";

const { Schema } = mongoose;

// FAQ Item Schema
const courseFaqItemSchema = new Schema(
  {
    question: {
      type: String,
      default: "",
      trim: true,
    },
    answer: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false },
);

// Main CourseFaq Schema
const CourseFaqSchema = new Schema(
  {
    text: {
      type: String,
      trim: true,
    },
    courseFaqBanner: {
      heading: {
        type: String,
        default: "",
        trim: true,
      },
      subHeading: {
        type: String,
        default: "",
        trim: true,
      },
      bgColor: {
        type: String,
        default: "",
        trim: true,
      },
      textColor: {
        type: String,
        default: "",
        trim: true,
      },
    },
    courseFaq: {
      type: [courseFaqItemSchema],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Model
const CourseFaq = mongoose.model("CourseFaq", CourseFaqSchema);

export default CourseFaq;
