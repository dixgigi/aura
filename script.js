function abrirLoginPais(){
    esconderTudo();
    document.getElementById("loginPais").classList.remove("hidden")
}
function abrirLoginmediador(){
    esconderTudo();
    document.getElementById("loginmediador").classList.remove("hidden")
}

function abrirLoginAluno(){
    esconderTudo();
    document.getElementById("loginAluno").classList.remove("hidden")
}

function abrirAcessibilidade(){
    esconderTudo();
    document.getElementById("acessibilidade").classList.remove("hidden")
}

function abrirCadastroPais(){
    esconderTudo();
    document.getElementById("registroPais").classList.remove("hidden")
}

function abrirCadastroMediador(){
    esconderTudo();
    document.getElementById("registroMediador").classList.remove("hidden")
}

function voltar(){
    esconderTudo();
    document.querySelector('header').style.display = 'flex';
    document.getElementById("home").classList.remove("hidden")
}

function painelPais(){
    const email = document.querySelector('#loginPais input[placeholder="Email"]').value.trim();
    const password = document.querySelector('#loginPais input[type="password"]').value.trim();
    const paisDB = JSON.parse(localStorage.getItem('auraPaisDB') || '[]');
    const user = paisDB.find(u => u.email === email && u.password === password);

    if (!user) {
        alert('Email ou senha incorretos. Cadastre-se ou tente novamente.');
        return;
    }

    esconderTudo();
    document.getElementById("pais").classList.remove("hidden")
}

function painelmediador(){
    const email = document.querySelector('#loginmediador input[placeholder="Email"]').value.trim();
    const password = document.querySelector('#loginmediador input[type="password"]').value.trim();
    const medDB = JSON.parse(localStorage.getItem('auraMediadorDB') || '[]');
    const user = medDB.find(u => u.email === email && u.password === password);

    if (!user) {
        alert('Email ou senha incorretos. Cadastre-se ou tente novamente.');
        return;
    }

    esconderTudo();
    document.getElementById("mediador").classList.remove("hidden")
}

function painelAluno(){
    esconderTudo();
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
function setTheme(theme){
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add("theme-" + theme);
    localStorage.setItem("auraTheme", theme);
}

function setFontSize(size){
    document.body.classList.remove("font-small", "font-medium", "font-large");
    document.body.classList.add("font-" + size);
    localStorage.setItem("auraFontSize", size);
}

function loadAccessibilitySettings(){
    const savedTheme = localStorage.getItem("auraTheme") || "light";
    const savedFont = localStorage.getItem("auraFontSize") || "medium";
    setTheme(savedTheme);
    setFontSize(savedFont);
}

function registrarPai(){
    const nome = document.getElementById('cadNomePai').value.trim();
    const cpf = document.getElementById('cadCpfPai').value.trim();
    const email = document.getElementById('cadEmailPai').value.trim();
    const password = document.getElementById('cadSenhaPai').value.trim();
    const aluno = document.getElementById('cadAlunoPai').value.trim();
    const turma = document.getElementById('cadTurmaPai').value.trim();

    if (!nome || !cpf || !email || !password || !aluno || !turma) {
        alert('Preencha todos os campos para se cadastrar.');
        return;
    }

    const pais = JSON.parse(localStorage.getItem('auraPaisDB') || '[]');
    if (pais.some(u => u.email === email)) {
        alert('Este e-mail já está cadastrado. Faça login.');
        return;
    }

    pais.push({ nome, cpf, email, password, aluno, turma });
    localStorage.setItem('auraPaisDB', JSON.stringify(pais));
    alert('Cadastro de pais realizado com sucesso! Agora faça login.');
    voltar();
}

function registrarMediador(){
    const nome = document.getElementById('cadNomeMediador').value.trim();
    const cpf = document.getElementById('cadCpfMediador').value.trim();
    const email = document.getElementById('cadEmailMediador').value.trim();
    const idEscola = document.getElementById('cadIdEscola').value.trim();
    const password = document.getElementById('cadSenhaMediador').value.trim();

    if (!nome || !cpf || !email || !idEscola || !password) {
        alert('Preencha todos os campos para se cadastrar.');
        return;
    }

    const mediadores = JSON.parse(localStorage.getItem('auraMediadorDB') || '[]');
    if (mediadores.some(u => u.email === email)) {
        alert('Este e-mail já está cadastrado. Faça login.');
        return;
    }

    mediadores.push({ nome, cpf, email, idEscola, password });
    localStorage.setItem('auraMediadorDB', JSON.stringify(mediadores));
    alert('Cadastro de mediador realizado com sucesso! Agora faça login.');
    voltar();
}

function abrirConfiguracoes(){
    document.getElementById("mediadorMain").classList.add("hidden");
    document.getElementById("configuracoesMediador").classList.remove("hidden");
}

function voltarPainelMediador(){
    document.getElementById("configuracoesMediador").classList.add("hidden");
    document.getElementById("mediadorMain").classList.remove("hidden");
}

function esconderTudo() {
    document.querySelector('header').style.display = 'none';

    document.getElementById("home").classList.add("hidden");
    document.getElementById("loginPais").classList.add("hidden");
    document.getElementById("loginmediador").classList.add("hidden");
    document.getElementById("loginAluno").classList.add("hidden");
    document.getElementById("acessibilidade").classList.add("hidden");
    document.getElementById("registroPais").classList.add("hidden");
    document.getElementById("registroMediador").classList.add("hidden");
    document.getElementById("pais").classList.add("hidden");
    document.getElementById("aluno").classList.add("hidden");
    document.getElementById("mediador").classList.add("hidden");

    document
    .getElementById("configuracoesMediador")
    .classList.add("hidden");
}

loadAccessibilitySettings();
