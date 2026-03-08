import mongoose from "mongoose";

const { Schema } = mongoose;

const languageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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

const Language = mongoose.model("Language", languageSchema);

export default Language;
