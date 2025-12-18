import mongoose from "mongoose";

const { Schema } = mongoose;

const languageSchema = new Schema(
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

const Language = mongoose.model("Language", languageSchema);

export default Language;
