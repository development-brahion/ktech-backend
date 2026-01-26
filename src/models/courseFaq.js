import mongoose from "mongoose";

const { Schema } = mongoose;

// FAQ Item Schema
const courseFaqItemSchema = new Schema(
  {
    question: {
      type: String,
      default: "",
    },
    answer: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

// Main CourseFaq Schema
const CourseFaqSchema = new Schema(
  {
    text: {
      type: String,
    },
    courseFaqBanner: {
      heading: {
        type: String,
        default: "",
      },
      subHeading: {
        type: String,
        default: "",
      },
      bgColor: {
        type: String,
        default: "",
      },
      textColor: {
        type: String,
        default: "",
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
