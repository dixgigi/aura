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
    if (loginPendente.tipo === "mediador") {
        carregarChatMediador();
        document.getElementById("mediador").classList.remove("hidden");
        monitorarNotificacoesMediador();

    } else if (loginPendente.tipo === "pai") {
        carregarChatPais();
        document.getElementById("pais").classList.remove("hidden");
    }
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

function logout(){
    localStorage.removeItem('auraUserAtual');
    location.reload()
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

document.addEventListener("DOMContentLoaded", () => {
    loadAccessibilitySettings();
});


let tipoRecuperacao = "";
function abrirRecuperarSenha(tipo) {

    tipoRecuperacao = tipo;

    esconderTudo();

    document
        .getElementById("recuperarSenha")
        .classList.remove("hidden");

}

function recuperarSenha() {

    let email = document.getElementById("emailRecuperacao").value.trim();

    if (!email) {
        alert("Digite seu email.");
        return;
    }

    let usuario;

    if (tipoRecuperacao === "pai") {
        let pais = JSON.parse(localStorage.getItem("auraPaisDB") || "[]");
        usuario = pais.find(p => p.email === email);
    }

    if (tipoRecuperacao === "mediador") {
        let mediadores = JSON.parse(localStorage.getItem("auraMediadorDB") || "[]");
        usuario = mediadores.find(m => m.email === email);
    }

    if (tipoRecuperacao === "aluno") {
        let alunos = JSON.parse(localStorage.getItem("auraAlunoDB") || "[]");
        usuario = alunos.find(a => a.email === email);
    }

    if (!usuario) {
        alert("Email não encontrado.");
        return;
    }

    let novaSenha = Math.floor(100000 + Math.random() * 900000).toString();


    usuario.password = novaSenha;


    if (tipoRecuperacao === "pai") {

        let pais = JSON.parse(localStorage.getItem("auraPaisDB"));
        let index = pais.findIndex(p => p.email === email);
        pais[index] = usuario;

        localStorage.setItem("auraPaisDB",JSON.stringify(pais));

    }

    if (tipoRecuperacao === "mediador") {
        let mediadores = JSON.parse(localStorage.getItem("auraMediadorDB"));
        let index = mediadores.findIndex(m => m.email === email);

        mediadores[index] = usuario;

        localStorage.setItem("auraMediadorDB",JSON.stringify(mediadores));
    }

    enviarNovaSenha(email, novaSenha);
    alert("Nova senha enviada para seu email!");
    voltar();
}

function enviarNovaSenha(email, senha) {
    emailjs.send(
        "service_bdd54vr",
        "template_ud3wy08",
        {
            email: email,
            passcode: senha
        }
    )
        .then(() => {
            console.log("Senha enviada");
        })
        .catch(erro => {
            console.log(erro);
        });
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
    document.getElementById("configuracoesMediador").classList.add("hidden");
    document.getElementById("recuperarSenha").classList.add("hidden");
}

loadAccessibilitySettings();
