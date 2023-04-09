import { Inject } from '@nestjs/common';
import { BinanceDataService } from '../provider/binance.service';
import { IDataService } from '../common/data.interface';

export class DataService {
  constructor(
    @Inject(BinanceDataService) private readonly datasources: IDataService,
  ) {
    console.log('datasources', datasources);
  }

  gettickData() {
    return this.datasources.gettickData();
  }
}
