function abrirLoginPais(){
    document.getElementById("home").classList.add("hidden")
    document.getElementById("loginPais").classList.remove("hidden")
}

function abrirLoginAluno(){
    document.getElementById("home").classList.add("hidden")
    document.getElementById("loginAluno").classList.remove("hidden")
}

function voltar(){
    document.getElementById("loginPais").classList.add("hidden")
    document.getElementById("loginAluno").classList.add("hidden")
    document.getElementById("home").classList.remove("hidden")
}

function painelPais(){
    document.getElementById("loginPais").classList.add("hidden")
    document.getElementById("pais").classList.remove("hidden")
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
}

function pararGravacao(){

    if(!mediaRecorder){
        alert("Você não iniciou a gravação!")
        return
    }

    mediaRecorder.stop()

    mediaRecorder.onstop = () => {

        let blob = new Blob(chunks,{type:"video/webm"})
        let url = URL.createObjectURL(blob)

        document.getElementById("preview").src = url

        localStorage.setItem("videoAluno",url)

        alert("Vídeo enviado para o aluno!")
    }
}
