function painelPais() {

    const email = document.querySelector('#loginPais input[placeholder="Email"]').value.trim();
    const password = document.querySelector('#loginPais input[type="password"]').value.trim();
    const paisDB = JSON.parse(localStorage.getItem('auraPaisDB') || '[]');
    const user = paisDB.find(u => u.email === email && u.password === password);

    if (!user) {
        alert('Email ou senha incorretos. Cadastre-se ou tente novamente.');
        return;
    }
    if (user.doisFatores) {
        const codigo = gerarCodigo2FA();
        localStorage.setItem("codigo2FA", codigo);
        localStorage.setItem("codigo2FAExpira", Date.now() + (5 * 60 * 1000));
        localStorage.setItem("loginPendente", JSON.stringify({ tipo: 'pai', email: email, nome: user.nome }));
        enviarCodigoEmail(user.email, codigo);
        mostrarTela2FA();
        return;

    }
    document.querySelector('.container').classList.remove('sem-caixa');
    esconderTudo();
    localStorage.setItem('auraUserAtual', JSON.stringify({ tipo: 'pai', email: email }));
   carregarChatPais();
carregarHistoricoPais();
carregarLocalizacaoParaOsPais();
document.getElementById("pais").classList.remove("hidden");
}
function carregarChatPais() {
    let chat = document.getElementById("chatPais");
    chat.innerHTML = '';

    let chats = JSON.parse(localStorage.getItem('auraChats') || '{}');
    let mensagens = chats.paisMediador || [];

    mensagens.forEach(msg => {
        let div = document.createElement("div");
        div.className = "msg";
        if (msg.tipo === 'pai') {
            div.innerText = "Você: " + msg.mensagem;
        } else {
            div.innerText = "Professora: " + msg.mensagem;
        }
        chat.appendChild(div);
    });
    chat.scrollTop = chat.scrollHeight;

}
function enviarMsgPais() {
    let msg = document.getElementById("msgPais").value.trim();
    let chat = document.getElementById("chatPais");

    if (!msg) return;

    let div = document.createElement("div");
    div.className = "msg";
    div.innerText = "Você: " + msg;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;

    // Armazenar no localStorage
    let chats = JSON.parse(localStorage.getItem('auraChats') || '{}');
    if (!chats.paisMediador) chats.paisMediador = [];
    chats.paisMediador.push({ tipo: 'pai', mensagem: msg, timestamp: new Date().toLocaleTimeString() });
    localStorage.setItem('auraChats', JSON.stringify(chats));

    document.getElementById("msgPais").value = "";
}
function registrarPai() {
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
function abrirConfiguracoesPais() {
    document.getElementById("pais").classList.add("hidden");
    document.getElementById("configuracoesPais").classList.remove("hidden");
    let user = JSON.parse(localStorage.getItem("auraUserAtual") || "{}");
    let paises = JSON.parse(localStorage.getItem("auraPaisDB") || "[]");
    let pai = paises.find(p => p.email === user.email);
    if (pai) {
        document.getElementById("nomePaiConfig").value = pai.nome;
        document.getElementById("emailPaiConfig").value = pai.email;
        document.getElementById("alunoPaiConfig").value = pai.aluno;
        document.getElementById("turmaPaiConfig").value = pai.turma;
    }
}
function salvarConfiguracoesPais() {
    let user = JSON.parse(localStorage.getItem("auraUserAtual") || "{}");
    let paises = JSON.parse(localStorage.getItem("auraPaisDB") || "[]");

    let index = paises.findIndex(p => p.email === user.email);

    if (index === -1) {
        alert("Pai não encontrado");
        return;
    }
    let nome = document.getElementById("nomePaiConfig").value.trim();
    let email = document.getElementById("emailPaiConfig").value.trim();
    let senha = document.getElementById("senhaPaiConfig").value.trim();
    let aluno = document.getElementById("alunoPaiConfig").value.trim();
    let turma = document.getElementById("turmaPaiConfig").value.trim();
    if (nome) paises[index].nome = nome;
    if (email) paises[index].email = email;
    if (senha) paises[index].password = senha;
    if (aluno) paises[index].aluno = aluno;
    if (turma) paises[index].turma = turma;
    localStorage.setItem("auraPaisDB", JSON.stringify(paises));
    localStorage.setItem("auraAlunoNome", paises[index].aluno);
    alert("Configurações atualizadas!");
    voltarPainelPais();
}
function voltarPainelPais() {
    document.getElementById("configuracoesPais").classList.add("hidden");
    document.getElementById("pais").classList.remove("hidden");
}
function toggle2FAPai() {

    let userAtual = JSON.parse(
        localStorage.getItem('auraUserAtual') || '{}'
    );


    let paises = JSON.parse(
        localStorage.getItem('auraPaisDB') || '[]'
    );


    let index = paises.findIndex(
        p => p.email === userAtual.email
    );


    if (index === -1) {
        alert("Pai não encontrado.");
        return;
    }


    paises[index].doisFatores = !paises[index].doisFatores;


    localStorage.setItem(
        'auraPaisDB',
        JSON.stringify(paises)
    );


    let ativo = paises[index].doisFatores;


    alert(
        ativo
            ? "✅ Autenticação em 2 etapas ativada!"
            : "❌ Autenticação em 2 etapas desativada!"
    );


    atualizarBotoes2FAPai(ativo);

}


function atualizarBotoes2FAPai(ativo) {

    const ativar =
        document.getElementById("btnAtivar2FAPai");

    const desativar =
        document.getElementById("btnDesativar2FAPai");


    if (ativar && desativar) {

        ativar.style.display = ativo
            ? "none"
            : "inline-block";


        desativar.style.display = ativo
            ? "inline-block"
            : "none";

    }

}
function carregarHistoricoPais() {
    const container = document.getElementById('historicoPais');
    if (!container) return;

    const historico = JSON.parse(localStorage.getItem('auraHistoricoPais') || '[]');

    if (historico.length === 0) {
        container.innerHTML = '<p style="color:#aaa">Nenhum evento recebido ainda.</p>';
        return;
    }

    container.innerHTML = historico.map(ev => `
        <div class="evento ${ev.tipo}">
            ${ev.texto}
            <span>${ev.hora}</span>
        </div>
    `).join('');
}

// ===============================
// LOCALIZAÇÃO DO ALUNO - PAIS
// ===============================

function carregarLocalizacaoParaOsPais() {

    const dadosRaw = localStorage.getItem("auraLocalizacaoAluno");
    const mapaDiv = document.getElementById("paisMapaAluno");
    const statusTxt = document.getElementById("paisStatusLocalizacao");

    if (!mapaDiv) return;

    if (!dadosRaw) {

        if (statusTxt) {
            statusTxt.innerText = "Aguardando compartilhamento do aluno...";
        }

        mapaDiv.innerHTML =
            "O mapa aparecerá aqui quando o aluno compartilhar a localização.";

        return;
    }

    try {

        const dados = JSON.parse(dadosRaw);

        if (statusTxt) {
            statusTxt.innerText = `Última atualização às ${dados.timestamp}`;
        }

        mapaDiv.innerHTML = `
            <iframe
                width="100%"
                height="300"
                frameborder="0"
                style="border:0;border-radius:8px;"
                src="https://maps.google.com/maps?q=${dados.latitude},${dados.longitude}&z=16&output=embed">
            </iframe>`;

    } catch (erro) {

        console.log("Erro ao carregar localização dos pais:", erro);

        if (statusTxt) {
            statusTxt.innerText = "Não foi possível carregar a localização.";
        }

    }

}

document.addEventListener("DOMContentLoaded", () => {

    carregarLocalizacaoParaOsPais();

    window.addEventListener("storage", (e) => {

        if (e.key === "auraLocalizacaoAluno") {
            carregarLocalizacaoParaOsPais();
        }

    });

});
