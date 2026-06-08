// Banco de dados oficial atualizado com as 4 candidatas da escola
const candidatos = {
    "01": { nome: "Bruna S.", partido: "Chapa Estudantil A", foto: "https://dicebear.com" },
    "02": { nome: "Maria Eduarda", partido: "Chapa Estudantil B", foto: "https://dicebear.com" },
    "03": { nome: "Ana Clara", partido: "Chapa Estudantil C", foto: "https://dicebear.com" },
    "04": { nome: "Beatriz M.", partido: "Chapa Estudantil D", foto: "https://dicebear.com" }
};

let votoDigitado = "";

// Inicializa a contagem incluindo a candidata 04 no LocalStorage do navegador
let totalVotos = JSON.parse(localStorage.getItem("votos_urna")) || { "01": 0, "02": 0, "03": 0, "04": 0, "Branco": 0, "Nulo": 0 };

function obterElementos() {
    return {
        digito1: document.getElementById("digito-1"),
        digito2: document.getElementById("digito-2"),
        dadosCandidato: document.getElementById("dados-candidato"),
        fotoContainer: document.getElementById("foto-container"),
        corpoTela: document.querySelector(".corpo-tela")
    };
}

function atualizarDisplay() {
    const el = obterElementos();
    if (!el.digito1 || !el.digito2) return;

    el.digito1.classList.remove("pisca");
    el.digito2.classList.remove("pisca");

    if (votoDigitado.length === 0) {
        el.digito1.innerText = ""; el.digito2.innerText = "";
        el.digito1.classList.add("pisca");
    } else if (votoDigitado.length === 1) {
        el.digito1.innerText = votoDigitado; el.digito2.innerText = "";
        el.digito2.classList.add("pisca");
    } else if (votoDigitado.length === 2) {
        el.digito1.innerText = votoDigitado.charAt(0);
        el.digito2.innerText = votoDigitado.charAt(1);
        buscarCandidato();
    }
}

function pressionarNumero(num) {
    if (votoDigitado.length < 2) {
        votoDigitado += num;
        atualizarDisplay();
    }
}

function buscarCandidato() {
    const el = obterElementos();
    const candidato = candidatos[votoDigitado];
    if (candidato) {
        el.dadosCandidato.innerHTML = `<p><strong>Nome:</strong> ${candidato.nome}</p><p><strong>Partido:</strong> ${candidato.partido}</p>`;
        el.fotoContainer.innerHTML = `<img src="${candidato.foto}" alt="Foto">`;
    } else {
        el.dadosCandidato.innerHTML = `<p style="color: #ff5f53; font-weight: bold; font-size: 1.5rem;">VOTO NULO</p>`;
        el.fotoContainer.innerHTML = "";
    }
}

function votarBranco() {
    votoDigitado = "BRANCO";
    const el = obterElementos();
    if (!el.digito1) return;
    el.digito1.innerText = ""; el.digito2.innerText = "";
    el.digito1.classList.remove("pisca"); el.digito2.classList.remove("pisca");
    el.dadosCandidato.innerHTML = `<p style="color: #7c6a65; font-weight: bold; font-size: 1.5rem;">VOTO EM BRANCO</p>`;
    el.fotoContainer.innerHTML = "";
}

function corrigir() {
    votoDigitado = "";
    const el = obterElementos();
    if (el.dadosCandidato) el.dadosCandidato.innerHTML = `<p class="instrucao-inicial">Digite o número do seu candidato.</p>`;
    if (el.fotoContainer) el.fotoContainer.innerHTML = "";
    atualizarDisplay();
}

function confirmar() {
    if (votoDigitado.length === 2 || votoDigitado === "BRANCO") {
        if (votoDigitado === "BRANCO") {
            totalVotos["Branco"]++;
        } else if (candidatos[votoDigitado]) {
            totalVotos[votoDigitado]++;
        } else {
            totalVotos["Nulo"]++;
        }

        localStorage.setItem("votos_urna", JSON.stringify(totalVotos));
        localStorage.setItem("dispositivo_votou", "true");

        const el = obterElementos();
        const layoutOriginal = el.corpoTela.innerHTML;
        el.corpoTela.innerHTML = "<div style='font-size: 4rem; font-weight: bold; color: #ff786e; width: 100%; text-align: center; padding-top: 30px;'>FIM</div>";

        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
}

function exibirApuracao() {
    const divResultado = document.getElementById("resultado-votos");
    const containerGrafico = document.getElementById("grafico-barras");
    if (!divResultado || !containerGrafico) return;

    const totalGeral = totalVotos["01"] + totalVotos["02"] + totalVotos["03"] + totalVotos["04"] + totalVotos["Branco"] + totalVotos["Nulo"];
    
    const itens = [
        { label: "Bruna S.", votos: totalVotos["01"] },
        { label: "Maria Eduarda", votos: totalVotos["02"] },
        { label: "Ana Clara", votos: totalVotos["03"] },
        { label: "Beatriz M.", votos: totalVotos["04"] },
        { label: "Brancos", votos: totalVotos["Branco"] },
        { label: "Nulos", votos: totalVotos["Nulo"] }
    ];

    containerGrafico.innerHTML = "";
    itens.forEach(item => {
        const pct = totalGeral > 0 ? ((item.votos / totalGeral) * 100).toFixed(1) : 0;
        containerGrafico.innerHTML += `
            <div class="barra-wrapper">
                <div class="barra-info"><span>${item.label}</span><span>${item.votos} votos (${pct}%)</span></div>
                <div class="barra-fundo"><div class="barra-preenchimento" style="width: ${pct}%"></div></div>
            </div>`;
    });

    divResultado.innerHTML = `
        <hr style="margin: 12px 0; border: 0; border-top: 1px solid #ebdcd8;">
        <div class="item-resultado" style="font-size: 1.1rem; color: #ff5f53;"><strong>TOTAL DE VOTOS:</strong> <span><strong>${totalGeral}</strong></span></div>
        <button onclick="limparVotos()" class="btn-limpar" style="margin-top: 15px;">Zerar Urna (Nova Eleição)</button>
    `;
}

function limparVotos() {
    if(confirm("Deseja zerar todos os votos e remover o bloqueio deste navegador?")) {
        totalVotos = { "01": 0, "02": 0, "03": 0, "04": 0, "Branco": 0, "Nulo": 0 };
        localStorage.removeItem("votos_urna");
        localStorage.removeItem("dispositivo_votou");
        window.location.reload();
    }
}

function alternarModoEscuro() {
    document.body.classList.toggle("dark-theme");
    const btn = document.getElementById("btn-theme");
    if (document.body.classList.contains("dark-theme")) {
        btn.innerText = "☀️ Modo Claro";
        localStorage.setItem("tema_urna", "dark");
    } else {
        btn.innerText = "🌙 Modo Escuro";
        localStorage.setItem("tema_urna", "light");
    }
}

function verificarBloqueio() {
    const jaVotou = localStorage.getItem("dispositivo_votou");
    const msgBloqueio = document.getElementById("msg-bloqueio-inicial");
    const btnIniciar = document.getElementById("btn-iniciar-voto");

    if (jaVotou === "true") {
        if (msgBloqueio) msgBloqueio.style.display = "block";
        if (btnIniciar) {
            btnIniciar.disabled = true;
            btnIniciar.style.opacity = "0.4";
            btnIniciar.onclick = null;
        }
    }
}

function iniciarVotacao() {
    if (localStorage.getItem("dispositivo_votou") === "true") return;

    document.getElementById("tela-inicial").classList.add("escondido");
    document.getElementById("urna-estrutura").classList.remove("escondido");
    document.getElementById("painel-estrutura").classList.remove("escondido");
    exibirApuracao();
}

window.onload = function() {
    if (localStorage.getItem("tema_urna") === "dark") {
        document.body.classList.add("dark-theme");
        document.getElementById("btn-theme").innerText = "☀️ Modo Claro";
    }
    verificarBloqueio();
    atualizarDisplay();
};
