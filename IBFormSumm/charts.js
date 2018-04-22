//adapted from: https://bl.ocks.org/mbostock/4600693

var svg, nodes, nodesValid, nodeById, nodeLength, nodeLookup, linkLookup, links, bilinks, simulation, color, ticked, forceLink, timer;

var width = 600;
var height = 600;

var tickNo = 0;
var auto = false;
var ready = 0;

var time = 0;
var eventno = -1;

var speed = 3;

var lastEventClean = [];

var lo = {
  facts: [
    5, 10, 20, 25, 30, 38, 40, 41, 42, 45
  ],
  patterns: [
    [1, 3, 6, 9],
    [11, 14, 18, 22],
    [9, 14, 20, 12, 9],
  ],
  comparisons: [
    [15, 30],
    [25, 4],
    [50, 6]
  ],
  creation: [
    [7, 15, 25, 30, 19, 44]
  ]
}

var lo_nodes = [];
var lo_links = [];
var lo_paths = [];

lo.facts.forEach(function(n) {
  lo_nodes[n] = n;
});
lo.patterns.forEach(function(n) {
  let last = null;
  n.forEach(function(n2) {
    lo_nodes[n2] = n2;
    if (last != null) {
      lo_links[n2] = last;
      lo_links[last] = n2;
    }
    last = n2;
  });
});
lo.comparisons.forEach(function(n) {
  n.forEach(function(n2) {
    lo_nodes[n2] = n2;
  });
  lo_paths[n[0]] = n[1];
  lo_paths[n[1]] = n[0];
});
let last = lo.creation[0][0];
for (let i = 1; i < lo.creation[0].length; i++) {
  let n = lo.creation[0][i];
  lo_paths[last] = n;
  lo_paths[n] = last;
  last = n;
}
for (let i = 0; i < lo.creation[0].length; i++) {
  let n = lo.creation[0][i];
  lo_nodes[n] = n;
}

var lo_nodes2 = [];
for (let i in lo_nodes) {
  lo_nodes2.push(i);
}
//lo_nodes.shuffle();
var lo_links2 = [];
for (let i in lo_links) {
  lo_links2.push([parseInt(i),lo_links[i]]);
}
var lo_paths2 = [];
for (let i in lo_paths) {
  lo_paths2.push([parseInt(i),lo_paths[i]]);
}

var events = [
  {
    event: 'preassess',
  },
];

let node_levels = {};
let lo_node = 0;
let lo_link = 0;
let lo_path = 0;
let skip = [];
for (let i = 5; i <= 90; i+= 10) {
  skip[i] = true;
}

for (let i = 1; i < 95; i++) {
  if (skip[i] != null) {
    continue;
  }
  let r = Math.random();
  let ev = {event: 'learn'};
  if (r < 0.5) {
    ev.type = 'node';
//    //console.log(lo_nodes,lo_nodes2,lo_node);
    ev.node = lo_nodes2[lo_node];
    ev.value = 0;
    if (node_levels[ev.node] != null) {
      node_levels[ev.node]++;
      ev.value = node_levels[ev.node];
    } else {
      node_levels[ev.node] = 0;
    }
    lo_node++;
    if (lo_node >= lo_nodes2.length) {
      lo_node = 0;
    }
  } else if (r < 0.75) {
    ev.type = 'link';
//    //console.log('link',lo_link,lo_links2[lo_link])
    ev.link = lo_links2[lo_link];
    lo_link++;
    if (lo_link >= lo_links2.length) {
      lo_link = 0;
    }
  } else {
    ev.type = 'path';
    ev.path = lo_paths2[lo_path];
    lo_path++;
    if (lo_path >= lo_paths2.length) {
      lo_path = 0;
    }
  }
  events[i] = ev;
}

let formative = [];
for (let i = 5; i <= 90; i+= 10) {
  events[i] = {event: 'formative'};
}

events[95] = {event: 'summative', type: 'nodes', data: lo.facts};
events[96] = {event: 'summative', type: 'links', data: lo.patterns[1]};
events[97] = {event: 'summative', type: 'comparisons', data: lo.comparisons[0]};
events[98] = {event: 'summative', type: 'comparisons', data: lo.comparisons[0]};
events[99] = {event: 'summative', type: 'create', data: lo.creation[0]};

events[100] = {event: 'final'};

//console.log(events);

function setLO() {
  let e = document.getElementById('lo');
  e.innerHTML = '';
  let facts = '<div class="lorow">' + lo.facts.length + ' distinct facts. <br />';
  for (let i in lo.facts) {
    facts += '<div class="lo">' + lo.facts[i] + '</div> ';
  }
  facts += '</div>';

  let patterns = '<div class="lorow">' + lo.patterns.length + ' processes and patterns. <br />';
  for (let i in lo.patterns) {
    patterns += '<div class="loset">';
    for (let j in lo.patterns[i]) {
      patterns += '<div class="lo">' + lo.patterns[i][j] + '</div>'  + (j < lo.patterns[i].length-1?' - ':'');
    }
    patterns += '</div>';
  }
  patterns += '</div>';

  let comparisons = '<div class="lorow">' + lo.comparisons.length + ' comparisons. <br />';
  for (let i in lo.comparisons) {
    comparisons += '<div class="loset">';
    comparisons += '<div class="lo">' + lo.comparisons[i][0] + '</div> - ';
    comparisons += '<div class="lo">' + lo.comparisons[i][1] + '</div>';
    comparisons += '</div>';
  }
  comparisons += '</div>';

  let creation = '<div class="lorow">' + lo.creation.length + ' creative project. <br />';
  for (let i in lo.creation) {
    creation += '<div class="loset">';
    for (let j in lo.creation[i]) {
      creation += '<div class="lo">' + lo.creation[i][j] + '</div>  ';
    }
    creation += '</div>';
  }
  creation += '</div>';
  e.innerHTML = facts + '<br />' + patterns + '<br />' + comparisons + '<br />' + creation + '<br />';
}

var eventTimer = function() {
//  events
  time += 100;
  if (time > ready && auto) {
    if (lastEventClean.length > 0) {
      for (let i in lastEventClean) {
        lastEventClean[i]();
        lastEventClean.slice(i,i);
      }
    }
    nextEvent();
  }
//  //console.log(time);
  if (time > 100000) {
    //console.log('Time too long.',time);
    clearInterval(timer);
  }
}

var nextEvent = function() {
  eventno++;
  if (events[eventno] == null) {
    time = 0;
    //console.log('Events end. ' + eventno,time);
    clearInterval(timer);
  } else {
    let ev = events[eventno];
    //console.log('nextEvent',eventno,ev);
    ev.eventno = eventno;
    ev.time = time;
    if (ev.event == 'preassess') {
      event_preassess(ev);
    } else if (ev.event == 'learn') {
      event_learn(ev);
    } else if (ev.event == 'formative') {
      event_formative(ev);
    } else if (ev.event == 'summative') {
      event_summative(ev);
    } else if (ev.event == 'final') {
      event_final(ev);
    }
  }
}

var restart = function() {
  init();
  eventno = -1;
  auto = false;
  time = 0;
  ready = 1;
  d3.select("#chart div.svg-container").remove();
  setInner('message','');
  setInner('title','');
  progress = [];
  renderProgress();
  event_start();
}

/* fact, pattern, evaluate, create */

function init() {

  svg = d3.select("#chart")
    .append("div")
    .classed("svg-container", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + ' ' + height)
    .classed("svg-content-responsive", true)
    .append("g")
//      .attr("transform",'translate(50,50)');

//  var svg = d3.select("#chart");

  color = d3.scaleOrdinal(d3.schemeCategory20);

  simulation = d3.forceSimulation()
    .force("center", d3.forceCenter(width / 2, height / 2))
      .force("link", d3.forceLink().distance(5).strength(1))
      .force("charge", d3.forceManyBody())

    nodes = [];
    nodesValid = [];
    bilinks = [];
    links = [];
    nodeLookup = {};
    linkLookup = {};
}


function update(newNodes,newLinks) {
  let linkr = svg.selectAll('.link').remove();
  let noder = svg.selectAll(".node").remove();

//  //console.log('update 1',newNodes,newLinks,nodes,links);
  newNodes.forEach(function(newNode) {
    let i = nodes.length;
    nodes[i] = newNode;
    newNode.type = 'n';
    nodesValid.push(newNode.id);
    nodeLookup[newNode.id] = i;
  });

  newLinks.forEach(function(l) {
    //console.log('link',l);
    if (nodeLookup[l.source] == null) {
      console.error('Invalid source',l);
      return;
    }
    if (nodeLookup[l.target] == null) {
      console.error('Invalid target',l);
      return;
    }
    var s = nodes[nodeLookup[l.source]],
        t = nodes[nodeLookup[l.target]],
        i = {type: 'i'}; // intermediate node
//    //console.log('links for each',l.source,'s',s,'i',i,l.target,'t',t);
    nodes.push(i);
    l.value = parseInt(l.value);
    if (l.value == 0) {
      l.value = 1;
    }
    if (linkLookup[s.id] == null) {
      linkLookup[s.id] = {};
    }
    linkLookup[s.id][t.id] = links.length;
    links[links.length] = {source: s, target: i, id: 'link'+ s.id + '_' + t.id, value: l.value, source_id: s.id, target_id: t.id};
    if (linkLookup[t.id] == null) {
      linkLookup[t.id] = {};
    }
    linkLookup[t.id][t.id] = links.length;
    links[links.length] = {source: i, target: t, id: 'link'+ t.id + '_' + s.id, value: l.value, source_id: t.id, target_id: s.id};
    bilinks.push([s, i, t, l.value]);
//    //console.log('bilinks.push',{s, i, t});
  });

//  //console.log('update 2',nodes,links);

  var link = svg.selectAll(".link")
    .data(bilinks)
    .enter().append("path")
      .attr("id",function(d) { return 'link'+ d[0].id + '_' + d[2].id; })
      .attr("stroke-width",function(d) {
        let w = parseInt(d[3]);
        return (w == 0?1:w);
      })
      .attr("class", "link");

//  let startx = (_.random(0,1) == 0?0:width);
  //let starty = (_.random(0,1) == 0?0:height);
  var node = svg.selectAll(".node")
    .data(nodes.filter(function(d) { return d.id >= 0; }))
    .enter().append("circle")
      .attr("class", "node")
      .attr("id",function(d) { return 'node'+ d.id; })
      .attr("r", function(d) { return (parseInt(d.value)*3)+5; })
//      .attr("transform","translate(" + startx + "," + starty + ")")
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

/*    function ticked () {
      link.attr("d", positionLink);
      link.attr('stroke-width', 10);
      node.attr("transform", positionNode);
    }*/

  simulation
      .nodes(nodes)
      .on("tick", function () {

        link.attr("d", positionLink);
        link.attr("stroke-width",function (d) {
          let w = parseInt(d[3]);
          return (w == 0?1:w);
        } );
        node.attr("transform", positionNode);
        node.attr("r",function (d) {return (parseInt(d.value)*3)+5; } );
      });

  simulation.force("link").links(links);

  simulation.alphaTarget(0.3).restart();
//simulation.alpha(1);
//  simulation.restart();
}

function positionLink(d) {
  if (d == null || d[0] == null) {
    console.error('positionLink',d);
    return null;
  }
//  //console.log('d',d);
  return "M" + d[0].x + "," + d[0].y
       + "S" + d[1].x + "," + d[1].y
       + " " + d[2].x + "," + d[2].y;
}

/*
function positionNode(d) {
  return "translate(" + d.x + "," + d.y + ")";
}*/

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

function addOne(id) {
  let rv = parseInt(Math.random() * nodesValid.length);
  let r = nodesValid[rv];

  let newNodes = [{id: id, value: 0}];
  let newLinks = [{source: r, target: id, value: 0}];
  //console.log('addOne',r,newNodes,newLinks);
  update(newNodes,newLinks);

}


function addRandom() {
  //select random base
  let rv = _.random(0,nodesValid.length-1);
  let r = nodesValid[rv];
//  //console.log('add',r,rv,nodesValid,nodesValid[rv]);
  let newNodes = [];
  let newLinks = [];
//  newLinks.push({source: r, target: nodes.length});
  let newNo = _.random(1,3);
  //console.log('adding ' + newNo + ' nodes to ' + r + '/' + rv);
  for (let i = nodesValid.length; i < (newNo+nodesValid.length); i++) {
    let id = nodesValid.length;
    let vn = _.random(0,3);
    newNodes[id] = {id: id, value: vn};
    let connNo = _.random(1,3);
    //console.log("\t" + 'adding ' + connNo + ' links to ' + (nodesValid.length+i));
    let v = _.random(1,3);
    if (i > nodesValid.length) {
      newLinks.push({source: id, target: id-1, value: v});
    } else {
      newLinks.push({source: r, target: id, value: v});
    }
    for (let j = 0; j <= connNo; j++) {
      let type = _.random(0,4);
//      //console.log(type);
      let target = null;
      if (type == 0) {  //existing link
        let rv2 = _.random(0,nodesValid.length-1);
        r2 = nodesValid[rv2];
        target = r2;
      } else {
        let rv = _.random(0,nodesValid.length-1);
        target = i;
//        newLinks.push({source: i, target: (nodes.length+r2)});
      }
      let v = _.random(1,3);
      if (target == i) {
        newLinks.push({source: i, target: r, value: v});
  //      //console.log('1 source: ' + i + ', target: ' + r);
      } else {
        newLinks.push({source: i, target: target, value: v});
    //    //console.log('2 source: ' + i + ', target: ' + r);
      }
    }
  }
  update(newNodes,newLinks);
}

function alterNode(id) {
  let n = d3.select('#node' + id);
  //console.log(n);
}

function alterLink(id) {

}

function highlight () {
  let r = parseInt(Math.random()*nodeLength);
  let s = nodes[r];
  let node = d3.select('#' + s.id);
  node.attr("r",10);
  //console.log(nodeLength,r,s);

  //console.log(links);
}

function setInner(id,content) {
  if (id == 'message') {
    let e = document.getElementById('messages');
    e.innerHTML += '<div class="message">' + content + '</div>';
    e.scrollTop = e.scrollHeight;
  } else {
    let e = document.getElementById(id);
    e.innerHTML = content;

  }
}

var progress = []; /* 0 = value, 1 = color, 2 = text */
function renderProgress() {

  let n = 0;
  let c = '<div class="c-progress">';
  for (let i in progress) {
    c += '<div class="c-progress__bar ' + progress[i][1] + '" style="width: ' + progress[i][0] + '%;">' + progress[i][2] + '</div>';
    n += progress[i][0];
  }
  c += '</div>';
  setInner('progressno',n + '%');
  setInner('progressbar',c);
}

function setSpeed(n) {
  speeds = [0,1,3,5];
  for (let i in speeds) {
    let e = document.getElementById('speed' + speeds[i]);
    if (n == speeds[i]) {
        e.className = 'c-button c-button--active';
    } else {
      e.className = 'c-button';
    }
  }
  speed = n;
}


function toggle() {
  auto = !auto;
  let t = document.getElementById('toggle');
  if (auto) {
    t.innerHTML = 'Stop';
  } else {
    t.innerHTML = 'Start';
  }
}

function event_start() {
  toggle();
  let c = '<div class="plan"><b>Learning Plan</b><ul>';
  for (let e in events) {
    let ev = events[e];
//    setInner('message',JSON.stringify(ev));
    if (ev.event == 'learn') {
      if (ev.type == 'node') {
        c += '<li>Fact ' + ev.node + '</li>';
      } else if (ev.type == 'link') {
        c += '<li>Connection ' + ev.link[0] + ' to ' + ev.link[1] + '</li>';
      } else if (ev.type == 'path') {
        c += '<li>Compare/Evaluate ' + ev.path[0] + ' to ' + ev.path[1] + '</li>';
      }
    } else if (ev.event == 'formative') {
      c += '<li><i>Formative Assessment</i>' + '</li>';
    } else if (ev.event == 'summative') {
      c += '<li>Summative Assessment</i> ' + ev.type + '</li>';
    }
  }
  c += '</ul></div>';
  setInner('message',c);

  let o = document.getElementById('overlay');
  o.style.display = 'none';
  let m = document.getElementById('modal');
  m.style.display = 'none';
  //m.className = 'c-overlay';

  let newNodes = [{id: 0, value: parseInt(Math.random()*5)}, {id: 1, value: parseInt(Math.random()*5)}, {id: 2, value: parseInt(Math.random()*5)}];
  let newLinks = [
    {source: 0, target: 1, value: parseInt(Math.random()*3)},
    {source: 1, target: 2, value: parseInt(Math.random()*3)},
    {source: 2, target: 0, value: parseInt(Math.random()*3)},
  ];

  setInner('title','Previous Learning');
  setInner('message','Adding previous learning.');
  update(newNodes,newLinks);
  addRandom();
  addRandom();
  addRandom();
  timer = setInterval(eventTimer,100);
  nextEvent();
}

function event_preassess() {
  setInner('title','Pre-assessment');
  let facts = 0;
  for (var i in nodes) {
    if (lo.facts.indexOf(nodes[i].id) >= 0) {
//      //console.log('found node in lo.facts ' + nodes[i].id,lo.facts);
//      //console.log('#node' + nodes[i].id)
      d3.select('#node' + nodes[i].id).classed('highlight',true);
      facts++;
    }
  }
  let patterns = 0;
  for (var i in lo.patterns) {
    for (var i in links) {
      //console.log(links[i]);
/*      if (lo.facts.indexOf(nodes[i].id) >= 0) {
        //console.log('found node in lo.patterns ' + nodes[i].id,lo.facts);
        //console.log('#node' + nodes[i].id)
        d3.select('#node' + nodes[i].id).classed('highlight',true);
        facts++;
      }*/
    }
  }
  setInner('message','Assessing previous learning. Evidence of ' + facts + '/' + lo.facts.length + ' facts and 0/' + lo.patterns.length + ' patterns.');

/*  for (var i in lo.compare) {
    d3.select('#node' + lo.facts[i]).classed('highlight');
  }*/
  progress.push([1,'preassess','']);
  renderProgress();

  ready += 1000;
//  nextEvent();
}


function event_learn(ev) {
  setInner('title','Learning');
  //console.log('learn',ev);
  //teach node or teach connection
  let status = 'fail';
  if (ev.type == 'node')  {  //teach a node
    if (ev.node == null) {
      console.warn('Invalid event',ev);
    } else if (nodeLookup[ev.node] != null && nodes[nodeLookup[ev.node]] != null) {
      let node = nodes[nodeLookup[ev.node]];
      //console.log('node',node);
      if (node.value+1 == ev.value) {
        status = 'success';
        node.value++;
        //console.log(status,'Incrementing ' + node.value);
        d3.select('#node' + node.id).classed('highlight',true);
        lastEventClean.push(function() {
          d3.select('#node' + node.id).classed('highlight',false);
        })
        d3.select('#node' + node.id).attr('r',5 + (node.value * 30));
        setInner('message','Learned fact ' + ev.node + ', increased to ' + node.value);
      } else if (node.value == ev.value) {
        status = 'warn';
        //console.log(status,'Same level ' + node.value);
        setInner('message','No learning, fact at same level (' + node.value + ')');
      } else if (node.value > ev.value) {
        status = 'warn';
        //console.log(status,'Too low ' + node.value);
        setInner('message','No learning, fact is too low level (' + node.value + ' &gt;' + ev.value + ')');
      } else {
        status = 'fail';
        //console.log(status,'Too high ' + node.value);
        setInner('message','No learning, fact is too advanced (' + node.value + ' &gt;' + ev.value + ')');
      }
    } else {
      if (ev.value <= 1) {
        status = 'success';
        addOne(parseInt(ev.node));
//        d3.select('#node' + node.id).classed('highlight',true);

        //console.log(status,'Adding ' + ev.node);
        setInner('message','Learned new fact ' + ev.node + '.');
      } else {
        //fail
        //console.log(status,'Too high.');
        setInner('message','No learning, fact is too advanced.');
      }
    }
  } else if (ev.type == 'link') {  //link
    //console.log('link',ev);
    if (ev.link == null) {
      console.warn('Invalid event',ev);
    } else if (nodeLookup[ev.link[0]] != null && nodeLookup[ev.link[1]] != null)  {
      link_id1 = 'link' + ev.link[0] + '_' + ev.link[1];
      let l1 = document.getElementById(link_id1);
      //console.log(link_id1,l1);
      link_id2 = 'link' + ev.link[1] + '_' + ev.link[0];
      let l2 = document.getElementById(link_id2);
      //console.log(link_id2,l2);
      if (l1 != null && l2 != null) {  //nodes and links present
        status = 'success';
        setInner('message','Connection stronger from ' + ev.link[0] + ' to ' + ev.link[1] + '.');
      } else {  //nodes present, but not links
        status = 'success';
        setInner('message','New connection made from ' + ev.link[0] + ' to ' + ev.link[1] + '.');
        update([],[{source: ev.link[0], target: ev.link[1], value: 0}]);
      }
    } else {
      //console.log(status,'Missing nodes ' + ev.link);
      setInner('message','No learning, connection could not be made from ' + ev.link[0] + ' to ' + ev.link[1] + '.');
    }
  } else if (ev.type == 'path') { //shorten
//    setInner('message','Path' + ev.path);
    let r = pathCheck(ev.path[0],ev.path[1]);
    //console.log('path',r);
    if (r.has == 0) {
      setInner('message','No learning, no path could be made from ' + ev.path[0] + ' to ' + ev.path[1] + '.');
    } else {
      if (r.pathlen > 3) {
        status = 'success';
        update([],[{source: r.link[0], target: r.link[1], value: 0}]);
        setInner('message','Path was too long, new connection made from ' + r.link[0] + ' to ' + r.link[1] + '.');
      } else {
        status = 'success';
        setInner('message','Path could be made from ' + ev.path[0] + ' to ' + ev.path[1] + '.');
      }
    }
  }
  //types, 10% new node, existing connection, 5% random, 10% fail

  progress.push([1,'learn-' + status,'']);
  renderProgress();
  ready += 10 + (speed * 100);

}

function nodeCheck(n) {
  let r = {has: 0, count: 0, tot: 0, avg: 0}
  for (let i in n) {
    if (nodeLookup[n[i]] != null && nodes[nodeLookup[n[i]]] != null) {
      let node = nodes[nodeLookup[n[i]]];
      r.has++;
      r.tot += node.value;
      d3.select('#node' + node.id).classed('highlight',true);
      lastEventClean.push(function() {
        d3.select('#node' + node.id).classed('highlight',false);
      })
    } else {
      console.log('nodeCheck failed',i);
    }
    r.count++;
  }
  r.avg = r.tot / r.count;
  return r;
}

function linkCheck(l) {
  let r = {has: 0, count: 0, tot: 0, avg: 0}
  let last = null;
  for (let i in l) {
    if (last != null) {
      if (linkLookup[last] != null && linkLookup[last][i] != null) {
        let link = links[linkLookup[last][i]];
        r.has ++;
        r.tot += link.value;
        d3.select('#node' + last).classed('highlight2',true);
        d3.select('#node' + i).classed('highlight2',true);
        d3.select('#link' + last + '_' + i).classed('highlight-link',true);
        d3.select('#link' + i + '_' + last).classed('highlight-link',true);
        lastEventClean.push(function() {
          let l1 = last;
          let l2 = i;
          d3.select('#node' + l1).classed('highlight2',false);
          d3.select('#node' + l2).classed('highlight2',false);
          d3.select('#link' + l1 + '_' + l2).classed('highlight-link',false);
          d3.select('#link' + l2 + '_' + l1).classed('highlight-link',false);
        })
      }
      r.count++;
    }
    last = i;
  }
  r.avg = r.tot / r.count;
  return r;
}

function buildPaths(start,end,path,skip,depth = 0) {
  start = parseInt(start);
  end = parseInt(end);
  skip[start] = true;
  let matches  = [];
//  //console.log(" ".repeat(depth) + 'buildPaths start',start + ' to ' + end,path,skip,depth);
  if (depth > 5) {
    return matches;
  }
  let path2 = path.slice();
  path2.push(start);
  for (let k in links) {
    if (links[k]['source_id'] == start) {
//      //console.log(" ".repeat(depth) + 'Match: [' + k + ']',links[k]['source_id'] + ' to ' + links[k]['target_id']);
      if (links[k]['target_id'] == end) {  //match
        let path3 = path2.slice();
        path3.push(end);
        matches.push(path3);
      } else if (path2.indexOf(links[k]['target_id']) == -1) {  //only follow new nodes
        let target = links[k]['target_id'];
        skip[target] = true;
        let p = buildPaths(target,end,path2,skip,depth+1);
        if (p.length > 0) {
          for (let i in p) {
            matches.push(p[i]);
          }
        }
      } else {
//        //console.log(" ".repeat(depth) + 'Skip: ' + k,links[k]['source_id'] + ' to ' + links[k]['target_id']);
      }
    } else {
//      //console.log(" ".repeat(depth) + 'No Match: ' + k,links[k]['source_id'] + ' to ' + links[k]['target_id']);
    }
  }
//  //console.log(" ".repeat(depth) + 'buildPaths end',start,end,matches,depth);

  return matches;
}

//function buildPathsOld(n,e,m,r) {
//  let matches  = [];


function pathCheck(start,end) {

  //console.log('pathCheck',start,end);
  let r = {has: 0, count: 1, tot: 0, avg: 0, path: [], pathlen: -1, pathmsg: '', link: []}
  if (nodeLookup[start] != null && nodeLookup[end] != null) {
//    let startnode = nodes[nodesLookup[start]];
//    let endnode = nodes[nodesLookup[end]];
    let paths = buildPaths(start,end,[],{},0);
    let path = [];
    let newlinks = [];
    for (let i in paths) {
      if (path.length == 0 || paths[i].length < path.length) {
        path = paths[i];
        r.pathlen = paths[i].length;
      }
      if (path.length > 3) {
        let l = paths[i].length;
        newlinks.push([paths[i][0],paths[i][2]]);
        newlinks.push([paths[i][l-1],paths[i][l-3]]);
      }
    }
    if (path.length > 0) {
      r.has = 1;
      r.path = path;
      let lr = parseInt(Math.random()*newlinks.length);
      r.link = newlinks[lr];
      for (let i in path) {
        d3.select('#node' + path[i]).classed('highlight2',true);
        lastEventClean.push(function() {
          d3.select('#node' + path[i]).classed('highlight2',false);
        });
      }
    }
/*

    for (let k1 in links) {
      if (links[k1]['source']['id'] == start && links[k1]['target']['id'] == end) {
        r.path = [start,end];
        return r;
        break;
      }
      if (links[k1]['source']['id'] == start) {
        let s1 = links[k1]['source']['id'];
        let t1 = links[k1]['target']['id'];
        for (let k2 in links) {
          if (links[k2]['source']['id'] == t1 && links[k2]['target']['id'] == end) {
            r.path = [s1,t1,end];
            return r;
          }
          if (links[k2]['source']['id'] == t1) {
            let s2 = links[k2]['source']['id'];
            let t2 = links[k2]['target']['id'];
            for (let k3 in links) {
              if (links[k3]['source']['id'] == t2 && links[k3]['target']['id'] == end) {
                r.path = [s1,t1,t2,end];
                return r;
              }
            }
          }
        }*/

//      }
//    }
  } else {
    r.count = 1;
    r.msg = 'Missing nodes.';
  }
  return r;
}


let t = [
  'Open-Ended Task',
  'Performance',
  'Process Journal',
  'Portfolio',
];


function event_formative(ev) {
  let ts = [
    'Informal Verbal Assessment',
    'Selected Response Quiz',
    'Self-Reflection',
    'Peer Review',
  ];
  let tr = _.random(0,ts.length-1);
  let t = ts[tr];

  let c = '<div class="form">Formative Assessment, ' + t + ':<ul>';
  for (let i = 0; i < 3; i++) {
    let r = _.random(1,3);
    if (r == 1) {  //fact
      let r2 = _.random(0,lo.facts.length-1);
      let n = lo.facts[r2];
      let r3 = nodeCheck([n]);
      if (r3.has > 0) {
        //console.log('form node','present');
        c += '<li>Fact ' + n + ' is assessed and present.</li>';
      } else {
        addOne(n);
        //console.log('form node','added');
        c += '<li>Fact ' + n + ' assessed as missing and now added.</li>';
      }
    } else if (r == 2) {  //link
      let r2 = _.random(0,lo.patterns.length-1);
      let r3 = linkCheck(lo.patterns[r2]);
      //console.log(r3)
      console.log('form pattern',r3);
      c += '<li>Pattern ' + JSON.stringify(lo.patterns[r2]) + ' - ' + r3.has + '/' + r3.count + ' steps mastered.</li>';
    } else if (r == 3) {  //compare
      let r2 = _.random(0,lo.comparisons.length-1);
      let r3 = pathCheck(lo.comparisons[r2][0],lo.comparisons[r2][1]);
      c += '<li>Compare/Evaluate ' + lo.comparisons[r2][0] + ' to ' + lo.comparisons[r2][1] + ' ';
      console.log('form compare',r3);
      if (r3.has == 0) {
        c += 'Connection too long or missing facts.';
      } else {
        if (r3.pathlen > 3) {
          c += 'Connection is too long (len: ' + r3.pathlen + '), but a new connection has been made.';
          update([],[{source: r3.link[0], target: r3.link[1], value: 0}]);
        } else {

          c += 'Strong connection.';
        }
      }
      c += '</li>';
    }
  }
  c += '</ul></div>';

  setInner('title','Formative Assessment');
  setInner('message',c);
  progress.push([1,'formative','F']);
  renderProgress();
  ready += 500 + (speed * 300);
}

function event_summative(ev) {
  setInner('title','Summative Assessment');
  progress.push([1,'summative','S']);

  let c = '<div class="summ">Summative Assessment, ';
  if (ev.type == 'nodes') {
    c += 'Fact-based Examination<br />';
    let total = 0;
    let present = 0;
    console.log('summ nodes',ev.data);
    let r = nodeCheck(ev.data);
    let p = parseInt(r.has / r.count * 10000)/100;
    c += '<i>Results: ' + r.has + '/' + r.count + ' facts or ' + p + '%. Average value: ' + r.avg + '.<br /><br />';
//    //console.log('summ nodes',r);
  } else if (ev.type == 'links') {
    c += 'Research or Presentation<br />';
    let r = linkCheck(ev.data);
    c += '<i>Results: ' + r.has + '/' + r.count + ' steps in the pattern or process.<br /><br />';
    console.log('summ link',r);
  } else if (ev.type == 'comparisons') {
    c += 'Open-Ended Project<br />';
    let r = pathCheck(ev.data[0],ev.data[1]);
    if (r.has == 0) {
      c += '<i>Results: Could not complete the complex connection.<br /><br />';
    } else {
      if (r.pathlen > 3) {
        c += '<i>Results: Completed a weak complex connection (len: ' + r.pathlen + ').<br /><br />';
      } else {
        c += '<i>Results: Completed a strong connection (len: ' + r.pathlen + ').<br /><br />';
      }
    }
    console.log('summ compare',r);
  } else if (ev.type == 'create') {
    c += 'Creative Project/Performance<br />';
    let last = ev.data[0];
    let count = 0;
    let tot = 0;
    console.log('summ create data',ev.data);
    let weak = 0;
    let strong = 0;
    for (let i = 1; i < ev.data.length; i++) {
      let curr = ev.data[i];
      let r = pathCheck(curr,last);
      if (r.has > 0) {
        if (r.pathlen <= 3) {
          strong++;
        } else {
          weak++;
        }
        count++;
      }
      console.log('summ create',curr,r);
      last = ev.data[i];
      tot++;
    }
    c += '<i>Results: ' + strong + ' strong, ' + weak  + ' weak, and ' + (tot-weak-strong) + ' failed complex connections.<br /><br />';
  }
  c += '</div>';
  setInner('message',c);
  /*
  events[20] = {event: 'summative', type: 'nodes', data: lo.facts};
  events[40] = {event: 'summative', type: 'links', data: lo.patterns[1]};
  events[60] = {event: 'summative', type: 'comparisons', data: lo.comparisons[0]};
  events[80] = {event: 'summative', type: 'comparisons', data: lo.comparisons[0]};
  events[99] = {event: 'summative', type: 'create', data: lo.creation[0]};
*/
  renderProgress();

  ready += 100 + (speed * 300);
}



function event_final(ev) {
  setInner('title','Final Results');
  let c = '<div class="summ">';
  c += '<p><i>This visualization is conjecture, and the formative assessment checks are randomized, but even with that, it is clearly evident that formative assessment is the only way to collect information on learning and to guide learning.</i></p>';
  c += '<p><i>It is also clear that it is relatively easy to learn lower order facts, but higher order connections are much more difficult without intentional formative assessment (instead of random selection).</i></p>';
  c += '</div>';
  setInner('message',c);

  ready += 100 + (speed * 300);
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
