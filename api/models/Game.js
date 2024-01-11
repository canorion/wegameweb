import mongoose from "mongoose";

const GameSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: "Name is required",
            max: 100,
        },
        description: {
            type: String,
            required: "Description is required",
            max: 500,
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

export default mongoose.model("games", GameSchema);