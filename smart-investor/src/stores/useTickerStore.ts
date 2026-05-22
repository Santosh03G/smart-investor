// src/stores/useTickerStore.ts
import { create } from 'zustand';
import { RawTick, OhlcvCandle } from '../types/market';

interface TickerState {
  ticks:       Record<string, RawTick>;      // keyed by symbol
  candles:     Record<string, OhlcvCandle[]>; // keyed by "symbol:timeframe"
  subscriptions: Set<string>;
  setTick:     (tick: RawTick) => void;
  pushCandle:  (candle: OhlcvCandle) => void;
  subscribe:   (symbol: string) => void;
  unsubscribe: (symbol: string) => void;
}

export const useTickerStore = create<TickerState>((set) => ({
  ticks:         {},
  candles:       {},
  subscriptions: new Set(),
  setTick: (tick) => set((s) => ({
    ticks: { ...s.ticks, [tick.symbol]: tick }
  })),
  pushCandle: (candle) => set((s) => {
    const key = `${candle.symbol}:${candle.timeframe}`;
    const prev = s.candles[key] ?? [];
    const last = prev[prev.length - 1];
    const updated = last?.time === candle.time
      ? [...prev.slice(0, -1), candle]
      : [...prev, candle];
    return { candles: { ...s.candles, [key]: updated } };
  }),
  subscribe:   (symbol) => set((s) => ({ subscriptions: new Set([...s.subscriptions, symbol]) })),
  unsubscribe: (symbol) => set((s) => {
    const next = new Set(s.subscriptions);
    next.delete(symbol);
    return { subscriptions: next };
  }),
}));
