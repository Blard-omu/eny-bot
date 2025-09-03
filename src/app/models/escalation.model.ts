import { Schema, model, Document } from 'mongoose';

interface IEscalation extends Document {
  query: string;
  userEmail: string;
  createdAt: Date;
}

const escalationSchema = new Schema<IEscalation>({
  query: { type: String, required: true },
  userEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<IEscalation>('Escalation', escalationSchema);