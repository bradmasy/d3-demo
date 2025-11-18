import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './TreeMap.scss'

const TreeMap = ({ data, title }) => {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 800
    const height = 400
    const margin = { top: 40, right: 10, bottom: 10, left: 10 }

    svg.attr('width', width).attr('height', height)

    const root = d3
      .hierarchy({ children: data })
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)

    d3.treemap().size([width - margin.left - margin.right, height - margin.top - margin.bottom]).padding(2)(root)

    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

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

    const cells = g
      .selectAll('g')
      .data(root.leaves())
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${d.x0},${d.y0})`)

    cells
      .append('rect')
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('fill', (d, i) => color(i))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .attr('opacity', 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .attr('opacity', 0.8)
      .on('end', function () {
        d3.select(this).attr('opacity', 0.8)
      })

    cells
      .append('text')
      .attr('x', (d) => (d.x1 - d.x0) / 2)
      .attr('y', (d) => (d.y1 - d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .style('font-size', (d) => {
        const area = (d.x1 - d.x0) * (d.y1 - d.y0)
        return Math.sqrt(area) / 10 + 'px'
      })
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text((d) => {
        const minSize = Math.min(d.x1 - d.x0, d.y1 - d.y0)
        return minSize > 30 ? d.data.label : ''
      })
      .style('opacity', 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 50 + 400)
      .style('opacity', 1)

    cells
      .selectAll('rect')
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('stroke-width', 3)
        tooltip.transition().duration(200).style('opacity', 1)
        tooltip
          .html(`<strong>${d.data.label}</strong><br/>Value: ${d.data.value}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px')
      })
      .on('mouseout', function () {
        d3.select(this).transition().duration(200).attr('opacity', 0.8).attr('stroke-width', 2)
        tooltip.transition().duration(200).style('opacity', 0)
      })

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 25)
      .style('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(title || 'Tree Map')

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

export default TreeMap



