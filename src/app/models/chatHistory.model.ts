import { Schema, model, Document } from 'mongoose';

interface IChatMessage {
  content: string;
  role: "user" | "assistant";
  confidence?: number;
  timestamp: Date;
}

interface IChatHistory extends Document {
  userId: string;
  messages: IChatMessage[];
  createdAt: Date;
}

const chatHistorySchema = new Schema<IChatHistory>({
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

export default model<IChatHistory>("ChatHistory", chatHistorySchema);
