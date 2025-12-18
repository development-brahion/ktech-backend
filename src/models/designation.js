import mongoose from "mongoose";

const { Schema } = mongoose;

const designationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Designation = mongoose.model("Designation", designationSchema);

export default Designation;
