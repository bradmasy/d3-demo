import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './TreeDiagram.scss'

const TreeDiagram = ({ data, title }) => {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || !data.root) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 800
    const height = 600
    const margin = { top: 40, right: 30, bottom: 30, left: 30 }

    svg.attr('width', width).attr('height', height)

    // Create hierarchical structure
    const root = d3.hierarchy(data.root)
    const treeLayout = d3.tree().size([height - margin.top - margin.bottom, width - margin.left - margin.right])

    treeLayout(root)

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

    // Draw links
    const links = g
      .selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', (d) => {
        return `M${d.source.y},${d.source.x}C${(d.source.y + d.target.y) / 2},${d.source.x} ${(d.source.y + d.target.y) / 2},${d.target.x} ${d.target.y},${d.target.x}`
      })
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 2)
      .style('opacity', 0)

    links.transition().duration(800).delay((d, i) => i * 50).style('opacity', 0.6)

    // Draw nodes
    const nodes = g
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.y},${d.x})`)

    // Node circles
    nodes
      .append('circle')
      .attr('r', (d) => (d.depth === 0 ? 12 : d.children ? 10 : 8))
      .attr('fill', (d) => {
        if (d.depth === 0) return '#667eea'
        if (d.children) return '#764ba2'
        return '#9b59b6'
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .attr('opacity', 0)
      .transition()
      .duration(600)
      .delay((d, i) => i * 100)
      .attr('opacity', 1)

    // Node labels
    nodes
      .append('text')
      .attr('dy', (d) => (d.depth === 0 ? -20 : d.children ? -15 : -15))
      .attr('dx', (d) => (d.children ? 0 : 0))
      .attr('text-anchor', 'middle')
      .style('font-size', (d) => (d.depth === 0 ? '14px' : '12px'))
      .style('font-weight', (d) => (d.depth === 0 ? 'bold' : 'normal'))
      .style('fill', '#333')
      .text((d) => d.data.name)
      .style('opacity', 0)
      .transition()
      .duration(600)
      .delay((d, i) => i * 100 + 300)
      .style('opacity', 1)

    // Hover effects
    nodes
      .selectAll('circle')
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', (d) => (d.depth === 0 ? 16 : d.children ? 14 : 12))
          .attr('stroke-width', 3)
        tooltip.transition().duration(200).style('opacity', 1)
        const tooltipText = d.data.value
          ? `<strong>${d.data.name}</strong><br/>Value: ${d.data.value}`
          : `<strong>${d.data.name}</strong>`
        tooltip
          .html(tooltipText)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px')
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', (d) => (d.depth === 0 ? 12 : d.children ? 10 : 8))
          .attr('stroke-width', 2)
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
      .text(title || 'Tree Diagram')

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

export default TreeDiagram



