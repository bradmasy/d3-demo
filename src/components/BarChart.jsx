import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './BarChart.scss'

const BarChart = ({ data, title }) => {
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
      .domain(data.map((d) => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.2)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
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

    // Bars with animations
    const bars = svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.label))
      .attr('y', height - margin.bottom)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('fill', (d, i) => d3.schemeCategory10[i % 10])
      .attr('rx', 4)
      .attr('ry', 4)
      .style('cursor', 'pointer')

    // Animate bars
    bars
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr('y', (d) => yScale(d.value))
      .attr('height', (d) => height - margin.bottom - yScale(d.value))

    // Add hover effects
    bars
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.8)
          .attr('y', (d) => yScale(d.value) - 5)
          .attr('height', (d) => height - margin.bottom - yScale(d.value) + 5)
        tooltip.transition().duration(200).style('opacity', 1)
        tooltip
          .html(`<strong>${d.label}</strong><br/>Value: ${d.value}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px')
      })
      .on('mouseout', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('y', (d) => yScale(d.value))
          .attr('height', (d) => height - margin.bottom - yScale(d.value))
        tooltip.transition().duration(200).style('opacity', 0)
      })

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
      .text(title || 'Bar Chart')

    // Value labels on bars with animation
    const labels = svg
      .selectAll('.value-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('x', (d) => xScale(d.label) + xScale.bandwidth() / 2)
      .attr('y', height - margin.bottom)
      .style('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#333')
      .style('opacity', 0)

    labels
      .transition()
      .duration(800)
      .delay(400)
      .ease(d3.easeCubicOut)
      .attr('y', (d) => yScale(d.value) - 5)
      .style('opacity', 1)
      .text((d) => d.value)

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

export default BarChart

