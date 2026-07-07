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
    carregarLocalizacaoSalva();
    
    // Carrega tema salvo
    const temaSalvo = localStorage.getItem("auraAlunoTema");
    if (temaSalvo) {
        setAlunoBodyTheme(temaSalvo);
        destacarBotaoTema(temaSalvo);
    }
    
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
    const btn = document.querySelector('button[onclick="obterLocalizacao()"]');
    
    if (!navigator.geolocation) {
        if(status) status.innerHTML = "❌ Seu navegador não suporta geolocalização.";
        alert("Seu navegador não suporta geolocalização.");
        return;
    }
    
    if(status) status.innerHTML = "📡 Buscando sua localização... Por favor aguarde.";
    if(btn) btn.disabled = true;

    navigator.geolocation.getCurrentPosition(sucesso, erro, {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 60000
    });
}

function carregarLocalizacaoSalva() {
    const localizacaoSalva = localStorage.getItem("auraLocalizacaoAluno");
    if(localizacaoSalva) {
        try {
            const dados = JSON.parse(localizacaoSalva);
            let mapaDiv = document.getElementById("alunoLocation");
            if(mapaDiv) {
                mapaDiv.innerHTML = `<iframe width="100%" height="250" frameborder="0" style="border:0; border-radius: 8px;" src="https://maps.google.com/maps?q=${dados.latitude},${dados.longitude}&z=16&output=embed"></iframe><p style="font-size:12px; margin-top:8px; color:#666;">📍 Última localização: ${dados.timestamp}</p>`;
            }
        } catch(e) {
            console.log("Erro ao carregar localização salva", e);
        }
    }
}

function sucesso(posicao) {
    let latitude = posicao.coords.latitude;
    let longitude = posicao.coords.longitude;
    let precisao = posicao.coords.accuracy.toFixed(0);

    const status = document.getElementById("status");
    if(status) status.innerHTML = "✅ Localização atualizada! Precisão: " + precisao + "m";

    let mapaDiv = document.getElementById("alunoLocation");
    if(mapaDiv) {
        mapaDiv.innerHTML = `<iframe width="100%" height="250" frameborder="0" style="border:0; border-radius: 8px;" src="https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed"></iframe><p style="font-size:12px; margin-top:8px; color:#666;">📍 Localização: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}</p>`;
    }

    const dataHora = new Date();
    const timestamp = dataHora.toLocaleTimeString('pt-BR') + ' - ' + dataHora.toLocaleDateString('pt-BR');
    const dadosLocalizacao = {
        latitude: latitude,
        longitude: longitude,
        precision: precisao,
        timestamp: timestamp
    };
    localStorage.setItem("auraLocalizacaoAluno", JSON.stringify(dadosLocalizacao));

    const btn = document.querySelector('button[onclick="obterLocalizacao()"]');
    if(btn) btn.disabled = false;

    // Envia para o servidor se disponível
    fetch("salvar.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "latitude=" + latitude + "&longitude=" + longitude
    }).catch(err => console.log("Servidor PHP não disponível."));
}


function erro(e) {
    const status = document.getElementById("status");
    const btn = document.querySelector('button[onclick="obterLocalizacao()"]');
    if(btn) btn.disabled = false;
    
    let mensagem = "❌ Erro ao obter localização: ";
    
    if (e.code === 1) {
        mensagem += "Permissão negada. Ative a localização em suas configurações.";
    } else if (e.code === 2) {
        mensagem += "Localização indisponível. Tente em um local aberto.";
    } else if (e.code === 3) {
        mensagem += "Tempo esgotado. Tente novamente.";
    } else {
        mensagem += e.message;
    }
    
    if(status) status.innerHTML = mensagem;
    alert(mensagem);
    console.log("Erro de geolocalização:", e);
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
        `<button id="tema-${opt.id}" class="theme-option" onclick="setAlunoBodyTheme('${opt.id}'); destacarBotaoTema('${opt.id}')">${opt.label}</button>`
    ).join("");
}

function setAlunoBodyTheme(theme) {
    const aluno = document.getElementById("aluno");
    const container = document.querySelector('.container');
    const hero = document.getElementById("alunoHero");
    const boxes = document.querySelectorAll('#aluno .box');

    if(!aluno || !container) return;

    const paleta = {
        carros: { fundo: "#e0f2fe", container: "#f8fdff", hero: "#dbeafe", box: "#ffffff" },
        aranha: { fundo: "#fee2e2", container: "#fff7f7", hero: "#fbcfe8", box: "#ffffff" },
        borboletas: { fundo: "#fce7f3", container: "#fff7fc", hero: "#f9d5e5", box: "#ffffff" },
        espaco: { fundo: "#ede9fe", container: "#f8f5ff", hero: "#ddd6fe", box: "#ffffff" },
        neutro: { fundo: "#f3f4f6", container: "#ffffff", hero: "#e5e7eb", box: "#ffffff" },
        estrelas: { fundo: "#fef3c7", container: "#fffbeb", hero: "#fde68a", box: "#ffffff" }
    };

    const tema = paleta[theme];
    if(!tema) return;

    aluno.style.background = tema.fundo;
    container.style.background = tema.container;
    container.style.transition = "background-color 0.3s ease";
    aluno.style.transition = "background-color 0.3s ease";

    if(hero) hero.style.background = tema.hero;
    boxes.forEach(box => {
        if(box) box.style.background = tema.box;
    });

    localStorage.setItem("auraAlunoTema", theme);
    destacarBotaoTema(theme);
}

function destacarBotaoTema(tema) {
    const botoes = document.querySelectorAll(".theme-option");
    botoes.forEach(btn => btn.style.borderColor = "rgba(15,23,42,0.12)");
    const botaoSelecionado = document.getElementById(`tema-${tema}`);
    if(botaoSelecionado) botaoSelecionado.style.borderColor = "#4f46e5";
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
