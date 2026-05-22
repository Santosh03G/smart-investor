// src/hooks/useTicker.ts
import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { useTickerStore } from '../stores/useTickerStore';
import { RawTick, OhlcvCandle } from '../types/market';

export function useTicker(symbol: string) {
  const { setTick, pushCandle, subscribe, unsubscribe } = useTickerStore();

  useEffect(() => {
    subscribe(symbol);

    const unlistenTick   = listen<RawTick>('tick',          (e) => setTick(e.payload));
    const unlistenCandle = listen<OhlcvCandle>('candle_update', (e) => pushCandle(e.payload));

    return () => {
      unsubscribe(symbol);
      unlistenTick.then(fn => fn());
      unlistenCandle.then(fn => fn());
    };
  }, [symbol, setTick, pushCandle, subscribe, unsubscribe]);
}
