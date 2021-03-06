function macNCheese(selector, data, form) {
    
    const graph = getGraph(data);

    const color = d3.scaleOrdinal(graph.nodes.map(d => d.group).sort(d3.ascending), ["#00D1FF", "#00A0FF", "#00E0FF", "#00F3FF", "#00FFFF", "#00FEFF","#1734FF","#00C4FF","#0EA8FF"]);

    const step = 25;

    const width = window.screen.width;

    const margin = ({top: 20, right: 20, bottom: 20, left: width*0.05 + 640});

    const height = (data.nodes.length - 1) * step + margin.top + margin.bottom;

    const y = d3.scalePoint(graph.nodes.map(d => d.id).sort(d3.ascending), [margin.top, height - margin.bottom]);

    function arc(d) {
        const y1 = d.source.y;
        const y2 = d.target.y;
        const r = Math.abs(y2 - y1) / 2;//
        return `M${margin.left},${y1}A${r},${r} 0,0,${y1 < y2 ? 0 : 1} ${margin.left},${y2}`;
    }

    const svg = d3.select(selector)
        .append("svg")
        .attr("width", width*2)
        .attr("height", height);
    
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
        // .attr("stroke-width", 4)
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
            d = d.target.__data__;
            svg.classed("hover", true);
            label.classed("primary", n => n === d);
            label.classed("secondary", n => n.sourceLinks.some(l => l.target === d) || n.targetLinks.some(l => l.source === d));
            path.classed("primary", l => l.source === d || l.target === d).filter(".primary").raise();
        })
        .on("mouseout", d => {
            svg.classed("hover", false);
            // label.classed("primary", false);
            // label.classed("secondary", false);
            // path.classed("primary", false).order();
        })
        .on("click", d => {
            d = d.target.__data__;
            svg.classed("clicked", true);
            label.classed("primaryClicked", n => n === d);
            label.classed("secondaryClicked", n => n.sourceLinks.some(l => l.target === d) || n.targetLinks.some(l => l.source === d));
            path.classed("primaryClicked", l => l.source === d || l.target === d).filter(".primary").raise();
        });
    
    function update() {
        y.domain(graph.nodes.sort(form.value).map(d => d.id));
    
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
    
    form.addEventListener("input", update);
    // invalidation.then(() => form.removeEventListener("input", update));

    //On enter, call sentenceAdd to insert new info to the graph 
    d3.select("#addTopic")
        .on("keypress", function(event) {
        if(event.keyPress === 13 || event.keyCode === 13){
            console.log("Congrats, you pressed enter!");
            //alert(this.value);
            console.log(this.value);

            newEmbeddings([this.value]);
            // sentenceAdd(newEmbeddings);

        }
    });





    function newEmbeddings(sentenceArray){

        let sentEmbeddingDict = {};

        const chunkJSON = JSON.stringify(Object.assign({}, sentenceArray));
        const sendingJSON = JSON.stringify({chunk: chunkJSON});
        const proxyurl = 'https://cors-anywhere.herokuapp.com/';
        fetch(proxyurl + 'http://api.hebbia.ai/chunk_embeddings/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'api.hebbia.ai/*'
            },
            body: sendingJSON
        }).then(response => response.json()).then(response => sentencesAdd(response));

    }



    //Add new sentence as a node, and call to check if other sentences that exist are links to your OG sentence 
    function sentencesAdd(sentenceEmbeddingDict){

        for (let sentence of Object.keys(sentEmbeddingDict)) {
            sentenceAdd(sentence, sentEmbeddingDict[sentence].split(", ").map(Number));

        }

    }
    



    //Add new sentence as a node, and call to check if other sentences that exist are links to your OG sentence 
    function sentenceAdd(sentence, embeddingArray){
        
        console.log("NEW SENTENCE ADD");
        console.log(sentence, embeddingArray);

        let newSentenceNode = {'id':sentence, 'sourceLinks': [], 'targetLinks': [], 'group': 99, 'y': 0}
        let n = graph.nodes.push(newSentenceNode);      

        let newLinks = [];
        graph.nodes.forEach(function(otherSentenceNode) {

            //Some bullshit cosine similarity to test
            var currCosineSimilarity = .69 * (otherSentenceNode.id[0] == newSentenceNode.id[0]);
            console.log(currCosineSimilarity);

            //If cosine similarity above a threshold (here if it is not zero/null/false)
            if(currCosineSimilarity){
                let newLink = {source: newSentenceNode, target: otherSentenceNode, value: currCosineSimilarity};
                graph.links.push(newLink);
                newLinks.push(newLink);
            }

        });
        //update();
        //form.dispatchEvent(new CustomEvent("input"));
        //update2(newSentenceNode, newLinks);
        var nodes = svg.selectAll("g")			//Select all bars
            .enter()
            .data(graph.nodes)
            .transition();
        
        update();
    }
    
    return svg.node();
}


function getGraph(data) {
    const nodes = data.nodes.map(({id, group}) => ({
        id,
        sourceLinks: [],
        targetLinks: [],
        group
    }));
  
    const nodeById = new Map(nodes.map(d => [d.id, d]));
  
    const links = data.links.map(({source, target, value}) => ({
        source: nodeById.get(source),
        target: nodeById.get(target),
        value: value
    }));
  
    for (const link of links) {
        const {source, target, value} = link;
        source.sourceLinks.push(link);
        target.targetLinks.push(link);
    }
  
    return {nodes, links};
}

function getForm() {
    const options = [
        { name: "Order by name", value: (a, b) => d3.ascending(a.id, b.id) },
        { name: "Order by group", value: (a, b) => a.group - b.group || d3.ascending(a.id, b.id) },
        { name: "Order by degree", value: (a, b) => d3.sum(b.sourceLinks, l => l.value) + d3.sum(b.targetLinks, l => l.value) - d3.sum(a.sourceLinks, l => l.value) - d3.sum(a.targetLinks, l => l.value) || d3.ascending(a.id, b.id) }
    ];

    /**
     * @param {String} HTML representing a single element
     * @return {Element}
     */
    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    const form = htmlToElement(
        `
        <form class="orderForm" style="display: flex; align-items: center; min-height: 33px;">
        <select class="order" name=i>
        ${options.map(o => Object.assign(htmlToElement(`<option>`), { textContent: o.name }).outerHTML).join("")}
        `
    );

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
}