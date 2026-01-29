import mongoose from "mongoose";

const { Schema } = mongoose;

const batchSchema = new Schema(
  {
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    courses: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Courses",
        required: true,
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
    totalSeat: {
      type: Number,
      default: 0,
    },
    availableSeat: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Batch = mongoose.model("Batch", batchSchema);

export default Batch;
