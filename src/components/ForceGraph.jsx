import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './ForceGraph.scss'

const ForceGraph = ({ data, title }) => {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 800
    const height = 600
    const margin = { top: 40, right: 30, bottom: 30, left: 30 }

    svg.attr('width', width).attr('height', height)

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

    const g = svg.append('g')

    // Create force simulation
    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        'link',
        d3.forceLink(data.links).id((d) => d.id).distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d) => d.size || 20))

    // Create links
    const link = g
      .append('g')
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d) => Math.sqrt(d.value || 1))
      .style('opacity', 0)

    link.transition().duration(1000).style('opacity', 0.6)

    // Create nodes
    const node = g
      .append('g')
      .selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('r', (d) => d.size || 10)
      .attr('fill', (d, i) => d3.schemeCategory10[i % 10])
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .call(
        d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      )

    // Labels
    const label = g
      .append('g')
      .selectAll('text')
      .data(data.nodes)
      .enter()
      .append('text')
      .text((d) => d.label || d.id)
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('fill', '#333')
      .style('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .attr('dy', 4)

    // Tooltip on hover
    node
      .on('mouseover', function (event, d) {
        d3.select(this).transition().duration(200).attr('stroke-width', 4)
        tooltip.transition().duration(200).style('opacity', 1)
        tooltip
          .html(`<strong>${d.label || d.id}</strong><br/>Connections: ${d.connections || 0}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px')
      })
      .on('mouseout', function () {
        d3.select(this).transition().duration(200).attr('stroke-width', 2)
        tooltip.transition().duration(200).style('opacity', 0)
      })

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y)

      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y)

      label.attr('x', (d) => d.x).attr('y', (d) => d.y + (d.size || 10) + 15)
    })

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event, d) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 25)
      .style('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(title || 'Force-Directed Graph')

    return () => {
      simulation.stop()
      tooltip.remove()
    }
  }, [data, title])

  return (
    <div className="chart-container">
      <svg ref={svgRef}></svg>
    </div>
  )
}

export default ForceGraph



