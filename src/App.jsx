import { useState, useEffect } from 'react'
import BarChart from './components/BarChart'
import LineChart from './components/LineChart'
import ScatterPlot from './components/ScatterPlot'
import PieChart from './components/PieChart'
import Heatmap from './components/Heatmap'
import TreeMap from './components/TreeMap'
import TreeDiagram from './components/TreeDiagram'
import RadarChart from './components/RadarChart'
import StackedAreaChart from './components/StackedAreaChart'
import BubbleChart from './components/BubbleChart'
import ForceGraph from './components/ForceGraph'
import CandlestickChart from './components/CandlestickChart'
import SankeyDiagram from './components/SankeyDiagram'
import SunburstChart from './components/SunburstChart'
import BoxPlot from './components/BoxPlot'
import './App.scss'

function App() {
  const [barData, setBarData] = useState([])
  const [lineData, setLineData] = useState([])
  const [scatterData, setScatterData] = useState([])
  const [pieData, setPieData] = useState([])
  const [heatmapData, setHeatmapData] = useState([])
  const [treeMapData, setTreeMapData] = useState([])
  const [treeData, setTreeData] = useState({ root: null })
  const [radarData, setRadarData] = useState([])
  const [stackedAreaData, setStackedAreaData] = useState([])
  const [bubbleData, setBubbleData] = useState([])
  const [forceGraphData, setForceGraphData] = useState({ nodes: [], links: [] })
  const [candlestickData, setCandlestickData] = useState([])
  const [sankeyData, setSankeyData] = useState({ nodes: [], links: [] })
  const [sunburstData, setSunburstData] = useState({ root: null })
  const [boxPlotData, setBoxPlotData] = useState([])
  const [loading, setLoading] = useState(true)

  const generateBarData = () => {
    const countries = [
      { label: 'China', value: 1439 },
      { label: 'India', value: 1380 },
      { label: 'USA', value: 331 },
      { label: 'Indonesia', value: 274 },
      { label: 'Pakistan', value: 238 },
      { label: 'Brazil', value: 215 },
      { label: 'Bangladesh', value: 165 },
    ]
    setBarData(countries)
  }

  const generateLineData = () => {
    const data = []
    let price = 45000
    for (let i = 0; i < 20; i++) {
      const trend = i < 10 ? 200 : -150
      const volatility = (Math.random() - 0.5) * 3000
      price = Math.max(40000, Math.min(50000, price + trend + volatility))
      data.push({
        x: i,
        y: price,
      })
    }
    setLineData(data)
  }

  const generateScatterData = () => {
    const data = []
    for (let i = 0; i < 50; i++) {
      const population = Math.random() * 1000 + 10
      const gdp = population * (0.5 + Math.random() * 0.5) + (Math.random() - 0.5) * 200
      data.push({
        x: Math.log10(population),
        y: Math.log10(gdp),
        size: Math.sqrt(population) / 10,
      })
    }
    setScatterData(data)
  }

  const generatePieData = () => {
    const pieData = [
      { label: 'Asia', value: 48 },
      { label: 'Africa', value: 16 },
      { label: 'Europe', value: 10 },
      { label: 'Americas', value: 14 },
      { label: 'Oceania', value: 12 },
    ]
    setPieData(pieData)
  }

  const generateHeatmapData = () => {
    const products = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E']
    const periods = ['Q1', 'Q2', 'Q3', 'Q4']
    const data = []
    
    products.forEach((product) => {
      periods.forEach((period) => {
        const baseValue = 50 + Math.random() * 40
        const seasonal = period === 'Q4' ? 15 : period === 'Q1' ? -10 : 0
        data.push({
          x: period,
          y: product,
          value: Math.max(10, Math.min(100, baseValue + seasonal)),
        })
      })
    })
    setHeatmapData(data)
  }

  const generateTreeMapData = () => {

    const osData = [
      { label: 'Windows', value: 1250 },
      { label: 'macOS', value: 380 },
      { label: 'Linux', value: 220 },
      { label: 'Chrome OS', value: 150 },
    ]
    
    const mobileData = [
      { label: 'Android', value: 1850 },
      { label: 'iOS', value: 920 },
      { label: 'Other Mobile', value: 80 },
    ]
    
    const browserData = [
      { label: 'Chrome', value: 2100 },
      { label: 'Safari', value: 680 },
      { label: 'Edge', value: 420 },
      { label: 'Firefox', value: 180 },
      { label: 'Other Browsers', value: 120 },
    ]
    
    const treeMapData = [...osData, ...mobileData, ...browserData]
    setTreeMapData(treeMapData)
  }

  const generateRandomTreeData = () => {
    const createNode = (name, depth, maxDepth) => {
      if (depth >= maxDepth) {
        return {
          name,
          value: Math.floor(Math.random() * 100) + 10,
        }
      }

      const childrenCount = depth === 0 ? 3 : Math.floor(Math.random() * 3) + 2
      const children = []
      for (let i = 0; i < childrenCount; i++) {
        children.push(createNode(`${name}-${i + 1}`, depth + 1, maxDepth))
      }

      return {
        name,
        children,
        value: Math.floor(Math.random() * 100) + 10,
      }
    }

    return {
      root: createNode('Root', 0, 3),
    }
  }

  const generateRadarData = () => {
    const adoption = 88
    const liquidity = adoption * 0.95
    const marketCap = adoption * 0.92
    const security = 95
    const decentralization = 92
    const regulatoryClarity = 65
    
    const radarData = [
      { label: 'Adoption', value: adoption },
      { label: 'Liquidity', value: Math.round(liquidity) },
      { label: 'Market Cap', value: Math.round(marketCap) },
      { label: 'Security', value: security },
      { label: 'Decentralization', value: decentralization },
      { label: 'Regulatory Clarity', value: regulatoryClarity },
    ]
    setRadarData(radarData)
  }

  const generateStackedAreaData = () => {
    const data = []
    const series = ['Series A', 'Series B', 'Series C']
    
    for (let i = 0; i < 15; i++) {
      const point = { x: i }
      series.forEach((s, idx) => {
        const base = 20 + idx * 15
        const trend = i * 2
        const noise = (Math.random() - 0.5) * 10
        point[s] = Math.max(10, base + trend + noise)
      })
      data.push(point)
    }
    setStackedAreaData(data)
  }

  const generateBubbleData = () => {
    const cryptocurrencies = [
      { name: 'Bitcoin', marketCap: 850, volume: 28, category: 'Store of Value' },
      { name: 'Ethereum', marketCap: 280, volume: 12, category: 'Smart Contracts' },
      { name: 'Binance Coin', marketCap: 45, volume: 2.1, category: 'Exchange Token' },
      { name: 'Solana', marketCap: 38, volume: 1.8, category: 'Smart Contracts' },
      { name: 'Cardano', marketCap: 15, volume: 0.45, category: 'Smart Contracts' },
      { name: 'XRP', marketCap: 32, volume: 1.2, category: 'Payment' },
      { name: 'Polkadot', marketCap: 8.5, volume: 0.25, category: 'Interoperability' },
      { name: 'Dogecoin', marketCap: 12, volume: 0.8, category: 'Meme Coin' },
      { name: 'Avalanche', marketCap: 6.2, volume: 0.18, category: 'Smart Contracts' },
      { name: 'Chainlink', marketCap: 4.8, volume: 0.15, category: 'Oracle' },
      { name: 'Polygon', marketCap: 3.5, volume: 0.12, category: 'Scaling' },
      { name: 'Litecoin', marketCap: 5.2, volume: 0.22, category: 'Payment' },
      { name: 'Uniswap', marketCap: 4.1, volume: 0.14, category: 'DeFi' },
      { name: 'Cosmos', marketCap: 2.8, volume: 0.09, category: 'Interoperability' },
      { name: 'Algorand', marketCap: 1.9, volume: 0.06, category: 'Smart Contracts' },
      { name: 'Filecoin', marketCap: 1.2, volume: 0.04, category: 'Storage' },
      { name: 'Tezos', marketCap: 0.95, volume: 0.03, category: 'Smart Contracts' },
      { name: 'Aave', marketCap: 1.1, volume: 0.035, category: 'DeFi' },
      { name: 'Monero', marketCap: 2.1, volume: 0.08, category: 'Privacy' },
      { name: 'Stellar', marketCap: 2.5, volume: 0.1, category: 'Payment' },
    ]
    
    const data = cryptocurrencies.map((crypto) => {
      return {
        x: Math.log10(crypto.marketCap),
        y: Math.log10(crypto.volume),
        size: Math.sqrt(crypto.marketCap) * 2,
        label: crypto.category,
        name: crypto.name,
      }
    })
    
    setBubbleData(data)
  }

  const generateRandomForceGraphData = () => {
    const nodeCount = 15
    const nodes = []
    const links = []

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        id: `node-${i}`,
        label: `Node ${i + 1}`,
        size: Math.random() * 15 + 10,
        connections: 0,
      })
    }

    nodes.forEach((node, i) => {
      const connectionCount = Math.floor(Math.random() * 3) + 2
      const connections = new Set()
      while (connections.size < connectionCount && connections.size < nodeCount - 1) {
        const targetIndex = Math.floor(Math.random() * nodeCount)
        if (targetIndex !== i && !connections.has(targetIndex)) {
          connections.add(targetIndex)
          links.push({
            source: node.id,
            target: nodes[targetIndex].id,
            value: Math.random() * 5 + 1,
          })
        }
      }
    })

    nodes.forEach((node) => {
      node.connections = links.filter(
        (link) => link.source === node.id || link.target === node.id
      ).length
    })

    return { nodes, links }
  }

  const generateCandlestickData = () => {
    const data = []
    let price = 45000
    
    for (let i = 0; i < 10; i++) {
      const trend = i < 5 ? 500 : -300
      const volatility = (Math.random() - 0.5) * 2000
      const open = price
      const close = Math.max(40000, Math.min(50000, price + trend + volatility))
      const high = Math.max(open, close) + Math.random() * 1500
      const low = Math.min(open, close) - Math.random() * 1500
      data.push({ open, high, low, close })
      price = close
    }
    setCandlestickData(data)
  }

  const generateSankeyData = () => {
    setSankeyData({
      nodes: [
        { name: 'North America', id: 'na', layer: 0 },
        { name: 'Europe', id: 'eu', layer: 0 },
        { name: 'Asia', id: 'as', layer: 0 },
        { name: 'Tech Sector', id: 'tech', layer: 1 },
        { name: 'Finance', id: 'finance', layer: 1 },
        { name: 'Healthcare', id: 'health', layer: 1 },
        { name: 'Energy', id: 'energy', layer: 1 },
      ],
      links: [
        { source: 'na', target: 'tech', value: 45 },
        { source: 'na', target: 'finance', value: 30 },
        { source: 'eu', target: 'health', value: 35 },
        { source: 'eu', target: 'energy', value: 25 },
        { source: 'as', target: 'tech', value: 50 },
        { source: 'as', target: 'finance', value: 40 },
      ],
    })
  }

  const generateSunburstData = () => {
    setSunburstData({
      root: {
        name: 'Global',
        children: [
          {
            name: 'Americas',
            children: [
              { name: 'North', value: 580 },
              { name: 'South', value: 430 },
              { name: 'Central', value: 180 },
            ],
          },
          {
            name: 'Europe',
            children: [
              { name: 'Western', value: 195 },
              { name: 'Eastern', value: 290 },
              { name: 'Northern', value: 105 },
            ],
          },
          {
            name: 'Asia',
            children: [
              { name: 'East', value: 1650 },
              { name: 'South', value: 1850 },
              { name: 'Southeast', value: 680 },
            ],
          },
        ],
      },
    })
  }

  const generateBoxPlotData = () => {
    const boxPlotData = [
      { category: 'Americas', min: 0.5, q1: 8, median: 25, q3: 85, max: 330 },
      { category: 'Europe', min: 0.3, q1: 5, median: 10, q3: 45, max: 145 },
      { category: 'Asia', min: 0.6, q1: 15, median: 50, q3: 180, max: 1440 },
      { category: 'Africa', min: 0.1, q1: 3, median: 12, q3: 35, max: 220 },
      { category: 'Oceania', min: 0.05, q1: 0.5, median: 5, q3: 25, max: 26 },
    ]
    setBoxPlotData(boxPlotData)
  }

  useEffect(() => {
    setLoading(true)
    generateBarData()
    generateLineData()
    generateScatterData()
    generatePieData()
    generateHeatmapData()
    generateTreeMapData()
    generateRadarData()
    generateStackedAreaData()
    generateBubbleData()
    generateCandlestickData()
    generateSankeyData()
    generateSunburstData()
    generateBoxPlotData()
    setTreeData(generateRandomTreeData())
    setForceGraphData(generateRandomForceGraphData())
    setLoading(false)
  }, [])

  const refreshData = () => {
    setLoading(true)
    generateBarData()
    generateLineData()
    generateScatterData()
    generatePieData()
    generateHeatmapData()
    generateTreeMapData()
    generateRadarData()
    generateStackedAreaData()
    generateBubbleData()
    generateCandlestickData()
    generateSankeyData()
    generateSunburstData()
    generateBoxPlotData()
    setTreeData(generateRandomTreeData())
    setForceGraphData(generateRandomForceGraphData())
    setLoading(false)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>D3.js Visualizations Demo</h1>
        <p>Interactive data visualizations with realistic mock data</p>
        {loading && <p className="loading-text">Generating data...</p>}
        <button className="refresh-button" onClick={refreshData} disabled={loading}>
          {loading ? '⏳ Loading...' : '🔄 Refresh Data'}
        </button>
      </header>

      <main className="app-main">
        <div className="chart-wrapper">
          <BarChart data={barData} title="Bar Chart: Top Countries by Population (Millions)" />
        </div>

        <div className="chart-wrapper">
          <LineChart data={lineData} title="Line Chart: Bitcoin Price History (Last 20 Days)" />
        </div>

        <div className="chart-wrapper">
          <ScatterPlot data={scatterData} title="Scatter Plot: Countries: Area vs Population" />
        </div>

        <div className="chart-wrapper">
          <PieChart data={pieData} title="Pie Chart: Countries by Region" innerRadius={0} />
        </div>

        <div className="chart-wrapper">
          <PieChart data={pieData} title="Donut Chart: Countries by Region" innerRadius={100} />
        </div>

        <div className="chart-wrapper">
          <Heatmap data={heatmapData} title="Heatmap: Cryptocurrency Price Changes (%)" />
        </div>

        <div className="chart-wrapper">
          <TreeMap data={treeMapData} title="Tree Map: Technology Market Share by Category" />
        </div>

        <div className="chart-wrapper">
          <TreeDiagram data={treeData} title="Tree Diagram: Hierarchical Tree Structure" />
        </div>

        <div className="chart-wrapper">
          <RadarChart data={radarData} title="Radar Chart: Bitcoin Market Metrics Performance" />
        </div>

        <div className="chart-wrapper">
          <StackedAreaChart data={stackedAreaData} title="Stacked Area Chart: Cryptocurrency Prices Over Time" />
        </div>

        <div className="chart-wrapper">
          <BubbleChart data={bubbleData} title="Bubble Chart: Cryptocurrencies: Market Cap vs Volume" />
        </div>

        <div className="chart-wrapper">
          <ForceGraph data={forceGraphData} title="Force-Directed Graph: Network Relationships (Drag to interact!)" />
        </div>

        <div className="chart-wrapper">
          <CandlestickChart data={candlestickData} title="Candlestick Chart: Bitcoin OHLC (Open/High/Low/Close)" />
        </div>

        <div className="chart-wrapper">
          <SankeyDiagram data={sankeyData} title="Sankey Diagram: Population Flow: Regions to Subregions" />
        </div>

        <div className="chart-wrapper">
          <SunburstChart data={sunburstData} title="Sunburst Chart: World Population by Region & Subregion" />
        </div>

        <div className="chart-wrapper">
          <BoxPlot data={boxPlotData} title="Box Plot: Population Distribution by Region (Statistics)" />
        </div>
      </main>
    </div>
  )
}

export default App

