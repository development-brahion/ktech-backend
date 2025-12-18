import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  assignTo: [{
    _id: false,
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    assignDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Pending', 'In-Progress', 'Completed']
    },
  }],
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

export default Task;
