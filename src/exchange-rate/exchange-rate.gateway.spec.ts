import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRateGateway } from './exchange-rate.gateway';

describe('ExchangeRateGateway', () => {
  let gateway: ExchangeRateGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangeRateGateway],
    }).compile();

    gateway = module.get<ExchangeRateGateway>(ExchangeRateGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
