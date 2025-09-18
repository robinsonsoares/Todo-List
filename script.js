let tarefas = []

function carregarTarefas(){       
    tarefas = leDoLocalStorage() 
    mostrarTarefas()   
}

function adicionarTarefaEnter(e) {
    if (e.key == "Enter"){
        adicionarTarefa()
    }
}

function validaNovaTarefa(texto){
    
    let erro = false 

    if (texto == "") {        
        exibeMensagemErro(mensagem,"Digite uma tarefa antes de adicionar!")
        erro = true 
    } else if(validaSeExistNovaTarefa(texto)){        
        exibeMensagemErro(mensagem,"Já existe uma tarefa com essa descrição")        
        erro = true 
    }
    
    if (erro){
        inputTarefa.style.border = '1px solid red'
    }

    return !erro ? false : true

}

function validaSeExistNovaTarefa(texto)
{
    let values     = JSON.parse(localStorage.getItem("tarefas") || "[]")
    let exists     = values.find(x => x.texto == texto)
    return !exists ? false : true
}

function adicionarTarefa() {
    const inputTarefa = document.getElementById("inputTarefa")
    const textoTarefa = inputTarefa.value.trim()
    const mensagem = document.getElementById("mensagem")
        
    if (validaNovaTarefa(textoTarefa)) return 

    salvarTarefa(textoTarefa)
    
    exibeMensagemSucesso(mensagem,"Tarefa adicionada com sucesso!") 
    inputTarefa.value = ""   
    inputTarefa.style.border = ""

    document.querySelector('input[name="filtro"][value="todas"]').checked = true;
    mostrarTarefas()

}

function salvarTarefa(texto){
    
    const tarefa = {
        texto,
        concluida: false
    }
   
    tarefas.push(tarefa)
    
    salvarNoLocalStorage(tarefas)   

}

function mostrarTarefas(listaTarefas = tarefas){
   
    const lista = document.getElementById("listaTarefa")
    lista.innerHTML = ''

    for (let i = 0; i < tarefas.length; i++){

        const tarefa = listaTarefas[i]

        const item = document.createElement("li")
        item.className="item"

        const textoTarefa = document.createElement("span")
        textoTarefa.textContent = tarefa.texto      
        if (tarefa.concluida) textoTarefa.classList.add("concluida")

        const div = document.createElement("div")
        div.className = "acoes"

        const botaoMarcaTarefa = document.createElement("button")
        botaoMarcaTarefa.textContent = tarefa.concluida?"Desmarcar":"Marcar"
      
        botaoMarcaTarefa.addEventListener("click", () => {
            mudarStatusTarefa(tarefa)
        })

        const botaoApagaTarefa = document.createElement("button")
        botaoApagaTarefa.textContent = "Apagar"
        
        botaoApagaTarefa.addEventListener("click", () => {
            apagarTarefa(tarefa)
        })

        div.appendChild(botaoMarcaTarefa)
        div.appendChild(botaoApagaTarefa)
        item.appendChild(textoTarefa)
        item.appendChild(div)

        lista.appendChild(item)

    }

}

function salvarNoLocalStorage(valor) {    
    localStorage.setItem("tarefas",JSON.stringify(valor))
}

function leDoLocalStorage() {    
    const minhasTarefas = localStorage.getItem("tarefas")       
    return minhasTarefas ? JSON.parse(minhasTarefas) : []
}


function mudarStatusTarefa(tarefa){
    const index = tarefas.findIndex(x => x.texto === tarefa.texto )
    if (index > -1) {
        tarefas[index].concluida = !tarefas[index].concluida
        salvarNoLocalStorage(tarefas)

        exibeMensagemSucesso(mensagem,"Tarefa alterada com sucesso!") 

        const radioAtual = document.querySelector('input[name="filtro"]:checked').value
        filtra(radioAtual)    
    }

}

function apagarTarefa(tarefa) {
    const index = tarefas.findIndex(x => x.texto === tarefa.texto )
    if (index > -1) {
        tarefas.splice(index,1)
        salvarNoLocalStorage(tarefas)
        
        exibeMensagemSucesso(mensagem,"Tarefa alterada com sucesso!") 

        const radioAtual = document.querySelector('input[name="filtro"]:checked').value
        filtra(radioAtual)         
    }
}

function filtra(tipo){
    const todasTarefas = leDoLocalStorage()
    let tarefasParaMostrar = []

    if (tipo == "todas"){        
        tarefasParaMostrar = todasTarefas        
    } else {
        const mostrarTarefasConcluidas = tipo == "concluidas"    
        tarefasParaMostrar  = todasTarefas.filter(tarefa => tarefa.concluida == mostrarTarefasConcluidas)    
    }
    
    mostrarTarefas(tarefasParaMostrar)
    
}

function exibeMensagemErro(elemento, texto){    
    elemento.classList.remove("sucesso")
    elemento.classList.add("erro")
    elemento.textContent = texto

    limpaMensagem(elemento)

}

function exibeMensagemSucesso(elemento, texto){
    elemento.classList.remove("erro")
    elemento.classList.add("sucesso")
    elemento.textContent = texto

    limpaMensagem(elemento)

}

function limpaMensagem(elemento){        
    setTimeout(() => {
        elemento.classList.add("ocultar")
    }, 4000) 
        
    setTimeout(() => {
        elemento.textContent = ''
        elemento.classList.remove('sucesso', 'erro', 'ocultar')
    }, 4500) // 3.5 segundos (3s do timeout + 0.5s da transição)    
}

window.onload = () => {
    carregarTarefas()
    filtra('todas') 
}
