import { Injectable } from '@nestjs/common';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { config } from 'dotenv';
config();

console.log(process.env.CONFIGURABLE_CRON_TIME, '.........', process.env.DATABASE_URL)
@Injectable()
export class ExchangeRateService {
  /*
   * cron job is invoked once the application server start
   * which at a set time calls the fetchRatesAndStreamToClients method
   * the time  can be set from the .env file
   */
  @Cron(process.env.CONFIGURABLE_CRON_TIME)
  handleCron() {
    return this.fetchRatesAndStreamToClients();
  }

  async fetchRatesAndStreamToClients() {
    console.log('cron job running....');
  }

  create(createExchangeRateDto: CreateExchangeRateDto) {
    return 'This action adds a new exchangeRate';
  }

  findAll() {
    return `This action returns all exchangeRate`;
  }
}
