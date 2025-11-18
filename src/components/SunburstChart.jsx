import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './SunburstChart.scss'

const SunburstChart = ({ data, title }) => {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || !data.root) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 600
    const height = 600
    const radius = Math.min(width, height) / 2 - 20

    svg.attr('width', width).attr('height', height)

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)

    const root = d3.hierarchy(data.root).sum((d) => d.value)

    const partition = d3.partition().size([2 * Math.PI, radius])

    partition(root)

    const arc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => d.y1)

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

    const paths = g
      .selectAll('path')
      .data(root.descendants())
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => {
        while (d.depth > 1) d = d.parent
        return color(d.data.name)
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('opacity', 0)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('stroke-width', 3)
        tooltip.transition().duration(200).style('opacity', 1)
        const path = d.ancestors().reverse().map((d) => d.data.name).join(' → ')
        tooltip
          .html(`<strong>${path}</strong><br/>Value: ${d.value || 0}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px')
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke-width', 2)
        tooltip.transition().duration(200).style('opacity', 0)
      })

    paths
      .transition()
      .duration(600)
      .delay((d, i) => i * 30)
      .style('opacity', 1)

    // Labels for larger segments
    g.selectAll('text')
      .data(
        root.descendants().filter((d) => d.depth && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10)
      )
      .enter()
      .append('text')
      .attr('transform', (d) => {
        const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI
        const y = (d.y0 + d.y1) / 2
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`
      })
      .attr('dy', '0.35em')
      .attr('text-anchor', (d) => (d.x < Math.PI ? 'start' : 'end'))
      .style('font-size', '11px')
      .style('font-weight', '500')
      .style('fill', '#333')
      .text((d) => d.data.name)
      .style('opacity', 0)
      .transition()
      .duration(600)
      .delay((d, i) => i * 30 + 300)
      .style('opacity', 1)

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .style('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(title || 'Sunburst Chart')

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

export default SunburstChart

