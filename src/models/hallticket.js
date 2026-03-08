import mongoose from "mongoose";

const { Schema } = mongoose;

const hallTicketSchema = new Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    examination_id: {
      type: mongoose.Types.ObjectId,
      ref: "Examination",
      required: true,
    },
    admission_id: {
      type: mongoose.Types.ObjectId,
      ref: "Admission",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const HallTicket = mongoose.model("HallTicket", hallTicketSchema);

export default HallTicket;
