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


function carregarChatMediador() {
    let chatAluno = document.getElementById("chatAluno");
    let chatResposta = document.getElementById("chatRespostaAluno");
    let chatPaisMed = document.getElementById("chatPaisMediador");

    chatAluno.innerHTML = '';
    chatPaisMed.innerHTML = '';

    let chats = JSON.parse(localStorage.getItem('auraChats') || '{}');

    // Carregar chat com aluno
    // Carregar mensagens do aluno
    let alunoMsgs = chats.alunoMediador || [];

    alunoMsgs.forEach(msg => {
        let div = document.createElement("div");
        if (msg.tipo === 'aluno') {
            div.className = "msg aluno";
            div.innerText = msg.mensagem;
            chatAluno.appendChild(div);
        }
        if (msg.tipo === 'mediador') {
            div.className = "msg";
            div.innerText = "👨‍🏫 Mediador: " + msg.mensagem;
            chatResposta.appendChild(div);
        }
    });

    // Carregar chat com pais
    let paisMsgs = chats.paisMediador || [];
    paisMsgs.forEach(msg => {
        let div = document.createElement("div");
        div.className = "msg";
        if (msg.tipo === 'pai') {
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
let monitoramentoAtivo = false;

function monitorarNotificacoesMediador() {

    if (monitoramentoAtivo) return;

    monitoramentoAtivo = true;

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
function responderAluno() {
    let input = document.getElementById("respostaMediador");
    if (input.value.trim() === "") return;
    let chats = JSON.parse(localStorage.getItem("auraChats") || "{}");

    if (!chats.alunoMediador)
        chats.alunoMediador = [];
    chats.alunoMediador.push({tipo: "mediador",mensagem: input.value,timestamp: new Date().toLocaleTimeString()});

    localStorage.setItem("auraChats",JSON.stringify(chats));
    input.value = "";
}


function enviarMsgPaisMediador() {
    let input = document.getElementById("msgPaisMediador");
    let chat = document.getElementById("chatPaisMediador");

    if (input.value.trim() !== "") {
        let novaMsg = document.createElement("div");
        novaMsg.classList.add("msg");
        novaMsg.innerHTML = "👨‍🏫 Mediador: " + input.value;
        chat.appendChild(novaMsg);
        chat.scrollTop = chat.scrollHeight;

        // Armazenar no localStorage
        let chats = JSON.parse(localStorage.getItem('auraChats') || '{}');
        if (!chats.paisMediador) chats.paisMediador = [];
        chats.paisMediador.push({ tipo: 'mediador', mensagem: input.value, timestamp: new Date().toLocaleTimeString() });
        localStorage.setItem('auraChats', JSON.stringify(chats));

        input.value = "";
    }
}
function abrirConfiguracoes() {
    document.getElementById("mediadorMain").classList.add("hidden");
    document.getElementById("configuracoesMediador").classList.remove("hidden");
    carregarConfiguracoesMediador();
}

function voltarPainelMediador() {
    document.getElementById("configuracoesMediador").classList.add("hidden");
    document.getElementById("mediadorMain").classList.remove("hidden");
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
    const btnAtivar = document.getElementById('btnAtivar2FA');
    const btnDesativar = document.getElementById('btnDesativar2FA');

    if (btnAtivar && btnDesativar) {
        if (estaAtivo) {
            btnAtivar.style.display = 'none';
            btnDesativar.style.display = 'inline-block';
        } else {
            btnAtivar.style.display = 'inline-block';
            btnDesativar.style.display = 'none';
        }
    }
}
function registrarMediador() {
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
function enviarHistoricoParaPais() {
    const checks = document.querySelectorAll('.evento-check:checked');
    if (checks.length === 0) {
        alert('Selecione pelo menos um evento.');
        return;
    }

    let historico = JSON.parse(localStorage.getItem('auraHistoricoPais') || '[]');

    checks.forEach(check => {
        const [texto, hora, tipo] = check.value.split(' | ');
        historico.push({ texto, hora, tipo, enviadoEm: new Date().toLocaleString() });
        check.checked = false;
    });

    localStorage.setItem('auraHistoricoPais', JSON.stringify(historico));
    alert('✅ Histórico enviado para os pais!');
}