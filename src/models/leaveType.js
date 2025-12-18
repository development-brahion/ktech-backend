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
  },
  { timestamps: true }
);

const LeaveType = mongoose.model("LeaveType", leaveTypeSchema);

export default LeaveType;
