import mongoose from "mongoose";
import { FileDbSchema } from "./fileDb.js";

const { Schema } = mongoose;

const certificateSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rollNo: {
      type: mongoose.Types.ObjectId,
      ref: "Admission",
      required: true,
    },
    image: [FileDbSchema],
  },
  { timestamps: true }
);

const Certificate = mongoose.model("certificateSave", certificateSchema);

export default Certificate;
