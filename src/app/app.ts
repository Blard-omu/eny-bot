import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import errorHandler from "../app/middlewares/errorHandler";
import { NotFoundError, methodNotAllowed } from "./middlewares";
import { CONFIG } from "../configs";
import AuthRouter from "./routes/auth.router";
import UserRouter from "../app/routes/user.routes";
import ChatRouter from "../app/routes/chatbot.routes";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from '../configs/swagger.config';

dotenv.config();

const app = express();


app.use(express.json());
// app.use(cors());


const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:8000",
  "http://192.168.100.161:8000"
   "http://localhost:5173",
  "https://eny-bot-fe.vercel.app",
  "https://enychotbot-core-chat.com", 
  "https://enychatbot-middle.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


// Swagger Doc
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); 


// ✅ Example API Route (Only GET Allowed)
app
  .route("/api/v1")
  .get((req, res) => {
    res.json({
      message: CONFIG.WELCOME.MESSAGE,
      current_datetime: new Date().toISOString(),
      doc_link: CONFIG.WELCOME.SWAGGER_DOC,
    });
  })
  .all(methodNotAllowed); // ❌ Rejects other methods (POST, PUT, DELETE, etc.)


// ✅ Authentication Routes
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/chat", ChatRouter);



// ✅ 404 - Not Found Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// ✅ Global Error Handler
app.use(errorHandler);


export default app;
