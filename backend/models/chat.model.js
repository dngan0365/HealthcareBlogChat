import mongoose from "mongoose";
import { Schema } from "mongoose";

const chatSchema = new mongoose.Schema({
    user:{
        type: String,
        required: true,
    },
    history : [
        {
            role: {
                type: String,
                enum: ["user" , "model"],
                required: true,
            },
            parts: [
                {
                    text:{
                        type: String,
                        required: true
                    },
                },
            ],
            img: {
                type: String,
                required: false
            }
        }
    ]
}, {timestamps: true})
// Export the model, using the conditional to prevent re-compilation.
export default mongoose.models.chat || mongoose.model("chat", chatSchema)