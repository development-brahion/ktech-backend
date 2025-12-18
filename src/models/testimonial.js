import mongoose from "mongoose";
const { Schema } = mongoose;

const testimonialSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
    },
    rating: {
        type: Number
    },
    text: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
