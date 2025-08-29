import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type LikeDocument = Like & Document

@Schema({ timestamps: true })
export class Like {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  user: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Comment", required: true })
  comment: Types.ObjectId
}

export const LikeSchema = SchemaFactory.createForClass(Like)

// Compound index to prevent duplicate likes
LikeSchema.index({ user: 1, comment: 1 }, { unique: true })
