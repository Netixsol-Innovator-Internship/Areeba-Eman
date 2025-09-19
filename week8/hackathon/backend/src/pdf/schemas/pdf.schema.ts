// src/pdf/schemas/pdf.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PdfDoc extends Document {
  @Prop()
  filename: string;

  @Prop()
  text: string;

  @Prop()
  summary: string;

  @Prop([String])
  highlights: string[];

  @Prop()
  category: string;
}

export const PdfDocSchema = SchemaFactory.createForClass(PdfDoc);
