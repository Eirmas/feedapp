import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Analytic>;

@Schema()
export class Analytic {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  question: string;

  @Prop({ type: Number, required: true })
  yes: number;

  @Prop({ type: Number, required: true })
  no: number;

  @Prop({ type: Number, required: true })
  created: number;
}

export const AnalyticSchema = SchemaFactory.createForClass(Analytic);
