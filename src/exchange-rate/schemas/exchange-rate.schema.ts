import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type RateDocument = Rate & Document;

@Schema()
export class Rate {
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
    extType: String;

}

export const RateSchema = SchemaFactory.createForClass(Rate);


