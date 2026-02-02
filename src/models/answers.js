import mongoose from "mongoose";

const { Schema } = mongoose;

const answerSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    examination: {
      type: mongoose.Types.ObjectId,
      ref: "Examination",
      required: true,
    },
    studentanswer: [
      {
        type: String,
        required: true,
      },
    ],
    result: {
      type: String,
      required: true,
    },
    marks: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["Goal", "Role", "Student"],
    },
    // roleselectid: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "Role",
    //   required: function () {
    //     return this.type === "Role" && this.result === "PASS";
    //   },
    // },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Answer = mongoose.model("Answer", answerSchema);

export default Answer;
