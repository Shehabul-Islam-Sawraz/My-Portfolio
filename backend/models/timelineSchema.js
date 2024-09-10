import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please Enter a Title!"],
    },
    description: {
        type: String,
        required: [true, "Please Add a Description!"],
    },
    timeline: {
        from: {
            type: String,
        },
        to: {
            type: String,
        },
    },
});

export const Timeline = mongoose.model("Timeline", timelineSchema);