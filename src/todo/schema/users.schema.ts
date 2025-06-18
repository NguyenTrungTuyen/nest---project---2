import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

export type TodoDocument = Todo & Document;

@Schema()
export class Todo {
@Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  gender: string;

  @Prop({ required: false })
  old: number;

  @Prop({ required: true })
  pass: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
