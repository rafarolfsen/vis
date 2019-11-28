var canvas = d3.select("body").append("svg")
                .attr("width", 50000)
                .attr("height", 3000)

var barra1 = canvas.append("rect")
                .attr("width", 300)
                .attr("height", 100)
                .attr("fill", "red")

d3.csv("amazon.csv", function (dados){
    console.log( dados.id, dados.year, dados.state, dados.month);
    canvas.append("rect")
    //.data(dados)
    //.enter()
        .attr("y", function () {return dados.number/5;})
        .attr("text", function() { return "quantidade " + dados.number + " " + dados.state +" "+ dados.year; })
        .attr("width", function () {return dados.number/5;})
        .attr("height", 12)
        .attr("fill", "blue")
        
        //.attr("y", function () {return dados.id*15;})
})

//document.getElementById("demo").innerHTML = "teste";