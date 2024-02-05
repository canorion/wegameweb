import mongoose from "mongoose";

const HotDogPlayerSchema = new mongoose.Schema(
    {
        block: {
            type: String,
            required: "Block is required",
            max: 10,
        },
        seat: {
            type: Number,
            required: "Seat is required"
        },
        hotdoggame: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "hotdoggames",
            required: true
         }
    },
    { timestamps: true }
);

export default mongoose.model("hotdogplayers", HotDogPlayerSchema);