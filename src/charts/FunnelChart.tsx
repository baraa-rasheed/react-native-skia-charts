import React, { useMemo } from 'react';
import { Group, Path, Skia } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import { Frame } from '../Frame';
import { useProgress } from '../animation';
import { colorAt, type BaseChartProps } from '../types';

export interface FunnelStage { value: number; label?: string; color?: string }
export interface FunnelChartProps extends BaseChartProps { data: FunnelStage[]; gap?: number }

export function FunnelChart({ width, height, padding = 8, data, gap = 4, background, duration, animate }: FunnelChartProps): React.JSX.Element {
  const progress = useProgress({ duration, animate }, [data]);
  const stages = useMemo(() => {
    const max = Math.max(1, ...data.map((d) => d.value));
    const h = (height - padding * 2 - gap * (data.length - 1)) / Math.max(1, data.length);
    const cx = width / 2; const W = width - padding * 2;
    return data.map((d, i) => {
      const top = (W * d.value) / max; const bot = (W * (data[i + 1]?.value ?? d.value * 0.8)) / max;
      const y = padding + i * (h + gap);
      const p = Skia.PathBuilder.Make();
      p.moveTo(cx - top / 2, y); p.lineTo(cx + top / 2, y); p.lineTo(cx + bot / 2, y + h); p.lineTo(cx - bot / 2, y + h); p.close();
      return { path: p.build(), color: colorAt(i, d.color) };
    });
  }, [data, width, height, padding, gap]);
  const transform = useDerivedValue(() => [{ scaleX: progress.value }]);
  return (
    <Frame width={width} height={height} background={background}>
      <Group transform={transform} origin={{ x: width / 2, y: 0 }}>
        {stages.map((s, i) => <Path key={i} path={s.path} color={s.color} />)}
      </Group>
    </Frame>
  );
}
