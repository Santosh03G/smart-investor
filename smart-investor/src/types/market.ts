export type Exchange = 'Kraken' | 'HyperLiquid' | 'Zerodha' | 'Dhan'
                     | 'Upstox' | 'Alpaca' | 'IBKR' | 'Yahoo';

export interface RawTick {
  symbol:       string;
  exchange:     Exchange;
  price:        number;
  volume:       number;
  timestamp_ms: number;
}

export interface OhlcvCandle {
  symbol:    string;
  timeframe: string;
  open:      number;
  high:      number;
  low:       number;
  close:     number;
  volume:    number;
  time:      number;   // Unix seconds
}

export type OrderSide   = 'Buy' | 'Sell';
export type OrderType   = 'Market' | 'Limit' | 'StopLoss' | 'BracketOrder' | 'GTT';
export type OrderStatus = 'Pending' | 'Open' | 'Filled' | 'Cancelled' | 'Rejected';

export interface Order {
  id:           string;
  symbol:       string;
  exchange:     Exchange;
  side:         OrderSide;
  order_type:   OrderType;
  quantity:     number;
  price?:       number;
  status:       OrderStatus;
  timestamp_ms: number;
}
