import React, { useMemo } from 'react';
import { Circle } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';
import { Frame } from '../Frame';
import { useProgress } from '../animation';
import { extent, linear } from '../scale';
import { colorAt, type BaseChartProps } from '../types';

export interface ScatterPoint { x: number; y: number; /** Bubble size value. */ size?: number }
export interface ScatterSeries { label?: string; color?: string; data: ScatterPoint[] }
export interface ScatterChartProps extends BaseChartProps {
  series: ScatterSeries[];
  /** Point radius for scatter; max radius for bubbles. */
  radius?: number;
  /** Scale radius by `size` (bubble chart). */
  bubble?: boolean;
  opacity?: number;
}

function Dot({ cx, cy, r, color, opacity, progress, delay }: { cx: number; cy: number; r: number; color: string; opacity: number; progress: SharedValue<number>; delay: number }): React.JSX.Element {
  const radius = useDerivedValue(() => r * Math.min(1, Math.max(0, (progress.value - delay) / (1 - delay))));
  return <Circle cx={cx} cy={cy} r={radius} color={color} opacity={opacity} />;
}

export function ScatterChart({ width, height, padding = 16, series, radius, bubble = false, opacity, background, duration, animate }: ScatterChartProps): React.JSX.Element {
  const progress = useProgress({ duration, animate }, [series]);
  const dots = useMemo(() => {
    const all = series.flatMap((s) => s.data);
    const maxR = radius ?? (bubble ? 28 : 5);
    const pad = padding + (bubble ? maxR : 0);
    const [x0, x1] = extent(all.map((p) => p.x));
    const [y0, y1] = extent(all.map((p) => p.y));
    const sMax = Math.max(1, ...all.map((p) => p.size ?? 1));
    const sx = linear(x0, x1, pad, width - pad); const sy = linear(y0, y1, height - pad, pad);
    const total = all.length || 1; let k = 0;
    return series.flatMap((s, si) => s.data.map((p) => ({
      cx: sx(p.x), cy: sy(p.y), r: bubble ? Math.max(3, maxR * Math.sqrt((p.size ?? 1) / sMax)) : maxR,
      color: colorAt(si, s.color), delay: ((k++) / total) * 0.5,
    })));
  }, [series, width, height, padding, radius, bubble]);
  return (
    <Frame width={width} height={height} background={background}>
      {dots.map((d, i) => <Dot key={i} {...d} opacity={opacity ?? (bubble ? 0.6 : 0.9)} progress={progress} />)}
    </Frame>
  );
}
export const BubbleChart = (p: Omit<ScatterChartProps, 'bubble'>): React.JSX.Element => <ScatterChart {...p} bubble />;
