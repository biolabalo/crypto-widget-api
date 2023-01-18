import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { ExchangeRateService } from './exchange-rate.service';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';

const saveExchangeType = 'saveExchange';
const logger = () => console.log('client has connected succesfully');
const connected = 'connected';

@WebSocketGateway(8001, { cors: '*' })
export class ExchangeRateGateway implements OnGatewayConnection {
  @WebSocketServer() server;
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  private async saveExchangeAndEmitToClient(data: CreateExchangeRateDto) {
    const newExchangeRateData = await this.exchangeRateService.create(data);
    if (newExchangeRateData)
      return this.server.emit('newExchange', newExchangeRateData);
  }

  private async getExchangeAndEmitToClient(query: {
    limit: number;
    page: number;
    fromDate?: Date;
    toDate?: Date;
  }) {
    const exchangeRateData = await this.exchangeRateService.findAll(query);
    return this.server.emit('allExchange', exchangeRateData);
  }

  handleConnection(client, request) {
    const limit  = 5, page  = 1
    client.on(connected, async () => {
      this.getExchangeAndEmitToClient({
        limit: Number(limit),
        page: Number(page),
      });
    });

    client.on(saveExchangeType, async (data: CreateExchangeRateDto) => {
      this.saveExchangeAndEmitToClient(data);
    });
  }
}
