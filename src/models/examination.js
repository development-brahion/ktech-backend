import mongoose from "mongoose";

const { Schema } = mongoose;

const examinationSchema = new Schema(
  {
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Courses",
    },
    batch: {
      type: mongoose.Types.ObjectId,
      ref: "Batch",
    },
    examinationfor: {
      type: String,
      enum: ["Student", "Teacher"],
    },
    examtitle: {
      type: String,
    },
    designation: {
      type: mongoose.Types.ObjectId,
      ref: "Designation",
    },
    time: {
      type: Date,
    },
    examduration: {
      hours: {
        type: Number,
      },
      minutes: {
        type: Number,
      },
    },
    passingPercentage: {
      type: Number,
    },
    questions: [
      {
        question: { type: String },
        option_1: { type: String },
        option_2: { type: String },
        option_3: { type: String },
        option_4: { type: String },
        answer: { type: String },
      },
    ],
    type: {
      type: String,
      enum: ["Goal", "Role", "Student"],
    },
    role: {
      type: mongoose.Types.ObjectId,
      ref: "Role",
    },
    goal: {
      type: mongoose.Types.ObjectId,
      ref: "Goal",
    },
    status: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Examination = mongoose.model("Examination", examinationSchema);

export default Examination;
