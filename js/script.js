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

let dadosTimes = [...listaOriginal];

// Função auxiliar para normalizar nomes (remove acentos e espaços extras)
function normalizarTexto(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim();
}

function limparTudo() {
    if (confirm("Deseja recarregar os dados da planilha?")) {
        carregarDadosDaPlanilha();
    }
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
                // Remove aspas e normaliza o nome vindo do CSV
                const nomeCSV = normalizarTexto(col[1].replace(/"/g, ''));

                mapaPlanilha[nomeCSV] = {
                    v: parseInt(col[2]) || 0,
                    e: parseInt(col[3]) || 0,
                    d: parseInt(col[4]) || 0,
                    gp: parseInt(col[5]) || 0,
                    gc: parseInt(col[6]) || 0
                };
            }
        });

        // Atualiza dadosTimes comparando os nomes normalizados
        dadosTimes = listaOriginal.map(time => {
            const nomeChave = normalizarTexto(time.nome);
            const novosValores = mapaPlanilha[nomeChave];
            
            if (novosValores) {
                return { ...time, ...novosValores };
            }
            return time;
        });

        console.log("Dados processados:", dadosTimes);
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
            ? (((t.v * 3 + t.e) / ((t.v + t.e + t.d) * 3)) * 100).toFixed(1) 
            : "0.0"
    })).sort((a, b) => {
        if (b.pontos !== a.pontos) return b.pontos - a.pontos;
        if (b.v !== a.v) return b.v - a.v;
        if (b.sg !== a.sg) return b.sg - a.sg;
        if (b.gp !== a.gp) return b.gp - a.gp;
        return a.nome.localeCompare(b.nome);
    });

    tbody.innerHTML = '';

    timesProcessados.forEach((time, index) => {
        const tr = document.createElement('tr');
        tr.dataset.id = time.id;

        tr.innerHTML = `
            <td>
                <div class="team-info">
                    <span style="min-width: 30px; opacity: 0.5;">${index + 1}º</span>
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
