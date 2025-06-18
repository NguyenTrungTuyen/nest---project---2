import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

export type TodoDocument = Todo & Document;

@Schema()
export class Todo {
@Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop()
  userName: string;

  @Prop()
  passWord: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
