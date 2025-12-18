import mongoose from "mongoose";
import { FileDbSchema } from "./fileDb.js";

const { Schema } = mongoose;

const studentCertificateSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imageupload: [FileDbSchema],
}, {
    timestamps: true
});

const StudentCertificate = mongoose.model('studentCertificate', studentCertificateSchema);

export default StudentCertificate;
