import { Injectable,  Query  } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import {  GetAllExchangeRateDto } from './dto/get-all-exhange-rate.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { config } from 'dotenv';
import { ExchangeRateDocument , ExchangeRate} from './schemas/exchange-rate.schema'
config();

@Injectable()
export class ExchangeRateService {
  constructor(
    @InjectModel(ExchangeRate.name) private  exchangeRateModel: Model<ExchangeRateDocument>) {}
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

  async create(createExchangeRateDto: CreateExchangeRateDto): Promise<ExchangeRate> {
    return new this.exchangeRateModel(createExchangeRateDto).save()
  }

  async findAll(@Query() { page = 1, limit = 5, type, fromDate, toDate}: GetAllExchangeRateDto): Promise<ExchangeRateDocument[]> {
    const count = await this.exchangeRateModel.countDocuments({});
    const count_page = (count / limit).toFixed();
    const query = {};

    if (type) {
      query['type'] = type;
    }

    if (fromDate && toDate) {
      query['createdAt'] = { $gte: fromDate, $lte: toDate };
    } else if (fromDate) {
      query['createdAt'] = { $gte: fromDate };
    } else if (toDate) {
      query['createdAt'] = { $lte: toDate };
    }

    return await this.exchangeRateModel 
    .find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();;
  }
}
