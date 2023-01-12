export type ExchangeType = 'live_price' | 'exchanged' ;

export interface IExchange {
  id: string;
  timestamp: Date;
  currencyFrom: string;
  amountFrom: number;
  currencyTo: string;
  amountTo: number;
  type: ExchangeType;
}
