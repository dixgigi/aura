/**
 * AURA - Painel do Aluno e Geolocalização
 */

let cameraStream;
let mediaRecorder;
let chunks = [];

function painelAluno() {
    if (typeof esconderTudo === "function") esconderTudo();
    
    const container = document.querySelector('.container');
    if(container) container.classList.remove('sem-caixa');
    
    const studentName = localStorage.getItem("auraAlunoNome") || "Lucas";
    const studentGender = localStorage.getItem("auraAlunoGenero") || "neutro";
    
    applyAlunoLayout(studentGender, studentName);
    
    const elAluno = document.getElementById("aluno");
    if(elAluno) elAluno.classList.remove("hidden");
    
    carregarChatAluno();
    
    let video = localStorage.getItem("videoAluno");
    const videoEl = document.getElementById("videoAluno");
    if (video && videoEl) {
        videoEl.src = video;
    }
}

function applyAlunoLayout(gender, name) {
    const aluno = document.getElementById("aluno");
    const hero = document.getElementById("alunoHero");
    const stickers = document.querySelectorAll(".sticker-card");

    if(aluno) aluno.classList.remove("masculino", "feminino", "neutro");
    if(hero) hero.classList.remove("masculino", "feminino", "neutro");
    stickers.forEach(card => card.classList.remove("masculino", "feminino", "neutro"));

    const layout = gender === "feminino" ? "feminino" : gender === "masculino" ? "masculino" : "neutro";
    if(aluno) aluno.classList.add(layout);
    if(hero) hero.classList.add(layout);
    stickers.forEach(card => card.classList.add(layout));

    populateAlunoThemeOptions(layout);

    const title = document.getElementById("alunoTitle");
    const subtitle = document.getElementById("alunoSubtitle");
    if(title) title.innerText = `Olá ${name} 👋`;
    if(subtitle) subtitle.innerText = "Seu espaço tranquilo para saber onde está e contar como se sente.";
    
    const mapaDiv = document.getElementById("alunoLocation");
    if (mapaDiv && !mapaDiv.querySelector('iframe')) {
        mapaDiv.innerHTML = "📍 O mapa aparecerá aqui assim que você compartilhar.";
    }

    const s1 = document.getElementById("sticker1");
    const s2 = document.getElementById("sticker2");
    const s3 = document.getElementById("sticker3");
    const s4 = document.getElementById("sticker4");

    if (layout === "feminino") {
        if(s1) s1.innerHTML = "<span>🌸</span>Momentos calmos";
        if(s2) s2.innerHTML = "<span>🎨</span>Cores suaves";
        if(s3) s3.innerHTML = "<span>📖</span>Histórias favoritas";
        if(s4) s4.innerHTML = "<span>🌈</span>Espaço colorido";
    } else if (layout === "masculino") {
        if(s1) s1.innerHTML = "<span>🚀</span>Tempo criativo";
        if(s2) s2.innerHTML = "<span>⚽</span>Jogo tranquilo";
        if(s3) s3.innerHTML = "<span>🧩</span>Quebra-cabeça leve";
        if(s4) s4.innerHTML = "<span>🎧</span>Som calmante";
    } else {
        if(s1) s1.innerHTML = "<span>🌟</span>Espaço sereno";
        if(s2) s2.innerHTML = "<span>🌈</span>Cores suaves";
        if(s3) s3.innerHTML = "<span>✨</span>Estrelas calmas";
        if(s4) s4.innerHTML = "<span>🧘</span>Instante de calma";
    }
}

function obterLocalizacao() {
    const status = document.getElementById("status");
    if (!navigator.geolocation) {
        if(status) status.innerHTML = "Seu navegador não suporta geolocalização.";
        return;
    }
    if(status) status.innerHTML = "Buscando sua localização... 📡";

    navigator.geolocation.getCurrentPosition(sucesso, erro, {
        enableHighAccuracy: false, // Alterado para false para acelerar a resposta em computadores/redes locais
        timeout: 20000,            // Aumentado para 20 segundos para evitar o erro de Timeout expirado
        maximumAge: 60000          // Aceita localizações armazenadas em cache de até 1 minuto atrás
    });
}

function sucesso(posicao) {
    let latitude = posicao.coords.latitude;
    let longitude = posicao.coords.longitude;

    const status = document.getElementById("status");
    if(status) status.innerHTML = "Localização atualizada! ✅";

    let mapaDiv = document.getElementById("alunoLocation");
    if(mapaDiv) {
        mapaDiv.innerHTML = `<iframe width="100%" height="250" frameborder="0" style="border:0; border-radius: 8px;" src="https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed"></iframe>`;
    }

    // ==== NOVO: Compartilha com o Mediador via LocalStorage ====
    const dadosLocalizacao = {
        latitude: latitude,
        longitude: longitude,
        timestamp: new Date().toLocaleTimeString()
    };
    localStorage.setItem("auraLocalizacaoAluno", JSON.stringify(dadosLocalizacao));
    // ==========================================================

    // Seu fetch antigo (mantido por compatibilidade)
    fetch("salvar.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "latitude=" + latitude + "&longitude=" + longitude
    }).catch(err => console.log("Persistência PHP externa offline ou ignorada em ambiente local."));
}


function erro(e) {
    const status = document.getElementById("status");
    if(status) status.innerHTML = "Erro ao obter localização: " + e.message;
}

function populateAlunoThemeOptions(layout) {
    const container = document.getElementById("alunoThemeOptions");
    if(!container) return;
    let options = [];
    if (layout === "masculino") {
        options = [ { id: "carros", label: "🔵 Azul" }, { id: "aranha", label: "🔴 Vermelho" } ];
    } else if (layout === "feminino") {
        options = [ { id: "borboletas", label: "🌸 Rosa" }, { id: "espaco", label: "🟣 Roxo" } ];
    } else {
        options = [ { id: "neutro", label: "⚪ Cinza" }, { id: "estrelas", label: "🟠 Dourado" } ];
    }

    container.innerHTML = options.map(opt => 
        `<button class="theme-option" onclick="setAlunoBodyTheme('${opt.id}')">${opt.label}</button>`
    ).join("");
}

function setAlunoBodyTheme(theme) {
    const aluno = document.getElementById("aluno");
    if(!aluno) return;
    if(theme === "carros") aluno.style.backgroundColor = "#e0f2fe";
    if(theme === "aranha") aluno.style.backgroundColor = "#fee2e2";
    if(theme === "borboletas") aluno.style.backgroundColor = "#fce7f3";
    if(theme === "espaco") aluno.style.backgroundColor = "#ede9fe";
    if(theme === "neutro") aluno.style.backgroundColor = "#f3f4f6";
    if(theme === "estrelas") aluno.style.backgroundColor = "#fef3c7";
}

function enviarMensagemAluno(msgTexto) {
    if (!msgTexto.trim()) return;
    let chats = JSON.parse(localStorage.getItem('auraChats') || '{}');
    if (!chats.alunoMediador) chats.alunoMediador = [];
    chats.alunoMediador.push({ tipo: 'aluno', message: msgTexto, timestamp: new Date().toLocaleTimeString() });
    localStorage.setItem('auraChats', JSON.stringify(chats));
    carregarChatAluno();
}

function carregarChatAluno() {
    let chatResposta = document.getElementById("chatRespostaAluno");
    if (!chatResposta) return;
    chatResposta.innerHTML = "";
    let chats = JSON.parse(localStorage.getItem('auraChats') || '{}');
    let alunoMsgs = chats.alunoMediador || [];

    alunoMsgs.forEach(msg => {
        if (msg.tipo === 'mediador') {
            let div = document.createElement("div");
            div.className = "msg mediador-msg";
            div.innerText = "👨‍🏫 Mediador: " + msg.mensagem;
            chatResposta.appendChild(div);
        }
    });
}

async function iniciarCamera() {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const cameraEl = document.getElementById("camera");
        if(cameraEl) cameraEl.srcObject = cameraStream;
        alert("Câmera ativada!");
    } catch (err) {
        alert("Permissão negada para acessar câmera/microfone");
    }
}

function gravarVideo() {
    if (!cameraStream) {
        alert("Abra a câmera primeiro!");
        return;
    }
    chunks = [];
    mediaRecorder = new MediaRecorder(cameraStream);
    mediaRecorder.ondataavailable = e => { chunks.push(e.data); };
    mediaRecorder.start();
    alert("🎥 Gravando vídeo...");
}

function pararGravacao() {
    if (!mediaRecorder) {
        alert("Você não iniciou nenhuma gravação!");
        return;
    }
    mediaRecorder.stop();
    alert("✅ Vídeo gravado com sucesso!");
    mediaRecorder.onstop = () => {
        let blob = new Blob(chunks, { type: "video/webm" });
        let url = URL.createObjectURL(blob);
        const previewEl = document.getElementById("preview");
        if(previewEl) previewEl.src = url;
        localStorage.setItem("videoAluno", url);
        alert("Vídeo enviado para a área do aluno!");
    };
}
