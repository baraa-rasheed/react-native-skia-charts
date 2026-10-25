import React, { useMemo } from 'react';
import { Group, RoundedRect } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import { Frame } from '../Frame';
import { useProgress } from '../animation';
import { extent, linear, stack } from '../scale';
import { colorAt, type BaseChartProps, type Series } from '../types';

export interface BarChartProps extends BaseChartProps {
  series: Series[];
  mode?: 'grouped' | 'stacked';
  horizontal?: boolean;
  /** Fraction of each category slot used by bars (0–1). */
  barRatio?: number;
  radius?: number;
}

interface Bar { x: number; y: number; w: number; h: number; color: string }

export function BarChart({
  width, height, padding = 16, series, mode = 'grouped', horizontal = false,
  barRatio = 0.7, radius = 4, background, duration, animate,
}: BarChartProps): React.JSX.Element {
  const progress = useProgress({ duration, animate }, [series, mode]);
  const { bars, base } = useMemo(() => {
    const raw = series.map((s) => s.data);
    const n = Math.max(1, ...raw.map((d) => d.length));
    const stacked = mode === 'stacked';
    const tops = stacked ? stack(raw) : raw;
    const [min, max] = extent(tops.flat(), true);
    const len = horizontal ? width : height;
    const cross = horizontal ? height : width;
    const v = horizontal ? linear(min, max, padding, len - padding) : linear(min, max, len - padding, padding);
    const zero = v(0);
    const slot = (cross - padding * 2) / n;
    const out: Bar[] = [];
    raw.forEach((data, si) => {
      const color = colorAt(si, series[si]?.color);
      data.forEach((value, i) => {
        const bw = stacked ? slot * barRatio : (slot * barRatio) / raw.length;
        const c0 = padding + i * slot + (slot - slot * barRatio) / 2 + (stacked ? 0 : si * bw);
        const hi = stacked ? (tops[si]?.[i] ?? 0) : value;
        const lo = stacked ? hi - value : 0;
        const a = v(lo); const b = v(hi);
        const s = Math.min(a, b); const e = Math.abs(b - a);
        out.push(horizontal ? { x: s, y: c0, w: e, h: bw, color } : { x: c0, y: s, w: bw, h: e, color });
      });
    });
    return { bars: out, base: zero };
  }, [series, mode, horizontal, width, height, padding, barRatio]);

  // One GPU transform grows every bar from the zero baseline.
  const transform = useDerivedValue(() => horizontal
    ? [{ translateX: base * (1 - progress.value) }, { scaleX: progress.value }]
    : [{ translateY: base * (1 - progress.value) }, { scaleY: progress.value }]);

  return (
    <Frame width={width} height={height} background={background}>
      <Group transform={transform}>
        {bars.map((b, i) => <RoundedRect key={i} x={b.x} y={b.y} width={b.w} height={b.h} r={radius} color={b.color} />)}
      </Group>
    </Frame>
  );
}
export const StackedBarChart = (p: Omit<BarChartProps, 'mode'>): React.JSX.Element => <BarChart {...p} mode="stacked" />;
export const HorizontalBarChart = (p: Omit<BarChartProps, 'horizontal'>): React.JSX.Element => <BarChart {...p} horizontal />;

/** Histogram: bins raw values then renders touching bars. */
export interface HistogramProps extends BaseChartProps { values: number[]; bins?: number; color?: string }
export function Histogram({ values, bins = 10, color, ...rest }: HistogramProps): React.JSX.Element {
  const data = useMemo(() => {
    const [min, max] = extent(values);
    const counts = new Array<number>(bins).fill(0);
    for (const v of values) { const i = Math.min(bins - 1, Math.floor(((v - min) / (max - min)) * bins)); counts[i] = (counts[i] ?? 0) + 1; }
    return counts;
  }, [values, bins]);
  return <BarChart {...rest} series={[{ data, color }]} barRatio={0.96} radius={1} />;
}
