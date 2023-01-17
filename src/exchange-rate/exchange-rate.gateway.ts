import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  MessageBody,
} from '@nestjs/websockets';
import { ExchangeRateService } from './exchange-rate.service';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';


const saveExchangeType = 'saveExchange'
const logger = () =>  console.log( 'client has connected succesfully')


@WebSocketGateway(8001, { cors: '*' })
export class ExchangeRateGateway implements OnGatewayConnection {
  @WebSocketServer() server;
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

   async saveExchangeAndEmitToClient (data: CreateExchangeRateDto){
    const newExchangeRateData =  await this.exchangeRateService.create(data);
    if(newExchangeRateData) return this.server.emit('newExchange', newExchangeRateData);
}

  handleConnection(client) {
    client.on('connected', logger);

    client.on(saveExchangeType, this.saveExchangeAndEmitToClient);
  }
}
