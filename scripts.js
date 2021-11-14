let usuario = prompt("Qual seu nome?");
let input = document.querySelector("input");
let contatoAtivo;
let visibidadeAtiva;

function enviarUsuario(user){
    const dado = {
        name: user
    }
    const enviar = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', dado);
    enviar.then(tratarEnvio);
    enviar.catch(ErroNoEnvioDoUsuario);
}

function tratarEnvio(resposta){
    //console.log("Envio ok, resposta:");
    //console.log(resposta);
}

function ErroNoEnvioDoUsuario(resposta){
    console.log("Erro no Envio:");
    console.log(resposta);
    usuario = prompt("Nome em uso. Entre com outro nome");
    enviarUsuario(usuario);
}

enviarUsuario(usuario);

function carregarMensagens(){
    let promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    promessa.then(chat);
    function chat(resposta){
        //console.log(resposta);
        mensagens = document.querySelector(".mensagens");
        mensagens.innerHTML =""
        for(let i=0; i < resposta.data.length; i++){
            if(resposta.data[i].type === "status"){
                mensagens.innerHTML += `<p class="status">
                <span>(${resposta.data[i].time})</span> <strong>${resposta.data[i].from}</strong> ${resposta.data[i].text}
                </p>`
            }
            if(resposta.data[i].type === "message"){
                mensagens.innerHTML += `<p class="message">
                <span>(${resposta.data[i].time})</span> <strong>${resposta.data[i].from}</strong> para <strong>${resposta.data[i].to}</strong>: ${resposta.data[i].text}  
                </p>`
            }
            if(resposta.data[i].type === "private_message"){
                mensagens.innerHTML += `<p class="mensage private_message">
                <span>(${resposta.data[i].time})</span> <strong>${resposta.data[i].from}</strong> reservadamente para <strong>${resposta.data[i].to}</strong>: ${resposta.data[i].text}  
                </p>`
            }
        }
        const ultimo = document.querySelector("main").lastChild;
        ultimo.scrollIntoView();
    }
}

carregarMensagens();

setInterval(carregarMensagens,3000);

function verificarUsuario(){
    const dado = {
        name: usuario
    }
    const enviar = axios.post('https://mock-api.driven.com.br/api/v4/uol/status',dado);
    enviar.then(tratarEnvio);
    enviar.catch(ErroDeVerificação);
}

function ErroDeVerificação(resposta){
    console.log(resposta);
}

setInterval(verificarUsuario,5000);

function enviarMensagem(){
    //destino = prompt("Qual o destinatario da mensagem");
    const input = document.querySelector("input");
    const destino = document.querySelector(".contatos .escolhido div p");
    const privaciade = document.querySelector(".visibilidade .escolhido div p");
    if(privaciade == "Publico"){
        const dado = {
            from: usuario,
            to: destino,
            text: input.value,
            type:"message"
        }
    }
    if(privaciade == "Privado"){
        const dado = {
            from: usuario,
            to: destino,
            text: input.value,
            type:  "private_message"
        }
    }
    console.log(input.value);
    const mensagem = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages',dado)
    mensagem.then(mensagemEnviadaOK);
    mensagem.catch(errorEnvioMensagem);
}


function mensagemEnviadaOK(){
    carregarMensagens();
    input.value = "Escreva aqui..."
    
}

function errorEnvioMensagem(){
    window.location.reload();
}

input.addEventListener('keyup', function(e){
     key = e.which || e.keyCode;
    if (key == 13){ 
        enviarMensagem();
    }
});

function apagarInput(){
    if(input.value == "Escreva aqui..."){
        input.value = "";
    }else if(input.value == ""){
        input.value = "Escreva aqui...";
    }
}

function retirarEscondido(){
    const escondido = document.querySelector("nav");
    escondido.classList.remove("escondido");
}

function addEscondido(selecionado){
    const escondido = document.querySelector("nav");
    escondido.classList.add("escondido");
}
function carregarContatos(){
    let contatos = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants')
    contatos.then(adicionarContatos);
    contatos.catch(erroNoContato);

    const nomecontatoAtivo = document.querySelector(".contatos .escolhido p");

    function adicionarContatos(resposta){
        const participantes = document.querySelector(".contatos");
        if(nomecontatoAtivo != null && nomecontatoAtivo.innerHTML == "Todos"){
            participantes.innerHTML = `
            <article onclick="addEscolhido(this)" class="escolhido" data-identifier="participant">
                <div>
                    <ion-icon  name="people"></ion-icon>
                    <p>Todos</p>
                </div>
                <ion-icon class="marcado" name="checkmark-outline"></ion-icon>
            </article>`
        }else{
            participantes.innerHTML = `
            <article onclick="addEscolhido(this) data-identifier="participant"">
                <div>
                    <ion-icon  name="people""></ion-icon>
                    <p>Todos</p>
                </div>
                <ion-icon class="marcado" name="checkmark-outline"></ion-icon>
            </article>`
        }
        
        for(let i= 0; i< resposta.data.length; i++){
            if(nomecontatoAtivo != null && nomecontatoAtivo.innerHTML == resposta.data[i].name){
                participantes.innerHTML += `
                <article onclick="addEscolhido(this)" class="escolhido" data-identifier="participant">
                    <div>
                        <ion-icon  name="people" onclick="retirarEscondido()"></ion-icon>
                        <p>${resposta.data[i].name}</p>
                    </div>
                    <ion-icon class="marcado" name="checkmark-outline"></ion-icon>
                </article>`;
            }else{
                participantes.innerHTML += `
                <article onclick="addEscolhido(this)" data-identifier="participant">
                    <div>
                        <ion-icon  name="people" onclick="retirarEscondido()"></ion-icon>
                        <p>${resposta.data[i].name}</p>
                    </div>
                    <ion-icon class="marcado" name="checkmark-outline"></ion-icon>
                </article>`;
            }
        }
    }
}

function erroNoContato(erro){
    console.log("Erro em pegar contatos: " + erro);
}

carregarContatos();

setInterval(carregarContatos,10000);

function addEscolhido(selecionado){
    contatoAtivo = document.querySelector(".contatos .escolhido");

    if(contatoAtivo == null){
        selecionado.classList.add("escolhido");
    }else{
        contatoAtivo.classList.remove("escolhido");
        selecionado.classList.add("escolhido");
    }
    informarDestinatario();
}


function escolherPrivacidade(selecionado){
    visibidadeAtiva = document.querySelector(".visibilidade .escolhido");
    console.log(visibidadeAtiva);
    if(visibidadeAtiva == null){
        selecionado.classList.add("escolhido");
    }else{
        visibidadeAtiva.classList.remove("escolhido");
        selecionado.classList.add("escolhido");
    }
    informarDestinatario();
}

function informarDestinatario(){
    const nome = document.querySelector(".contatos .escolhido div p");
    const tipo = document.querySelector(".visibilidade .escolhido div p");
    if(nome != null && tipo != null){
        const destino = document.querySelector("footer div span");
        destino.innerHTML = `Enviando para ${nome.innerHTML} (${tipo.innerHTML})`;
        console.log("destino: "+destino);
    }
}
