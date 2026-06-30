function painelAluno() {
    esconderTudo();
    
    document.querySelector('.container').classList.remove('sem-caixa');
    const studentName = localStorage.getItem("auraAlunoNome") || "Lucas";
    const studentGender = localStorage.getItem("auraAlunoGenero") || "neutro";
    
    applyAlunoLayout(studentGender, studentName);
    document.getElementById("aluno").classList.remove("hidden");
    carregarRespostaMediador();
    carregarChatAluno();
    let video = localStorage.getItem("videoAluno")

    if (video) {
        document.getElementById("videoAluno").src = video
    } else {
        alert("Nenhum vídeo enviado pelos pais")
    }
}
function applyAlunoLayout(gender, name) {
    const aluno = document.getElementById("aluno");
    const hero = document.getElementById("alunoHero");
    const stickers = document.querySelectorAll(".sticker-card");

    aluno.classList.remove("masculino", "feminino", "neutro");
    hero.classList.remove("masculino", "feminino", "neutro");
    stickers.forEach(card => card.classList.remove("masculino", "feminino"));

    const layout = gender === "feminino" ? "feminino" : gender === "masculino" ? "masculino" : "neutro";
    aluno.classList.add(layout);
    hero.classList.add(layout);
    stickers.forEach(card => card.classList.add(layout));

    populateAlunoThemeOptions(layout);

    document.getElementById("alunoTitle").innerText = `Olá ${name} 👋`;
    document.getElementById("alunoSubtitle").innerText = "Seu espaço tranquilo para saber onde está e contar como se sente.";
    document.getElementById("alunoLocation").innerText = layout === "feminino" ? "📍 Escola Municipal Aurora" : layout === "masculino" ? "📍 Escola Municipal" : "📍 Escola Municipal Neutra";

    if (layout === "feminino") {
        document.getElementById("sticker1").innerHTML = "<span>🌸</span>Momentos calmos";
        document.getElementById("sticker2").innerHTML = "<span>🎨</span>Cores suaves";
        document.getElementById("sticker3").innerHTML = "<span>📖</span>Histórias favoritas";
        document.getElementById("sticker4").innerHTML = "<span>🌈</span>Espaço colorido";
    } else if (layout === "masculino") {
        document.getElementById("sticker1").innerHTML = "<span>🚀</span>Tempo criativo";
        document.getElementById("sticker2").innerHTML = "<span>⚽</span>Jogo tranquilo";
        document.getElementById("sticker3").innerHTML = "<span>🧩</span>Quebra-cabeça leve";
        document.getElementById("sticker4").innerHTML = "<span>🎧</span>Som calmante";
    } else {
        document.getElementById("sticker1").innerHTML = "<span>🌟</span>Espaço sereno";
        document.getElementById("sticker2").innerHTML = "<span>🌈</span>Cores suaves";
        document.getElementById("sticker3").innerHTML = "<span>✨</span>Estrelas calmas";
        document.getElementById("sticker4").innerHTML = "<span>🧘</span>Instante de calma";
    }
}
function populateAlunoThemeOptions(layout) {
    const container = document.getElementById("alunoThemeOptions");
    let options = [];

    if (layout === "masculino") {
        options = [
            { id: "carros", label: "🔵 Azul" },
            { id: "aranha", label: "🔴 Vermelho" },
            { id: "flores", label: "🟢 Verde" },
        ];
    } else if (layout === "feminino") {
        options = [
            { id: "borboletas", label: "🌸 Rosa" },
            { id: "espaco", label: "🟣 Roxo" },
            { id: "unicornios", label: "💜 Lilás" },
        ];
    } else {
        options = [
            { id: "neutro", label: "⚪ Cinza" },
            { id: "arcoiris", label: "🩵 Azul Claro" },
            { id: "estrelas", label: "🟠 Dourado" }
        ];
    }

    container.innerHTML = options.map(option =>
        `<button type="button" class="theme-option" onclick="setAlunoBodyTheme('${option.id}')">${option.label}</button>`
    ).join("");

    const savedTheme = localStorage.getItem("auraAlunoBodyTheme") || options[0].id;
    setAlunoBodyTheme(savedTheme);
}

function setAlunoBodyTheme(theme) {
    const aluno = document.getElementById("aluno");
    if (!aluno) return;

    switch (theme) {
        case "carros":
            aluno.style.background = "#dbeafe"; // azul claro
            break;

        case "aranha":
            aluno.style.background = "#fecaca"; // vermelho claro
            break;

        case "espaco":
            aluno.style.background = "#c7d2fe"; // roxo azulado

            break;

        case "borboletas":
            aluno.style.background = "#fbcfe8"; // rosa claro
            break;

        case "flores":
            aluno.style.background = "#78ff69"; // verde claro
            break;

        case "unicornios":
            aluno.style.background = "#e9d5ff"; // lilás
            break;

        case "neutro":
            aluno.style.background = "#e5e7eb"; // cinza claro
            break;

        case "arcoiris":
            aluno.style.background = "#bfdbfe"; // azul bebê
            break;

        case "estrelas":
            aluno.style.background = "#fef3c7"; // dourado claro
            break;
    }

    localStorage.setItem("auraAlunoBodyTheme", theme);
}
function enviarMensagemAluno(mensagem) {

    let chats = JSON.parse(localStorage.getItem('auraChats') || '{}');
    if (!chats.alunoMediador) chats.alunoMediador = [];
    chats.alunoMediador.push({
        tipo: 'aluno',
        mensagem: mensagem
    });
    localStorage.setItem('auraChats', JSON.stringify(chats));
    if (mensagem.includes("ajuda")) {

        let mediadores = JSON.parse(localStorage.getItem('auraMediadorDB') || '[]');
        mediadores.forEach(mediador => {
            if (mediador.notificacoes?.urgentes) {
                localStorage.setItem("notificacaoUrgente", "🚨 O aluno pediu ajuda!");
            }
        });

    }
}
let cameraStream
let mediaRecorder
let chunks = []

async function iniciarCamera() {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })

        document.getElementById("camera").srcObject = cameraStream
        alert("Câmera ativada!")

    } catch (err) {
        alert("Permissão negada para câmera/microfone")
    }
}

function gravarVideo() {

    if (!cameraStream) {
        alert("Abra a câmera primeiro!")
        return
    }

    chunks = []

    mediaRecorder = new MediaRecorder(cameraStream)

    mediaRecorder.ondataavailable = e => {
        chunks.push(e.data)
    }

    mediaRecorder.start()
    alert("🎥 Gravando vídeo...");
}

function pararGravacao() {

    if (!mediaRecorder) {
        alert("Você não iniciou a gravação!")
        return
    }

    mediaRecorder.stop()
    alert("✅ Vídeo salvo!");
    mediaRecorder.onstop = () => {

        let blob = new Blob(chunks, { type: "video/webm" })
        let url = URL.createObjectURL(blob)

        document.getElementById("preview").src = url

        localStorage.setItem("videoAluno", url)

        alert("Vídeo enviado para o aluno!")
    }
}
function carregarRespostaMediador() {

    let chat = document.getElementById("respostaAluno");

    if (!chat) return;


    let chats = JSON.parse(localStorage.getItem("auraChats") || "{}");


    let mensagens = chats.alunoMediador || [];


    chat.innerHTML = "";


    mensagens.forEach(msg => {

        if (msg.tipo === "mediador") {

            let novaMsg = document.createElement("div");

            novaMsg.classList.add("msg");

            novaMsg.innerHTML =
                "👨‍🏫 Mediador: " + msg.mensagem;

            chat.appendChild(novaMsg);

        }

    });


    chat.scrollTop = chat.scrollHeight;

}
function carregarChatAluno() {

    let chatResposta = document.getElementById("chatRespostaAluno");

    if (!chatResposta) return;

    let chats = JSON.parse(
        localStorage.getItem("auraChats") || "{}"
    );

    let mensagens = chats.alunoMediador || [];

    chatResposta.innerHTML = "";

    mensagens.forEach(msg => {
        if (msg.tipo === "mediador") {
            let div = document.createElement("div");
            div.classList.add("msg");
            div.innerText = " Mediador: " + msg.mensagem;
            chatResposta.appendChild(div);
        }
    });
}
window.addEventListener("storage", function (event) {

    if (event.key === "auraChats") {

        carregarChatAluno();

    }

});