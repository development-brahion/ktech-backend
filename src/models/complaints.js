import mongoose from "mongoose";

const { Schema } = mongoose;

const complaintSchema = new Schema(
  {
    complaintBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    complaintType: {
      type: String,
      enum: ["Course", "Admission", "Fee", "Other"],
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
    complaintStatus: {
      type: String,
      enum: ["Solved", "Pending", "InProgress"],
      default: "InProgress",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    closedDate: {
      type: Date,
    },
    description: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
    },
    assignedTo: {
      type: String,
      required: true,
    },
    documents: [
      {
        path: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
