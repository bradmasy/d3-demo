import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './CandlestickChart.scss'

const CandlestickChart = ({ data, title }) => {
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
      .domain(data.map((d, i) => i))
      .range([margin.left, width - margin.right])
      .padding(0.3)

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.low),
        d3.max(data, (d) => d.high),
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

    // Candlesticks
    const candles = svg
      .selectAll('.candle')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'candle')
      .attr('transform', (d, i) => `translate(${xScale(i)}, 0)`)

    // High-Low line
    candles
      .append('line')
      .attr('class', 'wick')
      .attr('x1', xScale.bandwidth() / 2)
      .attr('x2', xScale.bandwidth() / 2)
      .attr('y1', (d) => yScale(d.high))
      .attr('y2', (d) => yScale(d.low))
      .attr('stroke', '#666')
      .attr('stroke-width', 1.5)
      .style('opacity', 0)
      .transition()
      .duration(600)
      .delay((d, i) => i * 50)
      .style('opacity', 1)

    // Open-Close box
    const rects = candles
      .append('rect')
      .attr('x', 0)
      .attr('y', (d) => yScale(Math.max(d.open, d.close)))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => Math.abs(yScale(d.close) - yScale(d.open)))
      .attr('fill', (d) => (d.close >= d.open ? '#26a69a' : '#ef5350'))
      .attr('stroke', (d) => (d.close >= d.open ? '#26a69a' : '#ef5350'))
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .style('opacity', 0)

    rects
      .transition()
      .duration(600)
      .delay((d, i) => i * 50 + 100)
      .style('opacity', 1)

    rects
      .on('mouseover', function (event, d) {
        d3.select(this).attr('stroke-width', 2)
        tooltip.transition().duration(200).style('opacity', 1)
        tooltip
          .html(
            `<strong>Day ${data.indexOf(d) + 1}</strong><br/>Open: $${d.open.toFixed(2)}<br/>High: $${d.high.toFixed(2)}<br/>Low: $${d.low.toFixed(2)}<br/>Close: $${d.close.toFixed(2)}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px')
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke-width', 1)
        tooltip.transition().duration(200).style('opacity', 0)
      })

    // X axis
    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat((d) => `Day ${d + 1}`))
      .selectAll('text')
      .style('font-size', '11px')
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
      .text('Price (USD)')

    // Legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - margin.right - 100}, ${margin.top})`)

    legend
      .append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', '#26a69a')
    legend
      .append('text')
      .attr('x', 20)
      .attr('y', 12)
      .style('font-size', '12px')
      .style('fill', '#333')
      .text('Up')

    legend
      .append('rect')
      .attr('y', 20)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', '#ef5350')
    legend
      .append('text')
      .attr('x', 20)
      .attr('y', 32)
      .style('font-size', '12px')
      .style('fill', '#333')
      .text('Down')

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .style('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(title || 'Candlestick Chart')

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

export default CandlestickChart

