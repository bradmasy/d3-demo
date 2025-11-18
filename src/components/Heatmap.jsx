import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './Heatmap.scss'

const Heatmap = ({ data, title }) => {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 800
    const height = 400
    const margin = { top: 60, right: 30, bottom: 80, left: 80 }

    svg.attr('width', width).attr('height', height)

    const xLabels = [...new Set(data.map((d) => d.x))]
    const yLabels = [...new Set(data.map((d) => d.y))]

    const xScale = d3
      .scaleBand()
      .domain(xLabels)
      .range([margin.left, width - margin.right])
      .padding(0.05)

    const yScale = d3
      .scaleBand()
      .domain(yLabels)
      .range([margin.top, height - margin.bottom])
      .padding(0.05)

    const colorScale = d3
      .scaleSequential(d3.interpolateYlOrRd)
      .domain([0, d3.max(data, (d) => d.value)])

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

    // Rectangles
    const rects = svg
      .selectAll('.cell')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', (d) => xScale(d.x))
      .attr('y', (d) => yScale(d.y))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', (d) => colorScale(d.value))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .attr('opacity', 0)

    rects
      .transition()
      .duration(600)
      .delay((d, i) => i * 10)
      .attr('opacity', 1)

    rects
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke-width', 3)
          .attr('stroke', '#333')
        tooltip.transition().duration(200).style('opacity', 1)
        tooltip
          .html(`<strong>${d.x} × ${d.y}</strong><br/>Value: ${d.value.toFixed(2)}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px')
      })
      .on('mouseout', function () {
        d3.select(this).transition().duration(200).attr('stroke-width', 1).attr('stroke', '#fff')
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

    // Color legend
    const legendWidth = 200
    const legendHeight = 20
    const legendX = width - margin.right - legendWidth
    const legendY = margin.top

    const legendScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([0, legendWidth])

    const legendAxis = d3.axisBottom(legendScale).ticks(5)

    const legend = svg.append('g').attr('transform', `translate(${legendX}, ${legendY})`)

    const defs = svg.append('defs')
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'heatmap-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%')

    const maxValue = d3.max(data, (d) => d.value)
    gradient
      .selectAll('stop')
      .data(
        d3.range(0, 1.01, 0.1).map((t) => ({
          offset: t * 100 + '%',
          color: colorScale(t * maxValue),
        }))
      )
      .enter()
      .append('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color)

    legend
      .append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#heatmap-gradient)')

    legend
      .append('g')
      .attr('transform', `translate(0, ${legendHeight})`)
      .call(legendAxis)
      .selectAll('text')
      .style('font-size', '10px')
      .style('fill', '#333')

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .style('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(title || 'Heatmap')

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

export default Heatmap



