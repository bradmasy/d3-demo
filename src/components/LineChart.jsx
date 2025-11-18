import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './LineChart.scss'

const LineChart = ({ data, title }) => {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 800
    const height = 400
    const margin = { top: 40, right: 30, bottom: 60, left: 60 }

    svg.attr('width', width).attr('height', height)

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.x))
      .range([margin.left, width - margin.right])

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.y))
      .nice()
      .range([height - margin.bottom, margin.top])

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

    svg
      .append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickSize(-(height - margin.top - margin.bottom))
          .tickFormat('')
      )
      .selectAll('line')
      .style('stroke', '#e0e0e0')
      .style('stroke-width', 1)
      .style('stroke-dasharray', '3,3')

    // Line generator
    const line = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(d3.curveMonotoneX)

    // Area generator
    const area = d3
      .area()
      .x((d) => xScale(d.x))
      .y0(height - margin.bottom)
      .y1((d) => yScale(d.y))
      .curve(d3.curveMonotoneX)

    // Area with animation
    const areaPath = svg
      .append('path')
      .datum(data)
      .attr('fill', 'rgba(102, 126, 234, 0.2)')
      .attr('d', area)

    const totalLength = areaPath.node().getTotalLength()
    areaPath
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .attr('stroke', '#667eea')
      .attr('stroke-width', 0)
      .transition()
      .duration(1000)
      .attr('stroke-dashoffset', 0)

    // Line with animation
    const linePath = svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#667eea')
      .attr('stroke-width', 2.5)
      .attr('d', line)

    const lineLength = linePath.node().getTotalLength()
    linePath
      .attr('stroke-dasharray', lineLength + ' ' + lineLength)
      .attr('stroke-dashoffset', lineLength)
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0)

    // Dots with animation and tooltips
    const dots = svg
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => xScale(d.x))
      .attr('cy', (d) => yScale(d.y))
      .attr('r', 0)
      .attr('fill', '#667eea')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')

    dots
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .ease(d3.easeCubicOut)
      .attr('r', 4)

    dots
      .on('mouseover', function (event, d) {
        d3.select(this).transition().duration(200).attr('r', 6)
        tooltip.transition().duration(200).style('opacity', 1)
        tooltip
          .html(`<strong>Time: ${d.x}</strong><br/>Value: ${d.y.toFixed(2)}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px')
      })
      .on('mouseout', function () {
        d3.select(this).transition().duration(200).attr('r', 4)
        tooltip.transition().duration(200).style('opacity', 0)
      })

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

    // X axis label
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#333')
      .text('Time')

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .style('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(title || 'Line Chart')

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

export default LineChart

