import mongoose from "mongoose";

const { Schema } = mongoose;

const QuerySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: true,
    },
    mobile: {
      type: String,
      default: true,
    },
    query: {
      type: String,
      default: true,
    },
  },
  { timestamps: true }
);

const Query = mongoose.model("Query", QuerySchema);

export default Query;
