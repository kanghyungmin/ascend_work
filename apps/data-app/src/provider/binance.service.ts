import { IDataService } from '../common/data.interface';
import { DataSource } from '../common/enum';

export class BinanceDataService implements IDataService {
  private name = DataSource.BINANCE;
  constructor() {
    console.log('bainace created');
  }
}
