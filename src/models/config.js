import mongoose from "mongoose";
import { FileDbSchema } from "./fileDb.js";

const { Schema } = mongoose;

const configSchema = new Schema(
  {
    companyName: String,
    facebook: String,
    twitter: String,
    instagram: String,
    youtube: String,
    websiteName: String,
    companyPhoneNo: Number,
    companyAddress: String,
    companyLogo: [FileDbSchema],
    templates: {
      certificate: [FileDbSchema],
      idcard: [FileDbSchema],
      hallticket: [FileDbSchema],
      Admission: [FileDbSchema],
      fees: [FileDbSchema],
      marksheet: [FileDbSchema],
      trainingCenter: [FileDbSchema],
      typing: [FileDbSchema],
    },
  },
  { timestamps: true }
);

const Config = mongoose.model("Config", configSchema);

export default Config;
