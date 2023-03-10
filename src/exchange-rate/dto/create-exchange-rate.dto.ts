import {
    IsNumber,
    IsString,
    MinLength,
    Matches,
    IsOptional,
  } from 'class-validator';

import { ExchangeType } from '../interfaces/exchange-rate.interface';

export class CreateExchangeRateDto {

  @IsString()
  @MinLength(2)
  @Matches('^[A-Z]*$')
  currencyFrom: string;

  @IsNumber()
  amountFrom: number;

  @IsString()
  @MinLength(2)
  @Matches('^[A-Z]*$')
  currencyTo: string;

  @IsNumber()
  amountTo: number;

  @IsString()
  @IsOptional()
  type?: ExchangeType;
}
