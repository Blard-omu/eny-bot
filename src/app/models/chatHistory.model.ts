import { Schema, model, Document } from 'mongoose';

interface IChatMessage {
  query: string;
  response: string;
  confidence: number;
  timestamp: Date;
}

interface IChatHistory extends Document {
  userId: string;
  messages: IChatMessage[];
  createdAt: Date;
}

const chatHistorySchema = new Schema<IChatHistory>({
  userId: { type: String, required: true, unique: true },
  messages: [{
    query: { type: String, required: true },
    response: { type: String, required: true },
    confidence: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  }],
  createdAt: { type: Date, default: Date.now },
});

export default model<IChatHistory>('ChatHistory', chatHistorySchema);
