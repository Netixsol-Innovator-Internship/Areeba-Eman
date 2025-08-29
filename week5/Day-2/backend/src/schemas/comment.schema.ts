import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type CommentDocument = Comment & Document

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  content: string

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  author: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Comment", default: null })
  parentComment: Types.ObjectId

  @Prop({ default: 0 })
  likesCount: number

  @Prop({ default: 0 })
  repliesCount: number
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
