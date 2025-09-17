import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class Cv extends Document {
  @Prop({ required: true })
  userId: string

  @Prop()
  title: string

  @Prop()
  photoUrl: string

  @Prop({ type: Object })
  personal: Record<string, any>

  @Prop({ type: Array })
  education: Record<string, any>[]

  @Prop({ type: Array })
  experience: Record<string, any>[]

  @Prop({ type: [String] })
  skills: string[]

  // 🆕 Added new fields

  @Prop()
  summary: string

  @Prop({ type: [String] })
  languages: string[]

  @Prop({ type: [String] })
  awards: string[]

  @Prop({ type: [String] })
  certificates: string[]

  @Prop({ type: [String] })
  interests: string[]

  @Prop({ type: Array })
  projects: Record<string, any>[]

  @Prop({ type: Array })
  publications: Record<string, any>[]

  @Prop({ type: Array })
  volunteering: Record<string, any>[]
}

export const CvSchema = SchemaFactory.createForClass(Cv)
