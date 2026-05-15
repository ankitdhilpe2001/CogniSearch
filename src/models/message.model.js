import mongoose from "mongoose";

const sourceSchema = new mongoose.Schema(
    {
        title: { type: String, trim: true },
        url: { type: String, trim: true },
        snippet: { type: String, trim: true },
    },
    { _id: false }
);

const messageSchema = new mongoose.Schema(
    {
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: [true, "Message must belong to a chat"],
        },
        role: {
            type: String,
            enum: {
                values: ["user", "assistant", "system"],
                message: "{VALUE} is not a valid role",
            },
            required: [true, "Message role is required"],
        },
        content: {
            type: String,
            required: [true, "Message content cannot be empty"],
            trim: true,
        },
        sources: {
            type: [sourceSchema],
            default: [],
        },
    },
    { timestamps: true }
);

messageSchema.index({ chat: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
