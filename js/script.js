// ================= ÁUDIO =================
const clickSound = document.getElementById("clickSound");

// ================= TIMES =================
const listaOriginal = [
    { nome: "ATHLETICO-PR", id: "athletico", logo: "Atletico paranaense.png", v: 0, e: 0, d: 0, gp: 0, gc: 0, ultimos: []},
    { nome: "ATLÉTICO-MG", id: "atleticomg", logo: "Atlético Mineiro.png", v: 0, e: 0, d: 0, gp: 0, gc: 0, ultimos: [] },
    { nome: "BAHIA", id: "bahia", logo: "Bahia.png", v: 0, e: 0, d: 0, gp: 0, gc: 0, ultimos: [] },
    { nome: "BOTAFOGO", id: "botafogo", logo: "Botafogo.png", v: 0, e: 0, d: 0, gp: 0, gc: 0, ultimos: [] },
    { nome: "BRAGANTINO", id: "bragantino", logo: "Bragantino.png", v: 0, e: 0, d: 0, gp: 0, gc: 0, ultimos: [] },
    { nome: "CHAPECOENSE", id: "chapecoense", logo: "Chapecoense.png", v: 0, e: 0, d: 0, gp: 0, gc: 0, ultimos: [] },
    { nome: "CORINTHIANS", id: "corinthians", logo: "Corinthians.png", v: 0, e: 0, d: 0, gp: 0, gc: 0, ultimos: [] },
    { nome: "CORITIBA", id: "coritiba", logo: "Coritiba.png", v: 0, e: 0, d: 0, gp: 0, gc: 0, ultimos: [] },
    { nome: "CRUZEIRO", id: "cruzeiro", logo: "Cruzeiro.png", v: 0, e: 0, d: 0, gp: 0, gc: 0, ultimos: [] },
    { nome: "FLAMENGO", id: "flamengo", logo: "Flamengo.png", v: 0, e: 0, d: 0, gp: 0, gc: 0, ultimos: [] },
    { nome: "FLUMINENSE", id: "fluminense", logo: "Fluminense.png", v: 0, e: 0, d: 0, gp: 0, gc: 0, ultimos: [] },
    { nome: "GRÊMIO", id: "gremio", logo: "Grêmio.png", v: 0, e: 0, d: 0, gp: 0, gc: 0, ultimos: [] },
    { nome: "INTERNACIONAL", id: "internacional", logo: "Internacional.png", v: 0, e: 0, d: 0, gp: 0, gc: 0, ultimos: [] },
    { nome: "MIRASSOL", id: "mirassol", logo: "Mirassol.png", v: 0, e: 0, d: 0, gp: 0, gc: 0, ultimos: [] },
    { nome: "PALMEIRAS", id: "palmeiras", logo: "Palmeiras.png", v: 0, e: 0, d: 0, gp: 0, gc: 0, ultimos: [] },
    { nome: "REMO", id: "remo", logo: "Remo.png", v: 0, e: 0, d: 0, gp: 0, gc: 0, ultimos: [] },
    { nome: "SANTOS", id: "santos", logo: "Santos.png", v: 0, e: 0, d: 0, gp: 0, gc: 0, ultimos: [] },
    { nome: "SÃO PAULO", id: "saopaulo", logo: "São Paulo.png", v: 0, e: 0, d: 0, gp: 0, gc: 0, ultimos: [] },
    { nome: "VASCO", id: "vasco", logo: "Vasco.png", v: 0, e: 0, d: 0, gp: 0, gc: 0, ultimos: [] },
    { nome: "VITÓRIA", id: "vitoria", logo: "Vitória.png", v: 0, e: 0, d: 0, gp: 0, gc: 0, ultimos: [] }
];

const coresTimes = {
    athletico:"#ff0033",atleticomg:"#F0F0F0",bahia:"#00a2ff",botafogo:"#e0e0e0",
    bragantino:"#ff4d4d",chapecoense:"#00ff73",corinthians:"#F0F0F0",coritiba:"#00ff88",
    cruzeiro:"#2e66ff",flamengo:"#ff0000",fluminense:"#ff0055",gremio:"#00d9ff",
    internacional:"#ff1100",mirassol:"#ffe600",palmeiras:"#00ff44",remo:"#3366ff",
    santos:"#F0F0F0",saopaulo:"#ff2222",vasco:"#F0F0F0",vitoria:"#ae0c00"
};

// clone seguro
let dadosTimes = listaOriginal.map(t => ({ ...t }));
let posicoesAnteriores = {};

// ================= JOGOS =================
let todosJogos = [];
let rodadaAtual = 1;

// ================= UTILS =================
function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
}

function pegarTimePorNome(nome){
    return listaOriginal.find(t => normalizarTexto(t.nome) === nome);
}

function atualizarUltimos(time, resultado) {
    time.ultimos.push(resultado);
    if (time.ultimos.length > 5) {
        time.ultimos.shift();
    }
}

function formatarUltimos(lista) {
    return lista.map(r => {
        if (r === "V") return '<span class="vitoria"></span>';
        if (r === "D") return '<span class="derrota"></span>';
        return '<span class="empate"></span>';
    }).join("");
}

// ================= DADOS =================
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

// ================= JOGOS =================
async function carregarJogosDaPlanilha(){
    try{
        const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQuYYrJrM1Ozyzllocl72jV0AsJON6oWCsQCvhIC0oE4mJWrcrcDFYq_ghSFwjxX2fsYtFi_i2vmHD-/pub?output=csv&gid=1021989896";

        const res = await fetch(url);
        const texto = (await res.text()).replace(/^\uFEFF/, '');

        const linhas = texto.split(/\r?\n/).slice(1);

        todosJogos = [];

        linhas.forEach(l=>{
            const sep = l.includes(";") ? ";" : ",";
            const col = l.split(sep);

            if (!col[0] || col[0] === "---") return;

            const golsCasa = col[3] && col[3].trim() !== "" ? parseInt(col[3]) : null;
            const golsFora = col[4] && col[4].trim() !== "" ? parseInt(col[4]) : null;

            todosJogos.push({
                rodada: parseInt(col[0]),
                casa: normalizarTexto(col[1]),
                fora: normalizarTexto(col[2]),
                golsCasa,
                golsFora,
                bloqueado: golsCasa !== null && golsFora !== null
            });
        });
        
        renderizarRodada();
        atualizarTabelaComJogos();

    }catch(e){
        console.error("Erro jogos:", e);
    }
}

// ================= RODADAS =================
function trocarRodada(dir){
    rodadaAtual += dir;
    if (rodadaAtual < 1) rodadaAtual = 1;
    if (rodadaAtual > 38) rodadaAtual = 38;
    renderizarRodada();
}

function renderizarRodada(){
    const titulo = document.getElementById("tituloRodada");
    if (titulo) titulo.innerText = `Rodada ${rodadaAtual}`;

    const jogos = todosJogos.filter(j => j.rodada === rodadaAtual);
    renderizarJogos(jogos);
}

// ================= TABELA =================
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

        tr.style.setProperty("--time-color", coresTimes[time.id] || "#fff");

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
            <td>
                <div class="ultimos">
                    ${formatarUltimos(time.ultimos)}
                </div>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// ================= JOGOS =================
function atualizarTabelaComJogos() {
    // reset completo
    dadosTimes = listaOriginal.map(t => ({
        ...t,
        v: 0, e: 0, d: 0,
        gp: 0, gc: 0,
        ultimos: []
    }));

    // mapa otimizado
    const mapa = {};
    dadosTimes.forEach(t => {
        mapa[normalizarTexto(t.nome)] = t;
    });

    todosJogos.forEach(j => {
        if (j.golsCasa == null || j.golsFora == null) return;

        const casa = mapa[j.casa];
        const fora = mapa[j.fora];

        if (!casa || !fora) return;

        casa.gp += j.golsCasa;
        casa.gc += j.golsFora;

        fora.gp += j.golsFora;
        fora.gc += j.golsCasa;

        if (j.golsCasa > j.golsFora) {
            casa.v++;
            fora.d++;

            atualizarUltimos(casa, "V");
            atualizarUltimos(fora, "D");

        } else if (j.golsCasa < j.golsFora) {
            fora.v++;
            casa.d++;

            atualizarUltimos(fora, "V");
            atualizarUltimos(casa, "D");

        } else {
            casa.e++;
            fora.e++;

            atualizarUltimos(casa, "E");
            atualizarUltimos(fora, "E");
        }
    });

    renderizarTabela();
}

// ================= INIT =================
carregarDadosDaPlanilha();
carregarJogosDaPlanilha();
