var data = [
	{
		name: "Caderno",
		value: 30
	},
	{
		name: "Materiais Escolares",
		value: 86
	},
	{
		name: "Mochila",
		value: 168
	},
	{
		name: "Livros Didáticos",
		value: 281
	},
	{
		name: "Professor particular",
		value: 100
	},
	{
		name: "Alimentação",
		value: 150
	}
];

console.log(d3.select("#barChart"));

// d3.select("#barChart")
//   	.selectAll("div")
//   	.data(data)
// 	.enter()
//     	.append("div")
//     	.style("width", function(d) { return d.value + "px"; })
// 		.text(function(d) { return "R$ " + d.value; })
// 		.on("mouseover", function(){
// 			d3.select(this)
// 			  .style("background-color", "red");
// 		})
// 		.on("mouseout", function(){
// 			d3.select(this)
// 			  .style("background-color", "steelblue");
// 		});

var svgwidth = 550,
	svgheight = 300,
	barpadding = 10;

var barwidth = svgwidth/data.length;


d3.select("#barChart")
	.attr("width", 500)
	.attr("height", 300 )
	.selectAll("rect")
	.data(data)
	.enter()
	.append("rect")
		.attr("width", barwidth - 10)
		.attr("height", function(d){ return d.value;} )
		.attr("x", function(d, i) { return barwidth*i })
		.attr("y", function(d) { return 300 - d.value ; })
		.attr("fill", "steelblue")
		.on("mouseover", function(){
			d3.select(this)
			.style("fill", "red");
		})
		.on("mouseout", function(){
			d3.select(this)
			.style("fill", "steelblue");
		});