import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExchangeRateModule } from './exchange-rate/exchange-rate.module';

@Module({
  imports: [ExchangeRateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
