import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({type: String ,ref: 'User', required: true })
  userId: { type: String }  

  @Prop({ required: true })
  chatId: string; 

 @Prop({
  type: [
    {
      question: { type: String, required: true },
      answer: { type: MongooseSchema.Types.Mixed, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  default: [],
  })
  messages: {
    question: string;
    answer: any;
    createdAt: Date;
  }[];

    @Prop()
  createdAt: Date; 

  @Prop()
  updatedAt: Date; 

}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
