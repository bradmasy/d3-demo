# D3.js Visualizations Demo

A React + Vite project showcasing D3.js data visualizations with SCSS styling.

## Features

### Chart Types
- **Bar Chart**: Weekly sales data visualization with animated bars
- **Line Chart**: Trend analysis with smooth curves and area fill
- **Scatter Plot**: Correlation analysis with interactive points
- **Pie Chart**: Department distribution visualization
- **Donut Chart**: Alternative pie chart style with center hole
- **Heatmap**: Color-coded grid showing density and intensity values
- **Tree Map**: Hierarchical rectangles showing proportional relationships
- **Radar Chart**: Multi-axis comparison with polar coordinates
- **Stacked Area Chart**: Multiple time series stacked on top of each other
- **Bubble Chart**: Scatter plot with size-encoded third dimension
- **Force-Directed Graph**: Interactive network visualization with drag-and-drop

### Interactive Features
- **Tooltips**: Hover over any chart element to see detailed information
- **Smooth Animations**: All charts animate when data loads or refreshes
- **Grid Lines**: Visual guides for easier data reading
- **Hover Effects**: Interactive feedback on all chart elements
- **Responsive Design**: Works beautifully on all screen sizes

All visualizations use randomly generated data that can be refreshed with a button click.

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
