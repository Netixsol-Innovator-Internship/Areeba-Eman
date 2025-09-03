import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true }) username: string;
  @Prop() fullName?: string;
  @Prop({ unique: true, sparse: true }) email?: string;
  @Prop({ required: true }) password: string;
  @Prop({ unique: true, sparse: true }) mobileNumber?: string;

  @Prop() nationality?: string;
  @Prop() idType?: string;
  @Prop() idNo?: string;
  @Prop() address1?: string;
  @Prop() address2?: string;
  @Prop() city?: string;
  @Prop() country?: string;
  @Prop() landline?: string;
  @Prop() poBox?: string;

  @Prop() trafficInformationType?: string;
  @Prop() trafficFileNo?: string;
  @Prop() plateState?: string;
  @Prop() plateCode?: string;
  @Prop() plateNumber?: string;
  @Prop() driverLicenseNumber?: string;
  @Prop() issueCity?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Car' }], default: [] })
  wishlist: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Car' }], default: [] })
  myCars: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Bid' }], default: [] })
  myBids: Types.ObjectId[];

  @Prop({ default: 'user' }) role: 'user' | 'admin';
}

export const UserSchema = SchemaFactory.createForClass(User);
