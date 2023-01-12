import {
    IsNumber,
    IsString,
    MinLength,
    MaxLength,
    Matches,
    IsOptional,
  } from 'class-validator';

  import { ExchangeType } from '../interfaces/exchange-rate.interface';

export class CreateExchangeRateDto {

  @IsString()
  @MinLength(2)
  @MaxLength(5)
  @Matches('^[A-Z]*$')
  currencyFrom: string;

  @IsNumber()
  amountFrom: number;

  @IsString()
  @MinLength(2)
  @MaxLength(5)
  @Matches('^[A-Z]*$')
  currencyTo: string;

  @IsNumber()
  amountTo: number;

  @IsString()
  @IsOptional()
  type?: ExchangeType;
}
