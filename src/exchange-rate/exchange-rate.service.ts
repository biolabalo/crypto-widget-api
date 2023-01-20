import { Injectable, Query } from '@nestjs/common';
import { ExchangeRateGateway } from './exchange-rate.gateway';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import { GetAllExchangeRateDto } from './dto/get-all-exhange-rate.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { config } from 'dotenv';
import {
  ExchangeRateDocument,
  ExchangeRate,
} from './schemas/exchange-rate.schema';
import { ExchangeType } from './interfaces/exchange-rate.interface';

config();

@Injectable()
export class ExchangeRateService {
  constructor(
    @InjectModel(ExchangeRate.name)
    private exchangeRateModel: Model<ExchangeRateDocument>,
  ) // private  exchangeRateGateway: ExchangeRateGateway
  {}
 
  async fetchRates() {
    const response = await this.getExternalRate();

    if (!response.length) return '';

    const createExchangeRateDtos = response.map((r) => {
      return {
        currencyFrom: r.currencyFrom,
        amountFrom: r.amountFrom,
        currencyTo: r.currencyTo,
        amountTo: r.amountTo,
        type: r.type as ExchangeType,
      };
    });

    const savedLivePrices = await this.createMany(createExchangeRateDtos);

     return savedLivePrices
  }

  async getExternalRate() {
    var options = {
      method: 'GET',
      hostname: 'rest.coinapi.io',
      headers: { 'X-CoinAPI-Key': process.env.XCoinAPIKey },
    };
    const urls = [
      'https://rest.coinapi.io/v1/exchangerate/BTC/USD',
      'https://rest.coinapi.io/v1/exchangerate/ETH/USD',
      'https://rest.coinapi.io/v1/exchangerate/BTC/EUR',
    ];

    const extractData = (response) => {
      return {
        currencyFrom: response.data.asset_id_base,
        amountFrom: 1,
        currencyTo: response.data.asset_id_quote,
        amountTo: response.data.rate,
        type: 'live_price',
      };
    };

    const makeAPIcall = async () => {
      try {
        const responses = await Promise.all(
          urls.map((url) => axios.get(url, options)),
        );
        const dataArray = responses.map((response) => extractData(response));
        return dataArray;
      } catch (error) {
        console.log(error);
        return [];
      }
    };

    return makeAPIcall();
  }

  async create(
    createExchangeRateDto: CreateExchangeRateDto,
  ): Promise<ExchangeRate> {
    return new this.exchangeRateModel(createExchangeRateDto).save();
  }

  async createMany(
    createExchangeRateDtos: CreateExchangeRateDto[],
  ): Promise<ExchangeRate[]> {
    const exchangeRates = createExchangeRateDtos.map(
      (exchangeRateDto) => new this.exchangeRateModel(exchangeRateDto),
    );
    return this.exchangeRateModel.insertMany(exchangeRates);
  }

  async findAll(
    { page = 1, limit = 5, type, fromDate, toDate }: GetAllExchangeRateDto,
    isPaginated: boolean,
  ) {
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

    return isPaginated ? { data, count, page } : { data, count };
  }
}
