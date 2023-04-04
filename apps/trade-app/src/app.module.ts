import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from 'libs/module/config/config.module';

@Module({
  imports: [ConfigModule.register({ envPath: 'envs/trade/.env' })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
