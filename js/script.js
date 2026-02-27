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

let dadosTimes = JSON.parse(localStorage.getItem('tabelaDados')) || listaOriginal;

function salvarAlteracao(id, campo, elemento) {
    const valorNumerico = parseInt(elemento.innerText.replace(/\D/g, '')) || 0;
    const time = dadosTimes.find(t => t.id === id);
    if (time) {
        time[campo] = valorNumerico;
        localStorage.setItem('tabelaDados', JSON.stringify(dadosTimes));
        renderizarTabela();
    }
}

function limparTudo() {
    if (confirm("Deseja realmente zerar todos os dados?")) {
        localStorage.removeItem('tabelaDados');
        location.reload();
    }
}

function renderizarTabela() {
    const tbody = document.querySelector('tbody');
    
    // 1. Capturar posições ATUAIS (antes de reordenar)
    const posicoesAntigas = {};
    const linhasExistentes = Array.from(tbody.querySelectorAll('tr'));
    linhasExistentes.forEach(tr => {
        const id = tr.dataset.id;
        posicoesAntigas[id] = tr.getBoundingClientRect().top;
    });

    // 2. Calcular dados e ordenar
    const timesProcessados = dadosTimes.map(t => ({
        ...t,
        pontos: (t.v * 3) + (t.e * 1),
        jogos: t.v + t.e + t.d,
        sg: t.gp - t.gc,
        aproveitamento: (t.v + t.e + t.d) > 0 ? (((t.v * 3 + t.e) / ((t.v + t.e + t.d) * 3)) * 100).toFixed(1) : "0.0"
    })).sort((a, b) => {
        if (b.pontos !== a.pontos) return b.pontos - a.pontos;
        if (b.v !== a.v) return b.v - a.v;
        if (b.sg !== a.sg) return b.sg - a.sg;
        return a.nome.localeCompare(b.nome);
    });

    // 3. Reorganizar o DOM sem apagar tudo (usando DocumentFragment para performance)
    timesProcessados.forEach((time, index) => {
        let tr = tbody.querySelector(`tr[data-id="${time.id}"]`);
        
        if (!tr) {
            tr = document.createElement('tr');
            tr.dataset.id = time.id;
            tbody.appendChild(tr);
        }

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
            <td contenteditable="true" onblur="salvarAlteracao('${time.id}', 'v', this)">${time.v}</td>
            <td contenteditable="true" onblur="salvarAlteracao('${time.id}', 'e', this)">${time.e}</td>
            <td contenteditable="true" onblur="salvarAlteracao('${time.id}', 'd', this)">${time.d}</td>
            <td contenteditable="true" onblur="salvarAlteracao('${time.id}', 'gp', this)">${time.gp}</td>
            <td contenteditable="true" onblur="salvarAlteracao('${time.id}', 'gc', this)">${time.gc}</td>
            <td>${time.sg}</td>
            <td>${time.aproveitamento}%</td>
        `;

        // Cores das zonas
        tr.style.borderLeft = "none";
        if (index < 4) tr.style.borderLeft = "4px solid #00ff88"; 
        else if (index >= 4 && index <= 5) tr.style.borderLeft = "4px solid #e5ff00"; 
        else if (index >= 6 && index <= 11) tr.style.borderLeft = "4px solid #006FFF"; 
        else if (index >= 16) tr.style.borderLeft = "4px solid #ff4d4d";

        tbody.appendChild(tr); // Re-anexa na ordem correta
    });

    // 4. Executar animação FLIP
    requestAnimationFrame(() => {
        const novasLinhas = Array.from(tbody.querySelectorAll('tr'));
        novasLinhas.forEach(tr => {
            const id = tr.dataset.id;
            const antiga = posicoesAntigas[id];
            const nova = tr.getBoundingClientRect().top;

            if (antiga && antiga !== nova) {
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


window.onload = renderizarTabela;
