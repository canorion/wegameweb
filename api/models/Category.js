import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
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
        description: {
            type: String,
            required: "Description is required",
            max: 250,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("categories", CategorySchema);