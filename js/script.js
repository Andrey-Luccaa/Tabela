const clickSound = document.getElementById("clickSound");

const listaOriginal = [
    { nome: "ATHLETICO-PR", id: "athletico", logo: "Atletico paranaense.png", v: 0, e: 0, d: 0, gp: 0, gc: 0 },
    { nome: "ATLÉTICO-MG", id: "atleticomg", logo: "Atlético Mineiro.png", v: 0, e: 0, d: 0, gp: 0, gc: 0 },
    { nome: "BAHIA", id: "bahia", logo: "Bahia.png", v: 0, e: 0, d: 0, gp: 0, gc: 0 },
    { nome: "BOTAFOGO", id: "botafogo", logo: "Botafogo.png", v: 0, e: 0, d: 0, gp: 0, gc: 0 },
    { nome: "BRAGANTINO", id: "bragantino", logo: "Bragantino.png", v: 0, e: 0, d: 0, gp: 0, gc: 0 },
    { nome: "CHAPECOENSE", id: "chapecoense", logo: "Chapecoense.png", v: 0, e: 0, d: 0, gp: 0, gc: 0 },
    { nome: "CORINTHIANS", id: "corinthians", logo: "Corinthians.png", v: 0, e: 0, d: 0, gp: 0, gc: 0 },
    { nome: "CORITIBA", id: "coritiba", logo: "Coritiba.png", v: 0, e: 0, d: 0, gp: 0, gc: 0 },
    { nome: "CRUZEIRO", id: "cruzeiro", logo: "Cruzeiro.png", v: 0, e: 0, d: 0, gp: 0, gc: 0 },
    { nome: "FLAMENGO", id: "flamengo", logo: "Flamengo.png", v: 0, e: 0, d: 0, gp: 0, gc: 0 },
    { nome: "FLUMINENSE", id: "fluminense", logo: "Fluminense.png", v: 0, e: 0, d: 0, gp: 0, gc: 0 },
    { nome: "GRÊMIO", id: "gremio", logo: "Grêmio.png", v: 0, e: 0, d: 0, gp: 0, gc: 0 },
    { nome: "INTERNACIONAL", id: "internacional", logo: "Internacional.png", v: 0, e: 0, d: 0, gp: 0, gc: 0 },
    { nome: "MIRASSOL", id: "mirassol", logo: "Mirassol.png", v: 0, e: 0, d: 0, gp: 0, gc: 0 },
    { nome: "PALMEIRAS", id: "palmeiras", logo: "Palmeiras.png", v: 0, e: 0, d: 0, gp: 0, gc: 0 },
    { nome: "REMO", id: "remo", logo: "Remo.png", v: 0, e: 0, d: 0, gp: 0, gc: 0 },
    { nome: "SANTOS", id: "santos", logo: "Santos.png", v: 0, e: 0, d: 0, gp: 0, gc: 0 },
    { nome: "SÃO PAULO", id: "saopaulo", logo: "São Paulo.png", v: 0, e: 0, d: 0, gp: 0, gc: 0 },
    { nome: "VASCO", id: "vasco", logo: "Vasco.png", v: 0, e: 0, d: 0, gp: 0, gc: 0 },
    { nome: "VITÓRIA", id: "vitoria", logo: "Vitória.png", v: 0, e: 0, d: 0, gp: 0, gc: 0 }
];

const coresTimes = {
    bahia: "#00a2ff",
    flamengo: "#ff0000",
    palmeiras: "#00ff44",
    vitoria: "#ff0044"
};

let dadosTimes = [...listaOriginal];
let pontuacoesAntigas = {};

function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
}

async function carregarDadosDaPlanilha() {
    try {
        const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQuYYrJrM1Ozyzllocl72jV0AsJON6oWCsQCvhIC0oE4mJWrcrcDFYq_ghSFwjxX2fsYtFi_i2vmHD-/pub?output=csv&gid=2083338507";
        const res = await fetch(url);
        const texto = await res.text();

        const linhas = texto.split("\n").slice(1);

        const mapa = {};

        linhas.forEach(l => {
            const col = l.split(",");
            const nome = normalizarTexto(col[1] || "");

            mapa[nome] = {
                v: parseInt(col[2]) || 0,
                e: parseInt(col[3]) || 0,
                d: parseInt(col[4]) || 0,
                gp: parseInt(col[5]) || 0,
                gc: parseInt(col[6]) || 0
            };
        });

        dadosTimes = listaOriginal.map(t => {
            const chave = normalizarTexto(t.nome);
            return mapa[chave] ? { ...t, ...mapa[chave] } : t;
        });

        renderizarTabela();

    } catch (e) {
        console.error("Erro:", e);
        renderizarTabela();
    }
}

function renderizarTabela() {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    const times = dadosTimes.map(t => ({
        ...t,
        pontos: t.v * 3 + t.e,
        jogos: t.v + t.e + t.d,
        sg: t.gp - t.gc,
        aproveitamento: ((t.v * 3 + t.e) / ((t.v + t.e + t.d) * 3) * 100 || 0).toFixed(1)
    })).sort((a, b) => b.pontos - a.pontos);

    times.forEach((time, index) => {
        const tr = document.createElement("tr");

        tr.style.setProperty("--time-color", coresTimes[time.id] || "#fff");

        if (index < 4) tr.classList.add("top4", "libertadores");
        else if (index === 4) tr.classList.add("pre-liberta");
        else if (index >= 5 && index <= 10) tr.classList.add("sulamericana");
        else if (index >= 16) tr.classList.add("rebaixamento");

        tr.innerHTML = `
            <td>${index + 1}º - ${time.nome}</td>
            <td>${time.pontos}</td>
            <td>${time.jogos}</td>
            <td>${time.v}</td>
            <td>${time.e}</td>
            <td>${time.d}</td>
            <td>${time.gp}</td>
            <td>${time.gc}</td>
            <td>${time.sg}</td>
            <td>
                <div class="aproveitamento-bar">
                    <div class="fill" style="width:${time.aproveitamento}%"></div>
                </div>
            </td>
        `;

        tr.addEventListener("click", () => {
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(() => {});
            }

            tr.classList.add("clicked");
            setTimeout(() => tr.classList.remove("clicked"), 300);
        });

        tbody.appendChild(tr);
    });
}

// liberar áudio mobile
document.body.addEventListener("touchstart", () => {
    if (clickSound) {
        clickSound.play().then(() => {
            clickSound.pause();
            clickSound.currentTime = 0;
        }).catch(() => {});
    }
}, { once: true });

carregarDadosDaPlanilha();
