import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './PieChart.scss'

const PieChart = ({ data, title, innerRadius = 0 }) => {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 600
    const height = 600
    const radius = Math.min(width, height) / 2 - 40

    svg.attr('width', width).attr('height', height)

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)

    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const pie = d3.pie().value((d) => d.value)

    const arc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(radius)

    const arcHover = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(radius + 10)

    const arcs = g.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc')

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

    // Arcs with animations
    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this).transition().duration(200).attr('d', arcHover)
        tooltip.transition().duration(200).style('opacity', 1)
        tooltip
          .html(`${d.data.label}: ${d.data.value} (${((d.endAngle - d.startAngle) / (2 * Math.PI) * 100).toFixed(1)}%)`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px')
      })
      .on('mouseout', function () {
        d3.select(this).transition().duration(200).attr('d', arc)
        tooltip.transition().duration(200).style('opacity', 0)
      })

    // Labels
    arcs
      .append('text')
      .attr('transform', (d) => {
        const [x, y] = arc.centroid(d)
        const midAngle = (d.startAngle + d.endAngle) / 2
        return `translate(${x * 1.4}, ${y * 1.4}) rotate(${(midAngle * 180) / Math.PI})`
      })
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('fill', '#333')
      .text((d) => {
        const percent = ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100
        return percent > 5 ? d.data.label : ''
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
      .text(title || 'Pie Chart')

    // Center text for donut chart
    if (innerRadius > 0) {
      const total = d3.sum(data, (d) => d.value)
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.5em')
        .style('font-size', '24px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .text('Total')
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.2em')
        .style('font-size', '20px')
        .style('fill', '#666')
        .text(total)
    }

    return () => {
      tooltip.remove()
    }
  }, [data, title, innerRadius])

  return (
    <div className="chart-container">
      <svg ref={svgRef}></svg>
    </div>
  )
}

export default PieChart



