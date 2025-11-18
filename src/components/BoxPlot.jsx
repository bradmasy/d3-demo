import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './BoxPlot.scss'

const BoxPlot = ({ data, title }) => {
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
      .scaleBand()
      .domain(data.map((d) => d.category))
      .range([margin.left, width - margin.right])
      .padding(0.3)

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.min),
        d3.max(data, (d) => d.max),
      ])
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

    const boxes = svg
      .selectAll('.box')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'box')
      .attr('transform', (d) => `translate(${xScale(d.category)}, 0)`)

    // Whiskers (min to Q1, Q3 to max)
    boxes
      .append('line')
      .attr('class', 'whisker')
      .attr('x1', xScale.bandwidth() / 2)
      .attr('x2', xScale.bandwidth() / 2)
      .attr('y1', (d) => yScale(d.min))
      .attr('y2', (d) => yScale(d.q1))
      .attr('stroke', '#333')
      .attr('stroke-width', 1.5)
      .style('opacity', 0)
      .transition()
      .duration(600)
      .delay((d, i) => i * 100)
      .style('opacity', 1)

    boxes
      .append('line')
      .attr('class', 'whisker')
      .attr('x1', xScale.bandwidth() / 2)
      .attr('x2', xScale.bandwidth() / 2)
      .attr('y1', (d) => yScale(d.q3))
      .attr('y2', (d) => yScale(d.max))
      .attr('stroke', '#333')
      .attr('stroke-width', 1.5)
      .style('opacity', 0)
      .transition()
      .duration(600)
      .delay((d, i) => i * 100)
      .style('opacity', 1)

    // Box (Q1 to Q3)
    const boxRects = boxes
      .append('rect')
      .attr('x', xScale.bandwidth() * 0.2)
      .attr('y', (d) => yScale(d.q3))
      .attr('width', xScale.bandwidth() * 0.6)
      .attr('height', (d) => yScale(d.q1) - yScale(d.q3))
      .attr('fill', (d, i) => d3.schemeCategory10[i % 10])
      .attr('stroke', '#333')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .style('opacity', 0)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('stroke-width', 3)
        tooltip.transition().duration(200).style('opacity', 1)
        tooltip
          .html(
            `<strong>${d.category}</strong><br/>Min: ${d.min.toFixed(2)}<br/>Q1: ${d.q1.toFixed(2)}<br/>Median: ${d.median.toFixed(2)}<br/>Q3: ${d.q3.toFixed(2)}<br/>Max: ${d.max.toFixed(2)}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px')
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke-width', 1.5)
        tooltip.transition().duration(200).style('opacity', 0)
      })

    boxRects
      .transition()
      .duration(600)
      .delay((d, i) => i * 100 + 200)
      .style('opacity', 0.8)

    // Median line
    boxes
      .append('line')
      .attr('class', 'median')
      .attr('x1', xScale.bandwidth() * 0.2)
      .attr('x2', xScale.bandwidth() * 0.8)
      .attr('y1', (d) => yScale(d.median))
      .attr('y2', (d) => yScale(d.median))
      .attr('stroke', '#333')
      .attr('stroke-width', 2)
      .style('opacity', 0)
      .transition()
      .duration(600)
      .delay((d, i) => i * 100 + 300)
      .style('opacity', 1)

    // X axis
    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
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
      .text(title || 'Box Plot')

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

export default BoxPlot

