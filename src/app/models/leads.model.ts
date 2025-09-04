import { Schema, model, Document } from "mongoose";

export interface ILead extends Document {
  email: string;
  query: string;
  assignedTo?: string;
  status: "new" | "assigned" | "in_progress" | "closed";
  createdAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    email: { type: String, required: true },
    query: { type: String, required: true },
    assignedTo: { type: String, default: null }, 
    status: { 
      type: String, 
      enum: ["new", "assigned", "in_progress", "closed"], 
      default: "new" 
    },
  },
  { timestamps: true }
);

export default model<ILead>("Lead", leadSchema);
