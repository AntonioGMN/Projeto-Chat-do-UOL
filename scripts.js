let usuario = prompt("Qual seu nome?");
const input = document.querySelector("input");

function enviarUsuario(user){
    const dado = {
        name: user
    }
    const enviar = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', dado);
    enviar.then(tratarEnvio);
    enviar.catch(ErroNoEnvioDoUsuario);
}

function tratarEnvio(resposta){
    console.log("Envio ok, resposta:");
    console.log(resposta);
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
    console.log(input.value);
    const dado = {
        from: usuario,
        to: "Todos",
        text: input.value,
        type: "message" // ou "private_message" para o bônus
    }
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