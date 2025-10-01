// --- Mostrar páginas ---
function mostrarPagina(pagina) {
  document.querySelectorAll('.pagina').forEach(sec => sec.classList.remove('ativa'));
  document.getElementById(pagina).classList.add('ativa');
}

// --- Relógio ---
function atualizarRelogio() {
  const relogio = document.getElementById('relogio');
  const agora = new Date();
  relogio.textContent = agora.toLocaleTimeString();
}
setInterval(atualizarRelogio, 1000);

// --- Registro de Presença ---
let presencas = [];

const formPresenca = document.getElementById('formPresenca');
formPresenca.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const acompanhante = document.getElementById('acompanhante').value.trim();
  const vinculo = document.getElementById('vinculo').value;
  const vinculoExtra = document.getElementById('vinculoExtra').value.trim();
  const tipo = document.getElementById('tipo').value;

  const agora = new Date();
  const data = agora.toLocaleDateString(); // "DD/MM/YYYY"
  const hora = agora.toLocaleTimeString();

  const registro = { nome, acompanhante, vinculo, vinculoExtra, tipo, data, hora };
  presencas.push(registro);

  atualizarTabela();
  formPresenca.reset();
});

// --- Atualizar tabela ---
function atualizarTabela(filtro = {}) {
  const tbody = document.getElementById('tabelaPresencas');
  tbody.innerHTML = '';

  let listaFiltrada = presencas;

  // --- Filtrar por data ---
  if (filtro.data) {
    listaFiltrada = listaFiltrada.filter(p => {
      const partes = p.data.split('/');
      const dataFormatada = `${partes[2]}-${partes[1].padStart(2,'0')}-${partes[0].padStart(2,'0')}`;
      return dataFormatada === filtro.data;
    });
  }

  // --- Filtrar por mês ---
  if (filtro.mes) {
    listaFiltrada = listaFiltrada.filter(p => {
      const partes = p.data.split('/');
      const mesFormatado = `${partes[2]}-${partes[1].padStart(2,'0')}`;
      return mesFormatado === filtro.mes;
    });
  }

  // --- Filtrar por ano ---
  if (filtro.ano) {
    listaFiltrada = listaFiltrada.filter(p => {
      const partes = p.data.split('/');
      return partes[2] === filtro.ano;
    });
  }

  listaFiltrada.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.nome}</td>
      <td>${p.acompanhante}</td>
      <td>${p.vinculo}</td>
      <td>${p.vinculoExtra}</td>
      <td>${p.tipo}</td>
      <td>${p.data}</td>
      <td>${p.hora}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('contador').textContent = `Total: ${listaFiltrada.length}`;
}

// --- Aplicar filtros ---
function aplicarFiltros() {
  const data = document.getElementById('filtroData').value;
  const mes = document.getElementById('filtroMes').value;
  const ano = document.getElementById('filtroAno').value;

  atualizarTabela({ data, mes, ano });
}

// --- Limpar filtros ---
function limparFiltros() {
  document.getElementById('filtroData').value = '';
  document.getElementById('filtroMes').value = '';
  document.getElementById('filtroAno').value = '';
  atualizarTabela();
}

// --- Alterar fonte ---
document.getElementById('fontSelect').addEventListener('change', (e) => {
  document.body.style.fontFamily = e.target.value;
});
