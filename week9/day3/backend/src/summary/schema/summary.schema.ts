import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document , Types} from 'mongoose';

@Schema({ timestamps: true })
export class Summary extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  chatId: string;

  @Prop({ required: true })
  summary: string;
}

export const SummarySchema = SchemaFactory.createForClass(Summary);
