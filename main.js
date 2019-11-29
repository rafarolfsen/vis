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

function criarGraficoCanvas(title, id, array){
    // Adiciona o título da tabela
    d3.select("body")
        .append("div")
        .attr("class", "canvas")
        .append("h2").text(title)
        .style("color", "black")                    
        .style("text-align","center");

    // Cria espaço onde será gerado o gráfico
    var canvas = d3.select(".canvas").append("svg")
                .attr("id", id)
                .attr("width", array.length * espacoBarra)
                .attr("height", alturaBarra+50)

    return canvas;
}

function minMax(array) {
    // Pega maior e menor valor do vetor
    var maior = 0;
    var menor = Number.MAX_SAFE_INTEGER;
    array.forEach((element) =>  {
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

    return {
        maior,
        menor
    };
}

function removerTodosCanvas(){
    document.querySelectorAll(".canvas").forEach((element) => {
        element.parentElement.removeChild(element);
    })
}

function criarANO(){ 
    var canvas = criarGraficoCanvas("Queimadas por ano (em milhares)", "grafico1", porAno);

    // Pega maior e menor valor do vetor
    const valores = minMax(porAno);
    var maior = valores.maior;
    var menor = valores.menor;

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
    var canvas = criarGraficoCanvas("Queimadas por estado (em milhares)", "grafico2", porEstado);

    // Pega maior e menor valor do vetor
    const valores = minMax(porEstado);
    var maior = valores.maior;
    var menor = valores.menor;

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

function preencherDropDown(){
    const agregacao = document.querySelector("#agregacao");
    const estado = document.querySelector('#estado');
    const ano = document.querySelector('#ano');

    const anos = porAno.map(element => element.year);
    const estados = porEstado.map(element => element.state);

    anos.forEach((element) => {
        const option = document.createElement('option');
        option.textContent = element;
        ano.appendChild(option)
    });

    estados.forEach((element) => {
        const option = document.createElement('option');
        option.textContent = element;
        estado.appendChild(option);
    });

    estado.disabled = true;
    ano.disabled = true;
   
    agregacao.addEventListener('change', () => {
        removerTodosCanvas()
        if(agregacao.value == "Por Ano" || agregacao.value == "Por Estado"){
            estado.disabled = true;
            ano.disabled = true;
            if(agregacao.value == "Por Ano")
                criarANO();
            else
                criarEstado();
        } 
        else if(agregacao.value == "Por Estado e por Ano"){
            estado.disabled = false;
            ano.disabled = true;
        }
        else {
            estado.disabled = false;
            ano.disabled = false;
        }
    })
}



csv.then(function(){
    preencherDropDown();
    criarANO();
})
