import mongoose from "mongoose";

const HotDogGameSchema = new mongoose.Schema(
    {
        isStarted: {
            type: Boolean,
            default: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isFinished: {
            type: Boolean,
            default: false,
        },
        winner: {
            type: String,
            default: ''
        },
        timeData: {
            type: String
        }
    },
    { timestamps: true }
);

export default mongoose.model("hotdoggames", HotDogGameSchema);