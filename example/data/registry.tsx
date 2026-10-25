import React from 'react';
import {
  AreaChart, BarChart, BubbleChart, CandlestickChart, DonutChart, FunnelChart, GaugeChart, HeatmapChart, Histogram,
  HorizontalBarChart, LineChart, OHLCChart, PieChart, ProgressRings, RadarChart, RoseChart, ScatterChart, Sparkline,
  StackedAreaChart, StackedBarChart,
} from '@baraa-rasheed/skia-charts';
import * as d from './samples';

export interface ChartEntry { slug: string; title: string; render: (w: number) => React.JSX.Element }
const h = (w: number): number => Math.round(w * 0.65);

/** Each entry is a separate screen in the example app (app/charts/[slug].tsx). */
export const charts: ChartEntry[] = [
  { slug: 'line', title: 'Line', render: (w) => <LineChart width={w} height={h(w)} series={[{ data: d.months }]} showDots /> },
  { slug: 'multi-line', title: 'Multi-series Line', render: (w) => <LineChart width={w} height={h(w)} series={d.series3} /> },
  { slug: 'area', title: 'Area', render: (w) => <AreaChart width={w} height={h(w)} series={[{ data: d.months }]} /> },
  { slug: 'stacked-area', title: 'Stacked Area', render: (w) => <StackedAreaChart width={w} height={h(w)} series={d.series3} /> },
  { slug: 'sparkline', title: 'Sparkline', render: (w) => <Sparkline width={w} height={60} series={[{ data: d.months }]} /> },
  { slug: 'bar', title: 'Bar (grouped)', render: (w) => <BarChart width={w} height={h(w)} series={d.series3} /> },
  { slug: 'stacked-bar', title: 'Stacked Bar', render: (w) => <StackedBarChart width={w} height={h(w)} series={d.series3} /> },
  { slug: 'horizontal-bar', title: 'Horizontal Bar', render: (w) => <HorizontalBarChart width={w} height={h(w)} series={[{ data: d.months.slice(0, 6) }]} /> },
  { slug: 'histogram', title: 'Histogram', render: (w) => <Histogram width={w} height={h(w)} values={d.samples} bins={16} /> },
  { slug: 'pie', title: 'Pie', render: (w) => <PieChart width={w} height={w} data={d.pie} padAngle={1} /> },
  { slug: 'donut', title: 'Donut', render: (w) => <DonutChart width={w} height={w} data={d.pie} padAngle={2} /> },
  { slug: 'rose', title: 'Rose / Polar Area', render: (w) => <RoseChart width={w} height={w} data={d.pie} /> },
  { slug: 'scatter', title: 'Scatter', render: (w) => <ScatterChart width={w} height={h(w)} series={d.scatter} /> },
  { slug: 'bubble', title: 'Bubble', render: (w) => <BubbleChart width={w} height={h(w)} series={d.scatter} /> },
  { slug: 'radar', title: 'Radar / Spider', render: (w) => <RadarChart width={w} height={w} series={d.radar} /> },
  { slug: 'candlestick', title: 'Candlestick', render: (w) => <CandlestickChart width={w} height={h(w)} data={d.candles} /> },
  { slug: 'ohlc', title: 'OHLC', render: (w) => <OHLCChart width={w} height={h(w)} data={d.candles} /> },
  { slug: 'heatmap', title: 'Heatmap', render: (w) => <HeatmapChart width={w} height={h(w)} data={d.heat} /> },
  { slug: 'gauge', title: 'Gauge', render: (w) => <GaugeChart width={w} height={w} value={72} /> },
  { slug: 'progress-rings', title: 'Progress Rings', render: (w) => <ProgressRings width={w} height={w} rings={[{ value: 0.82 }, { value: 0.64 }, { value: 0.45 }]} /> },
  { slug: 'funnel', title: 'Funnel', render: (w) => <FunnelChart width={w} height={h(w)} data={d.funnel} /> },
];
