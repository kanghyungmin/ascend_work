import { Module } from '@nestjs/common';
import { DataAppController } from './data-app.controller';
import { DataAppService } from './data-app.service';

@Module({
  imports: [],
  controllers: [DataAppController],
  providers: [DataAppService],
})
export class DataAppModule {}
