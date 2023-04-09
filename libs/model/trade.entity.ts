import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TradeDocument = Trade & Document;

@Schema({ timestamps: true })
export class Trade {
  @Prop({ required: true })
  price: string;

  @Prop({ requred: false })
  qty: string;

  @Prop({ requred: false })
  side: string;

  @Prop({ requred: false })
  tradeId: string;
}

export const TradeSchema = SchemaFactory.createForClass(Trade);
