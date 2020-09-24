export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["homer.txt", new URL("./files/26f39e4794b525d7ac820e8a505e78e1d40f8a03b9e01a8b1eb624d668bcdfeea89c773f9ff714825fd4f53c141b17f0bd6e6b8f07905858f709b1efc4c4058e", import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));


  main.variable(observer("viewof order")).define("viewof order", ["d3", "html"], function (d3, html) {

    const options = [
      { name: "Order by name", value: (a, b) => d3.ascending(a.id, b.id) },
      { name: "Order by group", value: (a, b) => a.group - b.group || d3.ascending(a.id, b.id) },
      { name: "Order by degree", value: (a, b) => d3.sum(b.sourceLinks, l => l.value) + d3.sum(b.targetLinks, l => l.value) - d3.sum(a.sourceLinks, l => l.value) - d3.sum(a.targetLinks, l => l.value) || d3.ascending(a.id, b.id) }
    ];

    const form = html`<form class="orderForm" style="display: flex; align-items: center; min-height: 33px;"><select class="order" name=i>${options.map(o => Object.assign(html`<option>`, { textContent: o.name }))}`;

    const timeout = setTimeout(() => {
      form.i.selectedIndex = 1;
      form.dispatchEvent(new CustomEvent("input"));
    }, 2000);

    form.onchange = () => {
      form.dispatchEvent(new CustomEvent("input")); // Safari
    };

    form.oninput = (event) => {
      if (event.isTrusted) form.onchange = null, clearTimeout(timeout);
      form.value = options[form.i.selectedIndex].value;
    };

    form.value = options[form.i.selectedIndex].value;
    return form;

  });



  
 // main.variable(observer("order")).define("order", ["Generators", "viewof order"], (G, _) => G.input(_));

  main.variable(observer("chart2")).define("chart2", ["d3", "DOM", "width", "height", "graph", "margin", "y", "color", "arc", "step", "viewof order", "invalidation"], function (d3, DOM, width, height, graph, margin, y, color, arc, step, $0, invalidation) {
    const svg = d3.select(DOM.svg(width*2, height));

    svg.append("style").text(`

    .hover path {
      stroke: #ccc;
    }

    .hover text {
      fill: #ccc;
      
      transition-property: fill;
      transition-duration: 100ms;
      transition-timing-function: ease-in-out;
      transition-delay: 0s;
    }

    .hover g.primary text {
      fill: black;
      font-weight: bold;
      
    }

    .hover g.secondary text {
      fill: #333;
    }

    .hover path.primary {
      stroke: #333;
      stroke-opacity: 1;
    }


    g.secondaryClicked text{
      fill: black !important;
      font-weight: bold !important;


    }

    .clicked g.primaryClicked text {
      fill: black !important;
      font-weight: bold !important;
      font-size: 15px !important;
      transition-property: font-size;
      transition-duration: 150ms;
      transition-timing-function: ease-in-out;
      transition-delay: 0s;
      /*text-shadow: rgba(94, 215, 255) 0px 0px 15px;*/
    }


    .clicked path.primaryClicked {
      stroke: black !important;
      stroke-opacity: 1 !important;

    }



  `);

    const label = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12.5)
      .attr("text-anchor", "start")
      .selectAll("g")
      .data(graph.nodes)
      .join("g")
      .attr("transform", d => `translate(${margin.left + 0},${d.y = y(d.id)})`)
      .call(g => g.append("text")
        .attr("x", 10)
        .attr("dy", "0.35em")        
        .attr("overflow", "scroll")
        .attr("fill", d => d3.lab(color(d.group)).darker(1))
        .text(d => d.id))
      .call(g => g.append("circle")
        //.attr("r", d => d.sourceLinks.length)
        .attr("r", 2)
        .attr("fill", d => color(d.group)));
    //.style("opacity", 0.1);


    const path = svg.insert("g", "*")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.3)
      //.attr("stroke-width", 2)    
      .selectAll("path")
      .data(graph.links)
      .join("path")
      .attr("stroke", d => d.source.group === d.target.group ? color(d.source.group) : "#aaa")
      .attr("stroke-width", d => (d.value-0.65)*35 + 1)
      .attr("d", arc);

    const overlay = svg.append("g")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .selectAll("rect")
      .data(graph.nodes)
      .join("rect")
      .attr("width", margin.left + 40)
      .attr("height", step)
      .attr("y", d => y(d.id) - step / 2)
      .attr("x", margin.left)

      .on("mouseover", d => {
        svg.classed("hover", true);
        label.classed("primary", n => n === d);
        label.classed("secondary", n => n.sourceLinks.some(l => l.target === d) || n.targetLinks.some(l => l.source === d));
        path.classed("primary", l => l.source === d || l.target === d).filter(".primary").raise();
      })

      .on("mouseout", d => {
        svg.classed("hover", false);
      })

      .on("click", d => {
        svg.classed("clicked", true);
        label.classed("primaryClicked", n => n === d);
        label.classed("secondaryClicked", n => n.sourceLinks.some(l => l.target === d) || n.targetLinks.some(l => l.source === d));
        path.classed("primaryClicked", l => l.source === d || l.target === d).filter(".primary").raise();
      })

    function update() {
      y.domain(graph.nodes.sort($0.value).map(d => d.id));

      const t = svg.transition()
        .duration(750);

      label.transition(t)
        .delay((d, i) => i * 20)
        .attrTween("transform", d => {
          const i = d3.interpolateNumber(d.y, y(d.id));
          return t => `translate(${margin.left},${d.y = i(t)})`;
        });

      path.transition(t)
        .duration(750 + graph.nodes.length * 20)
        .attrTween("d", d => () => arc(d));

      overlay.transition(t)
        .delay((d, i) => i * 20)
        .attr("y", d => y(d.id) - step / 2);
    }

    $0.addEventListener("input", update);
    invalidation.then(() => $0.removeEventListener("input", update));

    return svg.node();
  }
  );

//unused
  function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}



  function arc(d) {
    const y1 = d.source.y;
    const y2 = d.target.y;
    const r = Math.abs(y2 - y1) / 2;//
    return `M${margin.left},${y1}A${r},${r} 0,0,${y1 < y2 ? 0 : 1} ${margin.left},${y2}`;
  }






  main.variable(observer("arc")).define("arc", ["margin"], function (margin) {
    return (
      function arc(d) {
        const y1 = d.source.y;
        const y2 = d.target.y;
        const r = Math.abs(y2 - y1) / 2;//
        return `M${margin.left},${y1}A${r},${r} 0,0,${y1 < y2 ? 0 : 1} ${margin.left},${y2}`;
      }
    )
  });






  main.variable(observer("y")).define("y", ["d3", "graph", "margin", "height"], function (d3, graph, margin, height) {
    return (
      d3.scalePoint(graph.nodes.map(d => d.id).sort(d3.ascending), [margin.top, height - margin.bottom])
    )
  });

  
  main.variable(observer("margin")).define("margin", ["width"], function (width) {
    return (
      { top: 20, right: 20, bottom: 20, left: width*0.05 + 650 }
    )
  });
  main.variable(observer("height")).define("height", ["data", "step", "margin"], function (data, step, margin) {
    return (
      (data.nodes.length - 1) * step + margin.top + margin.bottom
    )
  });
  main.variable(observer("step")).define("step", function () {
    return (
      25
    )
  });
  main.variable(observer("color")).define("color", ["d3", "graph"], function (d3, graph) {
    return (
      d3.scaleOrdinal(graph.nodes.map(d => d.group).sort(d3.ascending), ["#00D1FF", "#00A0FF", "#00E0FF", "#00F3FF", "#00FFFF", "#00FEFF","#1734FF","#00C4FF","#0EA8FF"])
    )
  });
  main.variable(observer("graph")).define("graph", ["data"], function (data) {
    const nodes = data.nodes.map(({ id, group }) => ({
      id,
      sourceLinks: [],
      targetLinks: [],
      group
    }));

    const nodeById = new Map(nodes.map(d => [d.id, d]));

    const links = data.links.map(({ source, target, value }) => ({
      source: nodeById.get(source),
      target: nodeById.get(target),
      value: value
    }));

    for (const link of links) {
      const { source, target, value } = link;
      source.sourceLinks.push(link);
      target.targetLinks.push(link);

    }

    return { nodes, links };
  }
  );
  main.variable(observer("data")).define("data", ["FileAttachment"], function (FileAttachment) {
    return (
      FileAttachment("homer.txt").json()
    )
  });
  main.variable(observer("d3")).define("d3", ["require"], function (require) {
    return (
      require("d3@5")
    )
  });
  return main;
}
