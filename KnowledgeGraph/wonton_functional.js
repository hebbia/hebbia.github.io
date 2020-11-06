const SIMILARITY_THRESHOLD = 0.75;

function macNCheese(selector, corpusEmbeddings, form) {

    const data = organizeForD3(corpusEmbeddings);

    const graph = getGraph(data);

    const color = d3.scaleOrdinal(graph.nodes.map(d => d.group).sort(d3.ascending), ["#00D1FF", "#00A0FF", "#00E0FF", "#00F3FF", "#00FFFF", "#00FEFF","#1734FF","#00C4FF","#0EA8FF"]);

    const step = 25;

    const width = window.screen.width;

    const margin = ({top: 20, right: 20, bottom: 20, left: width*0.05 + 640});

    let height = (data.nodes.length - 1) * step + margin.top + margin.bottom;

    let y = d3.scalePoint(graph.nodes.sort(form.value).map(d => d.id), [margin.top, height - margin.bottom]);

    function arc(d) {
        const y1 = d.source.y;
        const y2 = d.target.y;
        const r = Math.abs(y2 - y1) / 2;
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

    function bindLabels(selection) {
        return selection
            .data(graph.nodes)
            .join(
                enter => bindSingularLabel(enter.append("g"), "append"),
                update => bindSingularLabel(update, "select")
            );
    }

    function bindSingularLabel(selection, method) {
        return selection
            .attr("transform", d => `translate(${margin.left + 0},${d.y = y(d.id)})`)
            .call(g => g[method]("text")
                .attr("x", 10)
                .attr("dy", "0.35em")
                .attr("overflow", "scroll")
                .attr("fill", d => d3.lab(color(d.group)).darker(1))
                .text(d => d.id))
            .call(g => g[method]("circle")
                //.attr("r", d => d.sourceLinks.length)
                .attr("r", 2)
                .attr("fill", d => color(d.group)));
                //.style("opacity", 0.1);
    }

    function bindPaths(selection) {
        return selection
            .data(graph.links)
            .join("path")
            .attr("stroke", d => d.source.group === d.target.group ? color(d.source.group) : "#aaa")
            .attr("stroke-width", d => (d.value-0.65)*35 + 1)
            .attr("d", arc);
    }

    function bindOverlays(selection) {
        return selection
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
    }
    
    let label = bindLabels(
        svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 12.5)
            .attr("text-anchor", "start")
            .selectAll("g")
    );
    
    let path = bindPaths(
        svg.insert("g", "*")
            .attr("fill", "none")
            .attr("stroke-opacity", 0.3)
            // .attr("stroke-width", 4)
            .selectAll("path")
    );
    
    let overlay = bindOverlays(
        svg.append("g")
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .selectAll("rect")
    );

    function updateOrder() {
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

    function updateContent() {
        height = (graph.nodes.length - 1) * step + margin.top + margin.bottom;

        svg.attr("height", height);

        y = d3.scalePoint(graph.nodes.sort(form.value).map(d => d.id), [margin.top, height - margin.bottom]);

        label = bindLabels(label);

        path = bindPaths(path);

        overlay = bindOverlays(overlay);
    }



    form.addEventListener("input", updateOrder);
    // invalidation.then(() => form.removeEventListener("input", update));

    //On enter, call sentenceAdd to insert new info to the graph 
    d3.select("#addTopic")
        .on("keypress", function(event) {
        if(event.keyPress === 13 || event.keyCode === 13){
            // console.log("Congrats, you pressed enter!");
            //alert(this.value);
            let sentences = sentence_splitter.splitSentences(this.value)
                                             .map(sentence => sentence.trim())
                                             .filter(sentence => sentence.length > 0);

            // console.log(sentences);

            newEmbeddings(sentences);
            // sentenceAdd(newEmbeddings);

        }
    });



    function newEmbeddings(sentenceArray){

        const chunkJSON = JSON.stringify(Object.assign({}, sentenceArray));
        const sendingJSON = JSON.stringify({chunk: chunkJSON});
        const proxyurl = 'https://api2.hebbia.ai/proxy/';
        fetch(proxyurl + 'https://api2.hebbia.ai/chunk_embeddings/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'api.hebbia.ai/*'
            },
            body: sendingJSON
        }).then(response => response.json()).then(response => sentencesAdd(response));

    }



    //Add new sentence as a node, and call to check if other sentences that exist are links to your OG sentence 
    function sentencesAdd(sentEmbeddingDict){

        for (let sentence of Object.keys(sentEmbeddingDict)) {
            if (corpusEmbeddings[sentence]) continue;

            corpusEmbeddings[sentence] = sentEmbeddingDict[sentence];

            sentenceAdd(sentence);
        }

    }
    


    //Add new sentence as a node, and call to check if other sentences that exist are links to your OG sentence 
    function sentenceAdd(sentence){
        
        // console.log("NEW SENTENCE ADD");
        // console.log(sentence, corpusEmbeddings[sentence]);

        let newSentenceNode = {'id': sentence, 'sourceLinks': [], 'targetLinks': [], 'group': 99, 'y': 0}
        let n = graph.nodes.push(newSentenceNode);      

        let newLinks = [];
        graph.nodes.forEach(function(otherSentenceNode) {

            if (otherSentenceNode.id === newSentenceNode.id) return;

            //Some bullshit cosine similarity to test
            var currCosineSimilarity = cosineSim(corpusEmbeddings[sentence], corpusEmbeddings[otherSentenceNode.id]);
            // console.log(currCosineSimilarity);

            //If cosine similarity above a threshold (here if it is not zero/null/false)
            if(currCosineSimilarity > SIMILARITY_THRESHOLD){
                let newLink = {source: newSentenceNode, target: otherSentenceNode, value: currCosineSimilarity};
                newSentenceNode.sourceLinks.push(newLink);
                otherSentenceNode.targetLinks.push(newLink);
                // console.log(newLink);
                graph.links.push(newLink);
                newLinks.push(newLink);
            }

        });

        updateContent();

        //update();
        //form.dispatchEvent(new CustomEvent("input"));
        //update2(newSentenceNode, newLinks);
        // var nodes = svg.selectAll("g")			//Select all bars
        //     .enter()
        //     .data(graph.nodes)
        //     .transition();
    }
    
    // return svg.node();
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
        { name: "Order by name", value: (a, b) => d3.ascending(a.id.toLowerCase(), b.id.toLowerCase()) },
        { name: "Order by group", value: (a, b) => a.group - b.group || d3.ascending(a.id.toLowerCase(), b.id.toLowerCase()) },
        { name: "Order by degree", value: (a, b) => d3.sum(b.sourceLinks, l => l.value) + d3.sum(b.targetLinks, l => l.value) - d3.sum(a.sourceLinks, l => l.value) - d3.sum(a.targetLinks, l => l.value) || d3.ascending(a.id.toLowerCase(), b.id.toLowerCase()) }
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
    }, 5000);

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



//EXTRA CODE TO CREATE D3 READABLE GRAPHS COPIED BELOW
function organizeForD3(corpusEmbeddings) {
	let nodes = []; //Array of objects {id: "SENTENCE", group: SENTENCE_GROUP_NUMBER}
	let links = []; //Array of objects Object {source: "SENTENCE1", target: "SENTENCE2", value: WEIGHT_OF_CONNECTION}




	let node_ids = [];
	let link_ids = [];
	let curr_id_1 = 0;

	for (sentence in corpusEmbeddings) {
		//GET EMBEDDING OF SENTENCE
		//console.log(sentence);
		let current_embedding = corpusEmbeddings[sentence];
		//console.log(current_embedding);

		//GET SIMILARITY SCORES W/ EVERY OTHER SENTENCE
		let currSentScoresDict = compareVectorsNoQuery(current_embedding, corpusEmbeddings);
		//console.log(currSentScoresDict);

		//THRESHOLD SIMILARITY SCORES
		let thresholdedCurrSentScoresDict = Object.fromEntries(Object.entries(currSentScoresDict).filter(([k, v]) => v > SIMILARITY_THRESHOLD));
		//console.log("THRESHOLD CROSSING: ", thresholdedCurrSentScoresDict);

		//POPULATE NODES
		nodes.push({id: sentence}); //, group: 1

		//POPULATE NUMERICAL NODES
		curr_id_1++;
		node_ids.push(curr_id_1);

		//POPULATE LINKS
		let curr_id_2 = 0;
		for (let sentence2 in thresholdedCurrSentScoresDict) {
			//NO IDENTITY LINKS
			curr_id_2++;
			if (sentence !== sentence2) {
				links.push({source: sentence, target: sentence2, value: thresholdedCurrSentScoresDict[sentence2]});
				link_ids.push({source: curr_id_1, target: curr_id_2, value: thresholdedCurrSentScoresDict[sentence2]});
			}
		}
		//let groups = getGroupsFromSentScores(currSentScoresDict, previousGroup);
	}

	//CALCULATE GROUPS ONCE DONE


	// console.log(node_ids);
	// console.log(link_ids);

	let community = jLouvain().nodes(node_ids).edges(link_ids);

	var community_assignment_result = community();

	// console.log('Resulting Community Data', community_assignment_result);

	var new_nodes = [];

	var max_community_number = 0;
	node_ids.forEach(function(d) {
		// console.log(d);
		//nodes[d].group = community_assignment_result[d];
		new_nodes.push({id: nodes[d - 1].id, group: community_assignment_result[d]});
		max_community_number = max_community_number < community_assignment_result[d] ?
			community_assignment_result[d] : max_community_number;

	});

	// console.log(max_community_number);

	//SANITY CHECK PRINT STATEMENTS
	// console.log(nodes);
	// console.log(new_nodes);
	// console.log(links);

	let togetherboy = {nodes: new_nodes, links: links};
	// console.log(togetherboy);


    return togetherboy;

}



function getGroupsFromSentScores(currSentScoresDict, previousGroup) {

	let group = previousGroup++;



}




function compareVectorsNoQuery(current_embedding, corpusEmbeddings) {

	var sentScoreDict = {};


	var sent1_array = current_embedding;
	for (var sent in corpusEmbeddings) {
		var sent2_array = corpusEmbeddings[sent];
		/* Defined in >> math.js */
		var similarity_score = cosineSim(sent1_array, sent2_array);
		sentScoreDict[sent] = similarity_score;
	}

	return sentScoreDict;
}



//MATH FUNCTION TO CALCULATE COSINE SIMILARITY BETWEEN VECTORS
function cosineSim(A, B) {
	if (typeof A === "string") {
		A = A.split(',').map(Number);
		B = B.split(',').map(Number);
	}

	var dotproduct = 0;
	var mA = 0;
	var mB = 0;

	for (let i = 0; i < A.length; i++) {
		dotproduct += (A[i] * B[i]);
		mA += (A[i] * A[i]);
		mB += (B[i] * B[i]);
	}

	mA = Math.sqrt(mA);
	mB = Math.sqrt(mB);
	var similarity = (dotproduct) / ((mA) * (mB));
	return similarity;
}



function saveVariableToFile(variable) {

	var hiddenElement = document.createElement('a');

	hiddenElement.href = 'data:attachment/text,' + encodeURI(variable);
	hiddenElement.target = '_blank';
	hiddenElement.download = 'myFile.txt';
	hiddenElement.click();

}
