import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Cron } from '@nestjs/schedule';
import { ExchangeRateService } from './exchange-rate.service';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import { ExchangeType } from './interfaces/exchange-rate.interface';

const fetchPaginatedExchange = 'fetchPaginatedExchange';
const saveExchangeType = 'saveExchange';
const connected = 'connected';
const filteredExchange = 'filteredExchange';
const general = 'general';
const fetchExchangeViaFilter = 'fetchExchangeViaFilter';
const paginatedExchanges = 'paginatedExchanges';
const allExchange = 'allExchange';
const newExchange = 'newExchange';
const liveExchange = 'liveExchange'

@WebSocketGateway(8001, { cors: '*' })
export class ExchangeRateGateway implements OnGatewayConnection {
  @WebSocketServer() server;
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  /*
   * cron job is invoked once the application server start
   * which at a set time calls the fetchRatesAndStreamToClients method
   * the time  can be set from the .env file
   */
  @Cron(process.env.CONFIGURABLE_CRON_TIME)
   async handleCron() {
    const liveExchangeData = await this.exchangeRateService.fetchRates();
    if(liveExchangeData) return this.server.emit(liveExchange, liveExchangeData);
   
  }

  handleConnection(client) {
    /*
     * Automatically fired when client successfully establishes connection
     */
    client.on(connected, async () => {
      const limit = 5,
        page = 1;
      this.getExchangeAndEmitToClient({
        limit: Number(limit),
        page: Number(page),
      });
    });

    /*
     * Fired  either when the filter on the table is clicked
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
     * Fired  either when the pagination on the table is clicked
     */
    client.on(fetchPaginatedExchange, async (data) => {
      const { pageResultType } = data;

      if (pageResultType === general) {
        const { page, limit } = data;
        this.getExchangeAndEmitToClientPaginated({
          limit: Number(limit),
          page: Number(page),
        });
      }

      if (pageResultType === filteredExchange) {
        const { page, limit, fromDate, toDate, type } = data;
        this.getExchangeAndEmitToClientPaginated({
          limit: Number(limit),
          page: Number(page),
          fromDate,
          toDate,
          type,
        });
      }
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
      return this.server.emit(newExchange, newExchangeRateData);
  }

  private async getExchangeAndEmitToClient(query: {
    limit: number;
    page: number;
    fromDate?: Date;
    toDate?: Date;
    type?: ExchangeType;
  }) {
    const exchangeRateData = await this.exchangeRateService.findAll(
      query,
      false,
    );
    return this.server.emit(allExchange, exchangeRateData);
  }

  private async getExchangeAndEmitToClientPaginated(query: {
    limit: number;
    page: number;
    fromDate?: Date;
    toDate?: Date;
    type?: ExchangeType;
  }) {
    const exchangeRateData = await this.exchangeRateService.findAll(
      query,
      true,
    );
    return this.server.emit(paginatedExchanges, exchangeRateData);
  }
}
