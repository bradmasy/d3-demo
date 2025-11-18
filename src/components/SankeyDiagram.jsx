import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './SankeyDiagram.scss'

const SankeyDiagram = ({ data, title }) => {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || !data.nodes || !data.links) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 800
    const height = 500
    const margin = { top: 40, right: 30, bottom: 30, left: 30 }

    svg.attr('width', width).attr('height', height)

    // Simple flow layout (manual positioning since d3-sankey isn't available)
    const nodeWidth = 15
    const nodePadding = 10
    const xPositions = [margin.left, width - margin.right - 200, width - margin.right]

    // Group nodes by layer
    const sourceNodes = data.nodes.filter((n) => n.layer === 0 || !n.layer)
    const targetNodes = data.nodes.filter((n) => n.layer === 1)

    // Position nodes
    const nodes = []
    let yPos = margin.top

    sourceNodes.forEach((node, i) => {
      nodes.push({
        ...node,
        x0: xPositions[0],
        x1: xPositions[0] + nodeWidth,
        y0: yPos,
        y1: yPos + 40,
        index: i,
      })
      yPos += 50
    })

    yPos = margin.top
    targetNodes.forEach((node, i) => {
      nodes.push({
        ...node,
        x0: xPositions[1],
        x1: xPositions[1] + nodeWidth,
        y0: yPos,
        y1: yPos + 40,
        index: sourceNodes.length + i,
      })
      yPos += 50
    })

    // Create links with curved paths
    const links = data.links.map((link) => {
      const source = nodes.find((n) => n.id === link.source || n.name === link.source)
      const target = nodes.find((n) => n.id === link.target || n.name === link.target)
      if (source && target) {
        return {
          ...link,
          source,
          target,
          width: Math.max(2, link.value / 10),
        }
      }
      return null
    }).filter(Boolean)

    // Color scale
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

    // Links with curved paths
    const linkPath = (d) => {
      const x0 = d.source.x1
      const x1 = d.target.x0
      const y0 = (d.source.y0 + d.source.y1) / 2
      const y1 = (d.target.y0 + d.target.y1) / 2
      const xm = (x0 + x1) / 2
      return `M${x0},${y0}C${xm},${y0} ${xm},${y1} ${x1},${y1}`
    }

    const link = svg
      .append('g')
      .selectAll('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', linkPath)
      .attr('stroke', (d) => {
        const sourceColor = color(d.source.index)
        return d3.color(sourceColor).brighter(0.5)
      })
      .attr('stroke-width', (d) => Math.max(1, d.width))
      .attr('fill', 'none')
      .attr('opacity', 0.5)
      .style('cursor', 'pointer')
      .style('opacity', 0)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 0.8).attr('stroke-width', (d) => Math.max(2, d.width + 2))
        tooltip.transition().duration(200).style('opacity', 1)
        tooltip
          .html(
            `<strong>${d.source.name}</strong> → <strong>${d.target.name}</strong><br/>Value: ${d.value.toFixed(2)}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px')
      })
      .on('mouseout', function (event, d) {
        d3.select(this).attr('opacity', 0.5).attr('stroke-width', (d) => Math.max(1, d.width))
        tooltip.transition().duration(200).style('opacity', 0)
      })

    link
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .style('opacity', 0.5)

    // Nodes
    const node = svg
      .append('g')
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.x0},${d.y0})`)

    const nodeRects = node
      .append('rect')
      .attr('height', (d) => d.y1 - d.y0)
      .attr('width', (d) => d.x1 - d.x0)
      .attr('fill', (d, i) => color(i))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .style('opacity', 0)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('stroke-width', 3)
        tooltip.transition().duration(200).style('opacity', 1)
        tooltip
          .html(`<strong>${d.name}</strong><br/>Value: ${d.value || 0}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px')
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke-width', 1)
        tooltip.transition().duration(200).style('opacity', 0)
      })

    nodeRects
      .transition()
      .duration(600)
      .delay((d, i) => i * 100)
      .style('opacity', 1)

    // Labels
    node
      .append('text')
      .attr('x', (d) => (d.x0 < width / 2 ? -6 : 6 + (d.x1 - d.x0)))
      .attr('y', (d) => (d.y1 - d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d) => (d.x0 < width / 2 ? 'end' : 'start'))
      .style('font-size', '11px')
      .style('font-weight', '500')
      .style('fill', '#333')
      .text((d) => d.name)
      .style('opacity', 0)
      .transition()
      .duration(600)
      .delay((d, i) => i * 100 + 300)
      .style('opacity', 1)

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 25)
      .style('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(title || 'Sankey Diagram')

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

export default SankeyDiagram

