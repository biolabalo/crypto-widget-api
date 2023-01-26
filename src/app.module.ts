import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ExchangeRateModule } from './exchange-rate/exchange-rate.module';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    MongooseModule.forRoot(process.env.DATABASE_URL),
    ScheduleModule.forRoot(),
    ExchangeRateModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

/*
 * root module. The root module is the starting point Nest uses 
 * to build the application graph - the internal data structure Nest 
 * uses to resolve module and provider relationships and dependencies
*/
export class AppModule {}
