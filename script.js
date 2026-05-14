function abrirLoginPais(){
    document.getElementById("home").classList.add("hidden")
    document.getElementById("loginPais").classList.remove("hidden")
}
function abrirLoginmediador(){
    document.getElementById("home").classList.add("hidden")
    document.getElementById("loginmediador").classList.remove("hidden")
}

function abrirLoginAluno(){
    document.getElementById("home").classList.add("hidden")
    document.getElementById("loginAluno").classList.remove("hidden")
}

function voltar(){
    document.getElementById("loginPais").classList.add("hidden")
    document.getElementById("loginAluno").classList.add("hidden")
    document.getElementById("loginmediador").classList.add("hidden")
    document.getElementById("home").classList.remove("hidden")
}

function painelPais(){
    document.getElementById("loginPais").classList.add("hidden")
    document.getElementById("pais").classList.remove("hidden")
}

function painelmediador(){
    document.getElementById("loginmediador").classList.add("hidden")
    document.getElementById("mediador").classList.remove("hidden")
}

function painelAluno(){
    document.getElementById("loginAluno").classList.add("hidden")
    document.getElementById("aluno").classList.remove("hidden")

    let video = localStorage.getItem("videoAluno")

    if(video){
        document.getElementById("videoAluno").src = video
    }else{
        alert("Nenhum vídeo enviado pelos pais")
    }
}

function logout(){
    location.reload()
}

function enviarMsgPais(){
    let msg = document.getElementById("msgPais").value
    let chat = document.getElementById("chatPais")

    let div = document.createElement("div")
    div.className="msg"
    div.innerText="Você: " + msg

    chat.appendChild(div)
    document.getElementById("msgPais").value=""
}

let cameraStream
let mediaRecorder
let chunks = []

async function iniciarCamera(){
    try{
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video:true,
            audio:true
        })

        document.getElementById("camera").srcObject = cameraStream
        alert("Câmera ativada!")

    }catch(err){
        alert("Permissão negada para câmera/microfone")
    }
}

function gravarVideo(){

    if(!cameraStream){
        alert("Abra a câmera primeiro!")
        return
    }

    chunks=[]

    mediaRecorder = new MediaRecorder(cameraStream)

    mediaRecorder.ondataavailable = e => {
        chunks.push(e.data)
    }

    mediaRecorder.start()
       alert("🎥 Gravando vídeo...");
}

function pararGravacao(){

    if(!mediaRecorder){
        alert("Você não iniciou a gravação!")
        return
    }

    mediaRecorder.stop()
  alert("✅ Vídeo salvo!");
    mediaRecorder.onstop = () => {

        let blob = new Blob(chunks,{type:"video/webm"})
        let url = URL.createObjectURL(blob)

        document.getElementById("preview").src = url

        localStorage.setItem("videoAluno",url)

        alert("Vídeo enviado para o aluno!")
    }
}
function responderAluno(){

    let input =
    document.getElementById("respostaMediador");

    let chat =
    document.getElementById("chatAluno");

    if(input.value.trim() !== ""){

        let novaMsg =
        document.createElement("div");

        novaMsg.classList.add("msg");

        novaMsg.innerHTML =
        "👨‍🏫 Mediador: " + input.value;

        chat.appendChild(novaMsg);

        input.value = "";
    }
}


function enviarMsgPaisMediador(){

    let input =
    document.getElementById("msgPaisMediador");

    let chat =
    document.getElementById("chatPaisMediador");

    if(input.value.trim() !== ""){

        let novaMsg =
        document.createElement("div");

        novaMsg.classList.add("msg");

        novaMsg.innerHTML =
        "👨‍🏫 Mediador: " + input.value;

        chat.appendChild(novaMsg);

        input.value = "";
    }
}
function abrirConfiguracoes(){

    esconderTudo();

    document
    .getElementById("configuracoesMediador")
    .classList.remove("hidden");
    document
.getElementById("configuracoesMediador")
.classList.add("hidden");
}


function voltarPainelMediador(){

    esconderTudo();

    document
    .getElementById("mediador")
    .classList.remove("hidden");
}
function esconderTudo() {

    document.getElementById("home").classList.add("hidden");
    document.getElementById("loginPais").classList.add("hidden");
    document.getElementById("loginmediador").classList.add("hidden");
    document.getElementById("loginAluno").classList.add("hidden");
    document.getElementById("pais").classList.add("hidden");
    document.getElementById("aluno").classList.add("hidden");
    document.getElementById("mediador").classList.add("hidden");

    document
    .getElementById("configuracoesMediador")
    .classList.add("hidden");
}