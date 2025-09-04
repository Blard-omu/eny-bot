"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const escalationSchema = new mongoose_1.Schema({
    query: { type: String, required: true },
    userEmail: { type: String, required: true },
    confidence: { type: Number, default: null },
    reason: { type: String, default: null },
    contextUsed: { type: [String], default: [] },
    metadata: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now },
});
exports.default = (0, mongoose_1.model)("Escalation", escalationSchema);
