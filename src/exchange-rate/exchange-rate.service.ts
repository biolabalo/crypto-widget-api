import { Injectable, Query } from '@nestjs/common';
import axios from 'axios';
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

  async getRatesByCurrency(
    currencyBase = 'BTC',
    currencies = ['USD', 'EUR', 'GBP'],
  ): Promise<CreateExchangeRateDto[]> {
    const apiUrl = 'https://rest.coinapi.io/v1/exchangerate';
    const apiKey =  '57C9E701-2251-4E2D-9673-8E40BDF20240';
 
    return axios
      .get(`${apiUrl}/${currencyBase}`, {
        headers: {
          'X-CoinAPI-Key': apiKey,
        },
        params: {
          invert: false,
          filter_asset_id: currencies.join(),
        },
      })
      .then(({ data: { asset_id_base = '', rates = [] } }) =>
        rates?.map((rate) => ({
          currencyFrom: asset_id_base,
          amountFrom: 1,
          currencyTo: rate?.asset_id_quote,
          amountTo: rate?.rate,
          type: 'live_price',
        })),
      )
      .catch((err) => {
        console.log('Error to get rate in external API: ' + err.message);
        return [];
      });
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
  }: GetAllExchangeRateDto, isPaginated: boolean) {
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

    return isPaginated ? { data, count, page } :  { data, count };
  }
}
