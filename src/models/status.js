import mongoose from "mongoose";

const { Schema } = mongoose;

const statusSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Status = mongoose.model('Status', statusSchema);

export default Status;
