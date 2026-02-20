import mongoose from "mongoose";

const { Schema } = mongoose;

const goalSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    designation: {
      type: mongoose.Types.ObjectId,
      ref: "Designation",
    },
    role: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Role",
      },
    ],
    salary: {
      type: Number,
    },
    duration: {
      type: String,
      trim: true,
    },
    assignTo: [
      {
        _id: false,
        user: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        assignDate: {
          type: Date,
          default: Date.now,
        },
        isvalid: {
          type: Boolean,
          default: false,
        },
        answer: {
          type: mongoose.Types.ObjectId,
          ref: "Answer",
        },
        status: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
        },
      },
    ],
    department: {
      type: mongoose.Types.ObjectId,
      ref: "Department",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;
