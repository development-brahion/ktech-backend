import mongoose from "mongoose";

const { Schema } = mongoose;

const VisitorBookSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNo: {
      type: String,
      trim: true,
    },
    meetingWith: {
      type: String,
      trim: true,
    },
    totalPerson: {
      type: Number,
    },
    date: {
      type: Date,
    },
    followUpDate: {
      type: Date,
    },
    inTime: {
      type: String,
    },
    outTime: {
      type: String,
    },
    purpose: {
      type: String,
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

const VisitorsBook = mongoose.model("VisitorsBook", VisitorBookSchema);

export default VisitorsBook;
