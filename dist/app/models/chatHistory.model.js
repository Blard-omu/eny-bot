"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatHistorySchema = new mongoose_1.Schema({
    userId: { type: String, required: true, unique: true },
    messages: [
        {
            content: { type: String, required: true },
            role: { type: String, enum: ["user", "assistant"], required: true },
            confidence: { type: Number },
            timestamp: { type: Date, default: Date.now },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});
exports.default = (0, mongoose_1.model)("ChatHistory", chatHistorySchema);
