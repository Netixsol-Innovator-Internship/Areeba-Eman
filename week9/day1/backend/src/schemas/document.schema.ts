import { Schema, Document } from 'mongoose';

export interface ResearchDoc extends Document {
  title: string;
  topic: string;
  content: string;
  createdAt: Date;
}

export const DocumentSchema = new Schema<ResearchDoc>({
  title: String,
  topic: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});
