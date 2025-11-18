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

  const generateRandomBarData = () => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return labels.map((label) => ({
      label,
      value: Math.floor(Math.random() * 100) + 10,
    }))
  }

  const generateRandomLineData = () => {
    const data = []
    let value = 50
    for (let i = 0; i < 20; i++) {
      value += Math.random() * 20 - 10
      data.push({
        x: i,
        y: Math.max(0, Math.min(100, value)),
      })
    }
    return data
  }

  const generateRandomScatterData = () => {
    const data = []
    for (let i = 0; i < 50; i++) {
      data.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
      })
    }
    return data
  }

  const generateRandomPieData = () => {
    const categories = ['Sales', 'Marketing', 'Development', 'Support', 'Operations']
    return categories.map((category) => ({
      label: category,
      value: Math.floor(Math.random() * 100) + 20,
    }))
  }

  const generateRandomHeatmapData = () => {
    const xLabels = ['Q1', 'Q2', 'Q3', 'Q4']
    const yLabels = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E']
    const data = []
    xLabels.forEach((x) => {
      yLabels.forEach((y) => {
        data.push({
          x,
          y,
          value: Math.random() * 100,
        })
      })
    })
    return data
  }

  const generateRandomTreeMapData = () => {
    const categories = [
      'Desktop',
      'Mobile',
      'Tablet',
      'Laptop',
      'Server',
      'Cloud',
      'IoT',
      'AI',
    ]
    return categories.map((category) => ({
      label: category,
      value: Math.floor(Math.random() * 200) + 50,
    }))
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

  const generateRandomRadarData = () => {
    const metrics = ['Speed', 'Reliability', 'Design', 'Features', 'Support', 'Price']
    return metrics.map((metric) => ({
      label: metric,
      value: Math.random() * 80 + 20,
    }))
  }

  const generateRandomStackedAreaData = () => {
    const data = []
    const series = ['Series A', 'Series B', 'Series C']
    for (let i = 0; i < 15; i++) {
      const point = { x: i }
      series.forEach((s) => {
        point[s] = Math.random() * 50 + 10
      })
      data.push(point)
    }
    return data
  }

  const generateRandomBubbleData = () => {
    const data = []
    const categories = ['Category A', 'Category B', 'Category C', 'Category D', 'Category E']
    for (let i = 0; i < 30; i++) {
      data.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 50 + 10,
        label: categories[Math.floor(Math.random() * categories.length)],
      })
    }
    return data
  }

  const generateRandomForceGraphData = () => {
    const nodeCount = 15
    const nodes = []
    const links = []

    // Generate nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        id: `node-${i}`,
        label: `Node ${i + 1}`,
        size: Math.random() * 15 + 10,
        connections: 0,
      })
    }

    // Generate links (each node connects to 2-4 other nodes)
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

    // Count connections for each node
    nodes.forEach((node) => {
      node.connections = links.filter(
        (link) => link.source === node.id || link.target === node.id
      ).length
    })

    return { nodes, links }
  }

  useEffect(() => {
    setBarData(generateRandomBarData())
    setLineData(generateRandomLineData())
    setScatterData(generateRandomScatterData())
    setPieData(generateRandomPieData())
    setHeatmapData(generateRandomHeatmapData())
    setTreeMapData(generateRandomTreeMapData())
    setTreeData(generateRandomTreeData())
    setRadarData(generateRandomRadarData())
    setStackedAreaData(generateRandomStackedAreaData())
    setBubbleData(generateRandomBubbleData())
    setForceGraphData(generateRandomForceGraphData())
  }, [])

  const refreshData = () => {
    setBarData(generateRandomBarData())
    setLineData(generateRandomLineData())
    setScatterData(generateRandomScatterData())
    setPieData(generateRandomPieData())
    setHeatmapData(generateRandomHeatmapData())
    setTreeMapData(generateRandomTreeMapData())
    setTreeData(generateRandomTreeData())
    setRadarData(generateRandomRadarData())
    setStackedAreaData(generateRandomStackedAreaData())
    setBubbleData(generateRandomBubbleData())
    setForceGraphData(generateRandomForceGraphData())
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>D3.js Visualizations Demo</h1>
        <p>Interactive data visualizations with React, D3.js, and SCSS</p>
        <button className="refresh-button" onClick={refreshData}>
          🔄 Generate New Data
        </button>
      </header>

      <main className="app-main">
        <div className="chart-wrapper">
          <BarChart data={barData} title="Weekly Sales Data" />
        </div>

        <div className="chart-wrapper">
          <LineChart data={lineData} title="Trend Analysis" />
        </div>

        <div className="chart-wrapper">
          <ScatterPlot data={scatterData} title="Correlation Analysis" />
        </div>

        <div className="chart-wrapper">
          <PieChart data={pieData} title="Department Distribution" innerRadius={0} />
        </div>

        <div className="chart-wrapper">
          <PieChart data={pieData} title="Department Distribution (Donut)" innerRadius={100} />
        </div>

        <div className="chart-wrapper">
          <Heatmap data={heatmapData} title="Quarterly Product Performance" />
        </div>

        <div className="chart-wrapper">
          <TreeMap data={treeMapData} title="Device Category Distribution" />
        </div>

        <div className="chart-wrapper">
          <TreeDiagram data={treeData} title="Hierarchical Tree Structure" />
        </div>

        <div className="chart-wrapper">
          <RadarChart data={radarData} title="Product Performance Metrics" />
        </div>

        <div className="chart-wrapper">
          <StackedAreaChart data={stackedAreaData} title="Multi-Series Trend Analysis" />
        </div>

        <div className="chart-wrapper">
          <BubbleChart data={bubbleData} title="Multi-Dimensional Data Analysis" />
        </div>

        <div className="chart-wrapper">
          <ForceGraph data={forceGraphData} title="Network Relationships (Drag to interact!)" />
        </div>
      </main>
    </div>
  )
}

export default App

