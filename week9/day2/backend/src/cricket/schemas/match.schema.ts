import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Match {
  @Prop() team: string;
  @Prop() score: string;
  @Prop() overs: string;
  @Prop() rpo: string;
  @Prop() lead: string;
  @Prop() inns: string;
  @Prop() result: string;
  @Prop() opposition: string;
  @Prop() ground: string;
  @Prop() start_date: string;
  @Prop() type: string;
}

export type MatchDocument = Match & Document;
export const MatchSchema = SchemaFactory.createForClass(Match);
