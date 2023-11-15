import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  name: string;
  @Prop()
  lastname: string;
  @Prop({
    unique: true,
  })
  email: string;
  @Prop()
  password: string;
  @Prop()
  date: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
