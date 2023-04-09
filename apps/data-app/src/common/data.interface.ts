import { element } from '../provider/binance.service';

export interface IDataService {
  gettickData: () => element | string;
}
