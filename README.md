# D3.js Visualizations Demo

A React + Vite project showcasing D3.js data visualizations with SCSS styling.

## Features

### Chart Types (with Realistic Mock Data)
- **Bar Chart**: Top countries by population (realistic data)
- **Line Chart**: Stock price trend with volatility (realistic simulation)
- **Scatter Plot**: GDP vs Population correlation (realistic correlation patterns)
- **Pie Chart**: Market share by region (realistic distribution)
- **Donut Chart**: Market share by region (alternative style)
- **Heatmap**: Product performance across quarters (realistic seasonal patterns)
- **Tree Map**: Market segments distribution (realistic market data)
- **Radar Chart**: Product performance metrics (realistic multi-dimensional data)
- **Stacked Area Chart**: Multi-series trends over time (realistic correlated trends)
- **Bubble Chart**: Market Cap vs Volume correlation (realistic market data)
- **Candlestick Chart**: OHLC price data (realistic financial patterns)
- **Sankey Diagram**: Flow visualization (realistic flow data)
- **Sunburst Chart**: Hierarchical data visualization (realistic hierarchical structure)
- **Box Plot**: Statistical distributions (realistic statistical data)
- **Force-Directed Graph**: Interactive network visualization (generated)
- **Tree Diagram**: Hierarchical tree structure (generated)

### Interactive Features
- **Tooltips**: Hover over any chart element to see detailed information
- **Smooth Animations**: All charts animate when data loads or refreshes
- **Grid Lines**: Visual guides for easier data reading
- **Hover Effects**: Interactive feedback on all chart elements
- **Responsive Design**: Works beautifully on all screen sizes

All visualizations use **realistic mock data** that simulates real-world patterns:
- No CORS issues - all data is generated locally
- Realistic patterns - data follows real-world correlations and trends
- Fast loading - no external API dependencies
- Refreshes instantly - click the button to generate new data sets

## Tech Stack

- React 18
- Vite 5
- D3.js 7
- SCSS

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
  ├── components/
  │   ├── BarChart.jsx
  │   ├── BarChart.scss
  │   ├── LineChart.jsx
  │   ├── LineChart.scss
  │   ├── ScatterPlot.jsx
  │   ├── ScatterPlot.scss
  │   ├── PieChart.jsx
  │   ├── PieChart.scss
  │   ├── Heatmap.jsx
  │   ├── Heatmap.scss
  │   ├── TreeMap.jsx
  │   ├── TreeMap.scss
  │   ├── RadarChart.jsx
  │   ├── RadarChart.scss
  │   ├── StackedAreaChart.jsx
  │   ├── StackedAreaChart.scss
  │   ├── BubbleChart.jsx
  │   ├── BubbleChart.scss
  │   ├── ForceGraph.jsx
  │   └── ForceGraph.scss
  ├── App.jsx
  ├── App.scss
  ├── main.jsx
  └── index.scss
```

## License

MIT

# d3-demo
