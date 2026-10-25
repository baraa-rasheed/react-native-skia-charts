import React, { useMemo } from 'react';
import { Circle, Group, Line, Path, Skia, vec, type SkPath, type SkPathBuilder } from '@shopify/react-native-skia';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Frame } from '../Frame';
import { useProgress } from '../animation';
import { extent, linear, stack } from '../scale';
import { colorAt, type BaseChartProps, type Series } from '../types';

export interface LineChartProps extends BaseChartProps {
  series: Series[];
  /** Fill area under each line (area chart). */
  area?: boolean;
  /** Stack series on top of each other (stacked area). Implies `area`. */
  stacked?: boolean;
  /** Smooth with monotone-ish cubic curves. */
  curved?: boolean;
  strokeWidth?: number;
  /** Pan to show a crosshair (gesture handled in a worklet). */
  interactive?: boolean;
  showDots?: boolean;
}

const buildPath = (pts: { x: number; y: number }[], curved: boolean): SkPathBuilder => {
  const p = Skia.PathBuilder.Make();
  pts.forEach((pt, i) => {
    if (i === 0) { p.moveTo(pt.x, pt.y); return; }
    const prev = pts[i - 1]!;
    if (curved) { const mx = (prev.x + pt.x) / 2; p.cubicTo(mx, prev.y, mx, pt.y, pt.x, pt.y); } else p.lineTo(pt.x, pt.y);
  });
  return p;
};

export function LineChart({
  width, height, padding = 16, series, area = false, stacked = false, curved = true,
  strokeWidth = 3, interactive = true, showDots = false, background, duration, animate,
}: LineChartProps): React.JSX.Element {
  const progress = useProgress({ duration, animate }, [series]);
  const fill = area || stacked;
  const geo = useMemo(() => {
    const raw = series.map((s) => s.data);
    const values = stacked ? stack(raw) : raw;
    const [min, max] = extent(values.flat(), fill);
    const n = Math.max(2, ...raw.map((d) => d.length));
    const sx = linear(0, n - 1, padding, width - padding);
    const sy = linear(min, max, height - padding, padding);
    const base = sy(Math.max(min, 0));
    const lines = values.map((d) => d.map((v, i) => ({ x: sx(i), y: sy(v) })));
    return {
      base, sx, n,
      items: lines.map((pts, si) => {
        const line = buildPath(pts, curved).build();
        let areaPath: SkPath | null = null;
        if (fill) {
          const b = buildPath(pts, curved);
          const below = stacked && si > 0 ? [...(lines[si - 1] ?? [])].reverse() : null;
          if (below) { below.forEach((pt) => b.lineTo(pt.x, pt.y)); }
          else { b.lineTo(pts[pts.length - 1]?.x ?? 0, base); b.lineTo(pts[0]?.x ?? 0, base); }
          areaPath = b.close().build();
        }
        return { line, areaPath, pts, color: colorAt(si, series[si]?.color) };
      }),
    };
  }, [series, width, height, padding, stacked, fill, curved]);

  // Grow areas from the baseline on the GPU via a group transform.
  const areaTransform = useDerivedValue(() => [
    { translateY: geo.base * (1 - progress.value) }, { scaleY: progress.value },
  ]);
  const touchX = useSharedValue(-1);
  const p1 = useDerivedValue(() => vec(touchX.value, padding));
  const p2 = useDerivedValue(() => vec(touchX.value, height - padding));
  const crossOpacity = useDerivedValue(() => (touchX.value < 0 ? 0 : 1));
  const gesture = Gesture.Pan()
    .enabled(interactive)
    .minDistance(0)
    .onBegin((e) => { touchX.value = Math.min(width - padding, Math.max(padding, e.x)); })
    .onUpdate((e) => { touchX.value = Math.min(width - padding, Math.max(padding, e.x)); })
    .onFinalize(() => { touchX.value = -1; });

  return (
    <GestureDetector gesture={gesture}>
      <Frame width={width} height={height} background={background}>
        {fill ? (
          <Group transform={areaTransform}>
            {geo.items.map((it, i) => it.areaPath ? <Path key={`a${i}`} path={it.areaPath} color={it.color} opacity={0.35} /> : null)}
          </Group>
        ) : null}
        {geo.items.map((it, i) => (
          <Path key={`l${i}`} path={it.line} color={it.color} style="stroke" strokeWidth={strokeWidth}
            strokeCap="round" strokeJoin="round" start={0} end={progress} />
        ))}
        {showDots ? geo.items.flatMap((it, i) => it.pts.map((pt, j) => (
          <Circle key={`d${i}-${j}`} cx={pt.x} cy={pt.y} r={strokeWidth + 1} color={it.color} opacity={progress} />
        ))) : null}
        <Line p1={p1} p2={p2} color="#94A3B8" strokeWidth={1} opacity={crossOpacity} />
      </Frame>
    </GestureDetector>
  );
}

/** Area chart: `LineChart` with filled regions. */
export function AreaChart(props: Omit<LineChartProps, 'area'>): React.JSX.Element {
  return <LineChart {...props} area />;
}
/** Stacked area chart. */
export function StackedAreaChart(props: Omit<LineChartProps, 'area' | 'stacked'>): React.JSX.Element {
  return <LineChart {...props} area stacked />;
}
/** Minimal inline trend line with no padding or interaction. */
export function Sparkline(props: Omit<LineChartProps, 'interactive' | 'padding'>): React.JSX.Element {
  return <LineChart {...props} padding={props.strokeWidth ?? 2} strokeWidth={props.strokeWidth ?? 2} interactive={false} />;
}
