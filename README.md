# @baraa-rasheed/skia-charts

GPU-accelerated, **60fps** animated charts for **Expo SDK 58** / React Native, built on
[React Native Skia](https://shopify.github.io/react-native-skia/) and Reanimated worklets. Written in strict TypeScript and ships `.d.ts` declarations.

## Why it stays smooth
- Every chart is drawn on a single Skia `<Canvas>`, so rendering happens on the GPU.
- Animations are Reanimated shared values (`withTiming`) passed straight to Skia props (`end`, `transform`, `opacity`, `r`). They run on the UI thread, with no `setState` or `requestAnimationFrame` loop on the JS thread.
- Animated paths (pie slices) are rebuilt inside `useDerivedValue` worklets.
- Gestures (the line/area crosshair) use Gesture Handler worklets that write shared values directly.
- Static geometry is memoised, so it's only recomputed when the data or size changes.

## Install
```sh
npx expo install @shopify/react-native-skia react-native-reanimated react-native-gesture-handler react-native-worklets
npm i github:baraa-rasheed/react-native-skia-charts
```
Wrap your app in `<GestureHandlerRootView style={{ flex: 1 }}>`.

## Chart types
Every chart accepts `width`, `height`, `padding?`, `background?`, `duration?` and `animate?`.
Screenshots will be added. To see each chart live, run the [example app](#example-app).

### Line
<!-- screenshot: docs/screenshots/line.png -->
```tsx
<LineChart width={320} height={220} series={[{ data: months }]} showDots />
```

### Multi-series Line
<!-- screenshot: docs/screenshots/multi-line.png -->
```tsx
<LineChart width={320} height={220} series={series3} />
```

### Area
<!-- screenshot: docs/screenshots/area.png -->
```tsx
<AreaChart width={320} height={220} series={[{ data: months }]} />
```

### Stacked Area
<!-- screenshot: docs/screenshots/stacked-area.png -->
```tsx
<StackedAreaChart width={320} height={220} series={series3} />
```

### Sparkline
<!-- screenshot: docs/screenshots/sparkline.png -->
```tsx
<Sparkline width={320} height={60} series={[{ data: months }]} />
```

### Bar (grouped)
<!-- screenshot: docs/screenshots/bar.png -->
```tsx
<BarChart width={320} height={220} series={series3} />
```

### Stacked Bar
<!-- screenshot: docs/screenshots/stacked-bar.png -->
```tsx
<StackedBarChart width={320} height={220} series={series3} />
```

### Horizontal Bar
<!-- screenshot: docs/screenshots/horizontal-bar.png -->
```tsx
<HorizontalBarChart width={320} height={220} series={[{ data: months.slice(0, 6) }]} />
```

### Histogram
<!-- screenshot: docs/screenshots/histogram.png -->
```tsx
<Histogram width={320} height={220} values={samples} bins={16} />
```

### Pie
<!-- screenshot: docs/screenshots/pie.png -->
```tsx
<PieChart width={320} height={320} data={pie} padAngle={1} />
```

### Donut
<!-- screenshot: docs/screenshots/donut.png -->
```tsx
<DonutChart width={320} height={320} data={pie} padAngle={2} />
```

### Rose / Polar Area
<!-- screenshot: docs/screenshots/rose.png -->
```tsx
<RoseChart width={320} height={320} data={pie} />
```

### Scatter
<!-- screenshot: docs/screenshots/scatter.png -->
```tsx
<ScatterChart width={320} height={220} series={scatter} />
```

### Bubble
<!-- screenshot: docs/screenshots/bubble.png -->
```tsx
<BubbleChart width={320} height={220} series={scatter} />
```

### Radar / Spider
<!-- screenshot: docs/screenshots/radar.png -->
```tsx
<RadarChart width={320} height={320} series={radar} />
```

### Candlestick
<!-- screenshot: docs/screenshots/candlestick.png -->
```tsx
<CandlestickChart width={320} height={220} data={candles} />
```

### OHLC
<!-- screenshot: docs/screenshots/ohlc.png -->
```tsx
<OHLCChart width={320} height={220} data={candles} />
```

### Heatmap
<!-- screenshot: docs/screenshots/heatmap.png -->
```tsx
<HeatmapChart width={320} height={220} data={heat} />
```

### Gauge
<!-- screenshot: docs/screenshots/gauge.png -->
```tsx
<GaugeChart width={320} height={320} value={72} />
```

### Progress Rings
<!-- screenshot: docs/screenshots/progress-rings.png -->
```tsx
<ProgressRings width={320} height={320} rings={[{ value: 0.82 }, { value: 0.64 }, { value: 0.45 }]} />
```

### Funnel
<!-- screenshot: docs/screenshots/funnel.png -->
```tsx
<FunnelChart width={320} height={220} data={funnel} />
```

## Example app
`example/` is an Expo SDK 58 (expo-router) app with one screen per chart type (`example/data/registry.tsx`). It resolves the library from `../src`, so you can edit with hot reload.
```sh
cd example && npm install && npx expo run:ios   # or run:android (Skia needs a dev build)
```

## Development
```sh
npm install && npm run typecheck && npm run build   # emits lib/ with .d.ts
```

## License
MIT
