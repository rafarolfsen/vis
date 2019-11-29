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

// variaveis para controle do tamanho das barras
let larguraBarra = 30;
let alturaBarra = 150;
let espacoBarra = 35;

function criarANO(){

    // Adiciona o título da tabela
    d3.select("body").append("h2").text("Queimadas por ano (em milhares)")
                .style("color", "black")                    
                .style("text-align","center");

    // Cria espaço onde será gerado o gráfico
    var canvas = d3.select("body").append("svg")
                .attr("id", "grafico1")
                .attr("width", porAno.length * espacoBarra)
                .attr("height", alturaBarra+50)

    // Pega maior e menor valor do vetor
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

    // aumenta o valor das barras de forma igualitaria para que a menor não fique com tamanho 0.
    if(menor != 0){  
        menor = menor - maior/10;
    }

    // Gera barras para cada elemento por aglomerado por ano
    for(let i = 0; i < porAno.length; i++){

        // normaliza os valores
        var aux = (porAno[i].number-menor)/(maior-menor); // normaliza os valores

        // adiciona novo container para cada barra e preenche os dados de cada uma
        canvas.append("rect")               
            .attr("width", larguraBarra)    
            .attr("height", aux*100)  
            .attr("fill", "blue")     
            .attr("x", i * espacoBarra)
            .attr("y", alturaBarra - aux*100)
            .on("mouseover", function(){
                d3.select(this)
                .style("fill", "red");
                d3.select("#labelano"+i)
                .style("visibility", "visible")
            })                          
            .on("mouseout", function(){
                d3.select(this)
                .style("fill", "blue");
                d3.select("#labelano"+i)
                .style("visibility", "hidden")
            })

        // Adiciona o label inferior de cada barra
        canvas.append("text")
                .attr("width", larguraBarra)
                .attr("height", 10)
                .attr("x", i * espacoBarra)
                .attr("y", alturaBarra + 15)
                .attr("fill", "black")
                .text( porAno[i].year )
        
        // Adiciona o valor numerico de cada barra
        canvas.append("text")
                .attr("id", "labelano" + i)
                .attr("x", i * espacoBarra)
                .attr("y", alturaBarra - aux * 100 - 2)
                .attr("fill", "black")
                .text(  Math.floor(porAno[i].number/1000) )
                .style("visibility", "hidden")
    }
}

function criarEstado(){

    // Adiciona o título da tabela
    d3.select("body").append("h2").text("Queimadas por estado (em milhares)")
                .style("color", "black")                    
                .style("text-align","center");

    // Cria espaço onde será gerado o gráfico
    var canvas = d3.select("body").append("svg")
                .attr("id", "grafico2")
                .attr("width", porEstado.length * espacoBarra)
                .attr("height", alturaBarra+50)

    // Pega maior e menor valor do vetor
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

    // aumenta o valor das barras de forma igualitaria para que a menor não fique com tamanho 0.
    if(menor != 0){  
        menor = menor - maior/10;
    }

    // Gera barras para cada elemento por aglomerado por estado
    for(let i = 0; i < porEstado.length; i++){

        // normaliza os valores
        var aux = (porEstado[i].number-menor)/(maior-menor); // normaliza os valores

        // adiciona novo container para cada barra e preenche os dados de cada uma
        canvas.append("rect")               
            .attr("width", larguraBarra)    
            .attr("height", aux*100)  
            .attr("fill", "blue")     
            .attr("x", i * espacoBarra)
            .attr("y", alturaBarra - aux*100)
            .on("mouseover", function(){
                d3.select(this)
                .style("fill", "red");
                d3.select("#labelestado"+i)
                .style("visibility", "visible")
            })                          
            .on("mouseout", function(){
                d3.select(this)
                .style("fill", "blue");
                d3.select("#labelestado"+i)
                .style("visibility", "hidden")
            })

        // Adiciona o label inferior de cada barra
        canvas.append("text")
                .attr("width", larguraBarra)
                .attr("height", 10)
                .attr("x", i * espacoBarra)
                .attr("y", alturaBarra + 15)
                .attr("fill", "black")
                .text( porEstado[i].state )
        
        // Adiciona o valor numerico de cada barra
        canvas.append("text")
                .attr("id", "labelestado" + i)
                .attr("x", i * espacoBarra)
                .attr("y", alturaBarra - aux * 100 - 2)
                .attr("fill", "black")
                .text(  Math.floor(porEstado[i].number/1000) )
                .style("visibility", "hidden")
    }
}

csv.then(function(){

    // função para gerar gráfico por ano
    criarANO();

    // função para criar grafico por estado
    criarEstado();
    

})
