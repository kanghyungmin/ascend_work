import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from 'libs/module/config/config.module';
import { DBconnectionMoudle } from 'libs/module/db/connection.module';
import { DBconnectionService } from 'libs/module/db/connection.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Trade, TradeSchema } from 'libs/model/trade.entity';

@Module({
  imports: [
    ConfigModule.register({ envPath: 'envs/trade/.env' }),
    DBconnectionMoudle,
    MongooseModule.forRootAsync({
      connectionName: process.env.REPL_MONGO_DB,
      inject: [DBconnectionService],
      useFactory: async (dbSvc: DBconnectionService) => dbSvc.getMongoConfig(),
    }),
    MongooseModule.forFeature(
      [{ name: Trade.name, schema: TradeSchema }],
      process.env.REPL_ADMIN_MONGO_DB,
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
