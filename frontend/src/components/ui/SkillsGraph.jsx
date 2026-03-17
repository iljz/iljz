import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';

const DEFAULT_GRAPH_WIDTH = 960;
const CATEGORY_COLORS = {
  Languages: '#8ecae6',
  'ML/AI': '#ffb703',
  'Web & Backend': '#90be6d',
  'Tools & Infrastructure': '#f28482',
};

function buildSkillGraphData(allSkills, featuredProjects) {
  const nodes = new Map();
  const links = new Map();

  const addLink = (source, target, projectTitle) => {
    if (source === target || !nodes.has(source) || !nodes.has(target)) return;
    const [from, to] = [source, target].sort((a, b) => a.localeCompare(b));
    const key = `${from}__${to}`;
    const current = links.get(key) ?? { source: from, target: to, weight: 0, sharedProjects: new Set() };
    current.weight += 1;
    if (projectTitle) current.sharedProjects.add(projectTitle);
    links.set(key, current);
  };

  Object.entries(allSkills).forEach(([category, items]) => {
    items.forEach((skill) => {
      const name = typeof skill === 'string' ? skill : skill.name;
      const proficiency = typeof skill === 'object' ? (skill.proficiency ?? 3) : 3;
      const years = typeof skill === 'object' ? (skill.years ?? null) : null;
      const note = typeof skill === 'object' ? (skill.note ?? null) : null;
      nodes.set(name, { id: name, category, proficiency, years, note, neighbors: new Set(), projects: new Set() });
    });
  });

  featuredProjects.forEach((project) => {
    const matched = project.tech.filter((t) => nodes.has(t));
    matched.forEach((name) => nodes.get(name).projects.add(project.title));
    matched.forEach((src, i) =>
      matched.slice(i + 1).forEach((tgt) => addLink(src, tgt, project.title))
    );
  });

  links.forEach((link) => {
    nodes.get(link.source).neighbors.add(link.target);
    nodes.get(link.target).neighbors.add(link.source);
  });

  const graphNodes = Array.from(nodes.values()).map((n) => ({
    ...n,
    degree: n.neighbors.size,
    neighbors: Array.from(n.neighbors).sort(),
    projectCount: n.projects.size,
    projects: Array.from(n.projects).sort(),
  }));

  const graphLinks = Array.from(links.values()).map((l) => ({
    source: l.source,
    target: l.target,
    weight: l.weight,
    sharedProjects: Array.from(l.sharedProjects),
  }));

  const topSkill = [...graphNodes].sort((a, b) =>
    b.proficiency !== a.proficiency ? b.proficiency - a.proficiency : b.projectCount - a.projectCount
  )[0];

  return { nodes: graphNodes, links: graphLinks, categories: Object.keys(allSkills), topSkillId: topSkill?.id ?? null };
}

const ProficiencyDots = ({ level }) => (
  <div className="flex items-center gap-1.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i} className={`h-2 w-2 rounded-full ${i <= level ? 'bg-ivory' : 'bg-white/15'}`} />
    ))}
  </div>
);

function softCurve(sx, sy, tx, ty) {
  const mx = (sx + tx) / 2;
  const my = (sy + ty) / 2;
  const dx = tx - sx;
  const dy = ty - sy;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const offset = Math.min(len * 0.18, 36);
  return `M${sx},${sy} Q${mx + (-dy / len) * offset},${my + (dx / len) * offset} ${tx},${ty}`;
}

const SkillsGraph = ({ skills, projects }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const highlightRef = useRef(null);

  const [graphWidth, setGraphWidth] = useState(0);
  const [hoveredSkillId, setHoveredSkillId] = useState(null);
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const data = useMemo(() => buildSkillGraphData(skills, projects), [projects, skills]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const measure = () =>
      setGraphWidth(el.getBoundingClientRect().width || el.clientWidth || DEFAULT_GRAPH_WIDTH);
    measure();
    const observer = new ResizeObserver(([entry]) =>
      setGraphWidth(entry.contentRect.width || DEFAULT_GRAPH_WIDTH)
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const resolvedWidth = graphWidth || DEFAULT_GRAPH_WIDTH;
  const height = Math.max(400, Math.min(540, resolvedWidth * 0.48));

  const activeSkillId = hoveredSkillId ?? selectedSkillId;
  const activeSkill = data.nodes.find((n) => n.id === activeSkillId) ?? null;
  const activeSkillLinks = activeSkill
    ? data.links.filter((l) => l.source === activeSkill.id || l.target === activeSkill.id)
    : [];

  // --- Main D3 simulation effect ---
  useEffect(() => {
    if (!svgRef.current || !resolvedWidth) return undefined;

    const width = resolvedWidth;
    const nodes = data.nodes.map((n) => ({ ...n }));
    const links = data.links.map((l) => ({ ...l }));
    const radiusScale = d3.scaleLinear().domain([1, 5]).range([12, 26]);
    const categoryX = new Map(
      data.categories.map((cat, i) => [cat, ((i + 1) * width) / (data.categories.length + 1)])
    );

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');

    const simulation = d3
      .forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((n) => n.id).distance(90).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('collision', d3.forceCollide().radius((n) => radiusScale(n.proficiency ?? 3) + 14))
      .force('x', d3.forceX((n) => categoryX.get(n.category) ?? width / 2).strength(0.12))
      .force('y', d3.forceY(height / 2).strength(0.08))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .alphaTarget(0.02)
      .alphaDecay(0.02);

    simulationRef.current = simulation;

    const pathSel = svg.append('g').selectAll('path').data(links).join('path')
      .attr('fill', 'none')
      .attr('stroke-linecap', 'round')
      .attr('stroke', '#f7d488')
      .attr('stroke-width', (l) => Math.max(1.2, l.weight * 1.5))
      .attr('stroke-opacity', 0.35);

    const nodeSel = svg.append('g').selectAll('g').data(nodes).join('g').style('cursor', 'pointer');

    nodeSel.append('circle')
      .attr('r', (n) => radiusScale(n.proficiency ?? 3))
      .attr('fill', (n) => CATEGORY_COLORS[n.category] ?? '#d6d3d1')
      .attr('fill-opacity', 0.92)
      .attr('stroke', '#1a1a1a')
      .attr('stroke-width', 1.5);

    nodeSel.append('text')
      .attr('x', (n) => radiusScale(n.proficiency ?? 3) + 5)
      .attr('y', -8)
      .attr('dy', '0.35em')
      .attr('fill', '#fafaf9')
      .attr('font-size', '10px')
      .attr('font-weight', 600)
      .attr('pointer-events', 'none')
      .attr('stroke', '#09090b')
      .attr('stroke-width', 3)
      .attr('paint-order', 'stroke')
      .text((n) => n.id);

    nodeSel
      .on('mouseenter', (_event, n) => setHoveredSkillId(n.id))
      .on('mouseleave', () => setHoveredSkillId(null))
      .on('click', (event, n) => {
        event.stopPropagation();
        setSelectedSkillId((cur) => (cur === n.id ? null : n.id));
      });

    svg.on('click', () => setSelectedSkillId(null));

    nodeSel.call(
      d3.drag()
        .on('start', (event, n) => { if (!event.active) simulation.alphaTarget(0.15).restart(); n.fx = n.x; n.fy = n.y; })
        .on('drag', (event, n) => { n.fx = event.x; n.fy = event.y; })
        .on('end', (event, n) => { if (!event.active) simulation.alphaTarget(0.02); n.fx = null; n.fy = null; })
    );

    simulation.on('tick', () => {
      pathSel.attr('d', (l) => {
        const sx = Math.max(30, Math.min(width - 30, l.source.x));
        const sy = Math.max(30, Math.min(height - 30, l.source.y));
        const tx = Math.max(30, Math.min(width - 30, l.target.x));
        const ty = Math.max(30, Math.min(height - 30, l.target.y));
        return softCurve(sx, sy, tx, ty);
      });
      nodeSel.attr('transform', (n) => {
        n.x = Math.max(30, Math.min(width - 30, n.x));
        n.y = Math.max(30, Math.min(height - 30, n.y));
        return `translate(${n.x},${n.y})`;
      });
    });

    highlightRef.current = { pathSel, nodeSel, links };
    return () => { simulation.stop(); simulationRef.current = null; highlightRef.current = null; };
  }, [data, resolvedWidth, height]);

  // --- Lightweight highlight effect ---
  useEffect(() => {
    const h = highlightRef.current;
    if (!h) return;
    const { pathSel, nodeSel, links: simLinks } = h;
    const active = activeSkillId;

    const linkedPairs = new Set(
      simLinks.flatMap((l) => {
        const sId = typeof l.source === 'object' ? l.source.id : l.source;
        const tId = typeof l.target === 'object' ? l.target.id : l.target;
        return [`${sId}->${tId}`, `${tId}->${sId}`];
      })
    );
    const isNeighbor = (id) => linkedPairs.has(`${active}->${id}`);

    pathSel
      .attr('stroke-opacity', (l) => {
        if (!active) return 0.35;
        const sId = typeof l.source === 'object' ? l.source.id : l.source;
        const tId = typeof l.target === 'object' ? l.target.id : l.target;
        return sId === active || tId === active ? 0.9 : 0.06;
      })
      .attr('stroke', (l) => {
        const sId = typeof l.source === 'object' ? l.source.id : l.source;
        const tId = typeof l.target === 'object' ? l.target.id : l.target;
        if (active && (sId === active || tId === active)) return '#fafaf9';
        return '#f7d488';
      });

    nodeSel.select('circle').each(function (n) {
      const el = d3.select(this);
      if (!active) el.attr('opacity', 1).attr('stroke', '#1a1a1a').attr('stroke-width', 1.5);
      else if (n.id === active) el.attr('opacity', 1).attr('stroke', '#fafaf9').attr('stroke-width', 3);
      else if (isNeighbor(n.id)) el.attr('opacity', 1).attr('stroke', '#d6d3d1').attr('stroke-width', 1.5);
      else el.attr('opacity', 0.3).attr('stroke', '#1a1a1a').attr('stroke-width', 1.5);
    });

    nodeSel.select('text').attr('opacity', (n) => {
      if (!active) return 1;
      return n.id === active || isNeighbor(n.id) ? 1 : 0.35;
    });
  }, [activeSkillId]);

  return (
    <div className="space-y-4">
      {/* Compact legend */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {data.categories.map((category) => (
            <span key={category} className="flex items-center gap-1.5 text-xs text-silver">
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[category] ?? '#d6d3d1' }}
              />
              {category}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-silver/50">
          <span>Node size = proficiency</span>
          <span>Arc thickness = shared projects</span>
        </div>
      </div>

      {/* Graph */}
      <div
        ref={containerRef}
        className="overflow-hidden rounded-[1rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] shadow-[0_24px_80px_rgba(0,0,0,0.25)]"
        style={{ height }}
      >
        <svg ref={svgRef} className="h-full w-full" />
      </div>

      {/* Detail card — expands below graph, no nested scroll */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: activeSkill ? '1fr' : '0fr',
          opacity: activeSkill ? 1 : 0,
          transition: 'grid-template-rows 250ms ease, opacity 200ms ease',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div className="rounded-[1rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6">
            {activeSkill && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                {/* Identity */}
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[activeSkill.category] ?? '#d6d3d1' }}
                    />
                    <h4 className="font-display text-2xl text-ivory">{activeSkill.id}</h4>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-silver">Proficiency</span>
                      <ProficiencyDots level={activeSkill.proficiency} />
                    </div>
                    {activeSkill.years != null && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-silver">Experience</span>
                        <span className="text-xs text-ivory">{activeSkill.years}y</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-silver">Category</span>
                      <span className="text-xs text-ivory">{activeSkill.category}</span>
                    </div>
                  </div>
                  {activeSkill.note && (
                    <p className="mt-4 text-sm leading-relaxed text-silver">{activeSkill.note}</p>
                  )}
                </div>

                {/* Connected via projects */}
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-silver mb-3">Connected via projects</p>
                  {activeSkillLinks.length > 0 ? (
                    <div className="space-y-2">
                      {activeSkillLinks.map((link) => {
                        const otherSkill = link.source === activeSkill.id ? link.target : link.source;
                        return (
                          <div key={otherSkill} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                            <button
                              type="button"
                              onClick={() => setSelectedSkillId(otherSkill)}
                              className="text-sm font-medium text-ivory hover:underline"
                            >
                              {otherSkill}
                            </button>
                            <p className="mt-0.5 text-xs text-silver">{link.sharedProjects.join(', ')}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-silver">No project connections.</p>
                  )}
                </div>

                {/* Featured projects */}
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-silver mb-3">Featured projects</p>
                  {activeSkill.projects.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {activeSkill.projects.map((title) => (
                        <span
                          key={title}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-silver"
                        >
                          {title}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-silver">Not referenced in featured projects.</p>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsGraph;
