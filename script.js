// Firebase imports (módulo)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuração do Firebase (sua real)
const firebaseConfig = {
  apiKey: "AIzaSyCyoed7aB-MpxQwznvRay4Zw1c69QBtIlc",
  authDomain: "adb28presenca.firebaseapp.com",
  projectId: "adb28presenca",
  storageBucket: "adb28presenca.firebasestorage.app",
  messagingSenderId: "376605186919",
  appId: "1:376605186919:web:0ca2c57dc2a06338d36dc2",
  measurementId: "G-KMN2PWBRL4"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Mostrar páginas ---
export function mostrarPagina(pagina) {
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

// --- Registrar Presença ---
const formPresenca = document.getElementById('formPresenca');
formPresenca.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const acompanhante = document.getElementById('acompanhante').value.trim();
  const vinculo = document.getElementById('vinculo').value;
  const vinculoExtra = document.getElementById('vinculoExtra').value.trim();
  const tipo = document.getElementById('tipo').value;

  const agora = new Date();
  const data = agora.toLocaleDateString();
  const hora = agora.toLocaleTimeString();

  try {
    // Salvar no Firestore
    await addDoc(collection(db, "presencas"), {
      nome,
      acompanhante,
      vinculo,
      vinculoExtra,
      tipo,
      data,
      hora
    });

    alert("✅ Presença registrada!");
    formPresenca.reset();
    listarPresencas();
  } catch (error) {
    console.error("Erro ao registrar presença: ", error);
    alert("❌ Ocorreu um erro ao registrar a presença.");
  }
});

// --- Listar Presenças ---
async function listarPresencas(filtro = {}) {
  const tabela = document.getElementById('tabelaPresencas');
  tabela.innerHTML = '';

  try {
    const querySnapshot = await getDocs(collection(db, "presencas"));
    let presencas = [];
    querySnapshot.forEach(doc => presencas.push(doc.data()));

    // Aplicar filtros
    if (filtro.data) {
      presencas = presencas.filter(p => {
        const partes = p.data.split('/');
        return `${partes[2]}-${partes[1].padStart(2,'0')}-${partes[0].padStart(2,'0')}` === filtro.data;
      });
    }
    if (filtro.mes) {
      presencas = presencas.filter(p => {
        const partes = p.data.split('/');
        return `${partes[2]}-${partes[1].padStart(2,'0')}` === filtro.mes;
      });
    }
    if (filtro.ano) {
      presencas = presencas.filter(p => {
        const partes = p.data.split('/');
        return partes[2] === filtro.ano;
      });
    }

    // Preencher tabela
    presencas.forEach(p => {
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
      tabela.appendChild(tr);
    });

    document.getElementById('contador').textContent = `Total: ${presencas.length}`;
  } catch (error) {
    console.error("Erro ao listar presenças: ", error);
  }
}

// --- Filtros ---
window.aplicarFiltros = function() {
  const data = document.getElementById('filtroData').value;
  const mes = document.getElementById('filtroMes').value;
  const ano = document.getElementById('filtroAno').value;
  listarPresencas({ data, mes, ano });
};

window.limparFiltros = function() {
  document.getElementById('filtroData').value = '';
  document.getElementById('filtroMes').value = '';
  document.getElementById('filtroAno').value = '';
  listarPresencas();
};

// --- Alterar Fonte ---
document.getElementById('fontSelect').addEventListener('change', (e) => {
  document.body.style.fontFamily = e.target.value;
});

// --- Inicializar ---
listarPresencas();
atualizarRelogio();
