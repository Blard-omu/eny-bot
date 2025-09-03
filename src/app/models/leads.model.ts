import { Schema, model, Document } from 'mongoose';

interface ILead extends Document {
  email: string;
  query: string;
  createdAt: Date;
}

const leadSchema = new Schema<ILead>({
  email: { type: String, required: true },
  query: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<ILead>('Lead', leadSchema);