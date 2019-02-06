<script>

var svg = d3.select("svg"),
margin = {
	top: 20,
	right: 20,
	bottom: 30,
	left: 50
},
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom,
g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%d-%b-%y");

var x = d3.scaleBand()
	.rangeRound([0, width])
	.padding(0.1);

var y = d3.scaleLinear()
	.rangeRound([height, 0]);
var colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"];



d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vQbCNthNcZ24SW9kOuMpmLr6ubJ_38gFmk42q-24mAPP1VPZtY7C_uqkwwwIhAsQ0r3kS6XrBY45AGs/pub?output=csv").then(function (data) {
	x.domain(data.map(function (d) {
			return d.dive;
		}));
	y.domain([0, d3.max(data, function (d) {
				return Number(d.depth);
			})]);

	g.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x))

	g.append("g")
	.call(d3.axisLeft(y))
	.append("text")
	.attr("fill", "#000")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", "0.71em")
	.attr("text-anchor", "end")
	.text("Speed");

	g.selectAll(".bar")
	.data(data)
	.enter().append("rect")
	.attr("class", "bar")
	.attr("x", function (d) {
		return x(d.dive);
	})
	.attr("y", function (d) {
		return y(Number(d.depth));
	})
	.attr("width", x.bandwidth())
	.attr("height", function (d) {
		return height - y(Number(d.depth));
	});
});

</script>