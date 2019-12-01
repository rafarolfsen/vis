let porMesEstado = []
let porAnoEstado = []
let porEstado = []
let porAno = []
const agregacao = document.querySelector("#agregacao");
const estado = document.querySelector('#estado');
const ano = document.querySelector('#ano');
const mes = document.querySelector('#mes');

//Leitura dos dados
const csv = d3.csv("https://raw.githubusercontent.com/rafarolfsen/vis/master/amazon.csv", function (data){
    //Essa função é executada a cada linha lida

    //Adiciona a linha no vetor porMesEstado que tem os dados no menor nivel de granularidade
    porMesEstado.push({
        year: data.year,
        state: data.state,
        month: data.month,
        number: parseInt(data.number)
    })

    //porAnoEstado agrega os dados por ano e estado, somando todas as entradas de mesmo ano e estado
    //Verifica se ja existe uma entrada desse ano e desse estado no vetor porAnoEstado para realizar a agregação
    var inserirAnoEstado = true;
    porAnoEstado.forEach((element, index) => {
        if(element.state == data.state && element.year == data.year){
            inserirAnoEstado = false;
            element.number += parseInt(data.number, 10); //Agregação
        } 
    });

    //porEstado agrega os dados por estado, somando todas as entradas de mesmo estado
    //Verifica se ja existe uma entrada desse estado no vetor porEstado para realizar a agregação
    var inserirEstado = true;
    porEstado.forEach(element => {
        if(element.state == data.state) {
            inserirEstado = false;
            element.number += parseInt(data.number); //Agregação
        }
    })

    //porAno agrega os dados por ano, somando todas as entradas de mesmo ano
    //Verifica se ja existe uma entrada desse ano no vetor porAno para realizar a agregação
    var inserirAno = true;
    porAno.forEach(element => {
        if(element.year == data.year){
            inserirAno = false;
            element.number += parseInt(data.number, 10); //Agregação
        }
    })

    //Se não realizou agregação, deve-se inserir essa linha
    if(inserirAnoEstado){
        porAnoEstado.push({
            year: data.year,
            state: data.state,
            number: parseInt(data.number, 10)
        })
    }

    //Se não realizou agregação, deve-se inserir essa linha
    if(inserirEstado){
        porEstado.push({
            state: data.state,
            number: parseInt(data.number)
        })
    }

    //Se não realizou agregação, deve-se inserir essa linha
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
        .attr("x",  array.length * espacoBarra / 2)
        .append("h2").text(title)
        .style("color", "black")                    
        .style("text-align","center");

    // Cria espaço onde será gerado o gráfico
    var canvas = d3.select(".canvas").append("svg")
                .attr("id", id)
                .attr("width", screen.width)
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
    // retorna os valores no formato de vetor
    return {
        maior,
        menor
    };
}

//Remove todas as divs com a classe canvas
function removerTodosCanvas(){
    document.querySelectorAll(".canvas").forEach((element) => {
        element.parentElement.removeChild(element);
    })
}

function criarGrafico(canvas, array, labelCallback, valueCallback){
    // Pega maior e menor valor do vetor
    const valores = minMax(array);
    var maior = valores.maior;
    var menor = valores.menor;

    // Gera barras para cada elemento por aglomerado por estado
    for(let i = 0; i < array.length; i++){

        // normaliza os valores
        var aux = (array[i].number-menor)/(maior-menor); // normaliza os valores

        // adiciona novo container para cada barra e preenche os dados de cada uma
        canvas.append("rect")               
            .attr("width", larguraBarra)    
            .attr("height", aux*100)  
            .attr("fill", "#e60000")     
            .attr("x", i * espacoBarra + (screen.width/2 - array.length*espacoBarra/2) )
            .attr("y", alturaBarra - aux*100)
            .on("mouseover", function(){
                d3.select(this)
                .style("fill", "#990000");
                d3.select("#labelestado"+i)
                .style("visibility", "visible")
            })                          
            .on("mouseout", function(){
                d3.select(this)
                .style("fill", "#e60000");
                d3.select("#labelestado"+i)
                .style("visibility", "hidden")
            })

        // Adiciona o label inferior de cada barra
        canvas.append("text")
                .attr("width", larguraBarra)
                .attr("height", 10)
                .attr("x", i * espacoBarra + (screen.width/2 - array.length*espacoBarra/2) )
                .attr("y", alturaBarra + 15)
                .attr("fill", "black")
                .text( labelCallback(array[i]))
        
        // Adiciona o valor numerico de cada barra
        canvas.append("text")
                .attr("id", "labelestado" + i)
                .attr("x",  i * espacoBarra + (screen.width/2 - array.length*espacoBarra/2) )
                .attr("y", alturaBarra - aux * 100 - 2)
                .attr("fill", "black")
                .text(valueCallback(array[i]))
                .style("visibility", "hidden")
    }    
}

//Cria um grafico de barras por ano
function criarANO(){ 
    var canvas = criarGraficoCanvas("Queimadas por ano (em milhares)", "grafico1", porAno);
    criarGrafico(canvas, porAno, (element) => (element.year), (element) => (Math.floor(element.number/1000)));
}

//Cria um grafico de barras por estado
function criarEstado(){
    var canvas = criarGraficoCanvas("Queimadas por estado (em milhares)", "grafico2", porEstado);
    criarGrafico(canvas, porEstado, (element) => (element.state), (element) => (Math.floor(element.number/1000)));
}

//Cria um grafico de barras pelo estado selecionado e por ano
function criarEstadoAno(estado){
    const data = porAnoEstado.filter((element) => (element.state == estado));
    var canvas = criarGraficoCanvas("Queimadas pelo estado " + estado + " por ano (em centenas)", "grafico3", data);
    criarGrafico(canvas, data, (element) => (element.year), (element) => (Math.floor(element.number/100)));
}

//Cria um grafico de barras pelo estado selecionado e pelo ano selecionado
function criarEstadoMes(estado, ano){
    const data = porMesEstado.filter((element) => (element.state == estado && element.year == ano));
    var canvas = criarGraficoCanvas("Queimadas pelo estado " + estado + " pelo ano de "+ ano, "grafico4", data);
    criarGrafico(canvas, data, (element) => (element.month.substring(0, 3)), (element) => (Math.floor(element.number)));
}

//Adiciona os listener dos seletores
function adicionaDropDownListener(){
    const opcoes = {
        "Por Ano" : () => {
            estado.disabled = true;
            ano.disabled = true;
            mes.disabled = true;
            criarANO();
        },

        "Por Estado": () => {
            estado.disabled = true;
            ano.disabled = true;
            mes.disabled = true;
            criarEstado();
            criarMapa(porEstado)
        },

        "Por Estado e por Ano": () => {
            estado.disabled = false;
            ano.disabled = false;
            mes.disabled = true;
            criarEstadoAno(estado.value);
            
            const array = porAnoEstado.filter((element) => (element.year == ano.value)); 
            criarMapa(array, "Queimadas pelo ano de " + ano.value);
        },

        "Por Estado e por mes": () => {
            estado.disabled = false;
            ano.disabled = false;
            mes.disabled = false;
            criarEstadoMes(estado.value, ano.value);

            const array = porMesEstado.filter((element) => (element.year == ano.value && element.month == mes.value)) ;
            criarMapa(array, "Queimadas pelo ano de " + ano.value + " no mês " + mes.value);
        }
    }
    estado.disabled = true;
    ano.disabled = true;
    mes.disabled = true;

    const listener = () => {
        removerTodosCanvas();
        if(opcoes[agregacao.value]){
            opcoes[agregacao.value]();
        }
    }
   
    agregacao.addEventListener('change', listener);
    ano.addEventListener('change', listener);
    estado.addEventListener('change', listener);
    mes.addEventListener('change', listener);

}

function preencherDropDown(){
    const anos = porAno.map(element => element.year);
    const estados = porEstado.map(element => element.state);
    const meses = porMesEstado.map(element => element.month)
                .filter((element, pos, self) => (self.indexOf(element) == pos));

    function cirarOptions(select, array){
        array.forEach((element) => {
            const option = document.createElement('option');
            option.textContent = element;
            select.appendChild(option)
        });
    }

    cirarOptions(ano, anos);
    cirarOptions(estado, estados);
    cirarOptions(mes, meses);

    adicionaDropDownListener();
}

function criarMapa(array, title){
    const valores = minMax(array);
    var maior = valores.maior;
    var menor = valores.menor;
    
    var div = d3.select("body")
            .append("div")
            .attr("class", "canvas")
            .attr("align", "center")
    div.append("h2").text(title);
    
    var svg = div.append("svg")

    width = +svg.attr("width", 1050);
    height = +svg.attr("height", 990);
        
    var promises = [
        d3.json("https://raw.githubusercontent.com/rafarolfsen/vis/master/brm.json")
    ]
    var path = d3.geoPath();
    var color = d3.scaleThreshold()
        .domain(d3.range(1, 27))
        .range(d3.schemeReds[9]);
    Promise.all(promises).then(ready) 

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([140, 140])
    .html(function(d) {
        return "<div style='opacity:0.8;background-color:#329c68;font-family:sans-serif;padding:8px;;color:white'>"+
                "Estado: " + d.properties.NOME_UF + "<br/>"+
                "UF:" + d.properties.UF +"<br/>"+
                "Numero de Queimadas: " + d.Queimadas + 
                "</div>";
        })

    function ready([brm]) {
       var g = svg.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(brm.features)
            .enter().append("path")
            .attr("fill", function(d) { 
                array.forEach(element => {
                    if(element.state == d.properties.UF){
                        d.Queimadas = element.number;
                    }
                });
                const normalizado = (d.Queimadas - menor) / (maior - menor);
                return color(normalizado * 27 + 1); 
            })
            .attr("d", path)  
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide)
    
        g.call(tip)
    }

  }

csv.then(function(){
    preencherDropDown();
    criarANO();
})
