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
    localStorage.setItem('auraUserAtual', JSON.stringify({tipo: 'pai', email: email}));
    carregarChatPais();
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
    localStorage.setItem('auraUserAtual', JSON.stringify({tipo: 'mediador', email: email, nome: user.nome}));
    carregarChatMediador();
    document.getElementById("mediador").classList.remove("hidden")
}

function painelAluno(){
    esconderTudo();

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
            { id: "carros", label: "🚗 Carros" },
            { id: "aranha", label: "🕷️ Homem-Aranha" },
            { id: "espaco", label: "🚀 Espaço" }
        ];
    } else if(layout === "feminino"){
        options = [
            { id: "borboletas", label: "🦋 Borboletas" },
            { id: "flores", label: "🌸 Flores" },
            { id: "unicornios", label: "🦄 Unicórnios" }
        ];
    } else {
        options = [
            { id: "neutro", label: "🌟 Tema neutro" },
            { id: "arcoiris", label: "🌈 Arco-íris" },
            { id: "estrelas", label: "✨ Estrelas" }
        ];
    }

    container.innerHTML = options.map(option =>
        `<button type="button" class="theme-option" onclick="setAlunoBodyTheme('${option.id}')">${option.label}</button>`
    ).join("");

    const savedTheme = localStorage.getItem("auraAlunoBodyTheme") || options[0].id;
    setAlunoBodyTheme(savedTheme);
}

function setAlunoBodyTheme(theme){
    const aluno = document.getElementById("aluno");
    const allThemes = ["aluno-theme-carros","aluno-theme-aranha","aluno-theme-espaco","aluno-theme-borboletas","aluno-theme-flores","aluno-theme-unicornios","aluno-theme-neutro","aluno-theme-arcoiris","aluno-theme-estrelas"];
    if(!aluno) return;
    // cleanup previous theme classes from #aluno
    aluno.classList.remove(...allThemes);
    // apply chosen theme only to the aluno container
    aluno.classList.add(`aluno-theme-${theme}`);
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

function enviarMensagemAluno(mensagem){
    // Armazenar a mensagem do aluno
    let chats = JSON.parse(localStorage.getItem('auraChats') || '{}');
    if (!chats.alunoMediador) chats.alunoMediador = [];
    chats.alunoMediador.push({tipo: 'aluno', mensagem: mensagem, timestamp: new Date().toLocaleTimeString()});
    localStorage.setItem('auraChats', JSON.stringify(chats));
    
    alert('Mensagem enviada: ' + mensagem);
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

function salvarConfiguracoesMediador(){
    let nome = document.querySelector('#configuracoesMediador input[placeholder="Alterar nome"]').value.trim();
    let email = document.querySelector('#configuracoesMediador input[placeholder="Alterar email"]').value.trim();
    let telefone = document.querySelector('#configuracoesMediador input[placeholder="Alterar telefone"]').value.trim();
    let novaSenha = document.querySelector('#configuracoesMediador input[placeholder="Nova senha"]').value.trim();

    if(!nome && !email && !telefone && !novaSenha){
        alert('Preencha pelo menos um campo para atualizar.');
        return;
    }

    let userAtual = JSON.parse(localStorage.getItem('auraUserAtual') || '{}');
    let mediadores = JSON.parse(localStorage.getItem('auraMediadorDB') || '[]');
    
    let index = mediadores.findIndex(u => u.email === userAtual.email);
    if(index !== -1){
        if(nome) mediadores[index].nome = nome;
        if(email) mediadores[index].email = email;
        if(telefone) mediadores[index].telefone = telefone;
        if(novaSenha) mediadores[index].password = novaSenha;
        
        localStorage.setItem('auraMediadorDB', JSON.stringify(mediadores));
        localStorage.setItem('auraUserAtual', JSON.stringify({tipo: 'mediador', email: mediadores[index].email, nome: mediadores[index].nome}));
        
        alert('Configurações atualizadas com sucesso!');
        voltarPainelMediador();
    }
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
