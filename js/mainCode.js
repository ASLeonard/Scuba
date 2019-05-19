////////////////////////////////////////////////////////////
//////////////////////// Set-up ////////////////////////////
////////////////////////////////////////////////////////////

//Chart variables
var startYear=2006,
	years, //save height per year
	rectWidth,
	rectHeight,
	rectCorner,
	currentYear = 2019,
	chosenYear = currentYear,
	chosenYearOld = currentYear,
	optArray, //for search box
	inSearch = false, //is the search box being used - for tooltip
	selectedArtist, //for search box and highlighting
	updateDots; //function needed in global
	
//Width and Height of the SVG
var	wind = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	maxWidth = 1200, //Maximum width of the chart, regardless of screen size
	maxHeight = 800, //Maximum height of the chart, regardless of screen size
	w = Math.min(maxWidth, wind.innerWidth || e.clientWidth || g.clientWidth),
	h = Math.min(maxHeight, wind.innerHeight|| e.clientHeight|| g.clientHeight);

//Offsets needed to properly position elements
var xOffset = Math.max(0, ((wind.innerWidth || e.clientWidth || g.clientWidth)-maxWidth)/2),
	yOffset = Math.max(0, ((wind.innerHeight|| e.clientHeight|| g.clientHeight)-maxHeight)/2)

//Find the offsets due to other divs
//var offsets = document.getElementById('chart').getBoundingClientRect();
	
//SVG locations
var margin = {top: 200, right: 20, bottom: 50, left: 40},
	padding = 40,
    width = w - margin.left - margin.right - padding,
    height = h - margin.top - margin.bottom - padding;// - offsets.top;

////////////////////////////////////////////////////////////
////////////////// Reposition elements /////////////////////
////////////////////////////////////////////////////////////

//Change note location
d3.select("#note")
	.style("top", (height + margin.top + margin.bottom + 40)+"px")
	.style("left", (xOffset + 20)+"px");
	
//Change intro location
d3.select("#intro")
	.style("left", (xOffset + 20)+"px");

//Change search box
var searchWidth = Math.min(300,width/2);
d3.select("#searchBoxWrapper")
	.style("left", (width/2 + xOffset + padding + margin.left - searchWidth/2)+"px")
	.style("width", searchWidth+"px");
	

	
//////////////////////////////////////////////////////
///////////// Initialize Axes & Scales ///////////////
//////////////////////////////////////////////////////
	
var x = d3.scaleLinear()
          .range([0, width]);

var y = d3.scaleLinear()
          .range([height, 0]);


var xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
var yAxis = d3.axisLeft(y);
	
//Create colors
var hexLocation = [
	{color:"#007F24", text: "0 - 10", depth: d3.range(0,10)},
	{color:"#62BF18", text: "10 - 20", depth: d3.range(10,20)},
	{color:"#FFC800", text: "20 - 30", depth: d3.range(20,30)},
	{color:"#FF5B13", text: "30 - 35", depth: d3.range(30,35)},
	{color:"#E50000", text: "35 - 40+", depth: d3.range(35,50)}
];
var hexKey = [];
hexLocation.forEach(function(d,i) {
	hexKey[d.color] = i;
})
	
var color = d3.scaleLinear()
	.domain([0,10,20,30,35,40])
	.range(hexLocation.map(function(d) { return d.color; }));

////////////////////////////////////////////////////////////	
///////////////////// Initiate SVG /////////////////////////
////////////////////////////////////////////////////////////
	
//Initiate outer chart SVG
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
//Container for all the rectangles
var dotContainer = svg.append("g").attr("class","dotContainer");
	
//Create title to show chosen year
var yearTitle = svg.append('text')                                     
	  .attr('x', width/2) 
	  .attr('y', -10)	  
	  .attr("class", "yearTitle")
	  .text(chosenYear);  

////////////////////////////////////////////////////////////	
///////////////////// Read in data /////////////////////////
////////////////////////////////////////////////////////////

d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vQbCNthNcZ24SW9kOuMpmLr6ubJ_38gFmk42q-24mAPP1VPZtY7C_uqkwwwIhAsQ0r3kS6XrBY45AGs/pub?gid=237789156&single=true&output=csv").then(function (data) {

	//var year_counts = {};

	for(var i = 0; i < data.length; i++) { //Faster?
		data[i].dive = +data[i].dive;
		data[i].date = +data[i].date.slice(0,4);
		//years[data[i].date] = (years[data[i].date] || 0) + 1;
		data[i].country = "" + data[i].country;
		data[i].site = "" + data[i].site;
		data[i].depth = +data[i].depth;
		data[i].time = +data[i].time;
	}

	var cf = crossfilter(data);
	// Create a dimension by political party
    	var cfYear = cf.dimension(function(d) { return +d.date; });
	//console.log(cfYear.size());


	

	//Calculate domains of chart
	startYear = d3.min(data, function(d) { return d.date; });
	x.domain([startYear-1,d3.max(data, function(d) { return d.date; })+1]);

	//d3.max(year_counts)]
	//var max_year=Object.keys(years).reduce(function(a, b){ return years[a] > years[b] ? a : b })

	y.domain([0,100]).nice();


	years = d3.range(d3.min(x.domain()),d3.max(x.domain()))
		.map(function(d,i) {
		  return {
			date: d,
			number: 1
		  };
		});

	//Size of the "song" rectangles
	rectWidth = Math.floor(x.range()[1]/50);
	rectHeight = Math.min(3,Math.floor(y.range()[0]/100));
	rectCorner = rectHeight/2;


	svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)
		.append("text")
		  .attr("class", "label")
		  .attr("x", width/2)
		  .attr("y", 45)
		  .style("text-anchor", "middle")
		  .style("fill", "white")
		  .style('font-size', 24)
		  .text("Year");

	//Create y axis
	svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("class", "label")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 8)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .style("fill", "white")
		  .style('font-size', 24)
		  .text("Number of dives")
	
	//Create the legend
	createLegend();

	var yearData = cfYear.filterAll();

	years.forEach(function(value, index) {
			years[index].number = 1;
		});

	var dots = dotContainer.selectAll(".dot")
					.data(yearData
							.top(Infinity)
							.sort(function(a, b) {return a.depth - b.depth}) 
							, function(d) { return d.depth; });


	dots.enter().append("rect")
			  .attr("class", "dot")
			  .attr("width", rectWidth)
			  .attr("height", rectHeight)
			  .attr("rx", rectCorner)
			  .attr("ry", rectCorner)
			  .style("fill", function(d) { return color(d.depth); })
			  .on("mouseover", showTooltip)
			  .on("mouseout", hideTooltip)
			  .attr("x", function(d) { return (x(d.date) - rectWidth/2); })
			  .attr("y", function(d) {return locateY(d);})
			  .style("opacity",1);

});

