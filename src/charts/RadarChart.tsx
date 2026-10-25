import React, { useMemo } from 'react';
import { Group, Path, Skia } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import { Frame } from '../Frame';
import { useProgress } from '../animation';
import { polar } from '../scale';
import { colorAt, type BaseChartProps, type Series } from '../types';

export interface RadarChartProps extends BaseChartProps {
  series: Series[];
  /** Max value for the outer ring; defaults to data max. */
  max?: number;
  rings?: number;
  gridColor?: string;
}

export function RadarChart({ width, height, padding = 16, series, max, rings = 4, gridColor = '#CBD5E1', background, duration, animate }: RadarChartProps): React.JSX.Element {
  const progress = useProgress({ duration, animate }, [series]);
  const cx = width / 2; const cy = height / 2;
  const { grid, shapes } = useMemo(() => {
    const n = Math.max(3, ...series.map((s) => s.data.length));
    const R = Math.min(width, height) / 2 - padding;
    const m = max ?? Math.max(1, ...series.flatMap((s) => s.data));
    const ang = (i: number): number => (i / n) * Math.PI * 2 - Math.PI / 2;
    const g = Skia.PathBuilder.Make();
    for (let r = 1; r <= rings; r++) for (let i = 0; i <= n; i++) { const p = polar(cx, cy, (R * r) / rings, ang(i % n)); if (i === 0) g.moveTo(p.x, p.y); else g.lineTo(p.x, p.y); }
    for (let i = 0; i < n; i++) { const p = polar(cx, cy, R, ang(i)); g.moveTo(cx, cy); g.lineTo(p.x, p.y); }
    const sh = series.map((s, si) => {
      const p = Skia.PathBuilder.Make();
      s.data.forEach((v, i) => { const pt = polar(cx, cy, (R * v) / m, ang(i)); if (i === 0) p.moveTo(pt.x, pt.y); else p.lineTo(pt.x, pt.y); });
      return { path: p.close().build(), color: colorAt(si, s.color) };
    });
    return { grid: g.build(), shapes: sh };
  }, [series, width, height, padding, max, rings, cx, cy]);
  const transform = useDerivedValue(() => [{ scale: progress.value }]);
  return (
    <Frame width={width} height={height} background={background}>
      <Path path={grid} color={gridColor} style="stroke" strokeWidth={1} />
      <Group transform={transform} origin={{ x: cx, y: cy }}>
        {shapes.map((s, i) => (
          <Group key={i}>
            <Path path={s.path} color={s.color} opacity={0.3} />
            <Path path={s.path} color={s.color} style="stroke" strokeWidth={2} />
          </Group>
        ))}
      </Group>
    </Frame>
  );
}
export const SpiderChart = RadarChart;
