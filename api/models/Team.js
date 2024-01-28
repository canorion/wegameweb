import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: "Name is required",
            max: 100,
        },
        imageUrl: {
            type: String,
            required: "Image Url is required",
            lowercase: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("teams", TeamSchema); 