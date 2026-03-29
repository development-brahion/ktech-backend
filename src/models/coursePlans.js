import mongoose from "mongoose";

const { Schema } = mongoose;

const coursePlansSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    course: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
      },
    ],
    // batch: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Batch",
    // },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const CoursePlans = mongoose.model("CoursePlans", coursePlansSchema);

export default CoursePlans;
