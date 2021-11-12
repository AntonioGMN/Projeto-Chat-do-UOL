let usuario = prompt("Qual seu nome?");

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
                ${resposta.data[i].time} ${resposta.data[i].from} ${resposta.data[i].text}
                </p>`
            }
            if(resposta.data[i].type === "message"){
                mensagens.innerHTML += `<p class="message">
                ${resposta.data[i].time} ${resposta.data[i].from} para ${resposta.data[i].to}: ${resposta.data[i].text}  
                </p>`
            }
            if(resposta.data[i].type === "private_message"){
                mensagens.innerHTML += `<p class="mensage private_message">
                ${resposta.data[i].time} ${resposta.data[i].from} reservadamente para ${resposta.data[i].to}: ${resposta.data[i].text}  
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
    destino = prompt("Qual o destinatario da mensagem");
    const input = document.querySelector("input");
    console.log(input.value);
    const dado = {
        from: usuario,
        to: "Todos",
        text: input.value,
        type: "message" // ou "private_message" para o bônus
    }
    const mensagem = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages',dado)
    mensagem.then(tratarEnvio);
    mensagem.catch(errorEnvioMensagem);

}

function apagarInput(){
    const input = document.querySelector("input");
    if(input.value === "Escreva aqui"){
        input.value = "";
    }else if(input.value == ""){
        input.value = "Escreva aqui";
    }
}

function mensagemEnviadaOK(){
    carregarMensagens();
    const input = document.querySelector("input");
    insut.value = "Escreva aqui"

}

function errorEnvioMensagem(){
    //window.location.reload();
}