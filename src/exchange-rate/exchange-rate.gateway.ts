import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { ExchangeRateService } from './exchange-rate.service';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import { ExchangeType } from './interfaces/exchange-rate.interface';

const saveExchangeType = 'saveExchange';
const connected = 'connected';
const fetchExchange = 'fetchExchange';
const fetchExchangeViaFilter = "fetchExchangeViaFilter";


@WebSocketGateway(8001, { cors: '*' })
export class ExchangeRateGateway implements OnGatewayConnection {
  @WebSocketServer() server;
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  handleConnection(client) {
    /*
     * Automatically fired when client successfully establishes connection
     */
    client.on(connected, async () => {
      const limit = 5, page = 1;
      this.getExchangeAndEmitToClient({
        limit: Number(limit),
        page: Number(page),
      });
    });

    /*
     * Fired  either when the filter / pagination on the table is clicked
     */
    client.on(fetchExchangeViaFilter, async (data) => {
      const { page, limit, fromDate, toDate, type } = data;
      this.getExchangeAndEmitToClient({
        limit: Number(limit),
        page: Number(page),
        fromDate,
        toDate,
        type,
      });
    });

    /*
     * Fired when the client click on the save button to save an 'exchange'
     */
    client.on(saveExchangeType, async (data: CreateExchangeRateDto) => {
      this.saveExchangeAndEmitToClient(data);
    });
  }

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
    type?: ExchangeType;
  }) {
    const exchangeRateData = await this.exchangeRateService.findAll(query);
    return this.server.emit('allExchange', exchangeRateData);
  }
}
