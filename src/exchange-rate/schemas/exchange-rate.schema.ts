import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type ExchangeRateDocument = ExchangeRate & Document;

@Schema()
export class ExchangeRate {
    @Prop({ required:true })
    amountFrom: Number;
    

    @Prop({required:true})
    currencyFrom: String;

    @Prop({required:true})
    amountTo: Number;

    @Prop({required:true})
    currencyTo: String;

    @Prop({ default: Date.now})
    createdAt: Date;

    @Prop({ default: "live_price" , enum: ['live_price', 'exchanged'], required:true})
    type: String;

}

export const ExchangeRateSchema = SchemaFactory.createForClass(ExchangeRate);


