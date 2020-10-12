export {default} from "./c56d1668ea7aa83a@488.js";





// const fileAttachments = new Map([["homer.txt", new URL("./files/26f39e4794b525d7ac820e8a505e78e1d40f8a03b9e01a8b1eb624d668bcdfeea89c773f9ff714825fd4f53c141b17f0bd6e6b8f07905858f709b1efc4c4058e", import.meta.url)]]);

// const file_name = fileAttachments.get(name);


// const options = [
//   { name: "Order by name", value: (a, b) => d3.ascending(a.id, b.id) },
//   { name: "Order by group", value: (a, b) => a.group - b.group || d3.ascending(a.id, b.id) },
//   { name: "Order by degree", value: (a, b) => d3.sum(b.sourceLinks, l => l.value) + d3.sum(b.targetLinks, l => l.value) - d3.sum(a.sourceLinks, l => l.value) - d3.sum(a.targetLinks, l => l.value) || d3.ascending(a.id, b.id) }
// ];

// const form = html`<form class="orderForm" style="display: flex; align-items: center; min-height: 33px;">
//                   <select class="order" name=i>${options.map(o => Object.assign(html`<option>`, { textContent: o.name }))}`;

// const timeout = setTimeout(() => {
//   form.i.selectedIndex = 1;
//   form.dispatchEvent(new CustomEvent("input"));
// }, 2000);

// form.onchange = () => {
//   form.dispatchEvent(new CustomEvent("input")); // Safari
// };

// form.oninput = (event) => {
//   if (event.isTrusted) form.onchange = null, clearTimeout(timeout);
//   form.value = options[form.i.selectedIndex].value;
// };

// form.value = options[form.i.selectedIndex].value;









// let chart2 = function (d3, DOM, width, height, graph, margin, y, color, arc, step, $0, invalidation) {
//   const svg = d3.select(DOM.svg(width * 2, height));

//   svg.append("style").text(`

//     .hover path {
//       stroke: #ccc;
//     }

//     .hover text {
//       fill: #ccc;
      
//       transition-property: fill;
//       transition-duration: 100ms;
//       transition-timing-function: ease-in-out;
//       transition-delay: 0s;
//     }

//     .hover g.primary text {
//       fill: black;
//       font-weight: bold;
      
//     }

//     .hover g.secondary text {
//       fill: #333;
//     }

//     .hover path.primary {
//       stroke: #333;
//       stroke-opacity: 1;
//     }


//     g.secondaryClicked text{
//       fill: black !important;
//       font-weight: bold !important;


//     }

//     .clicked g.primaryClicked text {
//       fill: black !important;
//       font-weight: bold !important;
//       font-size: 15px !important;
//       transition-property: font-size;
//       transition-duration: 150ms;
//       transition-timing-function: ease-in-out;
//       transition-delay: 0s;
//       /*text-shadow: rgba(94, 215, 255) 0px 0px 15px;*/
//     }


//     .clicked path.primaryClicked {
//       stroke: black !important;
//       stroke-opacity: 1 !important;

//     }



//   `);




//   //On enter, call sentenceAdd to insert new info to the graph 
//   d3.select("#addTopic")
//     .on("keypress", function () {
//       if (d3.event.keyPress === 13 || d3.event.keyCode === 13) {
//         //console.log("Congrats, you pressed enter!");
//         //alert(this.value);
//         sentenceAdd(this.value);
//       }
//     });


//   //Add new sentence as a node, and call to check if other sentences that exist are links to your OG sentence 
//   function sentenceAdd(sentence) {
//     let newSentenceNode = { 'id': sentence, 'sourceLinks': [], 'targetLinks': [], 'group': 99, 'y': 0 }
//     let n = graph.nodes.push(newSentenceNode);

//     let newLinks = [];
//     graph.nodes.forEach(function (otherSentenceNode) {

//       //Some bullshit cosine similarity to test
//       var currCosineSimilarity = .69 * (otherSentenceNode.id[0] == newSentenceNode.id[0]);
//       console.log(currCosineSimilarity);

//       //If cosine similarity above a threshold (here if it is not zero/null/false)
//       if (currCosineSimilarity) {
//         let newLink = { source: newSentenceNode, target: otherSentenceNode, value: currCosineSimilarity };
//         graph.links.push(newLink);
//         newLinks.push(newLink);
//       }

//     });
//     //update();
//     //form.dispatchEvent(new CustomEvent("input"));
//     //update2(newSentenceNode, newLinks);
//     var nodes = svg.selectAll("g")			//Select all bars
//       .enter()
//       .data(graph.nodes)
//       .transition();

//   }


//   function update22(newNode, newLinks) {
//     const newLabel = svg.append("g")
//       .attr("font-family", "sans-serif")
//       .attr("font-size", 12.5)
//       .attr("text-anchor", "start")
//       .selectAll("g")
//       .data(newNode)
//       .join("g")
//       .attr("transform", d => `translate(${margin.left + 0},${d.y = y(d.id)})`)
//       .call(g => g.append("text")
//         .attr("x", 10)
//         .attr("dy", "0.35em")
//         .attr("overflow", "scroll")
//         .attr("fill", d => d3.lab(color(d.group)).darker(1))
//         .text(d => d.id))
//       .call(g => g.append("circle")
//         //.attr("r", d => d.sourceLinks.length)
//         .attr("r", 2)
//         .attr("fill", d => color(d.group)));
//     //.style("opacity", 0.1);

//   }




//   const label = svg.append("g")
//     .attr("font-family", "sans-serif")
//     .attr("font-size", 12.5)
//     .attr("text-anchor", "start")
//     .selectAll("g")
//     .data(graph.nodes)
//     .join("g")
//     .attr("transform", d => `translate(${margin.left + 0},${d.y = y(d.id)})`)
//     .call(g => g.append("text")
//       .attr("x", 10)
//       .attr("dy", "0.35em")
//       .attr("overflow", "scroll")
//       .attr("fill", d => d3.lab(color(d.group)).darker(1))
//       .text(d => d.id))
//     .call(g => g.append("circle")
//       //.attr("r", d => d.sourceLinks.length)
//       .attr("r", 2)
//       .attr("fill", d => color(d.group)));
//   //.style("opacity", 0.1);


//   const path = svg.insert("g", "*")
//     .attr("fill", "none")
//     .attr("stroke-opacity", 0.3)
//     //.attr("stroke-width", 2)    
//     .selectAll("path")
//     .data(graph.links)
//     .join("path")
//     .attr("stroke", d => d.source.group === d.target.group ? color(d.source.group) : "#aaa")
//     .attr("stroke-width", d => (d.value - 0.65) * 35 + 1)
//     .attr("d", arc);


//   const overlay = svg.append("g")
//     .attr("fill", "none")
//     .attr("pointer-events", "all")
//     .selectAll("rect")
//     .data(graph.nodes)
//     .join("rect")
//     .attr("width", margin.left + 40)
//     .attr("height", step)
//     .attr("y", d => y(d.id) - step / 2)
//     .attr("x", margin.left)

//     .on("mouseover", d => {
//       svg.classed("hover", true);
//       label.classed("primary", n => n === d);
//       label.classed("secondary", n => n.sourceLinks.some(l => l.target === d) || n.targetLinks.some(l => l.source === d));
//       path.classed("primary", l => l.source === d || l.target === d).filter(".primary").raise();
//     })

//     .on("mouseout", d => {
//       svg.classed("hover", false);
//     })

//     .on("click", d => {
//       svg.classed("clicked", true);
//       label.classed("primaryClicked", n => n === d);
//       label.classed("secondaryClicked", n => n.sourceLinks.some(l => l.target === d) || n.targetLinks.some(l => l.source === d));
//       path.classed("primaryClicked", l => l.source === d || l.target === d).filter(".primary").raise();
//     })

//   function update() {
//     y.domain(graph.nodes.sort($0.value).map(d => d.id));

//     const t = svg.transition()
//       .duration(750);

//     label.transition(t)
//       .delay((d, i) => i * 20)
//       .attrTween("transform", d => {
//         const i = d3.interpolateNumber(d.y, y(d.id));
//         return t => `translate(${margin.left},${d.y = i(t)})`;
//       });

//     path.transition(t)
//       .duration(750 + graph.nodes.length * 20)
//       .attrTween("d", d => () => arc(d));

//     overlay.transition(t)
//       .delay((d, i) => i * 20)
//       .attr("y", d => y(d.id) - step / 2);
//   }

//   $0.addEventListener("input", update);
//   invalidation.then(() => $0.removeEventListener("input", update));

//   return svg.node();
// };

// //Not currently used
// function wrap(text, width) {
//   text.each(function () {
//     var text = d3.select(this),
//       words = text.text().split(/\s+/).reverse(),
//       word,
//       line = [],
//       lineNumber = 0,
//       lineHeight = 1.1, // ems
//       x = text.attr("x"),
//       y = text.attr("y"),
//       dy = 0, //parseFloat(text.attr("dy")),
//       tspan = text.text(null)
//         .append("tspan")
//         .attr("x", x)
//         .attr("y", y)
//         .attr("dy", dy + "em");
//     while (word = words.pop()) {
//       line.push(word);
//       tspan.text(line.join(" "));
//       if (tspan.node().getComputedTextLength() > width) {
//         line.pop();
//         tspan.text(line.join(" "));
//         line = [word];
//         tspan = text.append("tspan")
//           .attr("x", x)
//           .attr("y", y)
//           .attr("dy", ++lineNumber * lineHeight + dy + "em")
//           .text(word);
//       }
//     }
//   });
// }



// function arc(d) {
//   const y1 = d.source.y;
//   const y2 = d.target.y;
//   const r = Math.abs(y2 - y1) / 2;//
//   return `M${margin.left},${y1}A${r},${r} 0,0,${y1 < y2 ? 0 : 1} ${margin.left},${y2}`;
// }




// let arc = function (margin) {
//   return (
//     function arc(d) {
//       const y1 = d.source.y;
//       const y2 = d.target.y;
//       const r = Math.abs(y2 - y1) / 2;//
//       return `M${margin.left},${y1}A${r},${r} 0,0,${y1 < y2 ? 0 : 1} ${margin.left},${y2}`;
//     }
//   )
// };






// let y = function (d3, graph, margin, height) {
//   return (
//     d3.scalePoint(graph.nodes.map(d => d.id).sort(d3.ascending), [margin.top, height - margin.bottom])
//   )
// };


// let margin = function (width) {
//   return (
//     { top: 20, right: 20, bottom: 20, left: width * 0.05 + 650 }
//   )
// };


// let height = function (data, step, margin) {
//   return (
//     (data.nodes.length - 1) * step + margin.top + margin.bottom
//   )
// };


// let step = function () {
//   return (
//     25
//   )
// };


// let color = function (d3, graph) {
//   return (
//     d3.scaleOrdinal(graph.nodes.map(d => d.group).sort(d3.ascending), ["#00D1FF", "#00A0FF", "#00E0FF", "#00F3FF", "#00FFFF", "#00FEFF", "#1734FF", "#00C4FF", "#0EA8FF"])
//   )
// };

// let graph = function (data) {
//   const nodes = data.nodes.map(({ id, group }) => ({
//     id,
//     sourceLinks: [],
//     targetLinks: [],
//     group
//   }));

//   const nodeById = new Map(nodes.map(d => [d.id, d]));

//   const links = data.links.map(({ source, target, value }) => ({
//     source: nodeById.get(source),
//     target: nodeById.get(target),
//     value: value
//   }));

//   for (const link of links) {
//     const { source, target, value } = link;
//     source.sourceLinks.push(link);
//     target.targetLinks.push(link);

//   }

//   return { nodes, links };
// };


// let data = function (FileAttachment) {
//   return (
//     FileAttachment("homer.txt").json()
//   )
// };


// let d3 = function (require) {
//   return (
//     require("d3@5")
//   )
// };









// /*
//   //Add one new value to dataset
//   var maxValue = 25;
//   var newNumber = Math.floor(Math.random() * maxValue);	//New random integer (0-24)
//   dataset.push(newNumber);			 			 		//Add new number to array

//   //Update scale domains
//   xScale.domain(d3.range(dataset.length));	//Recalibrate the x scale domain, given the new length of dataset
//   yScale.domain([0, d3.max(dataset)]);		//Recalibrate the y scale domain, given the new max value in dataset

//   //Select…
//   var bars = svg.selectAll("rect")			//Select all bars
//     .data(dataset);	//Re-bind data to existing bars, return the 'update' selection
//                     //'bars' is now the update selection
//   //Enter…
//   bars.enter()	//References the enter selection (a subset of the update selection)
//     .append("rect")	//Creates a new rect
//     .attr("x", w)		//Initial x position of the rect beyond the right edge of SVG
//     .attr("y", function(d) {	//Sets the y value, based on the updated yScale
//       return h - yScale(d);
//     })
//     .attr("width", xScale.bandwidth())	//Sets the width value, based on the updated xScale
//     .attr("height", function(d) {			//Sets the height value, based on the updated yScale
//       return yScale(d);
//     })
//     .attr("fill", function(d) {				//Sets the fill value
//       return "rgb(0, 0, " + Math.round(d * 10) + ")";
//     })
//     .merge(bars)							//Merges the enter selection with the update selection
//     .transition()							//Initiate a transition on all elements in the update selection (all rects)
//     .duration(500)
//     .attr("x", function(d, i) {				//Set new x position, based on the updated xScale
//       return xScale(i);
//     })
//     .attr("y", function(d) {				//Set new y position, based on the updated yScale
//       return h - yScale(d);
//     })
//     .attr("width", xScale.bandwidth())		//Set new width value, based on the updated xScale
//     .attr("height", function(d) {			//Set new height value, based on the updated yScale
//       return yScale(d);
//     });

//   //Update all labels
//   var labels = svg.selectAll("text")
//                    .data(dataset);

//   labels.enter()
//      .append("text")
//      .text(function(d) {
//          return d;
//      })
//      .attr("text-anchor", "middle")
//      .attr("font-family", "sans-serif")
//      .attr("font-size", "11px")
//      .attr("fill", function(d) {
//         if (d < 0.07 * maxValue){	return "black"	}
//          else {	return "white"	}
//        })
//      .attr("x", function(d, i) {
//       return w + xScale.bandwidth() / 2;
//      })
//      .attr("y", function(d) {
//       if (d < 0.07 * maxValue){	return h - yScale(d) - 7	}
//        else {	return h - yScale(d) + 14;	}
//      })
//      .merge(labels)
//      .transition()
//      .duration(500)
//      .attr("x", function(d, i) { //Set new x position, based on the updated xScale
//       return xScale(i) + xScale.bandwidth() / 2;
//     })

// });
// */