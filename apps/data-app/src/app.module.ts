import { Module } from '@nestjs/common';
import { DataAppController } from './app.controller';
import { DataAppService } from './app.service';
import { ConfigModule } from 'libs/module/config/config.module';
import { DataService } from './service/data.service';
import { BinanceDataService } from './provider/binance.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { TradeService } from './service/trade.service';

@Module({
  imports: [
    ConfigModule.register({ envPath: 'envs/data/.env' }),
    ClientsModule.register([
      {
        name: 'TRADE_RPC_CLIENT',
        transport: Transport.GRPC,
        options: {
          url: `${process.env.ALB_DNS_NAME}:${process.env.GRPC_TRADE_PORT}`,
          package: 'trade',
          protoPath: join(__dirname, '../../../libs/grpc/proto/trade.proto'),
        },
      },
    ]),
  ],
  controllers: [DataAppController],
  providers: [DataAppService, DataService, BinanceDataService, TradeService],
})
export class DataAppModule {}
