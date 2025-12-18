import mongoose from "mongoose";

const { Schema } = mongoose;

const leaveRequestSchema = new Schema(
  {
    name: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    applyDate: {
      type: Date,
      default: Date.now,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    leaveType: {
      type: mongoose.Types.ObjectId,
      ref: "LeaveType", // ❗ fixed (no spaces in model name)
    },
    leaveStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    reason: {
      type: String,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

const LeaveRequest = mongoose.model("LeaveRequest", leaveRequestSchema);

export default LeaveRequest;
