"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerOptions = void 0;
exports.swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "ENY CHATBOT – Student Support ChatBot API",
            version: "1.0.0",
            description: "API documentation for the Middle Backend of ENY Consulting's Student Support Portal. This service acts as a bridge between the frontend and AI Core Backend, managing chat, escalations, leads, and chat history.",
        },
        servers: [
            {
                url: "https://eny-bot.onrender.com/api/v1",
                description: "Live Server",
            },
            {
                url: "http://localhost:5000/api/v1",
                description: "Local Development Server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        email: { type: 'string' },
                        username: { type: 'string' },
                        phone: { type: 'string' },
                        role: { type: 'string', enum: ['user', 'admin'] },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Lead: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        email: { type: "string", example: "lead@example.com" },
                        query: { type: "string", example: "Interested in CBAP enrollment" },
                        status: {
                            type: "string",
                            enum: ["new", "assigned", "in_progress", "closed"],
                            default: "new"
                        },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                Escalation: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        query: { type: "string", example: "How do I apply for CBAP?" },
                        userEmail: { type: "string", example: "student@example.com" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                ChatHistory: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        userId: { type: "string", example: "a42b29ac-7736-40e6-ba09-9ba1509bbc99" },
                        messages: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    query: { type: "string", example: "What is the cost of CBAP?" },
                                    response: { type: "string", example: "The CBAP course costs $297" },
                                    confidence: { type: "number", example: 0.92 },
                                    timestamp: { type: "string", format: "date-time" },
                                },
                            },
                        },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        status: { type: "integer" },
                        message: { type: "string" },
                        stack: { type: "string" },
                    },
                },
            },
            responses: {
                UnauthorizedError: {
                    description: "Unauthorized – invalid or missing token",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
                ValidationError: {
                    description: "Validation failed",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
                NotFoundError: {
                    description: "Resource not found",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
                ConflictError: {
                    description: "Conflict – resource already exists",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ErrorResponse" },
                        },
                    },
                },
            },
        },
    },
    apis: ["./src/app/routes/**/*.ts", "./src/app/models/**/*.ts"],
};
