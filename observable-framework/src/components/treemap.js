import * as d3 from "d3";
import {resize} from "@observablehq/framework";

// REFACTOR: The entire D3 treemap logic is now a self-contained component.
// It uses the Framework's `resize` utility instead of a `ResizeObserver`,
// which is the correct, idiomatic approach.

export function treemap(data_core) {
  // Data transformation is now inside the component.
  data_core.forEach(group => {
    group.children.forEach(item => {
      item.value_positive = item.value >= 0;
      item.value = Math.abs(item.value);
    });
  });

  const data = { name: "Positions", children: data_core };

  // The component returns a resize-aware container.
  return resize((width) => {
    const height = 400;

    function tile(node, x0, y0, x1, y1) {
      d3.treemapBinary(node, 0, 0, width, height);
      for (const child of node.children) {
        child.x0 = x0 + (child.x0 / width) * (x1 - x0);
        child.x1 = x0 + (child.x1 / width) * (x1 - x0);
        child.y0 = y0 + (child.y0 / height) * (y1 - y0);
        child.y1 = y0 + (child.y1 / height) * (y1 - y0);
      }
    }

    const hierarchy = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    const root = d3.treemap().tile(tile)(hierarchy);
    const x = d3.scaleLinear().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([0, height]);
    const format = d3.format(",.2f");
    const name = d => d.ancestors().reverse().map(d => d.data.name).join("/");

    const svg = d3.create("svg")
        .attr("viewBox", [0.5, -30.5, width, height + 30])
        .attr("width", width)
        .attr("height", height + 30)
        .attr("style", "max-width: 100%; height: auto;")
        .style("font", "10px sans-serif");

    let group = svg.append("g").call(render, root);

    function uid(prefix) { return `${prefix}-${Math.random().toString(36).substr(2, 9)}`; }

    function render(group, root) {
      const node = group.selectAll("g").data(root.children.concat(root)).join("g");
      node.filter(d => d === root ? d.parent : d.children).attr("cursor", "pointer").on("click", (event, d) => d === root ? zoomout(root) : zoomin(d));
      node.append("title").text(d => `${name(d)}\n${format(d.value)}`);
      node.append("rect")
          .attr("id", d => (d.leafUid = uid("leaf")))
          .attr("fill", d => d.data.value_positive === false ? "#e41a1c" : d.data.value_positive === true ? "#4daf4a" : "#ccc")
          .attr("stroke", "#fff");
      node.append("clipPath").attr("id", d => (d.clipUid = uid("clip"))).append("use").attr("xlink:href", d => `#${d.leafUid}`);
      node.append("text").attr("clip-path", d => d.clipUid)
          .selectAll("tspan").data(d => (d === root ? name(d) : d.data.name).split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
          .join("tspan")
          .attr("x", 4)
          .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
          .attr("fill", "white")
          .attr("stroke", "black")
          .attr("stroke-width", 0.2)
          .text(d => d);
      group.call(position, root);
    }

    function position(group, root) {
      group.selectAll("g")
          .attr("transform", d => d === root ? `translate(0,-30)` : `translate(${x(d.x0)},${y(d.y0)})`)
          .select("rect")
          .attr("width", d => d === root ? width : x(d.x1) - x(d.x0))
          .attr("height", d => d === root ? 30 : y(d.y1) - y(d.y0));
    }

    function zoomin(d) {
      const group0 = group.attr("pointer-events", "none");
      const group1 = group = svg.append("g").call(render, d);
      x.domain([d.x0, d.x1]);
      y.domain([d.y0, d.y1]);
      svg.transition().duration(750)
          .call(t => group0.transition(t).remove().call(position, d.parent))
          .call(t => group1.transition(t).attrTween("opacity", () => d3.interpolate(0, 1)).call(position, d));
    }

    function zoomout(d) {
      const group0 = group.attr("pointer-events", "none");
      const group1 = group = svg.insert("g", "*").call(render, d.parent);
      x.domain([d.parent.x0, d.parent.x1]);
      y.domain([d.parent.y0, d.parent.y1]);
      svg.transition().duration(750)
          .call(t => group0.transition(t).remove().attrTween("opacity", () => d3.interpolate(1, 0)).call(position, d))
          .call(t => group1.transition(t).call(position, d.parent));
    }

    return svg.node();
  });
}