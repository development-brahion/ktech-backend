import mongoose from "mongoose";

const { Schema } = mongoose;

const hallTicketSchema = new Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    examnition_id: {
      type: mongoose.Types.ObjectId,
      ref: "Examination",
      required: true,
    },
    admission_id: {
      type: mongoose.Types.ObjectId,
      ref: "Admission",
      required: true,
    },
  },
  { timestamps: true }
);

const HallTicket = mongoose.model("hallTicket", hallTicketSchema);

export default HallTicket;
