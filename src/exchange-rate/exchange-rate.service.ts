import { Injectable } from '@nestjs/common';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';

@Injectable()
export class ExchangeRateService {
  create(createExchangeRateDto: CreateExchangeRateDto) {
    return 'This action adds a new exchangeRate';
  }

  findAll() {
    return `This action returns all exchangeRate`;
  }
}
