//Show the tooltip on hover
function showTooltip(d) {
	
	//Position tooltip
	var Loc = this.getBoundingClientRect();
	//Set first location of tooltip and change opacity
	var xpos = Loc.left + width/2;
	var ypos = Loc.top - height*3;
	 
	//Position the tooltip
	d3.select("#tooltip")
		.style('top',ypos+"px")
		.style('left',xpos+"px")
		.style('opacity',1);	

	//Change the texts inside the tooltip
	d3.select("#tooltip .tooltip-band").text(d.country);
	d3.select("#tooltip-year").html(d.month);
	d3.select("#tooltip-title").html(d.site);
	d3.select("#tooltip-place").html("Depth: " + d.depth);
    d3.select("#tooltip-place2").html("Time: " + d.time);
}//showTooltip	

function hideTooltip(d) {

	//Only reset opacity of no search is being performed
	if (inSearch == false) {
		//All opacities back to 1
		svg.selectAll(".dot")
			.style("opacity", 1);
	}//if
	
	//Hide tooltip
	d3.select("#tooltip")
		.style('opacity',0)
		.style('top',0+"px")
		.style('left',0+"px");
}//hideTooltip
