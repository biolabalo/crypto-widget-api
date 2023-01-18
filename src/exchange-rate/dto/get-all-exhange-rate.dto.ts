import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ExchangeType } from '../interfaces/exchange-rate.interface';


export class GetAllExchangeRateDto {
    @IsNotEmpty()
    page: number;
  
    @IsNotEmpty()
    limit: number;

    @IsString()
    @IsOptional()
    type?: ExchangeType;

    @IsOptional()
     fromDate?: Date

   @IsOptional()
     toDate?: Date
  }