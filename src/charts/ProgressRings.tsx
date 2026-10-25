import React, { useMemo } from 'react';
import { Path, Skia } from '@shopify/react-native-skia';
import { Frame } from '../Frame';
import { useAnimatedNumber } from '../animation';
import { colorAt, type AnimationProps, type BaseChartProps } from '../types';

export interface Ring { value: number; color?: string; label?: string }
export interface ProgressRingsProps extends BaseChartProps {
  /** Values in 0–1. Rings render from outside in. */
  rings: Ring[];
  thickness?: number;
  gap?: number;
  trackOpacity?: number;
}

function RingArc({ cx, cy, r, value, color, thickness, trackOpacity, anim }: { cx: number; cy: number; r: number; value: number; color: string; thickness: number; trackOpacity: number; anim: AnimationProps }): React.JSX.Element {
  const v = useAnimatedNumber(Math.min(1, Math.max(0, value)), anim);
  const path = useMemo(() => { const p = Skia.PathBuilder.Make(); p.addArc({ x: cx - r, y: cy - r, width: r * 2, height: r * 2 }, -90, 359.99); return p.build(); }, [cx, cy, r]);
  return (
    <>
      <Path path={path} color={color} opacity={trackOpacity} style="stroke" strokeWidth={thickness} />
      <Path path={path} color={color} style="stroke" strokeWidth={thickness} strokeCap="round" start={0} end={v} />
    </>
  );
}

export function ProgressRings({ width, height, padding = 8, rings, thickness = 14, gap = 4, trackOpacity = 0.15, background, duration, animate }: ProgressRingsProps): React.JSX.Element {
  const R = Math.min(width, height) / 2 - padding - thickness / 2;
  return (
    <Frame width={width} height={height} background={background}>
      {rings.map((ring, i) => (
        <RingArc key={i} cx={width / 2} cy={height / 2} r={R - i * (thickness + gap)} value={ring.value}
          color={colorAt(i, ring.color)} thickness={thickness} trackOpacity={trackOpacity} anim={{ duration, animate }} />
      ))}
    </Frame>
  );
}
export const ProgressRing = ({ value, color, ...p }: Omit<ProgressRingsProps, 'rings'> & Ring): React.JSX.Element => <ProgressRings {...p} rings={[{ value, color }]} />;
