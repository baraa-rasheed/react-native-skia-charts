import React, { useMemo } from 'react';
import { Path, Skia } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';
import { Frame } from '../Frame';
import { useProgress } from '../animation';
import { colorAt, type BaseChartProps } from '../types';

export interface PieSlice { value: number; color?: string; label?: string }
export interface PieChartProps extends BaseChartProps {
  data: PieSlice[];
  /** Inner radius ratio 0–0.95; > 0 renders a donut. */
  innerRadius?: number;
  /** Gap between slices in degrees. */
  padAngle?: number;
  /** Rose / polar-area: slice radius proportional to value, equal angles. */
  rose?: boolean;
}

interface SliceProps { cx: number; cy: number; r: number; ir: number; a0: number; a1: number; color: string; progress: SharedValue<number> }

function Slice({ cx, cy, r, ir, a0, a1, color, progress }: SliceProps): React.JSX.Element {
  // Path is rebuilt in a UI-thread worklet each frame, never on the JS thread.
  const path = useDerivedValue(() => {
    const p = Skia.PathBuilder.Make();
    const start = (a0 * progress.value * 180) / Math.PI - 90;
    const sweep = ((a1 - a0) * progress.value * 180) / Math.PI;
    p.addArc({ x: cx - r, y: cy - r, width: r * 2, height: r * 2 }, start, sweep);
    if (ir > 0) p.arcToOval({ x: cx - ir, y: cy - ir, width: ir * 2, height: ir * 2 }, start + sweep, -sweep, false);
    else p.lineTo(cx, cy);
    return p.close().build();
  });
  return <Path path={path} color={color} />;
}

export function PieChart({ width, height, padding = 8, data, innerRadius = 0, padAngle = 0, rose = false, background, duration, animate }: PieChartProps): React.JSX.Element {
  const progress = useProgress({ duration, animate }, [data]);
  const slices = useMemo(() => {
    const total = data.reduce((s, d) => s + Math.max(0, d.value), 0) || 1;
    const maxV = Math.max(...data.map((d) => d.value), 1);
    const R = Math.min(width, height) / 2 - padding;
    const pad = (padAngle * Math.PI) / 180;
    let a = 0;
    return data.map((d, i) => {
      const sweep = rose ? (Math.PI * 2) / data.length : (Math.max(0, d.value) / total) * Math.PI * 2;
      const s = { a0: a + pad / 2, a1: a + sweep - pad / 2, r: rose ? R * Math.sqrt(d.value / maxV) : R, color: colorAt(i, d.color) };
      a += sweep;
      return { ...s, ir: R * innerRadius };
    });
  }, [data, width, height, padding, innerRadius, padAngle, rose]);
  return (
    <Frame width={width} height={height} background={background}>
      {slices.map((s, i) => <Slice key={i} cx={width / 2} cy={height / 2} {...s} progress={progress} />)}
    </Frame>
  );
}
export const DonutChart = (p: Omit<PieChartProps, 'innerRadius'> & { innerRadius?: number }): React.JSX.Element => <PieChart innerRadius={0.6} {...p} />;
export const RoseChart = (p: Omit<PieChartProps, 'rose'>): React.JSX.Element => <PieChart {...p} rose />;
