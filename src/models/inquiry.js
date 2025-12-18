import mongoose from "mongoose";

const { Schema } = mongoose;

const inquirySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
    enquiryDate: {
      type: Date,
    },
    followUpDate: {
      type: Date,
    },
    remarks: {
      type: String,
    },
    source: {
      type: mongoose.Types.ObjectId,
      ref: "Source",
    },
    status: {
      type: mongoose.Types.ObjectId,
      ref: "Status",
    },
    isAdmissionDone: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
