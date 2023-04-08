import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ItradeRPC } from 'libs/grpc/interfaces/trade.interface';
import { Observable } from 'rxjs';

@Injectable()
export class TradeService implements OnModuleInit {
  constructor(
    @Inject('TRADE_RPC_CLIENT') private readonly client: ClientGrpc,
  ) {}
  onModuleInit() {}

  getTrade(): Observable<string> {
    const rpc = this.client
      .getService<ItradeRPC>('TradeService')
      .findOne({ id: 1 });
    return rpc;
  }
}
