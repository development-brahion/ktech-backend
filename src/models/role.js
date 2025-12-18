import mongoose from "mongoose";

const { Schema } = mongoose;

const roleSchema = new Schema({
  name: {
    type: String,
  },
  course: {
    type: mongoose.Types.ObjectId,
    ref: 'Courses',
  },
  days: {
    type: Number,
  },
  assignTo: [{
    _id: false,
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    assignDate: {
      type: Date,
      default: Date.now,
    },
    isvalid: {
      type: Boolean,
      default: false,
    },
    answer: {
      type: mongoose.Types.ObjectId,
      ref: 'Answer',
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
    },
  }],
});

const Role = mongoose.model('Role', roleSchema);

export default Role;
