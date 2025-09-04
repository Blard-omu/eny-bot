"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const errorHandler_1 = tslib_1.__importDefault(require("../app/middlewares/errorHandler"));
const middlewares_1 = require("./middlewares");
const configs_1 = require("../configs");
const auth_router_1 = tslib_1.__importDefault(require("./routes/auth.router"));
const user_routes_1 = tslib_1.__importDefault(require("../app/routes/user.routes"));
const chatbot_routes_1 = tslib_1.__importDefault(require("../app/routes/chatbot.routes"));
const swagger_ui_express_1 = tslib_1.__importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = tslib_1.__importDefault(require("swagger-jsdoc"));
const swagger_config_1 = require("../configs/swagger.config");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// app.use(cors());
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:4000",
    "http://localhost:5173",
    "https://eny-chat.vercel.app",
    "https://backend.eny-chat.com", // Core AI backend baseURl
    "https://eny-chat.onrender.com",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
// Swagger Doc
const swaggerSpec = (0, swagger_jsdoc_1.default)(swagger_config_1.swaggerOptions);
app.use('/api/v1/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// ✅ Example API Route (Only GET Allowed)
app
    .route("/api/v1")
    .get((req, res) => {
    res.json({
        message: configs_1.CONFIG.WELCOME.MESSAGE,
        current_datetime: new Date().toISOString(),
        doc_link: configs_1.CONFIG.WELCOME.SWAGGER_DOC,
    });
})
    .all(middlewares_1.methodNotAllowed); // ❌ Rejects other methods (POST, PUT, DELETE, etc.)
// ✅ Authentication Routes
app.use("/api/v1/auth", auth_router_1.default);
app.use("/api/v1/user", user_routes_1.default);
app.use("/api/v1/chat", chatbot_routes_1.default);
// ✅ 404 - Not Found Handler
app.use((req, res, next) => {
    next(new middlewares_1.NotFoundError(`Route ${req.originalUrl} not found`));
});
// ✅ Global Error Handler
app.use(errorHandler_1.default);
exports.default = app;
