import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Hero, HeroById } from 'libs/grpc/interfaces/trade.interface';
import { TradeData } from 'libs/libs.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trade, TradeSchema } from 'libs/model/trade.entity';
import { Side } from 'libs/libs.enum';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectModel(Trade.name)
    private readonly tradeModel: Model<Trade>,
  ) {}

  @Post('/trade')
  async postTrade(@Body() tradeInfo: TradeData & { tradeId: string }): Promise<{
    status: string;
  }> {
    await this.tradeModel.create({
      tradeId: tradeInfo.tradeId,
      price: tradeInfo.price,
      qty: tradeInfo.qty,
      side: tradeInfo.side == Side.BUY ? 'BUY' : 'SELL',
    });

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
