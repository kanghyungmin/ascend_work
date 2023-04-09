import { Side, State } from './libs.enum';

export interface TradeData {
  price: string;
  qty: string;
  side: Side;
}

export interface StrategyData {
  state: State | null;
  execution: boolean;
  tradeData: TradeData | null;
}
