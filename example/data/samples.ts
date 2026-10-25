import type { OHLC } from '@baraa-rasheed/skia-charts';

const rand = (seed: number) => () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const r = rand(42);
export const months = [12, 19, 14, 22, 28, 24, 31, 35, 30, 38, 42, 47];
export const series3 = [
  { label: 'Web', data: [5, 8, 6, 9, 12, 10, 14] },
  { label: 'iOS', data: [3, 4, 6, 5, 7, 9, 8] },
  { label: 'Android', data: [2, 3, 3, 5, 4, 6, 7] },
];
export const pie = [
  { value: 42, label: 'Direct' }, { value: 26, label: 'Search' }, { value: 18, label: 'Social' }, { value: 14, label: 'Referral' },
];
export const scatter = [0, 1].map((s) => ({ data: Array.from({ length: 40 }, () => ({ x: r() * 100, y: r() * 60 + s * 30, size: r() * 10 })) }));
export const candles: OHLC[] = (() => {
  let p = 100;
  return Array.from({ length: 30 }, () => { const o = p; const c = o + (r() - 0.48) * 8; p = c;
    return { open: o, close: c, high: Math.max(o, c) + r() * 4, low: Math.min(o, c) - r() * 4 }; });
})();
export const heat = Array.from({ length: 7 }, () => Array.from({ length: 12 }, () => Math.round(r() * 100)));
export const radar = [{ data: [80, 65, 90, 70, 55, 85] }, { data: [60, 85, 70, 90, 75, 60] }];
export const samples = Array.from({ length: 300 }, () => (r() + r() + r()) * 33);
export const funnel = [{ value: 1000 }, { value: 720 }, { value: 480 }, { value: 300 }, { value: 140 }];
