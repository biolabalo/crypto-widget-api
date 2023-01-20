import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRate, ExchangeRateSchema } from './schemas/exchange-rate.schema';
import { ExchangeRateGateway } from './exchange-rate.gateway';

@Module({
  imports: [ MongooseModule.forFeature([{ name: ExchangeRate.name, schema: ExchangeRateSchema }]),],
  controllers: [],
  providers: [ExchangeRateService, ExchangeRateGateway ]
})
export class ExchangeRateModule {}
