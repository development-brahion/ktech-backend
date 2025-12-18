import mongoose from "mongoose";

const { Schema } = mongoose;

export const FileDbSchema = new Schema(
  {
    filename: { type: String },
    path: { type: String },
    mimetype: { type: String },
    url: { type: String },
  },
  {
    _id: false,
    timestamps: false,
  }
);
