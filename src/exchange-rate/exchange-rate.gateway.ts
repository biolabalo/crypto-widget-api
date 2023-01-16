import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets';

@WebSocketGateway(8001, { cors: '*'})
export class ExchangeRateGateway {
  @WebSocketServer()
  server;
  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
     this.server.emt('message', message);
  }
}
