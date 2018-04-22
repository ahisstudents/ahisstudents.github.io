//adapted from: https://bl.ocks.org/mbostock/4600693

var svg, nodes, nodeById, nodeLength, links, bilinks, simulation, color, ticked, forceLink;

function init() {

  svg = d3.select("#chart")
    .append("div")
    .classed("svg-container", true)
    .append("svg")
    .attr("id",'rings')
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 2000 2000")
    .classed("svg-content-responsive", true)
    .append("g")
      .attr("transform",'translate(50,50)');

//  var svg = d3.select("#chart");
  var width = 1000;
  var height = 600;

  color = d3.scaleOrdinal(d3.schemeCategory20);

  simulation = d3.forceSimulation()
      .force("link", d3.forceLink().distance(10).strength(0.5))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

  d3.json("start.json", function(error, graph) {
    if (error) throw error;

    nodes = graph.nodes;
    nodeById = d3.map(nodes, function(d) { return d.id; });
    links = graph.links;
    bilinks = [];

//    console.log('data loaded',JSON.stringify(graph));

    links.forEach(function(link) {
      var s = link.source = nodeById.get(link.source),
          t = link.target = nodeById.get(link.target),
          i = {}; // intermediate node
//        console.log('links for each',s,t);
      nodes.push(i);
      links.push({source: s, target: i}, {source: i, target: t});
      bilinks.push([s, i, t]);
    });

    var link = svg.selectAll(".link")
      .data(bilinks)
      .enter().append("path")
        .attr("class", "link");

    var node = svg.selectAll(".node")
      .data(nodes.filter(function(d) { return d.id; }))
      .enter().append("circle")
        .attr("class", "node")
        .attr("id",function(d) { return d.id; })
        .attr("r", 5)
        .attr("fill", function(d) { return color(d.group); })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("title")
        .text(function(d) { return d.id; });

        ticked = function () {
          link.attr("d", positionLink);
          node.attr("transform", positionNode);
        }

    nodeLength = 0;
    for (let i in nodes) {
      if (nodes[i].id != null) {
        nodeLength++;
      }
    }


    simulation
        .nodes(nodes)
        .on("tick", ticked);

    forceLink = simulation.force("link");
    forceLink.links(links);

  });
}

function positionLink(d) {
  return "M" + d[0].x + "," + d[0].y
       + "S" + d[1].x + "," + d[1].y
       + " " + d[2].x + "," + d[2].y;
}

function positionNode(d) {
  return "translate(" + d.x + "," + d.y + ")";
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x, d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x, d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null, d.fy = null;
}

function add() {
  let r = parseInt(Math.random()*nodeLength);
  let s = nodes[r];
//  let t = { id: parseInt(Math.random()*1000000), x: 0, y: 0, vy: 0.01, vx: 0.01};
  let t = { id: parseInt(Math.random()*1000000)};
  let i = {};
  nodes.push(t);
  nodes.push(i);
  links.push({source: s, target: i}, {source: i, target: t});
  bilinks.push([s, i, t]);


  let link = svg
    .data([[s, i, t]])
    .enter().append("path")
      .attr("class", "link");

//  let link = svg.append("path")
//        .attr("class", "link")
//        .attr("d", positionLink);

  let node = svg
  .data([t].filter(function(d) { return d.id; }))
  .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
//      .attr("transform", positionNode)
      .attr("fill", function(d) { return color(0); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.id; });

  ticked = function () {
    link.attr("d", positionLink);
    node.attr("transform", positionNode);
  }

  console.log(nodeLength,r,t,s);

  console.log('nodes',nodes);

/*  simulation
      .nodes(nodes)
      .on("tick", ticked);*/


/*  d3.forceLink([link])*/

//  forceLink.links(links);

//  link.attr("d", positionLink(link));
//  node.attr("d", positionNode(node));
//  node.attr("transform", positionNode(node));
/*  simulation.force("link")
      .links(links);*/
}


function highlight () {
  let r = parseInt(Math.random()*nodeLength);
  let s = nodes[r];
  let node = d3.select('#' + s.id);
  node.attr("r",10);
  console.log(nodeLength,r,s);

  console.log(links);
}

/*
<div class="c-progress">
  <div class="c-progress__bar" style="width: 15%;">15%</div>
  <div class="c-progress__bar c-progress__bar--brand" style="width: 25%;">25%</div>
  <div class="c-progress__bar c-progress__bar--info" style="width: 10%;">10%</div>
  <div class="c-progress__bar c-progress__bar--warning" style="width: 12%;">12%</div>
  <div class="c-progress__bar c-progress__bar--success" style="width: 18%;">18%</div>
  <div class="c-progress__bar c-progress__bar--error" style="width: 6%;">6%</div>
</div>
*/
