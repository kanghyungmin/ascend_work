import { StrategyData, TradeData } from 'libs/libs.interface';
import { IDataService } from '../common/data.interface';
import { DataSource } from '../common/enum';
import { Spot } from '@binance/connector';
import { State, Side } from 'libs/libs.enum';
import axios from 'axios';

export interface element {
  bid: string;
  bidQty: string;
  ask: string;
  askQty: string;
}

export class BinanceDataService implements IDataService {
  private name = DataSource.BINANCE;
  private readonly numStrategies = 101;
  private readonly tickDatanums = 121;
  private apiKey = process.env.BINANCE_APIKEY;
  private apiSecret = process.env.BINANCE_SECRETKEY;
  private bidAskInfo: element[] = new Array();
  private tickData: element = null;
  private socketClinet = new Spot(this.apiKey, this.apiSecret, {
    wsURL: 'wss://testnet.binance.vision', // If optional base URL is not provided, wsURL defaults to wss://stream.binance.com:9443
  });
  private resultChkStr: Map<string, StrategyData> = new Map();
  constructor() {
    this.open();
  }
  public gettickData() {
    if (this.tickData) return this.tickData;
    else return 'no tick';
  }
  public open() {
    const callbacks = {
      open: this._open.bind(this),
      close: this._close.bind(this),
      message: this._onMessage.bind(this),
    };

    this.socketClinet.tickerWS('btcusdt', callbacks);
    this.checkTrading();
  }
  private _open() {
    console.log('socket opened');
  }
  private _close() {
    console.log('socket closed');
  }
  private async checkTrading() {
    const checkFun = async () => {
      // let start = new Date().getTime();
      if (this.tickData) {
        this.bidAskInfo.push(this.tickData);
        if (this.bidAskInfo.length == this.tickDatanums) {
          this.bidAskInfo.shift();
          //전략에 기반하여 trade 여부 결정.this.resultChkStr 변수 참조
          this.calStrategy(this.tickData.ask, this.tickData.bid);
          await this.callTradeAPI();
        }
      }
      // console.log(`elapsed time : ${new Date().getTime() - start}`);
    };

    setInterval(checkFun, 1000); // 1분
  }
  private async _onMessage(data) {
    const { b, B, a, A } = JSON.parse(data); //데이터 추출
    this.tickData = { bid: b, bidQty: B, ask: a, askQty: A };
  }
  private async callTradeAPI() {
    let element: StrategyData;
    let tradeId: string;
    let promises: Promise<{ status: string }>[] = [];
    let postData: TradeData & { tradeId: string };

    for (let i = 0; i < this.numStrategies; i++) {
      tradeId = `Strategy-(${i + 10})`;
      element = this.resultChkStr.get(tradeId);
      if (element.execution) {
        const { price, qty, side } = element.tradeData;
        postData = {
          price,
          qty,
          side,
          tradeId,
        };
        promises.push(
          axios.post(
            `http://${process.env.ALB_DNS_NAME}:${process.env.TRADE_PORT}/trade`,
            postData,
          ),
        ); //trade promise 생성
        element.execution = false; //reinit
        this.resultChkStr.set(tradeId, element);
      }
    }
    await Promise.all(promises);
  }
  private getMVfilter(num: number) {
    let sum = 0;
    for (let i = 0; i < num; i++) {
      sum += Number(this.bidAskInfo[i].bid);
    }
    return sum / num;
  }
  private calStrategy(askPrice: string, bidPrice: string) {
    //init
    if (this.resultChkStr.size == 0) {
      for (let i = 0; i < this.numStrategies; i++) {
        this.resultChkStr.set(`Strategy-(${i + 10})`, {
          state: null,
          execution: false,
          tradeData: null,
        });
      }
    }
    // golden cross : 단기 MA가 장기 MA를 돌파하고 올라갈 때. 그럼 그전은 단기 MA < 장기 MA
    // dead cross :단기 MA가 장기 MA를 뚫고 내려갈 때, 그럼 그전은 단기 MA > 장기 MA
    for (let i = 0; i < this.numStrategies; i++) {
      const key = `Strategy-(${i + 10})`;
      const [shortMA, longMA] = [
        this.getMVfilter(i + 10),
        this.getMVfilter(i + 20),
      ];
      let result = this.resultChkStr.get(key);
      if (result.state === null) {
        //// 변동성 체크 전, state 저장
        result.state =
          shortMA > longMA
            ? State.BIG_SHORT_MA_THAN_LONG_MA
            : State.BIG_LONG_MA_THAN_SHORT_MA;
        this.resultChkStr.set(key, result);
        break;
      } else {
        // Check Golden Cross or Dead Cross
        switch (result.state) {
          case State.BIG_SHORT_MA_THAN_LONG_MA: {
            if (shortMA < longMA) {
              result.execution = true;
              result.state = State.BIG_LONG_MA_THAN_SHORT_MA;
              result.tradeData = {
                price: bidPrice,
                qty: '1',
                side: Side.SELL,
              };
            }
            this.resultChkStr.set(key, result);
            break;
          }
          case State.BIG_LONG_MA_THAN_SHORT_MA: {
            if (shortMA > longMA) {
              result.execution = true;
              result.state = State.BIG_SHORT_MA_THAN_LONG_MA;
              result.tradeData = {
                price: askPrice,
                qty: '1',
                side: Side.BUY,
              };
            }
            this.resultChkStr.set(key, result);
            break;
          }
          default: {
            break;
          }
        }
      }
    }
  }
}
