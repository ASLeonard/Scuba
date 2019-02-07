////////////////////////////////////////////////////////////
///////////////// Mobile vs Desktop ////////////////////////
////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
////////////////// Helper Functions ////////////////////////
////////////////////////////////////////////////////////////

//Calculate height of each rectangle
function locateY(d) {

	var yearLoc = d.date - startYear;
	var topping = years[yearLoc].number;
	years[yearLoc].number += 1;
	
	return y(topping);	
}// function locateY

//Taken from https://groups.google.com/forum/#!msg/d3-js/WC_7Xi6VV50/j1HK0vIWI-EJ
//Calls a function only after the total transition ends
function endall(transition, callback) { 
	var n = 0; 
	transition 
		.each(function() { ++n; }) 
		.each("end", function() { if (!--n) callback.apply(this, arguments); }); 
}

//Taken from http://stackoverflow.com/questions/6940103/how-do-i-make-an-array-with-unique-elements-i-e-remove-duplicates
//Remove duplicates
function ArrNoDupe(a) {
	var temp = {};
	for (var i = 0; i < a.length; i++)
		temp[a[i]] = true;
	var r = [];
	for (var k in temp)
		r.push(k);
	return r;
}//ArrNoDupe

