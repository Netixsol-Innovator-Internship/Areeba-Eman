import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document, Types } from "mongoose"

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ default: "" })
  bio: string

  @Prop({ default: "" })
  profilePicture: string

  @Prop({ default: 0 })
  followersCount: number

  @Prop({ default: 0 })
  followingCount: number
}
export type UserDocument = User & Document & { _id: Types.ObjectId }
export const UserSchema = SchemaFactory.createForClass(User)
