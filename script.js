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

function adicionarTarefa() {
    const inputTarefa = document.getElementById("inputTarefa")
    const textoTarefa = inputTarefa.value.trim()
    const mensagemElemento = document.getElementById("mensagem")

    const resultadoValidacao = validaNovaTarefa(textoTarefa)

    if (!resultadoValidacao.valido) {
        inputTarefa.classList.add('input-erro');
        exibeMensagemErro(mensagemElemento, resultadoValidacao.mensagem)
        return
    }

    salvarTarefa(textoTarefa)
    
    exibeMensagemSucesso(mensagemElemento,"Tarefa adicionada com sucesso!") 
    inputTarefa.value = ""   
    inputTarefa.style.border = ""
    inputTarefa.classList.remove("input-erro")
    
    document.querySelector('input[name="filtro"][value="todas"]').checked = true;
    
    mostrarTarefas()
    estadoBotaoLimpar()
}

function validaNovaTarefa(texto){
       
    if (texto == "") {        
        return {
            valido: false,
            mensagem: "Digite uma tarefa antes de adicionar!"
        }
        
    }

    const tarefasExistentes = leDoLocalStorage()
    const existeTarefa = tarefasExistentes.find(tarefa => tarefa.texto === texto)

    if (existeTarefa) {
        return {
            valido: false,
            mensagem: "Já existe uma tarefa com essa descrição"
        }
    }

    return {
        valido: true
    } 

}

function salvarNoLocalStorage(valor) {    
    localStorage.setItem("tarefas",JSON.stringify(valor))
}

function leDoLocalStorage() {    
    const minhasTarefas = localStorage.getItem("tarefas")      
    return minhasTarefas ? JSON.parse(minhasTarefas) : []
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
        botaoMarcaTarefa.className = "btn-lista"
        botaoMarcaTarefa.textContent = tarefa.concluida?"Desmarcar":"Marcar"
      
        botaoMarcaTarefa.addEventListener("click", () => {
            mudarStatusTarefa(tarefa)
        })

        const botaoApagaTarefa = document.createElement("button")
        botaoApagaTarefa.className = "btn-lista"
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
        estadoBotaoLimpar()       
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
    }, 3000) 
        
    setTimeout(() => {
        elemento.textContent = ''
        elemento.classList.remove('sucesso', 'erro', 'ocultar')
    }, 3500) 
}

function limparTarefas() {
    tarefas = []
    salvarNoLocalStorage(tarefas)

    const mensagemElemento = document.getElementById("mensagem")
    exibeMensagemSucesso(mensagemElemento, "Todas as tarefas foram removidas!")

    mostrarTarefas()
    estadoBotaoLimpar()

}

function estadoBotaoLimpar() {
    const botaoLimpar = document.getElementById("btnLimpar")
    botaoLimpar.disabled = tarefas.length === 0

}

window.onload = () => {
    carregarTarefas()
    estadoBotaoLimpar()
    filtra('todas')     
}
