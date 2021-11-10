const promessa = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages');
promessa.then(carregarMensagens);

function carregarMensagens(resposta){
    console.log(resposta);
    mensagens = document.querySelector(".mensagens");
    for(let i=0; i < 100; i++){
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
            mensagens.innerHTML += `<p class="private_message">
            ${resposta.data[i].time} ${resposta.data[i].from} reservadamente para ${resposta.data[i].to}: ${resposta.data[i].text}  
            </p>`
        }


    }
    console.log(resposta.data[0].text)
    // mensagens.innerHTML += `
    // <p>${resposta.data[0].time} ${resposta.data[0].from} para ${resposta.data[0].to} ${resposta.data[0].text}</p>`
    

}

