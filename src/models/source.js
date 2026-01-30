import mongoose from "mongoose";

const { Schema } = mongoose;

const sourceSchema = new Schema(
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

const Source = mongoose.model("Source", sourceSchema);

export default Source;
