"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.Role = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["SUPERADMIN"] = "super_admin";
    Role["USER"] = "user";
})(Role || (exports.UserRole = exports.Role = Role = {}));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        trim: true,
        required: [true, "Username is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: true,
        match: [
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            "Invalid email format",
        ],
    },
    phone: { type: String, trim: true, default: "+123456789" },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER,
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters"],
        maxlength: 64,
        select: false,
    },
    profileImage: { type: String, trim: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model("User", userSchema);
