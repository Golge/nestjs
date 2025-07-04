import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
export abstract class AbstractDocument {
  // Define common fields and methods for all schemas here
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;
}
