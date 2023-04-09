import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Hero, HeroById } from 'libs/grpc/interfaces/trade.interface';
import { TradeData } from 'libs/libs.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/trade')
  postTrade(@Body() tradeInfo: TradeData & { tradeId: string }): {
    status: string;
  } {
    console.log(tradeInfo);
    // orm 형성 &
    return {
      status: 'ok',
    };
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @GrpcMethod('TradeService', 'FindOne')
  findOne(
    data: HeroById,
    // metadata: Metadata,
    // call: ServerUnaryCall<any, any>,
  ): Hero {
    const items = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Doe' },
    ];

    return items.find(({ id }) => id === data.id);
  }
}
