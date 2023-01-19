import { Injectable, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {  Model } from 'mongoose';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import { GetAllExchangeRateDto } from './dto/get-all-exhange-rate.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { config } from 'dotenv';
import {
  ExchangeRateDocument,
  ExchangeRate,
} from './schemas/exchange-rate.schema';
config();

@Injectable()
export class ExchangeRateService {
  constructor(
    @InjectModel(ExchangeRate.name)
    private exchangeRateModel: Model<ExchangeRateDocument>,
  ) {}
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

  async create(
    createExchangeRateDto: CreateExchangeRateDto,
  ): Promise<ExchangeRate> {
    return new this.exchangeRateModel(createExchangeRateDto).save();
  }

  async findAll({
    page = 1,
    limit = 5,
    type,
    fromDate,
    toDate,
  }: GetAllExchangeRateDto) {
    console.log(fromDate, toDate,)
    let query = {};
    let countQuery = [];
    let dateQuery = [];

    if (type) {
      countQuery.push({ type: type });
    }

    if (fromDate) {
      dateQuery.push({ createdAt: { $gte: fromDate } });
    }
    if (toDate) {
      dateQuery.push({ createdAt: { $lte: toDate } });
    }
    if (dateQuery.length > 0) {
      countQuery.push({ $and: dateQuery });
    }

    let count: number;
    if (countQuery.length) {
      count = await this.exchangeRateModel.countDocuments({ $and: countQuery });
    } else {
      count = await this.exchangeRateModel.countDocuments({});
    }

    if (type) {
      query['type'] = type;
    }

    if (dateQuery.length > 0) {
      query['$and'] = dateQuery;
    }

    const data = await this.exchangeRateModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return { data, count };
  }
}
