var	wind = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	maxWidth = 1500, //Maximum width of the chart, regardless of screen size
	maxHeight = 1000, //Maximum height of the chart, regardless of screen size
	w = Math.min(maxWidth, wind.innerWidth || e.clientWidth || g.clientWidth),
	h = Math.min(maxHeight, wind.innerHeight|| e.clientHeight|| g.clientHeight);

//Offsets needed to properly position elements
var xOffset = Math.max(0, ((wind.innerWidth || e.clientWidth || g.clientWidth)-maxWidth)/2),
	yOffset = Math.max(0, ((wind.innerHeight|| e.clientHeight|| g.clientHeight)-maxHeight)/2)


//SVG locations
var margin = {top: 50, right: 20, bottom: 50, left: 40},
	padding = 20,
    width = w - margin.left - margin.right - padding,
    height = h - margin.top - margin.bottom - padding;// - offsets.top;

var div = d3.select("#chart").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var radius = 10;


var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody()
		.strength(function(d) { return -25;})
		.distanceMax(350))
    .force("gravity", d3.forceManyBody()
		.strength(function(d) { return 15})
		.distanceMax(1000))
    .force("center", d3.forceCenter(width / 2, height / 2));

d3.json("data/network.json", function(error, graph) {
  if (error) throw error;

  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return d.value+1; });

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes)
    .enter().append("g")

    
  var circles = node.append("circle")
      .attr("r", 4)
      .attr("fill", function(d) { return d.colour; })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
      .on("mouseover", function(event, d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div.html("<b>"+d.site+"</b>")	
                .style("left", (event.pageX) + "px")		
                .style("top", (event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(event, d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });


  //node.append("title")
  //    .text(function(d) { return d.site; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);


  function ticked() {
    node.attr("x", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
        .attr("y", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
    
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
  }
});

function dragstarted(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragended(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

