function abrirLoginPais(){
    esconderTudo();
    document.getElementById("loginPais").classList.remove("hidden")
    document.querySelector('.container').classList.add('sem-caixa');
}
function abrirLoginmediador(){
    esconderTudo();
    document.getElementById("loginmediador").classList.remove("hidden")
    document.querySelector('.container').classList.add('sem-caixa');
}

function abrirLoginAluno(){
    esconderTudo();
    document.getElementById("loginAluno").classList.remove("hidden")
    document.querySelector('.container').classList.add('sem-caixa');
}

function abrirAcessibilidade(){
    esconderTudo();
    document.getElementById("acessibilidade").classList.remove("hidden")
}

function abrirCadastroPais(){
    esconderTudo();
    document.getElementById("registroPais").classList.remove("hidden")
    document.querySelector('.container').classList.remove('sem-caixa');
}

function abrirCadastroMediador(){
    esconderTudo();
    document.getElementById("registroMediador").classList.remove("hidden")
    document.querySelector('.container').classList.remove('sem-caixa');
}

function voltar(){
    esconderTudo();
    document.querySelector('header').style.display = 'flex';
    document.getElementById("home").classList.remove("hidden")
    document.querySelector('.container').classList.remove('sem-caixa');
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
    document.querySelector('.container').classList.remove('sem-caixa');
    esconderTudo();
    localStorage.setItem('auraUserAtual', JSON.stringify({tipo: 'pai', email: email}));
    carregarChatPais();
    document.getElementById("pais").classList.remove("hidden")
}

function painelmediador() {

    const email = document.querySelector('#loginmediador input[placeholder="Email"]').value.trim();
    const password = document.querySelector('#loginmediador input[type="password"]').value.trim();

    const medDB = JSON.parse(localStorage.getItem('auraMediadorDB') || '[]');

    const user = medDB.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        alert('Email ou senha incorretos. Cadastre-se ou tente novamente.');
        return;
    }

   
    if (user.doisFatores) {

        const codigo = gerarCodigo2FA();

        localStorage.setItem("codigo2FA", codigo);

        localStorage.setItem(
            "codigo2FAExpira",
            Date.now() + (5 * 60 * 1000)
        );

        localStorage.setItem(
            "loginPendente",
            JSON.stringify({
                tipo: 'mediador',
                email: email,
                nome: user.nome
            })
        );

        enviarCodigoEmail(user.email, codigo);

        mostrarTela2FA();

        return;
    }

    
    document.querySelector('.container').classList.remove('sem-caixa');

    esconderTudo();

    localStorage.setItem(
        'auraUserAtual',
        JSON.stringify({
            tipo: 'mediador',
            email: email,
            nome: user.nome
        })
    );

    carregarChatMediador();


    document.getElementById("mediador").classList.remove("hidden");

    monitorarNotificacoesMediador();
}

function painelAluno(){
    esconderTudo();
    document.querySelector('.container').classList.remove('sem-caixa');
    const studentName = localStorage.getItem("auraAlunoNome") || "Lucas";
    const studentGender = localStorage.getItem("auraAlunoGenero") || "neutro";

    applyAlunoLayout(studentGender, studentName);
    document.getElementById("aluno").classList.remove("hidden");

    let video = localStorage.getItem("videoAluno")

    if(video){
        document.getElementById("videoAluno").src = video
    }else{
        alert("Nenhum vídeo enviado pelos pais")
    }
}

function applyAlunoLayout(gender, name){
    const aluno = document.getElementById("aluno");
    const hero = document.getElementById("alunoHero");
    const stickers = document.querySelectorAll(".sticker-card");

    aluno.classList.remove("masculino","feminino","neutro");
    hero.classList.remove("masculino","feminino","neutro");
    stickers.forEach(card => card.classList.remove("masculino","feminino"));

    const layout = gender === "feminino" ? "feminino" : gender === "masculino" ? "masculino" : "neutro";
    aluno.classList.add(layout);
    hero.classList.add(layout);
    stickers.forEach(card => card.classList.add(layout));

    populateAlunoThemeOptions(layout);

    document.getElementById("alunoTitle").innerText = `Olá ${name} 👋`;
    document.getElementById("alunoSubtitle").innerText = "Seu espaço tranquilo para saber onde está e contar como se sente.";
    document.getElementById("alunoLocation").innerText = layout === "feminino" ? "📍 Escola Municipal Aurora" : layout === "masculino" ? "📍 Escola Municipal" : "📍 Escola Municipal Neutra";

    if(layout === "feminino"){
        document.getElementById("sticker1").innerHTML = "<span>🌸</span>Momentos calmos";
        document.getElementById("sticker2").innerHTML = "<span>🎨</span>Cores suaves";
        document.getElementById("sticker3").innerHTML = "<span>📖</span>Histórias favoritas";
        document.getElementById("sticker4").innerHTML = "<span>🌈</span>Espaço colorido";
    } else if(layout === "masculino"){
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

function populateAlunoThemeOptions(layout){
    const container = document.getElementById("alunoThemeOptions");
    let options = [];

    if(layout === "masculino"){
        options = [
            { id: "carros", label: "🔵 Azul" },
            { id: "aranha", label: "🔴 Vermelho" },
            { id: "flores", label: "🟢 Verde" },
        ];
    } else if(layout === "feminino"){
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

function carregarChatPais(){
    let chat = document.getElementById("chatPais");
    chat.innerHTML = '';

    let chats = JSON.parse(localStorage.getItem('auraChats') || '{}');
    let mensagens = chats.paisMediador || [];

    mensagens.forEach(msg => {
        let div = document.createElement("div");
        div.className = "msg";
        if(msg.tipo === 'pai'){
            div.innerText = "Você: " + msg.mensagem;
        } else {
            div.innerText = "Professora: " + msg.mensagem;
        }
        chat.appendChild(div);
    });
    chat.scrollTop = chat.scrollHeight;
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
                localStorage.setItem("notificacaoUrgente","🚨 O aluno pediu ajuda!");
            }
        });

    }
}

function carregarChatMediador(){
    let chatAluno = document.getElementById("chatAluno");
    let chatPaisMed = document.getElementById("chatPaisMediador");
    
    chatAluno.innerHTML = '';
    chatPaisMed.innerHTML = '';

    let chats = JSON.parse(localStorage.getItem('auraChats') || '{}');
    
    // Carregar chat com aluno
    let alunoMsgs = chats.alunoMediador || [];
    alunoMsgs.forEach(msg => {
        let div = document.createElement("div");
        if(msg.tipo === 'aluno'){
            div.className = "msg aluno";
            div.innerText = msg.mensagem;
        } else {
            div.className = "msg";
            div.innerText = "👨‍🏫 Mediador: " + msg.mensagem;
        }
        chatAluno.appendChild(div);
    });
    chatAluno.scrollTop = chatAluno.scrollHeight;

    // Carregar chat com pais
    let paisMsgs = chats.paisMediador || [];
    paisMsgs.forEach(msg => {
        let div = document.createElement("div");
        div.className = "msg";
        if(msg.tipo === 'pai'){
            div.innerText = "👩 Pais: " + msg.mensagem;
        } else {
            div.innerText = "👨‍🏫 Mediador: " + msg.mensagem;
        }
        chatPaisMed.appendChild(div);
    });
    chatPaisMed.scrollTop = chatPaisMed.scrollHeight;
}

function salvarConfiguracoesMediador() {
    let nome = document.querySelector('#configuracoesMediador input[placeholder="Alterar nome"]').value.trim();
    let email = document.querySelector('#configuracoesMediador input[placeholder="Alterar email"]').value.trim();
    let idEscola = document.querySelector('#configuracoesMediador input[placeholder="Alterar ID da Escola"]').value.trim();
    let novaSenha = document.querySelector('#configuracoesMediador input[placeholder="Nova senha"]').value.trim();

    let userAtual = JSON.parse(
        localStorage.getItem('auraUserAtual') || '{}'
    );

    let mediadores = JSON.parse(
        localStorage.getItem('auraMediadorDB') || '[]'
    );

    let index = mediadores.findIndex(
        u => u.email === userAtual.email
    );

    if (index === -1) {
        alert('Mediador não encontrado.');
        return;
    }

    if (nome) mediadores[index].nome = nome;
    if (email) mediadores[index].email = email;
    if (idEscola) mediadores[index].idEscola = idEscola;
    if (novaSenha) mediadores[index].password = novaSenha;


    localStorage.setItem(
        'auraMediadorDB',
        JSON.stringify(mediadores)
    );

    localStorage.setItem(
        'auraUserAtual',
        JSON.stringify({
            tipo: 'mediador',
            email: mediadores[index].email,
            nome: mediadores[index].nome
        })
    );

    alert('Configurações atualizadas com sucesso!');
    voltarPainelMediador();
}
function salvarNotificacoes() {
    const notifUrgentes = document.getElementById('notifUrgentes').checked;
    const notifLocalizacao = document.getElementById('notifLocalizacao').checked;
    const notifRelatorios = document.getElementById('notifRelatorios').checked;

    let userAtual = JSON.parse(localStorage.getItem('auraUserAtual') || '{}');
    let mediadores = JSON.parse(localStorage.getItem('auraMediadorDB') || '[]');

    let index = mediadores.findIndex(u => u.email === userAtual.email);

    if (index === -1) {
        alert("Mediador não encontrado");
        return;
    }

    mediadores[index].notificacoes = {
        urgentes: notifUrgentes,
        localizacao: notifLocalizacao,
        relatorios: notifRelatorios
    };

    localStorage.setItem('auraMediadorDB', JSON.stringify(mediadores));

    alert("🔔 Notificações salvas com sucesso!");
}
function carregarConfiguracoesMediador() {

    let userAtual =
        JSON.parse(localStorage.getItem('auraUserAtual') || '{}');

    let mediadores =
        JSON.parse(localStorage.getItem('auraMediadorDB') || '[]');

    let mediador =
        mediadores.find(u => u.email === userAtual.email);

    if (!mediador || !mediador.notificacoes) return;

    document.getElementById('notifUrgentes').checked =
        mediador.notificacoes.urgentes || false;

    document.getElementById('notifLocalizacao').checked =
        mediador.notificacoes.localizacao || false;

    document.getElementById('notifRelatorios').checked =
        mediador.notificacoes.relatorios || false;
}
function monitorarNotificacoesMediador() {

    setInterval(() => {

        const notificacao = localStorage.getItem("notificacaoUrgente");

        console.log("Monitorando:", notificacao);

        if (notificacao) {

            const som = localStorage.getItem("somNotificacao") || "padrao";

            tocarSom(som);

            setTimeout(() => {
                alert(notificacao);
                localStorage.removeItem("notificacaoUrgente");
            }, 500);

        }

    }, 1000);

}
function verificar2FA() {

    const codigoDigitado = document.getElementById("input2fa").value.trim();
    const codigoSalvo = localStorage.getItem("codigo2FA");
    const expiracao =Number(localStorage.getItem("codigo2FAExpira"));
    if (Date.now() > expiracao) {

        localStorage.removeItem("codigo2FA");
        localStorage.removeItem("codigo2FAExpira");

        alert("⏰ Código expirado. Solicite um novo código.");

        return;
    }
    if (codigoDigitado !== codigoSalvo) {
        alert("Código incorreto!");
        return;
    }

    const loginPendente =JSON.parse(localStorage.getItem("loginPendente"));

    localStorage.setItem("auraUserAtual",JSON.stringify(loginPendente));
    localStorage.removeItem("codigo2FA");
    localStorage.removeItem("loginPendente");

    document.querySelector('.container').classList.remove('sem-caixa');
    esconderTudo();
    carregarChatMediador();

    const notificacao = localStorage.getItem("notificacaoUrgente");


    document.getElementById("mediador").classList.remove("hidden");
    monitorarNotificacoesMediador();
}
function gerarCodigo2FA() {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
}
function reenviarCodigo2FA() {

    const loginPendente =
        JSON.parse(
            localStorage.getItem("loginPendente") || "{}"
        );

    if (!loginPendente.email) {
        alert("Sessão inválida.");
        return;
    }

    const codigo = gerarCodigo2FA();

    localStorage.setItem(
        "codigo2FA",
        codigo
    );

    localStorage.setItem(
        "codigo2FAExpira",
        Date.now() + (5 * 60 * 1000)
    );

    enviarCodigoEmail(
        loginPendente.email,
        codigo
    );

    alert("✅ Novo código enviado!");
}
function enviarCodigoEmail(email, codigo) {

    emailjs.send(
        "service_bdd54vr",
        "template_ud3wy08",
        {
            passcode: codigo,
            email: email
        }
    )
        .then(() => {
            alert("📧 Código enviado para o email!");
        })
        .catch((erro) => {
            console.error("Erro EmailJS:", erro);
            alert("❌ Erro ao enviar o código.");
        });

}
function toggle2FA() {
    let userAtual = JSON.parse(
        localStorage.getItem('auraUserAtual') || '{}'
    );

    let mediadores = JSON.parse(
        localStorage.getItem('auraMediadorDB') || '[]'
    );

    let index = mediadores.findIndex(
        u => u.email === userAtual.email
    );

    if (index === -1) {
        alert("Mediador não encontrado.");
        return;
    }

    mediadores[index].doisFatores = !mediadores[index].doisFatores;

    localStorage.setItem(
        'auraMediadorDB',
        JSON.stringify(mediadores)
    );

    let ativo = mediadores[index].doisFatores;

    alert(
        ativo
            ? "✅ Autenticação em 2 etapas ativada!"
            : "❌ Autenticação em 2 etapas desativada!"
    );

    atualizarBotoes2FA(ativo);
}

function atualizarBotoes2FA(estaAtivo) {
    
    let btnAtivar = document.getElementById('btnAtivar2FA');
    let btnDesativar = document.getElementById('btnDesativar2FA');

    if (!btnAtivar || !btnDesativar) {
        const botoes = document.querySelectorAll('.page-actions button');
        botoes.forEach(btn => {
            if (btn.textContent.includes('Ativar')) btnAtivar = btn;
            if (btn.textContent.includes('Desativar')) btnDesativar = btn;
        });
    }

    if (btnAtivar && btnDesativar) {
        if (estaAtivo) {
            btnAtivar.style.setProperty('display', 'none', 'important');
            btnDesativar.style.setProperty('display', 'inline-block', 'important');
        } else {
            btnAtivar.style.setProperty('display', 'inline-block', 'important');
            btnDesativar.style.setProperty('display', 'none', 'important');
        }
    }
}

function checar2FAAoCarregar() {
    let userAtual = JSON.parse(localStorage.getItem('auraUserAtual') || '{}');
    let mediadores = JSON.parse(localStorage.getItem('auraMediadorDB') || '[]');
    let mediadorLogado = mediadores.find(u => u.email === userAtual.email);
    let estadoAtual = mediadorLogado ? !!mediadorLogado.doisFatores : false;
    
    atualizarBotoes2FA(estadoAtual);
}

document.addEventListener("DOMContentLoaded", checar2FAAoCarregar);
window.addEventListener("load", checar2FAAoCarregar);

function voltarLoginMediador() {

    document.getElementById("input2fa").value = "";

    localStorage.removeItem("codigo2FA");
    localStorage.removeItem("codigo2FAExpira");
    localStorage.removeItem("loginPendente");

    esconderTudo();

    document.querySelector('.container').classList.add('sem-caixa');
    document.getElementById("loginmediador").classList.remove("hidden");
    localStorage.removeItem("codigo2FAExpira");
}
function mostrarTela2FA() {
    esconderTudo();
    document
        .getElementById("tela2fa")
        .classList
        .remove("hidden");
}
function testarSom() {

    const somSelecionado =
        document.getElementById("somNotificacao").value;

    tocarSom(somSelecionado);

}
function tocarSom(tipo) {

    let audio;

    switch (tipo) {

        case "suave":
            audio = new Audio("sons/suave.mpeg");
            break;

        case "urgente":
            audio = new Audio("sons/urgente.mpeg");
            break;

        default:
            audio = new Audio("sons/padrao.mpeg");
    }

    audio.play();

}
function salvarSom() {

    const som =
        document.getElementById("somNotificacao").value;

    localStorage.setItem(
        "somNotificacao",
        som
    );

    alert("Som salvo!");

}
function mostrarNotificacaoUrgente(msg) {

    const som =
        localStorage.getItem("somNotificacao")
        || "padrao";

    tocarSom(som);

    alert(msg);

}
function tocarSomUrgente() {
    const audio = new Audio("sons/urgente.mpeg");
    audio.play();
}
function tocarSomPadrao() {
    const audio = new Audio("sons/padrao.mpeg");
    audio.play();
}
function tocarSomSuave() {
    const audio = new Audio("sons/suave.mpeg");
    audio.play();
}
function logout(){
    localStorage.removeItem('auraUserAtual');
    location.reload()
}

function enviarMsgPais(){
    let msg = document.getElementById("msgPais").value.trim();
    let chat = document.getElementById("chatPais");

    if (!msg) return;

    let div = document.createElement("div");
    div.className="msg";
    div.innerText="Você: " + msg;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;

    // Armazenar no localStorage
    let chats = JSON.parse(localStorage.getItem('auraChats') || '{}');
    if (!chats.paisMediador) chats.paisMediador = [];
    chats.paisMediador.push({tipo: 'pai', mensagem: msg, timestamp: new Date().toLocaleTimeString()});
    localStorage.setItem('auraChats', JSON.stringify(chats));

    document.getElementById("msgPais").value="";
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
    let input = document.getElementById("respostaMediador");
    let chat = document.getElementById("chatAluno");

    if(input.value.trim() !== ""){
        let novaMsg = document.createElement("div");
        novaMsg.classList.add("msg");
        novaMsg.innerHTML = "👨‍🏫 Mediador: " + input.value;
        chat.appendChild(novaMsg);
        chat.scrollTop = chat.scrollHeight;

        // Armazenar no localStorage
        let chats = JSON.parse(localStorage.getItem('auraChats') || '{}');
        if (!chats.alunoMediador) chats.alunoMediador = [];
        chats.alunoMediador.push({tipo: 'mediador', mensagem: input.value, timestamp: new Date().toLocaleTimeString()});
        localStorage.setItem('auraChats', JSON.stringify(chats));

        input.value = "";
    }
}


function enviarMsgPaisMediador(){
    let input = document.getElementById("msgPaisMediador");
    let chat = document.getElementById("chatPaisMediador");

    if(input.value.trim() !== ""){
        let novaMsg = document.createElement("div");
        novaMsg.classList.add("msg");
        novaMsg.innerHTML = "👨‍🏫 Mediador: " + input.value;
        chat.appendChild(novaMsg);
        chat.scrollTop = chat.scrollHeight;

        // Armazenar no localStorage
        let chats = JSON.parse(localStorage.getItem('auraChats') || '{}');
        if (!chats.paisMediador) chats.paisMediador = [];
        chats.paisMediador.push({tipo: 'mediador', mensagem: input.value, timestamp: new Date().toLocaleTimeString()});
        localStorage.setItem('auraChats', JSON.stringify(chats));

        input.value = "";
    }
}
function setTheme(theme) {
    document.body.classList.remove("theme-light", "theme-dark");

    document.body.classList.add("theme-" + theme);

    localStorage.setItem("auraTheme", theme);
}

function setFontSize(size) {
    document.body.classList.remove("font-small", "font-medium", "font-large");
    document.body.classList.add("font-" + size);
    localStorage.setItem("auraFontSize", size);
}

function loadAccessibilitySettings() {
    const savedTheme = localStorage.getItem("auraTheme") || "light";
    const savedFont = localStorage.getItem("auraFontSize") || "medium";
    
    setTheme(savedTheme);
    setFontSize(savedFont);
}

loadAccessibilitySettings();

document.addEventListener("DOMContentLoaded", () => {
    loadAccessibilitySettings();
});

function registrarPai(){
    const nome = document.getElementById('cadNomePai').value.trim();
    const cpf = document.getElementById('cadCpfPai').value.trim();
    const email = document.getElementById('cadEmailPai').value.trim();
    const password = document.getElementById('cadSenhaPai').value.trim();
    const aluno = document.getElementById('cadAlunoPai').value.trim();
    const genero = document.getElementById('cadGeneroAluno').value;
    const turma = document.getElementById('cadTurmaPai').value.trim();

    if (!nome || !cpf || !email || !password || !aluno || !genero || !turma) {
        alert('Preencha todos os campos para se cadastrar.');
        return;
    }

    const pais = JSON.parse(localStorage.getItem('auraPaisDB') || '[]');
    if (pais.some(u => u.email === email)) {
        alert('Este e-mail já está cadastrado. Faça login.');
        return;
    }

    const alunoGenero = genero === 'feminino' ? 'feminino' : genero === 'masculino' ? 'masculino' : 'neutro';
    pais.push({ nome, cpf, email, password, aluno, turma, genero: alunoGenero });
    localStorage.setItem('auraPaisDB', JSON.stringify(pais));
    localStorage.setItem('auraAlunoNome', aluno);
    localStorage.setItem('auraAlunoGenero', alunoGenero);
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

    mediadores.push({ nome, cpf, email, idEscola, password, doisFatores: false });
    localStorage.setItem('auraMediadorDB', JSON.stringify(mediadores));
    alert('Cadastro de mediador realizado com sucesso! Agora faça login.');
    voltar();
}

function abrirConfiguracoes(){
    document.getElementById("mediadorMain").classList.add("hidden");
    document.getElementById("configuracoesMediador").classList.remove("hidden");
    carregarConfiguracoesMediador();
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
    document.getElementById("tela2fa").classList.add("hidden");
    document
    .getElementById("configuracoesMediador")
    .classList.add("hidden");
}

loadAccessibilitySettings();
