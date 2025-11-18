import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './StackedAreaChart.scss'

const StackedAreaChart = ({ data, title }) => {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 800
    const height = 400
    const margin = { top: 40, right: 30, bottom: 60, left: 60 }

    svg.attr('width', width).attr('height', height)

    const keys = Object.keys(data[0]).filter((key) => key !== 'x')

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.x))
      .range([margin.left, width - margin.right])

    const stackedData = d3.stack().keys(keys)(data)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(stackedData, (d) => d3.max(d, (d) => d[1]))])
      .nice()
      .range([height - margin.bottom, margin.top])

    const color = d3.scaleOrdinal(d3.schemeCategory10)

    // Tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '10px')
      .style('border-radius', '5px')
      .style('pointer-events', 'none')
      .style('font-size', '14px')
      .style('z-index', 1000)

    // Grid lines
    svg
      .append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-(width - margin.left - margin.right))
          .tickFormat('')
      )
      .selectAll('line')
      .style('stroke', '#e0e0e0')
      .style('stroke-width', 1)
      .style('stroke-dasharray', '3,3')

    // Area generator
    const area = d3
      .area()
      .x((d) => xScale(d.data.x))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]))
      .curve(d3.curveMonotoneX)

    // Line generator
    const line = d3
      .line()
      .x((d) => xScale(d.data.x))
      .y((d) => yScale(d[1]))
      .curve(d3.curveMonotoneX)

    // Draw areas
    const areas = svg
      .selectAll('.area')
      .data(stackedData)
      .enter()
      .append('g')
      .attr('class', 'area')

    areas
      .append('path')
      .attr('d', area)
      .attr('fill', (d, i) => color(i))
      .attr('opacity', 0.7)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')

    // Draw lines
    areas
      .append('path')
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', (d, i) => color(i))
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')

    // Legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - margin.right - 100}, ${margin.top})`)

    const legendItems = legend
      .selectAll('.legend-item')
      .data(keys)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`)
      .style('cursor', 'pointer')

    legendItems
      .append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d, i) => color(i))

    legendItems
      .append('text')
      .attr('x', 20)
      .attr('y', 12)
      .style('font-size', '12px')
      .style('fill', '#333')
      .text((d) => d)

    // X axis
    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#333')

    // Y axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#333')

    // Y axis label
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 15)
      .attr('x', -height / 2)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#333')
      .text('Value')

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .style('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(title || 'Stacked Area Chart')

    return () => {
      tooltip.remove()
    }
  }, [data, title])

  return (
    <div className="chart-container">
      <svg ref={svgRef}></svg>
    </div>
  )
}

export default StackedAreaChart



