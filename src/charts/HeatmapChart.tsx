import React, { useMemo } from 'react';
import { Group, RoundedRect } from '@shopify/react-native-skia';
import { Frame } from '../Frame';
import { useProgress } from '../animation';
import { extent } from '../scale';
import type { BaseChartProps } from '../types';

export interface HeatmapChartProps extends BaseChartProps {
  /** Row-major matrix of values. */
  data: number[][];
  /** Low and high colors as hex `#RRGGBB`. */
  colors?: [string, string];
  gap?: number;
  radius?: number;
}

const hex = (c: string): [number, number, number] => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)) as [number, number, number];
const mix = (a: string, b: string, t: number): string => {
  const A = hex(a); const B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + ((B[i] ?? v) - v) * t)).join(',')})`;
};

export function HeatmapChart({ width, height, padding = 8, data, colors = ['#EEF2FF', '#4338CA'], gap = 2, radius = 3, background, duration, animate }: HeatmapChartProps): React.JSX.Element {
  const progress = useProgress({ duration, animate }, [data]);
  const cells = useMemo(() => {
    const [min, max] = extent(data.flat());
    const rows = data.length || 1; const cols = Math.max(1, ...data.map((r) => r.length));
    const cw = (width - padding * 2) / cols; const ch = (height - padding * 2) / rows;
    return data.flatMap((row, r) => row.map((v, c) => ({
      x: padding + c * cw + gap / 2, y: padding + r * ch + gap / 2, w: cw - gap, h: ch - gap,
      color: mix(colors[0], colors[1], (v - min) / (max - min || 1)),
    })));
  }, [data, width, height, padding, colors, gap]);
  return (
    <Frame width={width} height={height} background={background}>
      <Group opacity={progress}>
        {cells.map((c, i) => <RoundedRect key={i} x={c.x} y={c.y} width={c.w} height={c.h} r={radius} color={c.color} />)}
      </Group>
    </Frame>
  );
}
