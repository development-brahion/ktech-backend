import mongoose from "mongoose";

const { Schema } = mongoose;

const leaveTypeSchema = new Schema(
  {
    name: {
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

const LeaveType = mongoose.model("LeaveType", leaveTypeSchema);

export default LeaveType;
