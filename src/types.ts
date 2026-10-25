export interface ChartSize {
  width: number;
  height: number;
  padding?: number;
}
export interface AnimationProps {
  /** Animation duration in ms (runs on the UI thread). Default 700. */
  duration?: number;
  /** Disable the entry animation. */
  animate?: boolean;
}
export interface Series {
  label?: string;
  color?: string;
  data: number[];
}
export type BaseChartProps = ChartSize & AnimationProps & { background?: string };
export const PALETTE = [
  '#6366F1', '#22C55E', '#F59E0B', '#EF4444', '#06B6D4',
  '#A855F7', '#EC4899', '#14B8A6', '#84CC16', '#F97316',
] as const;
export const colorAt = (i: number, c?: string): string => c ?? PALETTE[i % PALETTE.length] ?? '#6366F1';
