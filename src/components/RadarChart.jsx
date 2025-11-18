import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './RadarChart.scss'

const RadarChart = ({ data, title }) => {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 600
    const height = 600
    const margin = { top: 60, right: 60, bottom: 60, left: 60 }

    svg.attr('width', width).attr('height', height)

    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - Math.max(margin.top, margin.right)

    const angleSlice = (2 * Math.PI) / data.length

    const g = svg.append('g').attr('transform', `translate(${centerX}, ${centerY})`)

    // Scales
    const maxValue = d3.max(data, (d) => d.value)
    const rScale = d3.scaleLinear().domain([0, maxValue]).range([0, radius])

    // Draw grid circles
    const gridLevels = 5
    for (let i = 0; i <= gridLevels; i++) {
      const levelRadius = (radius / gridLevels) * i
      g.append('circle')
        .attr('r', levelRadius)
        .attr('fill', 'none')
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 1)
        .attr('opacity', 0.5)
    }

    // Draw grid lines
    data.forEach((d, i) => {
      const angle = i * angleSlice - Math.PI / 2
      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', radius * Math.cos(angle))
        .attr('y2', radius * Math.sin(angle))
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 1)
        .attr('opacity', 0.5)
    })

    // Draw axis labels
    data.forEach((d, i) => {
      const angle = i * angleSlice - Math.PI / 2
      const labelRadius = radius + 20
      g.append('text')
        .attr('x', labelRadius * Math.cos(angle))
        .attr('y', labelRadius * Math.sin(angle))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '14px')
        .style('font-weight', '500')
        .style('fill', '#333')
        .text(d.label)
    })

    // Draw area
    const radarLine = d3
      .lineRadial()
      .angle((d, i) => i * angleSlice - Math.PI / 2)
      .radius((d) => rScale(d.value))
      .curve(d3.curveLinearClosed)

    const area = d3
      .areaRadial()
      .angle((d, i) => i * angleSlice - Math.PI / 2)
      .innerRadius(0)
      .outerRadius((d) => rScale(d.value))
      .curve(d3.curveLinearClosed)

    const path = g
      .append('path')
      .datum(data)
      .attr('d', area)
      .attr('fill', 'rgba(102, 126, 234, 0.3)')
      .attr('stroke', '#667eea')
      .attr('stroke-width', 2)

    const linePath = g
      .append('path')
      .datum(data)
      .attr('d', radarLine)
      .attr('fill', 'none')
      .attr('stroke', '#667eea')
      .attr('stroke-width', 2.5)

    // Animate path
    const totalLength = linePath.node().getTotalLength()
    linePath
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0)

    // Draw dots
    data.forEach((d, i) => {
      const angle = i * angleSlice - Math.PI / 2
      const r = rScale(d.value)
      g.append('circle')
        .attr('cx', r * Math.cos(angle))
        .attr('cy', r * Math.sin(angle))
        .attr('r', 0)
        .attr('fill', '#667eea')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .transition()
        .duration(600)
        .delay(i * 100)
        .attr('r', 5)
    })

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .style('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(title || 'Radar Chart')
  }, [data, title])

  return (
    <div className="chart-container">
      <svg ref={svgRef}></svg>
    </div>
  )
}

export default RadarChart



