import { Schema } from "mongoose";
import mongoose from "mongoose";

// Schema for schedule
const scheduleSchema= new Schema({
    user: { type: String, required: true},
    Id: { type: Number, required: true },
    Subject: { type: String, required: true },
    StartTime: { type: Date, required: true },
    EndTime: { type: Date, required: true },
    CategoryColor: { type: String }
});
export default mongoose.model("Schedule", scheduleSchema);