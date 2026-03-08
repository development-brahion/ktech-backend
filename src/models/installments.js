import mongoose from "mongoose";

const { Schema } = mongoose;

const installmentsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    amount: {
      type: Number,
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Courses",
    },
    batch: {
      type: mongoose.Types.ObjectId,
      ref: "Batch",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    student: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    receiptNumber: {
      type: String,
      sparse: true,
    },
    paymentmode: {
      type: String,
      enum: ["Cash", "Cheque"],
    },
    transctionId: {
      type: String,
      sparse: true,
    },
  },
  { timestamps: true }
);

const Installment = mongoose.model("Installment", installmentsSchema);

export default Installment;
