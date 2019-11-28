let porMesEstado = []
let porAnoEstado = []
let porEstado = []
let porAno = []
let flag = false;
const csv = d3.csv("amazon.csv", function (data){
    porMesEstado.push({
        year: data.year,
        state: data.state,
        month: data.month,
        number: parseInt(data.number)
    })

    var inserirAnoEstado = true;
    porAnoEstado.forEach((element, index) => {
        if(element.state == data.state && element.year == data.year){
            inserirAnoEstado = false;
            element.number += parseInt(data.number, 10);
        } 
    });

    var inserirEstado = true;
    porEstado.forEach(element => {
        if(element.state == data.state) {
            inserirEstado = false;
            element.number += parseInt(data.number);
        }
    })

    var inserirAno = true;
    porAno.forEach(element => {
        if(element.year == data.year){
            inserirAno = false;
            element.number += parseInt(data.number, 10);
        }
    })

    if(inserirAnoEstado){
        porAnoEstado.push({
            year: data.year,
            state: data.state,
            number: parseInt(data.number, 10)
        })
    }

    if(inserirEstado){
        porEstado.push({
            state: data.state,
            number: parseInt(data.number)
        })
    }

    if(inserirAno) {
        porAno.push({
            year: data.year,
            number: parseInt(data.number)
        })
    }

})

function criarANO(){

    d3.select("body").append("h2").text("Queimadas por ano")
                .attr("x", porAno.length*30/2)

    var canvas = d3.select("body").append("svg")
                .attr("id", "grafico1")
                .attr("width", porAno.length*35)
                .attr("height", 300)
                .attr("fill", "steelblue")

    var maior = 0;
    var menor = Number.MAX_SAFE_INTEGER;
    porAno.forEach((element) =>  {
        if(element.number > maior){
            maior = element.number;
        }
        if(element.number < menor){
            menor = element.number;
        }
    });
    if(menor != 0){
        menor = menor - maior/10;
    }

    for(let i = 0; i < porAno.length; i++){
        var aux = (porAno[i].number-menor)/(maior-menor);
        canvas.append("rect")
            .attr("width", 30)
            .attr("height", aux*100)
            .attr("fill", "blue")
            .attr("x", i*35)
            .attr("y", 150 - aux*100)
            .on("mouseover", function(){
                d3.select(this)
                .style("fill", "red");
            })
            .on("mouseout", function(){
                d3.select(this)
                .style("fill", "blue");
            })
        canvas.append("text")
                .attr("width", 30)
                .attr("height", 10)
                .attr("x", i*35)
                .attr("y", 165)
                .attr("fill", "black")
                .text("Ano")
    }
}

function criarEstado(){

    var canvas = d3.select("body").append("svg")
                .attr("id", "grafico2")
                .attr("width", porEstado.length*30)
                .attr("height", 300)
                .attr("fill", "steelblue")
        

    var maior = 0;
    var menor = Number.MAX_SAFE_INTEGER;
    porEstado.forEach((element) =>  {
        if(element.number > maior){
            maior = element.number;
        }
        if(element.number < menor){
            menor = element.number;
        }
    });
    if(menor != 0){
        menor = menor - maior/10;
    }

    for(let i = 0; i < porEstado.length; i++){
        var aux = (porEstado[i].number-menor)/(maior-menor);
        canvas.append("rect")
            .attr("width", 25)
            .attr("height", aux*100)
            .attr("fill", "blue")
            .attr("x", i*30)
            .attr("y", 100 - aux*100)
            .on("mouseover", function(){
                d3.select(this)
                .style("fill", "red");
            })
            .on("mouseout", function(){
                d3.select(this)
                .style("fill", "blue");
            })
    }
}

csv.then(function(){

///////////////////////////////////////////////////////////// POR ANO
    criarANO();
/////////////////////////////////////////////////////   POR ESTADO
    criarEstado();
    

})
