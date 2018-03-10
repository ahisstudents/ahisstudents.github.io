
/*
var width = 960,
    height = 500,
    outerRadius = Math.min(width, height) * .5 - 10,
    innerRadius = outerRadius * .6;

var max = Math.min(width, height) * .5 - 10;
var min = max * 0.4;
var width1 = max * 0.05;
var rings = [];
rings[0] = max * 0.5;
rings[1] = max * 0.6;
rings[2] = max * 0.7;
rings[3] = max * 0.8;
rings[4] = max * 0.9;
rings[5] = max * 1.0;
*/

var width = 600,
    height = 500;
//    outerRadius = Math.min(width, height) * .5 - 10,
//    innerRadius = outerRadius * .2;

/*

HL 240 hrs -
SL 150
TOK 100, time for CAS and Extended Essay
3 or 4 HL, 6 total from different subjects

*/



/*** RINGS ***/

var pie = d3.layout.pie()
    .sort(null);

function rings_angles(sa) {
  var subject_angles = [0];
  var last = 0;
  for (var i in sa) {
    last += sa[i];
    console.log(last,sa[i]);
    subject_angles[parseInt(i)+1] = last;
  }
  return subject_angles;
}


function rings_curriculum(type) {
  var subject_colors = {
    0: d3.rgb('red'),  //Mathematics
    1: d3.rgb('yellow'), //Individuals and Societies
    2: d3.rgb('pink'), //Studies in Language and Literature
    3: d3.rgb('orange'), //Language Acquisition
    4: d3.rgb('green'), //Sciences
    5: d3.rgb('purple'), //The Arts
    6: d3.rgb('GoldenRod'), //Physical and Health Education
    7: d3.rgb('palegreen'), //Design
    8: d3.rgb('khaki'), //Action,
    9: d3.rgb('Cyan'), //Service
    10: d3.rgb('CadetBlue'), //Community Project
    11: d3.rgb('Gray'), //Personal Project
    12: d3.rgb('CornflowerBlue'), //Extended Essay
    13: d3.rgb('DarkSlateBlue') //Theory of Knowledge
  }

  var subject_colors_pyp = {};
  Object.assign(subject_colors_pyp,subject_colors);

  var subject_colors_myp = {};
  Object.assign(subject_colors_myp,subject_colors,);

  var subject_colors_dp = {};
  Object.assign(subject_colors_dp,subject_colors);
  subject_colors_dp[9] = d3.rgb('#bbb');
  subject_colors_dp[10] = d3.rgb('Gray');
  subject_colors_dp[11] = d3.rgb('Gray');

  var subject_colors_cp = {};
  Object.assign(subject_colors_cp,subject_colors);
  subject_colors_cp[0] = d3.rgb('#ccc');
  subject_colors_cp[1] = d3.rgb('#ddd');
  subject_colors_cp[2] = d3.rgb('#eee');
  subject_colors_cp[5] = d3.rgb('khaki');
  subject_colors_cp[7] = d3.rgb('Gray');

  var subject_angles_pyp = rings_angles([0.5,0.6,0.85,0.60,0.30,0.30,0.9,0.25,0.60,0.30,0.50,0.585]);
  var subject_angles_myp = rings_angles([0.5,0.6,0.85,0.60,0.30,0.30,0.9,0.25,0.60,0.30,0.50,0.585]);
  var subject_angles_dp = rings_angles([0.5,0.6,0.85,0.60,0.30,0.30,0.9,0.25,0.9,0.50,0.585]);
  var subject_angles_cp = rings_angles([0.5,0.6,0.85,0.6,1.75,0.9,0.50,0.585]);

  var rings = {

    PYP: {
      rings: [
        {
          segments: 1,
          pie: pie([1]),
          fill: [d3.rgb('#DDD')],
          text: ['Primary Years Program']
        },
        {
          segments: 14,
          pie: pie([1,1,1,1,1,1,1,1,1,1,1,1,1,1]),
          fill: subject_colors_pyp,
          angles: subject_angles_pyp,
          text: [
            'Mathematics',
            'Social Studies',
            '',
            'Language',
            'Science',
            'Arts',
            'Physical and Health Education',
            '',
            'Action',
            '',
            '',
            'Exhibition',
            '',
            ''
          ]
        },
      ]
    },
    MYP: {
      rings: [
        {
          segments: 1,
          pie: pie([1]),
          fill: [d3.rgb('#DDD')],
          text: ['Middle Years Program']
        },
        {
          segments: 14,
          pie: pie([1,1,1,1,1,1,1,1,1,1,1,1,1,1]),
          fill: subject_colors_myp,
          angles: subject_angles_myp,
          text: [
            'Mathematics',
            'Individuals and Societies',
            'Studies in Language and Literature',
            'Language Acquisition',
            'Sciences',
            'The Arts',
            'Physical and Health Education',
            'Design',
            'Action',
            'Service',
            'Community Project',
            'Personal Project',
            '',
            '',
          ]
        }
      ]
    }
  }
  if (type == 'DP') {
    rings['DP'] = {
      rings: [
        {
          segments: 1,
          pie: pie([1]),
          fill: [d3.rgb('#DDD')],
          text: ['Diploma Program']
        },
        {
          segments: 14,
          pie: pie([1,1,1,1,1,1,1,1,1,1,1,1,1,1]),
          fill: subject_colors_dp,
          angles: subject_angles_dp,
          text: [
            'Mathematics',
            'Individuals and Societies',
            'Studies in Language and Literature',
            'Language Acquisition',
            'Sciences',
            'The Arts',
            '',
            '',
            'Creativity, Action, and Service',
            'Extended Essay',
            'Theory of Knowledge'
          ]
        },
      ]
    };
  } else {
    rings['CP'] = {
      rings: [
        {
          segments: 1,
          pie: pie([1]),
          fill: [d3.rgb('#DDD')],
          text: ['Career Program']
        },
        {
          segments: 14,
          pie: pie([1,1,1,1,1,1,1,1,1,1,1,1,1,1]),
          fill: subject_colors_cp,
          angles: subject_angles_cp,
          text: [
            'Required Course 1',
            'Required Course 2',
            '',
            'Language Development',
            'Career Related Study with Approaches to Learning Core',
            'Community and Service',
            '',
            'Reflective Project',
          ]
        },
      ]
    }
  }
  generate_rings(rings);
}

function generate_rings(rings) {
  reset();

  var outerRadius = 500;
  var innerRadius = 240;

  var segment_width = parseInt((outerRadius - innerRadius) / 6);

  console.log('segment_width',(outerRadius - innerRadius),segment_width);


  var svg = d3.select("#chart")
    .append("div")
    .classed("svg-container", true)
    .append("svg")
    .attr("id",'rings')
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 2000 2000")
    .classed("svg-content-responsive", true)
    .append("g")
      .attr("transform",'translate(50,50)');

  var color = d3.scale.category20();

  var arc = d3.svg.arc();


  var min = 0;
  //var width = 0;

  var ringno = 0;
  for (var t in rings) {
    var space = true;
    var g = svg.append('g')
      .attr('id',t)
      .attr("class", "arc")
  //    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    for (var r in rings[t].rings) {
      var ring = rings[t].rings[r];
      console.log('ring',ring);
      var g2 = g.append('g')
        .attr('id',t + '_' + ringno)
        .attr("class", "arc")
        .attr("transform", "translate(" + outerRadius + "," + height + ")");
      for (var s = 0; s < rings[t].rings[r].segments; s++) {
        var arcdata = ring.pie[s];
        arcdata.padAngle = 0.006;
        if (space) {
          arcdata.innerRadius = innerRadius + (ringno * segment_width) + (segment_width * 0.2);
          space = false;
        } else {
          arcdata.innerRadius = innerRadius + (ringno * segment_width);
        }
        arcdata.outerRadius = innerRadius + ((ringno+1) * segment_width);
        if (rings[t].rings[r].angles != null) {
          console.log(arcdata.startAngle,arcdata.endAngle);
          arcdata.startAngle = rings[t].rings[r].angles[s];
          arcdata.endAngle = rings[t].rings[r].angles[s+1];
          console.log(arcdata.startAngle,arcdata.endAngle);
        }
        console.log('s',arcdata);
        if (ring.text[s] != null && ring.text[s] != '') {
          var arcobj = g2.append("path")
            .attr("fill", ring.fill[s])
            .attr("id", "p_" + ringno + '_' + s)
            .attr("d", arc(arcdata));
            arcdata.innerRadius = innerRadius + (ringno * segment_width) + (segment_width * 0.7);
            arcdata.outerRadius = arcdata.innerRadius;
            arcdata.startAngle += 0.05;
    //        arcdata.endAngle =
            var arcobj2 = g2.append("path")
    //          .attr("fill", ring.fill[s])
              .attr("id", "p2_" + ringno + '_' + s)
    //          .attr("transform", "rotate(5)")
              .attr("d", arc(arcdata));

            var c = arc.centroid(arcdata);

            var arcdata = ring.pie[s];

            var textdata = arcdata;
            var midangle = 0;
            if (arcdata.startAngle > arcdata.endAngle) {
              midangle = (arcdata.startAngle - arcdata.endAngle) / 2 + arcdata.startAngle;
            } else {
              midangle = (arcdata.endAngle - arcdata.startAngle) / 2 + arcdata.startAngle;
            }
            console.log('a',arcdata.startAngle,arcdata.endAngle,midangle);
            if (ring.text[s]) {
            var textobj = g2.append('text');
      //        .text(ring.text[s])
      //        .attr("transform", "translate(" + c[0] + "," + c[1] + ")")
      //        .attr("transform", "translate(0,20)")
    //          .attr("transform", "rotate(" + midangle + " 0 20)")
      //        .attr("d", arc(textdata));
      //      arcobj.append('centroid',arcobj,c);

            textobj.append("textPath")
              .attr("stroke","black")
              .attr("href","#p2_" + ringno + '_' + s)
              .style("text-anchor","end")
              .attr("startOffset","100%")
      //        .attr("transform", "rotate(" + midangle + " 0 20)")
              .text(ring.text[s]);
            }
        }

      }
      ringno++;

  /*    svg.selectAll(".arc")
        .data(r2)
        .enter().append("g")
          .attr("class", "arc2")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .append("path")
          .attr("fill", function(d, i) { console.log('d',d,'i',i); return color(i); })
          .attr("d", arc);
          */
    }
  }
}

/*** RINGS ***/

/*** Tree ***/
var tree = d3.layout.tree()
 .size([height, width]);

function treemap() {
  reset();
  var curriculum_map = [{
    "name": "Top Level",
    "parent": "null",
    "children": [
      {
        "name": "Level 2: A",
        "parent": "Top Level",
        "children": [
          {
            "name": "Son of A",
            "parent": "Level 2: A"
          },
          {
            "name": "Daughter of A",
            "parent": "Level 2: A"
          }
        ]
      },
      {
        "name": "Level 2: B",
        "parent": "Top Level"
      }
    ]
  }];

  var margin = {top: 20, right: 120, bottom: 20, left: 120},
   width = 960 - margin.right - margin.left,
   height = 500 - margin.top - margin.bottom;


  //var tree = d3.layout.tree()
//   .size([height, width]);

  var diagonal = d3.svg.diagonal()
   .projection(function(d) { return [d.y, d.x]; });

  var svg = d3.select("body").append("svg")
  .attr('id','curriculum')
   .attr("width", width + margin.right + margin.left)
   .attr("height", height + margin.top + margin.bottom)
    .append("g")
   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  root = curriculum_map[0];
  var i = 0;

  update(root,svg,i);
}

function update(source,svg,i) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
   links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Declare the nodesâ€¦
  var node = svg.selectAll("g.node")
   .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
   .attr("class", "node")
   .attr("transform", function(d) {
    return "translate(" + d.y + "," + d.x + ")"; });

  nodeEnter.append("rect")
   .attr("width", 150)
   .attr("height", 80)
   .attr("y", -40)
   .style("fill", "#ccc");

  nodeEnter.append("text")
   .attr("x", function(d) {
    return d.children || d._children ? -13 : 13; })
   .attr("dy", ".35em")
   .attr("text-anchor", function(d) {
    return d.children || d._children ? "end" : "start"; })
   .text(function(d) { return d.name; })
   .style("fill-opacity", 1);

  // Declare the linksâ€¦
  var link = svg.selectAll("path.link")
   .data(links, function(d) { return d.target.id; });

  // Enter the links.
  link.enter().insert("path", "g")
   .attr("class", "link")
   .attr("d", diagonal);

}



/*
var arcs = [];


var n = 10;
var data = [];
for (var i = 0; i < 12; i++) {
  data[i] = d3.range(n).map(Math.random);
}

console.log(data);

*/

//    a[i] = pie(data[i]);
/*
var row = d3.range(6).map(Math.random);
console.log('row',row);

var r = pie([1,1,1,1,1,1]);
for (var i in r) {
  r[i].innerRadius = 50;
  r[i].outerRadius = 100;
}
console.log('r',r);
var r2 = pie([1,1,1,1]);
for (var i in r2) {
  r2[i].innerRadius = 100;
  r2[i].outerRadius = 120;
}



//svg.selectAll(".arc")
//    .data([arc]);

console.log(width,height);

svg.selectAll(".arc")
  .data(r)
  .enter().append("g")
    .attr("class", "arc")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
  .append("path")
    .attr("fill", function(d, i) { console.log('d',d,'i',i); return color(i); })
    .attr("d", arc);

svg.selectAll(".arc")
  .data(r2)
  .enter().append("g")
    .attr("class", "arc2")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
  .append("path")
    .attr("fill", function(d, i) { console.log('d',d,'i',i); return color(i); })
    .attr("d", arc);

var gs = svg.selectAll(".arc");
console.log('gs',gs);
*/

//transition(1);

function arcs(data,inner,outer) {
  var a = [];
  var width = (outer - inner) / 12;
  for (var i = 0; i < data.length; i++) {
    console.log(i,data[i],data.length);
    a[i] = pie(data[i]);
    console.log('a[i] A',a[i]);
    for (var j = 0; j < data.length; j++) {
      a[i][j].innerRadius = inner + (width * i);
      a[i][j].outerRadius = inner + (width * (i+1) );
    }
    console.log('a[i] B',a[i]);
    if (i > 0 ) {
      a[i-1].next = a[i];
    }
  }
  console.log('a',a);
  return a[0];
}

function transition(state) {
  var path = d3.selectAll(".arc > path")
      .data(state ? arcs(data0, data1) : arcs(data1, data0));

  // Wedges split into two rings.
  var t0 = path.transition()
      .duration(1000)
      .attrTween("d", tweenArc(function(d, i) {
        return {
          innerRadius: i & 1 ? innerRadius : (innerRadius + outerRadius) / 2,
          outerRadius: i & 1 ? (innerRadius + outerRadius) / 2 : outerRadius
        };
      }));

  // Wedges translate to be centered on their final position.
  var t1 = t0.transition()
      .attrTween("d", tweenArc(function(d, i) {
        var a0 = d.next.startAngle + d.next.endAngle,
            a1 = d.startAngle - d.endAngle;
        return {
          startAngle: (a0 + a1) / 2,
          endAngle: (a0 - a1) / 2
        };
      }));

  // Wedges then update their values, changing size.
  var t2 = t1.transition()
        .attrTween("d", tweenArc(function(d, i) {
          return {
            startAngle: d.next.startAngle,
            endAngle: d.next.endAngle
          };
        }));

  // Wedges reunite into a single ring.
  var t3 = t2.transition()
      .attrTween("d", tweenArc(function(d, i) {
        return {
          innerRadius: innerRadius,
          outerRadius: outerRadius
        };
      }));

  setTimeout(function() { transition(!state); }, 5000);
}

function tweenArc(b) {
  return function(a, i) {
    var d = b.call(this, a, i), i = d3.interpolate(a, d);
    for (var k in d) a[k] = d[k]; // update data
    return function(t) { return arc(i(t)); };
  };
}

/*** Tree ***/

/*** Chords ***/

function reset() {
  var e = document.getElementById('chart');
  e.innerHTML ='';
//  d3.select("#chart").html('Test');
}

function setActive(btn_id) {
  var e = document.getElementById(btn_id);

//  d3.select("#chart").html('Test');
}

function progression_dendrogram() {
  //adapted from https://bl.ocks.org/mbostock/4339607
  reset();

  var g = d3.select("#chart")
    .append("div")
    .classed("svg-container", true)
    .append("svg")
    .attr("id",'rings')
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 2000 2000")
    .classed("svg-content-responsive", true)
    .append("g")
      .attr("transform",'translate(600,550)');



//  var g = svg.append("g").attr("transform", "translate(400,400)");

  var stratify = d3.stratify()
      .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

  var tree = d3.cluster()
      .size([360, 390])
      .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

  d3.csv("coursemap.csv", function(error, data) {
    if (error) throw error;

    var root = tree(stratify(data)
        .sort(function(a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); }));

    var link = g.selectAll(".link")
      .data(root.descendants().slice(1))
      .enter().append("path")
        .attr("class", "link")
        .attr("d", function(d) {
          return "M" + project(d.x, d.y)
              + "C" + project(d.x, (d.y + d.parent.y) / 2)
              + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
              + " " + project(d.parent.x, d.parent.y);
        });

    var node = g.selectAll(".node")
      .data(root.descendants())
      .enter().append("g")
        .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d) { return "translate(" + project(d.x, d.y) + ")"; });

    node.append("circle")
        .attr("r", 2.5);

    node.append("text")
        .attr("dy", ".31em")
        .attr("x", function(d) { return d.x < 180 === !d.children ? 6 : -6; })
        .style("text-anchor", function(d) { return d.x < 180 === !d.children ? "start" : "end"; })
        .attr("transform", function(d) { return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")"; })
        .text(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1); });
  });

}

function project(x, y) {
  var angle = (x - 90) / 180 * Math.PI, radius = y;
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
}

/*** Principles Chord ***/
function chord_age() {
  var transform = "rotate(32 520 400) translate(500,400)";
  generate_chord('chord-age',"chord-age.json",10,transform);
}

function chord_assessment() {
  var transform = "rotate(0) translate(500,530)";
  generate_chord('chord-assessment',"chord-assessment.json",20,transform);
}

function chord_principles() {
  var transform = "rotate(0) translate(500,540)";
  generate_chord('chord-principles',"chord-principles.json",20,transform);
}

function chord_programme() {
  var transform = "rotate(0) translate(500,500)";
  generate_chord('chord-programme',"chord-programme.json",20,transform);
}

function generate_chord(cssclass,jsonfile,colors,transform) {
  //Adapted from: https://bl.ocks.org/mbostock/1046712
  reset();
  var svg = d3.select("#chart")
      .attr("class", cssclass)
      .attr("width", width)
      .attr("height", height);
      var outerRadius = 400,
          innerRadius = outerRadius - 100;


          d3.select("div#chartId")

      if (colors == 10) {
        var fill = d3.scale.category10();
      } else if (colors == 20) {
        var fill = d3.scale.category20c();
      }

      var chord = d3.layout.chord()
          .padding(.15)
          .sortSubgroups(d3.descending)
          .sortChords(d3.descending);

      var arc = d3.svg.arc()
          .innerRadius(innerRadius)
          .outerRadius(innerRadius + 20);

      var svg = d3.select("#chart")
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 2000 2000")
        .classed("svg-content-responsive", true)
        .append("g")
          .attr("transform",transform);

      d3.json(jsonfile, function(error, imports) {
        if (error) throw error;

        var indexByName = d3.map(),
            nameByIndex = d3.map(),
            matrix = [],
            n = 0;

        // Returns the Flare package name for the given class name.
        function name(name) {
  //        return name;
          var p = name.split('/');
//          console.log(name,p);
          return p[1];
  //        var n = name.substring(0, name.lastIndexOf("/")).substring(6)

        }

        // Compute a unique index for each package name.
        imports.forEach(function(d) {
          if (!indexByName.has(d = name(d.name))) {
            nameByIndex.set(n, d);
            indexByName.set(d, n++);
          }
        });

        // Construct a square matrix counting package imports.
        imports.forEach(function(d) {
          var source = indexByName.get(name(d.name)),
              row = matrix[source];
          if (!row) {
           row = matrix[source] = [];
           for (var i = -1; ++i < n;) {
             var size = (d.size !=  null?parseInt(d.size):0);
             row[i] = 0;
           }
          }
          d.imports.forEach(function(d) {
//            console.log('d',d);
            row[indexByName.get(name(d))]++;
          });
        });

//        console.log(matrix);
        chord.matrix(matrix);

        var g = svg.selectAll(".group")
            .data(chord.groups)
          .enter().append("g")
            .attr("class", "group");

        g.append("path")
            .attr('class',function(d) { console.log('d',d); return 'p'+d.index;})
            .style("fill", function(d) { console.log('d',d); return fill(d.index); })
            .style("stroke", function(d) { return fill(d.index); })
            .attr("d", arc);

        g.append("text")
            .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
            .attr("dy", ".35em")
            .attr("transform", function(d) {
              return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                  + "translate(" + (innerRadius + 26) + ")"
                  + (d.angle > Math.PI ? "rotate(180)" : "");
            })
            .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
            .text(function(d) {
              var n = nameByIndex.get(d.index);
              if (n.substring(0,2) == '--') {
                return '';
              } else {
                return n;
              }
             });

        svg.selectAll(".chord")
            .data(chord.chords)
          .enter().append("path")
            .attr('class',function(d) { console.log('d',d); return ' chord c'+d.source.index+'_'+d.target.index;})
            .style("stroke", function(d) { return d3.rgb(fill(d.source.index)).darker(); })
            .style("fill", function(d) { return fill(d.source.index); })
            .attr("d", d3.svg.chord().radius(innerRadius));

      });

      d3.select(self.frameElement).style("height", outerRadius * 2 + "px");
}
