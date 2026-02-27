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

// Mapeamento de cores para o efeito de brilho
const coresTimes = {
    athletico: "#ff0033",     // Vermelho Vivo
    atleticomg: "#ffffff",    // Branco Puro
    bahia: "#00a2ff",         // Azul Cyan
    botafogo: "#e0e0e0",      // Prata Brilhante
    bragantino: "#ff4d4d",    // Vermelho Touro
    chapecoense: "#00ff73",   // Verde Esmeralda
    corinthians: "#ffffff",   
    coritiba: "#00ff88",      
    cruzeiro: "#2e66ff",      // Azul Elétrico
    flamengo: "#ff0000",      
    fluminense: "#ff0055",    // Grená Vibrante
    gremio: "#00d9ff",        // Azul Celeste Neon
    internacional: "#ff1100", 
    mirassol: "#ffe600",      // Amarelo Limão
    palmeiras: "#00ff44",     // Verde Neon
    remo: "#3366ff",          
    santos: "#f0f0f0",        
    saopaulo: "#ff2222",      
    vasco: "#ffffff",         
    vitoria: "#ff0044"
};

let dadosTimes = [...listaOriginal];

function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
}

async function carregarDadosDaPlanilha() {
    try {
        const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQuYYrJrM1Ozyzllocl72jV0AsJON6oWCsQCvhIC0oE4mJWrcrcDFYq_ghSFwjxX2fsYtFi_i2vmHD-/pub?output=csv&gid=2083338507";
        const resposta = await fetch(sheetURL);
        if (!resposta.ok) throw new Error("Erro ao acessar Google Sheets.");

        const texto = (await resposta.text()).replace(/^\uFEFF/, '');
        const linhas = texto.split(/\r?\n/).filter(l => l.trim().length > 0);
        const corpo = linhas.slice(1);
        const mapaPlanilha = {};

        corpo.forEach(linha => {
            const separador = linha.includes(';') ? ';' : ',';
            const col = linha.split(separador);
            if (col.length >= 7) {
                const nomeCSV = normalizarTexto(col[1].replace(/"/g, ''));
                mapaPlanilha[nomeCSV] = {
                    v: parseInt(col[2]) || 0, e: parseInt(col[3]) || 0, d: parseInt(col[4]) || 0,
                    gp: parseInt(col[5]) || 0, gc: parseInt(col[6]) || 0
                };
            }
        });

        dadosTimes = listaOriginal.map(time => {
            const nomeChave = normalizarTexto(time.nome);
            const novosValores = mapaPlanilha[nomeChave];
            return novosValores ? { ...time, ...novosValores } : time;
        });

        renderizarTabela();
    } catch (erro) {
        console.error("Erro crítico:", erro.message);
        renderizarTabela();
    }
}

function renderizarTabela() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;

    const posicoesAntigas = {};
    tbody.querySelectorAll('tr').forEach(tr => {
        const id = tr.dataset.id;
        if (id) posicoesAntigas[id] = tr.getBoundingClientRect().top;
    });

    const timesProcessados = dadosTimes.map(t => ({
        ...t,
        pontos: (t.v * 3) + (t.e * 1),
        jogos: t.v + t.e + t.d,
        sg: t.gp - t.gc,
        aproveitamento: (t.v + t.e + t.d) > 0 
            ? (((t.v * 3 + t.e) / ((t.v + t.e + t.d) * 3)) * 100).toFixed(1) : "0.0"
    })).sort((a, b) => {
        if (b.pontos !== a.pontos) return b.pontos - a.pontos;
        if (b.v !== a.v) return b.v - a.v;
        if (b.sg !== a.sg) return b.sg - a.sg;
        return a.nome.localeCompare(b.nome);
    });

    tbody.innerHTML = '';

    timesProcessados.forEach((time, index) => {
        const tr = document.createElement('tr');
        tr.dataset.id = time.id;
        
        // Define a cor do time para o CSS usar no hover
        const corHex = coresTimes[time.id] || "#ffffff";
        tr.style.setProperty('--time-color', corHex);

        tr.innerHTML = `
            <td>
                <div class="team-info">
                    <span class="pos-num">${index + 1}º</span>
                    <img src="image/${time.logo}" class="timelogo">
                    <span>${time.nome}</span>
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
            <td>${time.aproveitamento}%</td>
        `;

        if (index < 4) tr.style.borderLeft = "4px solid #00ff88";
        else if (index >= 4 && index <= 5) tr.style.borderLeft = "4px solid #e5ff00";
        else if (index >= 6 && index <= 11) tr.style.borderLeft = "4px solid #006FFF";
        else if (index >= 16) tr.style.borderLeft = "4px solid #ff4d4d";

        tbody.appendChild(tr);
    });

    // Lógica de animação de troca de posição
    requestAnimationFrame(() => {
        tbody.querySelectorAll('tr').forEach(tr => {
            const id = tr.dataset.id;
            const antiga = posicoesAntigas[id];
            const nova = tr.getBoundingClientRect().top;
            if (antiga !== undefined && antiga !== nova) {
                const delta = antiga - nova;
                tr.style.transition = 'none';
                tr.style.transform = `translateY(${delta}px)`;
                requestAnimationFrame(() => {
                    tr.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    tr.style.transform = 'translateY(0)';
                });
            }
        });
    });
}

window.onload = carregarDadosDaPlanilha;

