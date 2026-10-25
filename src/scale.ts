export type Scale = (v: number) => number;
export const linear = (d0: number, d1: number, r0: number, r1: number): Scale => {
  const span = d1 - d0 || 1;
  return (v: number) => r0 + ((v - d0) / span) * (r1 - r0);
};
export const extent = (values: readonly number[], includeZero = false): [number, number] => {
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) { if (v < min) min = v; if (v > max) max = v; }
  if (!Number.isFinite(min)) return [0, 1];
  if (includeZero) { min = Math.min(0, min); max = Math.max(0, max); }
  return min === max ? [min - 1, max + 1] : [min, max];
};
export const stack = (series: readonly (readonly number[])[]): number[][] => {
  const n = Math.max(0, ...series.map((s) => s.length));
  const acc = new Array<number>(n).fill(0);
  return series.map((s) => acc.map((a, i) => (acc[i] = a + (s[i] ?? 0))));
};
export const polar = (cx: number, cy: number, r: number, a: number): { x: number; y: number } => ({
  x: cx + r * Math.cos(a), y: cy + r * Math.sin(a),
});
