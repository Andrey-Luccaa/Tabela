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
    athletico: "#ff0033",
    atleticomg: "#F0F0F0",
    bahia: "#00a2ff",
    botafogo: "#e0e0e0",
    bragantino: "#ff4d4d",
    chapecoense: "#00ff73",
    corinthians: "#F0F0F0",
    coritiba: "#00ff88",
    cruzeiro: "#2e66ff",
    flamengo: "#ff0000",
    fluminense: "#ff0055",
    gremio: "#00d9ff",
    internacional: "#ff1100",
    mirassol: "#ffe600",
    palmeiras: "#00ff44",
    remo: "#3366ff",
    santos: "#F0F0F0",
    saopaulo: "#ff2222",
    vasco: "#F0F0F0",
    vitoria: "#ae0c00"
};

let dadosTimes = [...listaOriginal];
let posicoesAnteriores = {};

function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
}

async function carregarDadosDaPlanilha() {
    try {
        const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQuYYrJrM1Ozyzllocl72jV0AsJON6oWCsQCvhIC0oE4mJWrcrcDFYq_ghSFwjxX2fsYtFi_i2vmHD-/pub?output=csv&gid=2083338507";
        const res = await fetch(url);
        const texto = (await res.text()).replace(/^\uFEFF/, '');

        const linhas = texto.split(/\r?\n/).slice(1);
        const mapa = {};

        linhas.forEach(l => {
            const sep = l.includes(";") ? ";" : ",";
            const col = l.split(sep);

            const nome = normalizarTexto((col[1] || "").replace(/"/g, ""));

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
    if (!tbody) return;

    const posicoesAntigasDOM = {};
    tbody.querySelectorAll("tr").forEach(tr => {
        posicoesAntigasDOM[tr.dataset.id] = tr.getBoundingClientRect().top;
    });

    const primeiraRenderizacao = Object.keys(posicoesAnteriores).length === 0;

    const times = dadosTimes.map(t => ({
        ...t,
        pontos: t.v * 3 + t.e,
        jogos: t.v + t.e + t.d,
        sg: t.gp - t.gc,
        aproveitamento: (t.v + t.e + t.d) > 0
            ? (((t.v * 3 + t.e) / ((t.v + t.e + t.d) * 3)) * 100).toFixed(1)
            : "0.0"
    })).sort((a, b) => {
        if (b.pontos !== a.pontos) return b.pontos - a.pontos;
        if (b.v !== a.v) return b.v - a.v;
        if (b.sg !== a.sg) return b.sg - a.sg;
        return a.nome.localeCompare(b.nome);
    });

    tbody.innerHTML = "";

    times.forEach((time, index) => {
        const tr = document.createElement("tr");
        tr.dataset.id = time.id;

        const corTime = coresTimes[time.id] || "#fff";
        let corDestaque = corTime;

        // define destaque por posição
        if (index < 4) {
            corDestaque = "#22c55e"; // verde
        } else if (index >= 16) {
            corDestaque = "#ef4444"; // vermelho
        }

tr.style.setProperty("--time-color", corTime);
tr.style.setProperty("--highlight-color", corDestaque);

        const posAntiga = posicoesAnteriores[time.id];
        let seta = "•";
        let classeSeta = "same";

        if (!primeiraRenderizacao && posAntiga !== undefined) {
            if (index < posAntiga) {
                seta = "↑";
                classeSeta = "up";
            } else if (index > posAntiga) {
                seta = "↓";
                classeSeta = "down";
            }
        }

        posicoesAnteriores[time.id] = index;

        if (index < 4) tr.classList.add("top4", "libertadores");
        else if (index === 4) tr.classList.add("pre-liberta");
        else if (index >= 5 && index <= 10) tr.classList.add("sulamericana");
        else if (index >= 16) tr.classList.add("rebaixamento");

        tr.innerHTML = `
            <td>
                <div class="team-info">
                    <span class="pos-num">${index + 1}º</span>
                    <img src="image/${time.logo}" class="timelogo">
                    <span>${time.nome}</span>
                    <span class="pos-change ${classeSeta}">${seta}</span>
                </div>
            </td>
            <td><strong>${time.pontos}</strong></td>
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
                    <span>${time.aproveitamento}%</span>
                </div>
            </td>
        `;

        tr.addEventListener("click", () => {
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(() => {});
            }

            tr.classList.add("clicked");
            setTimeout(() => tr.classList.remove("clicked"), 400);
        });

        tbody.appendChild(tr);
    });

    requestAnimationFrame(() => {
        tbody.querySelectorAll("tr").forEach(tr => {
            const antiga = posicoesAntigasDOM[tr.dataset.id];
            const nova = tr.getBoundingClientRect().top;

            if (antiga !== undefined && antiga !== nova) {
                const delta = antiga - nova;

                tr.style.transition = "none";
                tr.style.transform = `translateY(${delta}px)`;

                requestAnimationFrame(() => {
                    tr.style.transition = window.innerWidth <= 768
                        ? "transform 0.3s ease-out"
                        : "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
                    tr.style.transform = "translateY(0)";
                });
            }
        });
    });
}

document.body.addEventListener("touchstart", () => {
    if (clickSound) {
        clickSound.play().then(() => {
            clickSound.pause();
            clickSound.currentTime = 0;
        }).catch(() => {});
    }
}, { once: true });

carregarDadosDaPlanilha();
