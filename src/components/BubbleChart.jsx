import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './BubbleChart.scss'

const BubbleChart = ({ data, title }) => {
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
      .nice()
      .range([margin.left, width - margin.right])

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.y))
      .nice()
      .range([height - margin.bottom, margin.top])

    const sizeScale = d3
      .scaleSqrt()
      .domain(d3.extent(data, (d) => d.size))
      .range([5, 40])

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

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

    // Bubbles
    const bubbles = svg
      .selectAll('.bubble')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'bubble')
      .attr('cx', (d) => xScale(d.x))
      .attr('cy', (d) => yScale(d.y))
      .attr('r', 0)
      .attr('fill', (d, i) => colorScale(i))
      .attr('opacity', 0.6)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')

    bubbles
      .transition()
      .duration(800)
      .delay((d, i) => i * 30)
      .ease(d3.easeCubicOut)
      .attr('r', (d) => sizeScale(d.size))
      .attr('opacity', 0.7)

    // Labels
    const labels = svg
      .selectAll('.label')
      .data(data.filter((d) => d.label))
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', (d) => xScale(d.x))
      .attr('y', (d) => yScale(d.y))
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '11px')
      .style('font-weight', '500')
      .style('fill', '#333')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .text((d) => d.label)

    labels
      .transition()
      .duration(800)
      .delay((d, i) => i * 30 + 400)
      .style('opacity', 1)

    bubbles
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('stroke-width', 3)
        tooltip.transition().duration(200).style('opacity', 1)
        tooltip
          .html(
            `<strong>${d.label || 'Point'}</strong><br/>X: ${d.x.toFixed(2)}<br/>Y: ${d.y.toFixed(2)}<br/>Size: ${d.size.toFixed(2)}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px')
      })
      .on('mouseout', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.7)
          .attr('stroke-width', 2)
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
      .text('Y Value')

    // X axis label
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#333')
      .text('X Value')

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .style('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(title || 'Bubble Chart')

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

export default BubbleChart



