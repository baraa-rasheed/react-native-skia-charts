import React, { useMemo } from 'react';
import { Circle, Group, Line, Path, Skia, vec } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import { Frame } from '../Frame';
import { useAnimatedNumber } from '../animation';
import type { BaseChartProps } from '../types';

export interface GaugeChartProps extends BaseChartProps {
  value: number;
  min?: number;
  max?: number;
  /** Total sweep in degrees. Default 240. */
  sweep?: number;
  thickness?: number;
  color?: string;
  trackColor?: string;
  needle?: boolean;
}

export function GaugeChart({ width, height, padding = 12, value, min = 0, max = 100, sweep = 240, thickness = 16, color = '#6366F1', trackColor = '#E2E8F0', needle = true, background, duration, animate }: GaugeChartProps): React.JSX.Element {
  const t = Math.min(1, Math.max(0, (value - min) / (max - min || 1)));
  const v = useAnimatedNumber(t, { duration, animate });
  const cx = width / 2; const cy = height / 2;
  const r = Math.min(width, height) / 2 - padding - thickness / 2;
  const startDeg = 90 + (360 - sweep) / 2;
  const arc = useMemo(() => {
    const p = Skia.PathBuilder.Make();
    p.addArc({ x: cx - r, y: cy - r, width: r * 2, height: r * 2 }, startDeg, sweep);
    return p.build();
  }, [cx, cy, r, startDeg, sweep]);
  const needleT = useDerivedValue(() => [{ rotate: ((startDeg + sweep * v.value) * Math.PI) / 180 }]);
  return (
    <Frame width={width} height={height} background={background}>
      <Path path={arc} color={trackColor} style="stroke" strokeWidth={thickness} strokeCap="round" />
      <Path path={arc} color={color} style="stroke" strokeWidth={thickness} strokeCap="round" start={0} end={v} />
      {needle ? (
        <Group origin={{ x: cx, y: cy }} transform={needleT}>
          <Line p1={vec(cx, cy)} p2={vec(cx + r * 0.75, cy)} color="#0F172A" strokeWidth={3} strokeCap="round" />
        </Group>
      ) : null}
      {needle ? <Circle cx={cx} cy={cy} r={6} color="#0F172A" /> : null}
    </Frame>
  );
}
