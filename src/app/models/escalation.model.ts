import { Schema, model, Document } from 'mongoose';

interface IEscalation extends Document {
  query: string;
  userEmail: string;
  confidence?: number;             
  reason?: string;                 
  contextUsed?: string[];     
  metadata?: Record<string, any>;
  createdAt: Date;
}

const escalationSchema = new Schema<IEscalation>({
  query: { type: String, required: true },
  userEmail: { type: String, required: true },
  confidence: { type: Number, default: null },
  reason: { type: String, default: null },
  contextUsed: { type: [String], default: [] },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
});

export default model<IEscalation>("Escalation", escalationSchema);
