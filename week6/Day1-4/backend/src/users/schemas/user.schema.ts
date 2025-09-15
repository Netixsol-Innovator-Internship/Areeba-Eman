import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../common/enums/role.enum';
export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User {
  @Prop({ default: 'local' })
  provider: string; // 'google' | 'github' | 'discord' | 'local'
  @Prop()
  providerId: string;
  @Prop()
  avatar: string;
  @Prop([{ provider: String, providerId: String }])
  linkedAccounts: { provider: string; providerId: string }[];
  @Prop({unique: true, lowercase: true, trim: true }) username?: string;
  @Prop({ required: true, unique: true, lowercase: true, trim: true }) email: string;
  @Prop() password?: string;
  @Prop({ required: true }) fullName: string;
  @Prop({ type: [String], enum: Object.values(Role), default: [Role.USER] }) roles: Role[];
  @Prop({ default: false }) verified: boolean;
  @Prop() otpCode?: string;
  @Prop() otpExpiresAt?: Date;
  @Prop() lastOtpSentAt?: Date;
  @Prop() resetOtpCode?: string;
  @Prop() resetOtpExpiresAt?: Date;
  @Prop({ default: 0 }) otpResendCount?: number;
  @Prop() otpResendWindowStart?: Date;
  @Prop({ default: false }) isDeleted?: boolean;
  @Prop({ default: 0 }) loyaltyPoints: number; // NEW: Loyalty Points
}
export const UserSchema = SchemaFactory.createForClass(User);
