import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Analytic>;

@Schema()
export class Analytic {
  @ApiProperty()
  @Prop({ type: String, required: true })
  _id: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  title: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  question: string;

  @ApiProperty()
  @Prop({ type: Number, required: true })
  yes: number;

  @ApiProperty()
  @Prop({ type: Number, required: true })
  no: number;

  @ApiProperty()
  @Prop({ type: Number, required: true })
  created: number;
}

export const AnalyticSchema = SchemaFactory.createForClass(Analytic);
