const agregacao = document.querySelector("#agregacao");
const estado = document.querySelector('#estado');
const ano = document.querySelector('#ano');

/*
anos.forEach((element) => {
    const option = document.createElement('option');
    option.textContent = element;
    ano.appendChild(option)
})*/

agregacao.addEventListener('change', () => {
    if(agregacao.value == "Por Ano" || agregacao.value == "Por Estado"){
        estado.disabled = true;
        ano.disabled = true;
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
