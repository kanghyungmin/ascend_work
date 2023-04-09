import { Controller, Get, Inject } from '@nestjs/common';
import { DataAppService } from './app.service';
import { element } from './provider/binance.service';
import { DataService } from './service/data.service';
import { TradeService } from './service/trade.service';

@Controller()
export class DataAppController {
  constructor(
    @Inject(DataService) private readonly datasources: DataService,
    private readonly tradeSvc: TradeService,
    private readonly dataAppService: DataAppService,
  ) {}

  @Get()
  getHello(): string {
    return this.dataAppService.getHello();
  }

  @Get('/tickdata')
  gettickData(): string | element {
    return this.datasources.gettickData();
  }

  @Get('/test')
  getTest() {
    return this.tradeSvc.getTrade();
  }
}
