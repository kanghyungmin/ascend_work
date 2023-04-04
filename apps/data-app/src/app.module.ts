import { Module } from '@nestjs/common';
import { DataAppController } from './app.controller';
import { DataAppService } from './app.service';
import { ConfigModule } from 'libs/module/config/config.module';
import { DataService } from './service/data.service';
import { BinanceDataService } from './provider/binance.service';

@Module({
  imports: [ConfigModule.register({ envPath: 'envs/data/.env' })],
  controllers: [DataAppController],
  providers: [DataAppService, DataService, BinanceDataService],
})
export class DataAppModule {}
