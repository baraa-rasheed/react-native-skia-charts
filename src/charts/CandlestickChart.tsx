import React, { useMemo } from 'react';
import { Group, Line, Rect, vec } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import { Frame } from '../Frame';
import { useProgress } from '../animation';
import { extent, linear } from '../scale';
import type { BaseChartProps } from '../types';

export interface OHLC { open: number; high: number; low: number; close: number }
export interface CandlestickChartProps extends BaseChartProps {
  data: OHLC[];
  /** `candle` draws bodies; `ohlc` draws open/close ticks. */
  variant?: 'candle' | 'ohlc';
  upColor?: string;
  downColor?: string;
}

export function CandlestickChart({ width, height, padding = 16, data, variant = 'candle', upColor = '#22C55E', downColor = '#EF4444', background, duration, animate }: CandlestickChartProps): React.JSX.Element {
  const progress = useProgress({ duration, animate }, [data]);
  const items = useMemo(() => {
    const [lo, hi] = extent(data.flatMap((d) => [d.low, d.high]));
    const sy = linear(lo, hi, height - padding, padding);
    const slot = (width - padding * 2) / Math.max(1, data.length);
    return data.map((d, i) => {
      const x = padding + slot * (i + 0.5); const w = slot * 0.6;
      const o = sy(d.open); const c = sy(d.close);
      return { x, w, hy: sy(d.high), ly: sy(d.low), o, c, color: d.close >= d.open ? upColor : downColor };
    });
  }, [data, width, height, padding, upColor, downColor]);
  const mid = height / 2;
  const transform = useDerivedValue(() => [{ translateY: mid * (1 - progress.value) }, { scaleY: progress.value }]);
  return (
    <Frame width={width} height={height} background={background}>
      <Group transform={transform} opacity={progress}>
        {items.map((it, i) => (
          <Group key={i} color={it.color}>
            <Line p1={vec(it.x, it.hy)} p2={vec(it.x, it.ly)} strokeWidth={1.5} />
            {variant === 'candle'
              ? <Rect x={it.x - it.w / 2} y={Math.min(it.o, it.c)} width={it.w} height={Math.max(1, Math.abs(it.c - it.o))} />
              : <Group><Line p1={vec(it.x - it.w / 2, it.o)} p2={vec(it.x, it.o)} strokeWidth={1.5} /><Line p1={vec(it.x, it.c)} p2={vec(it.x + it.w / 2, it.c)} strokeWidth={1.5} /></Group>}
          </Group>
        ))}
      </Group>
    </Frame>
  );
}
export const OHLCChart = (p: Omit<CandlestickChartProps, 'variant'>): React.JSX.Element => <CandlestickChart {...p} variant="ohlc" />;
