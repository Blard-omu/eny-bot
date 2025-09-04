"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const leadSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    query: { type: String, required: true },
    assignedTo: { type: String, default: null },
    status: {
        type: String,
        enum: ["new", "assigned", "in_progress", "closed"],
        default: "new"
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Lead", leadSchema);
