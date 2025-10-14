// =================== Firebase SDK ===================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, doc, setDoc, updateDoc, getDoc, query, where, orderBy, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  onAuthStateChanged, signOut, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// =================== Configuração Firebase ===================
const firebaseConfig = {
  apiKey: "AIzaSyCyoed7aB-MpxQwznvRay4Zw1c69QBtIlc",
  authDomain: "adb28presenca.firebaseapp.com",
  projectId: "adb28presenca",
  storageBucket: "adb28presenca.appspot.com",
  messagingSenderId: "376605186919",
  appId: "1:376605186919:web:0ca2c57dc2a06338d36dc2",
  measurementId: "G-KMN2PWBRL4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// =================== Variáveis globais ===================
let idDocumentoEmEdicao = null;
let idAnotacaoEditando = null;
let userProfile = { role: 'pending' };
let mode = 'login';
let presencasCache = [];

// Util
function $(id){ return document.getElementById(id); }
const nowISO = () => new Date().toISOString().split('T')[0];
const isoToPtBR = iso => { if(!iso) return ''; const [y,m,d]=iso.split('-'); return `${d}/${m}/${y}`; };

// =================== 🆕 SISTEMA DE NOTIFICAÇÕES ===================
function mostrarNotificacao(mensagem, tipo = 'info') {
  const container = $('notification-container') || document.body;
  const notif = document.createElement('div');
  notif.className = `notification notification-${tipo}`;
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  notif.innerHTML = `
    <span class="notif-icon">${icons[tipo] || icons.info}</span>
    <span class="notif-message">${mensagem}</span>
  `;
  
  container.appendChild(notif);
  
  setTimeout(() => notif.classList.add('show'), 10);
  
  setTimeout(() => {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 300);
  }, 3500);
}

// =================== Funções utilitárias ===================
function obterPeriodoPelaHora(horaString) {
  if (!horaString) return '';
  const match = horaString.match(/(\d{1,2})/);
  if(!match) return '';
  let h = parseInt(match[1], 10);
  const lower = horaString.toLowerCase();
  if (lower.includes('pm') && h !== 12) h += 12;
  if (lower.includes('am') && h === 12) h = 0;
  if(h >= 0 && h < 6) return 'Madrugada';
  if(h >= 6 && h < 12) return 'Manhã';
  if(h >= 12 && h < 18) return 'Tarde';
  if(h >= 18 && h <= 23) return 'Noite';
  return '';
}

function obterPeriodo() {
  const h = new Date().getHours();
  if(h >= 0 && h < 6) return 'Madrugada';
  if(h >= 6 && h < 12) return 'Manhã';
  if(h >= 12 && h < 18) return 'Tarde';
  if(h >= 18 && h <= 23) return 'Noite';
  return 'Indefinido';
}

// =================== Profile helper ===================
async function getUserProfile(uid) {
  try {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error("Erro ao buscar perfil:", e);
    return null;
  }
}

// =================== Carregar Preferências ===================
async function carregarPreferencias(uid) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const prefs = userDoc.data().preferencias;
      if (prefs?.paleta) {
        aplicarPaleta(prefs.paleta);
      }
      if (prefs?.tema === 'escuro') {
        document.body.classList.add('dark-mode');
        const themeToggle = $('toggle-theme');
        themeToggle && (themeToggle.textContent = '☀️');
      }
    }
  } catch (err) {
    console.error('Erro ao carregar preferências:', err);
  }
}

// =================== Aplicar Paleta ===================
async function aplicarPaleta(paletaId) {
  document.body.setAttribute('data-paleta', paletaId);
  
  document.querySelectorAll('.palette-item').forEach(item => {
    item.classList.toggle('ativa', item.dataset.paleta === paletaId);
  });
  
  if (auth.currentUser) {
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        'preferencias.paleta': paletaId
      });
    } catch (err) {
      console.error('Erro ao salvar paleta:', err);
    }
  }
  
  const painelPaletas = $('painel-paletas');
  painelPaletas?.classList.add('hidden');
}

// =================== 🆕 FUNÇÕES DE EXPORTAÇÃO ===================

// Exportar para Excel
function exportarExcel(dados) {
  try {
    const ws_data = [
      ['Nome', 'Acompanhante', 'Telefone', 'Endereço', 'Vínculo', 'Detalhe Vínculo', 'Tipo', 'Detalhe Tipo', 'Data', 'Hora', 'Período']
    ];
    
    dados.forEach(p => {
      ws_data.push([
        p.nome || '',
        p.acompanhante || '',
        p.telefone || '',
        p.endereco || '',
        p.vinculo || '',
        p.vinculoExtra || '',
        p.tipo || '',
        p.tipoExtra || '',
        p.data || '',
        p.hora || '',
        p.periodo || obterPeriodoPelaHora(p.hora)
      ]);
    });
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    
    ws['!cols'] = [
      {wch: 20}, {wch: 15}, {wch: 15}, {wch: 25}, 
      {wch: 15}, {wch: 15}, {wch: 15}, {wch: 15},
      {wch: 12}, {wch: 10}, {wch: 12}
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, "Presenças");
    
    const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    XLSX.writeFile(wb, `Presencas_ADB_${dataAtual}.xlsx`);
    
    mostrarNotificacao('✅ Arquivo Excel exportado com sucesso!', 'success');
  } catch (err) {
    console.error('Erro ao exportar Excel:', err);
    mostrarNotificacao('❌ Erro ao exportar para Excel', 'error');
  }
}

// Exportar para PDF
function exportarPDF(dados) {
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');
    
    doc.setFontSize(18);
    doc.text('Lista de Presenças - ADB Vila Élida', 14, 15);
    
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 22);
    doc.text(`Total de registros: ${dados.length}`, 14, 28);
    
    const tableData = dados.map(p => [
      p.nome || '',
      p.telefone || '',
      p.endereco || '',
      p.vinculo || '',
      p.tipo || '',
      p.data || '',
      p.hora || '',
      p.periodo || obterPeriodoPelaHora(p.hora)
    ]);
    
    doc.autoTable({
      startY: 35,
      head: [['Nome', 'Telefone', 'Endereço', 'Vínculo', 'Tipo', 'Data', 'Hora', 'Período']],
      body: tableData,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [11, 79, 153], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 246, 255] },
      margin: { left: 14, right: 14 }
    });
    
    const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    doc.save(`Presencas_ADB_${dataAtual}.pdf`);
    
    mostrarNotificacao('✅ Arquivo PDF exportado com sucesso!', 'success');
  } catch (err) {
    console.error('Erro ao exportar PDF:', err);
    mostrarNotificacao('❌ Erro ao exportar para PDF', 'error');
  }
}

// =================== 🆕 SISTEMA DE GRÁFICOS ===================
let graficos = {};

function criarGraficos() {
  const ctxPeriodo = $('graficoPeriodo')?.getContext('2d');
  if (ctxPeriodo) {
    graficos.periodo = new Chart(ctxPeriodo, {
      type: 'doughnut',
      data: {
        labels: ['Madrugada', 'Manhã', 'Tarde', 'Noite'],
        datasets: [{
          data: [0, 0, 0, 0],
          backgroundColor: ['#667eea', '#f6ad55', '#fc8181', '#4299e1']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
  
  const ctxTemporal = $('graficoTemporal')?.getContext('2d');
  if (ctxTemporal) {
    graficos.temporal = new Chart(ctxTemporal, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Presenças',
          data: [],
          borderColor: '#0b4f99',
          backgroundColor: 'rgba(11, 79, 153, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
  
  const ctxVinculo = $('graficoVinculo')?.getContext('2d');
  if (ctxVinculo) {
    graficos.vinculo = new Chart(ctxVinculo, {
      type: 'bar',
      data: {
        labels: ['Congregação', 'Outra Religião', 'Sem Igreja'],
        datasets: [{
          label: 'Quantidade',
          data: [0, 0, 0],
          backgroundColor: ['#48bb78', '#ed8936', '#f56565']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
  
  const ctxTipo = $('graficoTipo')?.getContext('2d');
  if (ctxTipo) {
    graficos.tipo = new Chart(ctxTipo, {
      type: 'pie',
      data: {
        labels: ['Convidado', 'Visitante', 'Membro'],
        datasets: [{
          data: [0, 0, 0],
          backgroundColor: ['#9f7aea', '#ed64a6', '#38b2ac']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
}

async function atualizarGraficos() {
  try {
    const dias = parseInt($('periodoRelatorio')?.value || 30);
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);
    
    const snap = await getDocs(collection(db, 'presencas'));
    const dados = snap.docs.map(d => ({ ...d.data(), id: d.id }));
    
    const dadosFiltrados = dados.filter(p => {
      if (!p.data) return false;
      const [d, m, y] = p.data.split('/');
      const dataPresenca = new Date(`${y}-${m}-${d}`);
      return dataPresenca >= dataInicio;
    });
    
    atualizarEstatisticas(dados);
    
    const periodos = { 'Madrugada': 0, 'Manhã': 0, 'Tarde': 0, 'Noite': 0 };
    dadosFiltrados.forEach(p => {
      const periodo = p.periodo || obterPeriodoPelaHora(p.hora);
      if (periodos[periodo] !== undefined) periodos[periodo]++;
    });
    
    if (graficos.periodo) {
      graficos.periodo.data.datasets[0].data = Object.values(periodos);
      graficos.periodo.update();
    }
    
    const porData = {};
    dadosFiltrados.forEach(p => {
      const data = p.data || '';
      porData[data] = (porData[data] || 0) + 1;
    });
    
    const datasOrdenadas = Object.keys(porData).sort((a, b) => {
      const [d1, m1, y1] = a.split('/');
      const [d2, m2, y2] = b.split('/');
      return new Date(`${y1}-${m1}-${d1}`) - new Date(`${y2}-${m2}-${d2}`);
    });
    
    if (graficos.temporal) {
      graficos.temporal.data.labels = datasOrdenadas;
      graficos.temporal.data.datasets[0].data = datasOrdenadas.map(d => porData[d]);
      graficos.temporal.update();
    }
    
    const vinculos = { 'Congregacao': 0, 'Outra Religiao': 0, 'Sem Igreja': 0 };
    dadosFiltrados.forEach(p => {
      if (vinculos[p.vinculo] !== undefined) vinculos[p.vinculo]++;
    });
    
    if (graficos.vinculo) {
      graficos.vinculo.data.datasets[0].data = Object.values(vinculos);
      graficos.vinculo.update();
    }
    
    const tipos = { 'Convidado': 0, 'Visitante': 0, 'Membro': 0 };
    dadosFiltrados.forEach(p => {
      if (tipos[p.tipo] !== undefined) tipos[p.tipo]++;
    });
    
    if (graficos.tipo) {
      graficos.tipo.data.datasets[0].data = Object.values(tipos);
      graficos.tipo.update();
    }
    
  } catch (err) {
    console.error('Erro ao atualizar gráficos:', err);
    mostrarNotificacao('❌ Erro ao atualizar gráficos', 'error');
  }
}

function atualizarEstatisticas(dados) {
  const hoje = nowISO();
  const mesAtual = hoje.substring(0, 7);
  
  const total = dados.length;
  const hojeCont = dados.filter(p => {
    if (!p.data) return false;
    const [d, m, y] = p.data.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}` === hoje;
  }).length;
  
  const mesCont = dados.filter(p => {
    if (!p.data) return false;
    const [d, m, y] = p.data.split('/');
    return `${y}-${m.padStart(2, '0')}`.startsWith(mesAtual);
  }).length;
  
  const diasComPresenca = new Set(dados.map(p => p.data).filter(Boolean)).size;
  const media = diasComPresenca > 0 ? Math.round(total / diasComPresenca) : 0;
  
  if ($('stat-total')) $('stat-total').textContent = total;
  if ($('stat-hoje')) $('stat-hoje').textContent = hojeCont;
  if ($('stat-mes')) $('stat-mes').textContent = mesCont;
  if ($('stat-media')) $('stat-media').textContent = media;
}

// =================== DOM ready ===================
window.addEventListener('DOMContentLoaded', () => {
  const authArea = $('auth-area');
  const presencaArea = $('presenca-area');
  const authForm = $('auth-form');
  const formPresenca = $('formPresenca');
  const tabelaBody = $('tabelaPresencas');
  const contadorEl = $('contador');
  const submitBtn = $('submit-btn');
  const switchLink = $('switch-link');
  const authFeedback = $('auth-feedback');
  const headline = $('headline');
  const senhaInput = $('password');

  const btnFiltrar = $('btnFiltrar');
  const btnLimparFiltros = $('btnLimparFiltros');
  const salvarAnotacaoBtn = $('salvarAnotacao');
  const campoAnotacoes = $('campoAnotacoes');
  const listaAnotacoes = $('listaAnotacoes');
  const feedbackAnotacao = $('feedbackAnotacao');
  const verAntigasBtn = $('verAntigasBtn');
  const seletorData = $('dataAnotacoes');
  const fontButton = document.querySelector('.font-button');
  const fontList = $('lista-fontes');
  const themeToggle = $('toggle-theme');
  const logoutBtn = $('logout-btn');
  const btnAdminAccess = $('btn-admin-access');
  const presencaMain = document.querySelector('.presenca-main');
  const salvarBtn = $('salvarBtn');

  const btnRegistra = $('btn-registra');
  const btnLista = $('btn-lista');
  const btnAnotacoes = $('btn-anotacoes');
  const btnRelatorios = $('btn-relatorios');

  const btnExportExcel = $('btnExportExcel');
  const btnExportPDF = $('btnExportPDF');

  /* === BLOCO: CONTROLE DE TAMANHO DA FONTE === */
  (function () {
    const fontSizeSelect = $('fontSizeSelect');
    const campoAnotacoes = $('campoAnotacoes');
    const listaAnotacoes = $('listaAnotacoes');

    if (!fontSizeSelect) return;

    function aplicarTamanhoFonte(valor) {
      if (!valor || typeof valor !== 'string') return;
      const tamanho = valor.includes('px') ? valor : (valor + 'px');
      document.documentElement.style.setProperty('--tamanho-fonte', tamanho);

      if (campoAnotacoes) campoAnotacoes.style.fontSize = tamanho;
      if (listaAnotacoes) {
        listaAnotacoes.querySelectorAll('.texto-anotacao, .anotacao-item p').forEach(el => {
          el.style.fontSize = tamanho;
        });
      }
    }

    fontSizeSelect.addEventListener('change', (ev) => {
      aplicarTamanhoFonte(ev.target.value);
    });

    aplicarTamanhoFonte(fontSizeSelect.value);
  })();

  if (!authForm) {
    console.error("auth-form não encontrado no DOM.");
    return;
  }

  // === UI: mode (login/cadastro) ===
  function setMode(newMode){
    mode = newMode;
    if (authFeedback) authFeedback.textContent = '';
    if (headline) headline.textContent = (mode === 'login') ? 'Conecte-se' : 'Cadastro';
    if (submitBtn) submitBtn.textContent = (mode === 'login') ? 'Entrar' : 'Criar Conta';
    if (switchLink) switchLink.textContent = (mode === 'login') ? 'Cadastre-se' : 'Entrar';
  }
  
  // ✅ INICIALIZAR O MODE AQUI DENTRO DO ESCOPO
  setMode('login');

  switchLink && switchLink.addEventListener('click', (e) => {
    e.preventDefault();
    setMode(mode === 'login' ? 'cadastro' : 'login');
  });

  // === Olhinho de senha ===
  if (senhaInput) {
    const senhaWrapper = document.createElement('div');
    senhaWrapper.style.cssText = 'position: relative; width: 100%;';
    
    senhaInput.parentNode.insertBefore(senhaWrapper, senhaInput);
    senhaWrapper.appendChild(senhaInput);
    
    const toggleSenha = document.createElement('span');
    toggleSenha.textContent = '👁️';
    toggleSenha.style.cssText = `
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      font-size: 20px;
      user-select: none;
      z-index: 10;
    `;
    
    senhaWrapper.appendChild(toggleSenha);
    senhaInput.style.paddingRight = '45px';
    
    toggleSenha.addEventListener('click', () => {
      if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        toggleSenha.textContent = '🙈';
      } else {
        senhaInput.type = 'password';
        toggleSenha.textContent = '👁️';
      }
    });
  }

  // === Reset link ===
  const resetLink = document.createElement('a');
  resetLink.href = "#";
  resetLink.textContent = "Esqueci a senha";
  resetLink.style.display = "block";
  resetLink.style.marginTop = "6px";
  resetLink.style.textAlign = "center";
  resetLink.style.fontSize = "14px";
  resetLink.style.color = "#0b4f99";
  resetLink.style.cursor = "pointer";
  authForm.after(resetLink);
  resetLink.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = prompt("Digite seu e-mail para redefinir a senha:");
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        mostrarNotificacao('✅ Link de redefinição enviado para seu e-mail!', 'success');
      } catch(err) {
        console.error(err);
        mostrarNotificacao('❌ Erro ao enviar link de redefinição', 'error');
      }
    }
  });

  // =================== Login / Cadastro handler ===================
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!authFeedback) return;
    authFeedback.textContent = '';
    const email = ($('email')?.value || '').trim();
    const password = (senhaInput?.value || '').trim();

    if (!email || !password) {
      authFeedback.textContent = 'Preencha todos os campos.';
      return;
    }

    try {
      if (mode === 'login') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const profile = await getUserProfile(user.uid);
        if (profile && profile.role && profile.role !== 'pending') {
          userProfile = profile;
          mostrarAreaPrincipal(profile);
          mostrarNotificacao('✅ Login realizado com sucesso!', 'success');
        } else if (profile && profile.role === 'pending') {
          await signOut(auth);
          authFeedback.textContent = '⚠️ Seu cadastro está em análise.';
        } else {
          await signOut(auth);
          authFeedback.textContent = '⚠️ Perfil não encontrado. Contate admin.';
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
          email: email,
          role: 'pending',
          dataCadastro: new Date().toISOString()
        });
        await signOut(auth);
        authFeedback.textContent = '✅ Conta criada! Aguardar aprovação.';
        mostrarNotificacao('✅ Conta criada! Aguarde aprovação do administrador.', 'success');
        setMode('login');
      }
      authForm.reset();
    } catch (err) {
      console.error(err);
      let msg = 'Erro de autenticação.';
      if (err.code === 'auth/email-already-in-use') {
        msg = '❌ E-mail já cadastrado! Tente fazer login.';
        setMode('login');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = '❌ E-mail ou senha incorretos.';
      } else {
        msg = '❌ ' + (err.message || 'Erro inesperado.');
      }
      authFeedback.textContent = msg;
      mostrarNotificacao(msg, 'error');
    }
  });

  // =================== Auth state listener ===================
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.exists() ? userDocSnap.data() : null;

      const isAuthorized = !!userData && (
        userData.autorizado === true ||
        (userData.role && userData.role !== 'pending')
      );

      if (!isAuthorized) {
        mostrarNotificacao('⚠️ Seu cadastro ainda não foi liberado pelo administrador.', 'warning');
        await signOut(auth);
        return;
      }

      const profile = await getUserProfile(user.uid);
      if (profile && profile.role && profile.role !== 'pending') {
        userProfile = profile;
        mostrarAreaPrincipal(profile);
      } else if (profile && profile.role === 'pending') {
        mostrarNotificacao('⚠️ Cadastro pendente. Você será desconectado.', 'warning');
        await signOut(auth);
      } else {
        console.error("Perfil não encontrado, desconectando.");
        await signOut(auth);
        mostrarTelaDeLogin();
      }
    } else {
      mostrarTelaDeLogin();
    }
  });

  // =================== UI area toggles ===================
  function mostrarAreaPrincipal(profile) {
    console.log('📖 Mostrando área principal...');
    
    if (authArea) {
      authArea.style.display = 'none';
      authArea.classList.add('hidden');
    }
    
    const presencaArea = $('presenca-area');
    if (presencaArea) {
      presencaArea.style.display = 'block';
      presencaArea.classList.remove('hidden');
    }

    const toolbar = document.querySelector('.toolbar');
    if (toolbar) {
      toolbar.style.display = 'flex';
      toolbar.classList.remove('hidden');
    }
    
    const userInfoCenter = $('user-info-center');
    const userEmailCenter = $('user-email-center');
    const horaAtualCenter = $('hora-atual-center');

    if (userInfoCenter) {
      userInfoCenter.classList.remove('hidden');
      userInfoCenter.style.display = 'flex';
    }
    
    if (userEmailCenter && auth.currentUser) {
      userEmailCenter.textContent = auth.currentUser.email;
    }

    function atualizarHoraCentral() {
      if (horaAtualCenter) {
        horaAtualCenter.textContent = new Date().toLocaleTimeString('pt-BR');
      }
    }
    setInterval(atualizarHoraCentral, 1000);
    atualizarHoraCentral();

    const btnAdmin = $('btn-admin-access');
    if (btnAdmin) {
      if (profile && profile.role === 'admin') {
        btnAdmin.classList.remove('hidden');
        btnAdmin.style.display = 'inline-block';
      } else {
        btnAdmin.classList.add('hidden');
        btnAdmin.style.display = 'none';
      }
    }
    
    const footerTitleEl = document.querySelector('footer p');
    if (headline) {
      headline.textContent = footerTitleEl ? footerTitleEl.textContent.trim() : 'ADB Vila Élida';
    }

    mostrarPagina('registro');
    listarPresencas();
    listarAnotacoes();
    
    setTimeout(() => {
      criarGraficos();
      atualizarGraficos();
    }, 500);
    
    if (auth.currentUser) {
      carregarPreferencias(auth.currentUser.uid);
    }
  }

  function mostrarTelaDeLogin() {
    console.log('🔒 Mostrando tela de login...');
    
    if (authArea) {
      authArea.style.display = 'block';
      authArea.classList.remove('hidden');
    }
    
    const presencaArea = $('presenca-area');
    if (presencaArea) {
      presencaArea.style.display = 'none';
      presencaArea.classList.add('hidden');
    }
    
    const userInfoCenter = $('user-info-center');
    if (userInfoCenter) {
      userInfoCenter.classList.add('hidden');
      userInfoCenter.style.display = 'none';
    }
    
    const btnAdmin = $('btn-admin-access');
    if (btnAdmin) {
      btnAdmin.classList.add('hidden');
      btnAdmin.style.display = 'none';
    }
    
    const toolbar = document.querySelector('.toolbar');
    if (toolbar) {
      toolbar.style.display = 'none';
      toolbar.classList.add('hidden');
    }
    
    if (headline) headline.textContent = 'Conecte-se';
    if (submitBtn) submitBtn.textContent = 'Entrar';
  }

  // =================== função mostrarPagina ===================
  window.mostrarPagina = function(id) {
    const paginas = document.querySelectorAll('.pagina');
    paginas.forEach(p => p.classList.remove('ativa'));
    const alvo = document.getElementById(id);
    if (alvo) {
      alvo.classList.add('ativa');
    } else {
      console.warn('mostrarPagina: elemento não encontrado', id);
    }
  };

  // 🆕 EVENTOS DOS BOTÕES
  if (btnRegistra) {
    btnRegistra.addEventListener('click', () => mostrarPagina('registro'));
  }

  if (btnLista) {
    btnLista.addEventListener('click', () => {
      mostrarPagina('lista');
      listarPresencas();
    });
  }

  if (btnAnotacoes) {
    btnAnotacoes.addEventListener('click', () => {
      mostrarPagina('anotacoes');
      listarAnotacoes();
    });
  }

  if (btnRelatorios) {
    btnRelatorios.addEventListener('click', () => {
      mostrarPagina('relatorios');
      atualizarGraficos();
    });
  }

  const btnAtualizarGraficos = $('btnAtualizarGraficos');
  if (btnAtualizarGraficos) {
    btnAtualizarGraficos.addEventListener('click', () => {
      atualizarGraficos();
      mostrarNotificacao('✅ Gráficos atualizados!', 'success');
    });
  }

  if (btnExportExcel) {
    btnExportExcel.addEventListener('click', () => {
      if (presencasCache.length === 0) {
        mostrarNotificacao('⚠️ Nenhum dado para exportar', 'warning');
        return;
      }
      exportarExcel(presencasCache);
    });
  }

  if (btnExportPDF) {
    btnExportPDF.addEventListener('click', () => {
      if (presencasCache.length === 0) {
        mostrarNotificacao('⚠️ Nenhum dado para exportar', 'warning');
        return;
      }
      exportarPDF(presencasCache);
    });
  }

  // =================== Registrar / Atualizar Presença ===================
  if (formPresenca) {
    formPresenca.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      try {
        const fd = new FormData(formPresenca);
        const presencaData = {
          nome: (fd.get('nome') || '').trim(),
          acompanhante: (fd.get('acompanhante') || '').trim(),
          telefone: (fd.get('telefone') || '').trim(),
          endereco: (fd.get('endereco') || '').trim(),
          vinculo: fd.get('vinculo') || '',
          vinculoExtra: (fd.get('vinculoExtra') || '').trim(),
          tipo: fd.get('tipo') || '',
          tipoExtra: (fd.get('tipoExtra') || '').trim(),
        };

        if (idDocumentoEmEdicao) {
          const docRef = doc(db, 'presencas', idDocumentoEmEdicao);
          await updateDoc(docRef, presencaData);
          await sincronizarDadosPessoais(presencaData, idDocumentoEmEdicao);
          mostrarNotificacao('✅ Presença atualizada!', 'success');
        } else {
          const agora = new Date();
          const dia = String(agora.getDate()).padStart(2, '0');
          const mes = String(agora.getMonth() + 1).padStart(2, '0');
          const ano = agora.getFullYear();
          
          presencaData.data = `${dia}/${mes}/${ano}`;
          presencaData.hora = agora.toLocaleTimeString('pt-BR');
          presencaData.periodo = obterPeriodo();
          await addDoc(collection(db, 'presencas'), presencaData);
          mostrarNotificacao('✅ Presença registrada com sucesso!', 'success');
        }

        formPresenca.reset();
        idDocumentoEmEdicao = null;
        salvarBtn && (salvarBtn.textContent = 'Registrar Presença');
        listarPresencas();
      } catch (err) {
        console.error("Erro ao salvar/atualizar presença:", err);
        mostrarNotificacao('❌ Erro ao salvar presença', 'error');
      }
    });
  }

  // =================== preencher para edição ===================
  async function preencherFormularioParaEdicao(documentId) {
    try {
      const docRef = doc(db, 'presencas', documentId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return mostrarNotificacao('❌ Documento não encontrado', 'error');
      const p = snap.data();
      idDocumentoEmEdicao = documentId;
      $('nome').value = p.nome || '';
      $('acompanhante').value = p.acompanhante || '';
      $('telefone').value = p.telefone || '';
      $('endereco').value = p.endereco || '';
      $('vinculo').value = p.vinculo || '';
      $('vinculoExtra').value = p.vinculoExtra || '';
      $('tipo').value = p.tipo || '';
      $('tipoExtra').value = p.tipoExtra || '';
      salvarBtn && (salvarBtn.textContent = 'Atualizar Presença');
      mostrarPagina('registro');
      mostrarNotificacao('ℹ️ Editando presença', 'info');
    } catch (err) {
      console.error("Erro preencher para edição:", err);
      mostrarNotificacao('❌ Erro ao carregar dados', 'error');
    }
  }

  // =================== sincronizar dados pessoais ===================
  async function sincronizarDadosPessoais(dadosNovos, idDocumentoAtual) {
    if (!dadosNovos || !dadosNovos.nome) return;
    try {
      const q = query(collection(db, 'presencas'), where('nome', '==', dadosNovos.nome));
      const snap = await getDocs(q);
      const updates = [];
      snap.docs.forEach(ds => {
        if (ds.id !== idDocumentoAtual) {
          const ref = doc(db, 'presencas', ds.id);
          const payload = {
            telefone: dadosNovos.telefone,
            endereco: dadosNovos.endereco,
            vinculo: dadosNovos.vinculo,
            vinculoExtra: dadosNovos.vinculoExtra
          };
          updates.push(updateDoc(ref, payload));
        }
      });
      if (updates.length) await Promise.all(updates);
    } catch (err) {
      console.error("Erro sincronizar dados:", err);
    }
  }

  // ==================== Listar presenças ====================
  window.listarPresencas = async function(filtro = {}) {
    tabelaBody && (tabelaBody.innerHTML = '');

    const hoje = new Date().toISOString().split("T")[0];
    const periodoAtual = (() => {
      const hora = new Date().getHours();
      if (hora < 6) return "Madrugada";
      if (hora < 12) return "Manhã";
      if (hora < 18) return "Tarde";
      return "Noite";
    })();

    const filtroVazio = !filtro.dataInicio && !filtro.dataFim && !filtro.periodo && !filtro.nome && !filtro.telefone && !filtro.vinculo;
    
    if (filtroVazio) {
      filtro.dataInicio = hoje;
      filtro.dataFim = hoje;
      filtro.periodo = periodoAtual;
    }

    try {
      const snap = await getDocs(collection(db, 'presencas'));
      let arr = snap.docs.map(d => ({ ...d.data(), id: d.id }));

      arr.sort((a, b) => {
        const [da, ma, ya] = (a.data || '').split('/');
        const [db, mb, yb] = (b.data || '').split('/');
        
        const horaA = a.hora || '00:00:00';
        const horaB = b.hora || '00:00:00';
        
        const dataA = new Date(`${ya}-${ma.padStart(2, '0')}-${da.padStart(2, '0')}T${horaA}`);
        const dataB = new Date(`${yb}-${mb.padStart(2, '0')}-${db.padStart(2, '0')}T${horaB}`);
        
        return dataB - dataA;
      });

      if (filtro.dataInicio) {
        arr = arr.filter(p => {
          if (!p.data) return false;
          const [d, m, y] = p.data.split('/');
          const dataPresenca = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
          return dataPresenca >= filtro.dataInicio;
        });
      }

      if (filtro.dataFim) {
        arr = arr.filter(p => {
          if (!p.data) return false;
          const [d, m, y] = p.data.split('/');
          const dataPresenca = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
          return dataPresenca <= filtro.dataFim;
        });
      }

      if (filtro.periodo && filtro.periodo !== '') {
        arr = arr.filter(p => {
          if (p.periodo) return p.periodo === filtro.periodo;
          return obterPeriodoPelaHora(p.hora) === filtro.periodo;
        });
      }

      if (filtro.nome && filtro.nome.trim() !== '') {
        const termosBusca = filtro.nome.trim().toLowerCase().split(' ');
        arr = arr.filter(p => {
          const nomeCompleto = (p.nome || '').toLowerCase();
          return termosBusca.every(termo => nomeCompleto.includes(termo));
        });
      }

      if (filtro.telefone && filtro.telefone.trim() !== '') {
        const telefoneBusca = filtro.telefone.trim().toLowerCase();
        arr = arr.filter(p => {
          const telefone = (p.telefone || '').toLowerCase();
          return telefone.includes(telefoneBusca);
        });
      }

      if (filtro.vinculo && filtro.vinculo !== '') {
        arr = arr.filter(p => p.vinculo === filtro.vinculo);
      }

      presencasCache = arr;

      arr.forEach(p => {
        const periodoExibido = p.periodo || obterPeriodoPelaHora(p.hora) || '';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${p.nome || ''}</td>
          <td>${p.acompanhante || ''}</td>
          <td>${p.telefone || ''}</td>
          <td>${p.endereco || ''}</td>
          <td>${p.vinculo || ''}</td>
          <td>${p.vinculoExtra || ''}</td>
          <td>${p.tipo || ''}</td>
          <td>${p.tipoExtra || ''}</td>
          <td>${p.data || ''}</td>
          <td>${p.hora || ''}</td>
          <td>${periodoExibido}</td>
          <td><button class="editar-btn" data-id="${p.id}">Alterar</button></td>
        `;
        tabelaBody && tabelaBody.appendChild(tr);
      });

      document.querySelectorAll('.editar-btn').forEach(btn => {
        btn.addEventListener('click', () => preencherFormularioParaEdicao(btn.dataset.id));
      });

      contadorEl && (contadorEl.textContent = `Total: ${arr.length}`);
    } catch (err) {
      console.error('Erro ao listar presenças:', err);
      contadorEl && (contadorEl.textContent = 'Erro ao carregar presenças.');
      mostrarNotificacao('❌ Erro ao carregar lista', 'error');
    }
  }

  // =================== filtros botões ====================
  btnFiltrar && btnFiltrar.addEventListener('click', () => {
    const dataInicio = $('filtroDataInicio')?.value || '';
    const dataFim = $('filtroDataFim')?.value || '';
    const periodo = $('filtroPeriodo')?.value || '';
    const nome = $('filtroNome')?.value || '';
    const telefone = $('filtroTelefone')?.value || '';
    const vinculo = $('filtroVinculo')?.value || '';
    
    listarPresencas({ dataInicio, dataFim, periodo, nome, telefone, vinculo });
    mostrarNotificacao('🔍 Filtros aplicados', 'info');
  });

  if (btnLimparFiltros) {
    btnLimparFiltros.addEventListener('click', () => {
      if ($('filtroDataInicio')) $('filtroDataInicio').value = '';
      if ($('filtroDataFim')) $('filtroDataFim').value = '';
      if ($('filtroPeriodo')) $('filtroPeriodo').value = '';
      if ($('filtroNome')) $('filtroNome').value = '';
      if ($('filtroTelefone')) $('filtroTelefone').value = '';
      if ($('filtroVinculo')) $('filtroVinculo').value = '';
      
      listarPresencas();
      mostrarNotificacao('🔄 Filtros limpos', 'info');
    });
  }

  // =================== Font menu ====================
  if (fontButton && fontList) {
    const fontes = ["Arial","Roboto","Verdana","Poppins","Georgia","Inter","Lato","Montserrat","Raleway","Open Sans","Nunito","Playfair Display","Dancing Script","Quicksand"];
    fontes.forEach(f => {
      const item = document.createElement('div');
      item.innerHTML = `<span style="font-family:${f}">${f}</span> <span style="font-size:12px;opacity:0.7;">Aa</span>`;
      item.onclick = () => {
        document.body.style.fontFamily = f;
        fontButton.innerHTML = `✏️ ${f}`;
        fontList.classList.add('hidden');
      };
      fontList.appendChild(item);
    });
    fontButton.onclick = () => fontList.classList.toggle('hidden');
    document.addEventListener('click', (e) => {
      if (!fontList.contains(e.target) && !fontButton.contains(e.target)) fontList.classList.add('hidden');
    });
  }

  // =================== Theme toggle ====================
  if (themeToggle) {
    themeToggle.addEventListener('click', async () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      themeToggle.textContent = isDark ? '☀️' : '🌙';
      
      if (auth.currentUser) {
        try {
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            'preferencias.tema': isDark ? 'escuro' : 'claro'
          });
        } catch (err) {
          console.error('Erro ao salvar tema:', err);
        }
      }
    });
  }

  // =================== Logout ====================
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      console.log('🚪 Logout clicado');
      try {
        await signOut(auth);
        console.log('✅ Logout bem-sucedido');
        mostrarNotificacao('👋 Até logo!', 'info');
        window.location.reload();
      } catch (err) {
        console.error('❌ Erro ao fazer logout:', err);
        mostrarNotificacao('❌ Erro ao sair', 'error');
      }
    });
  }

  // =================== Admin functions ====================
  async function renderAdminPage() {
    let adminSection = $('admin-aprovacao');
    if (!adminSection) {
      adminSection = document.createElement('section');
      adminSection.id = 'admin-aprovacao';
      adminSection.className = 'pagina';
      adminSection.innerHTML = `
        <h2>👑 Aprovação de Novos Cadastros</h2>
        <div id="lista-usuarios-pendentes"></div>
        <p id="admin-feedback" class="feedback"></p>
      `;
      presencaMain && presencaMain.appendChild(adminSection);
    }
    mostrarPagina('admin-aprovacao');
    const listaDiv = $('lista-usuarios-pendentes');
    const feedbackDiv = $('admin-feedback');
    listaDiv && (listaDiv.innerHTML = '<p>🕐 Buscando cadastros pendentes...</p>');
    
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'pending'), orderBy('dataCadastro', 'asc'));
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        listaDiv.innerHTML = '';
        snap.forEach(docSnap => {
          const u = docSnap.data();
          const uid = docSnap.id;
          const dataCad = u.dataCadastro ? new Date(u.dataCadastro).toLocaleDateString('pt-BR') : 'N/A';
          const item = document.createElement('div');
          item.className = 'usuario-item';
          item.innerHTML = `
            <div class="user-info">
              <strong>${u.email}</strong>
              <span>Cadastrado em: ${dataCad}</span>
            </div>
            <div class="user-actions">
              <button class="btn-aceitar-user" data-uid="${uid}" data-email="${u.email}">👤 Usuário</button>
              <button class="btn-aceitar-admin" data-uid="${uid}" data-email="${u.email}">👑 Admin</button>
              <button class="btn-recusar" data-uid="${uid}" data-email="${u.email}">❌ Recusar</button>
            </div>
          `;
          listaDiv.appendChild(item);
        });
        
        listaDiv.querySelectorAll('.btn-aceitar-user').forEach(b => {
          b.addEventListener('click', async () => {
            if (!confirm(`Aprovar ${b.dataset.email} como USUÁRIO NORMAL?`)) return;
            try {
              await updateDoc(doc(db, 'users', b.dataset.uid), { 
                role: 'approved',
                autorizado: true 
              });
              mostrarNotificacao(`✅ ${b.dataset.email} aprovado como Usuário!`, 'success');
              renderAdminPage();
            } catch(err) { 
              console.error(err); 
              mostrarNotificacao('❌ Erro ao aprovar', 'error');
            }
          });
        });
        
        listaDiv.querySelectorAll('.btn-aceitar-admin').forEach(b => {
          b.addEventListener('click', async () => {
            if (!confirm(`⚠️ Aprovar ${b.dataset.email} como ADMINISTRADOR?`)) return;
            try {
              await updateDoc(doc(db, 'users', b.dataset.uid), { 
                role: 'admin',
                autorizado: true 
              });
              mostrarNotificacao(`✅ ${b.dataset.email} aprovado como Admin!`, 'success');
              renderAdminPage();
            } catch(err) { 
              console.error(err); 
              mostrarNotificacao('❌ Erro ao aprovar', 'error');
            }
          });
        });
        
        listaDiv.querySelectorAll('.btn-recusar').forEach(b => {
          b.addEventListener('click', async () => {
            const uid = b.dataset.uid;
            const email = b.dataset.email;
            
            if (!confirm(`⚠️ Deseja DELETAR permanentemente o usuário ${email}?`)) return;
            
            try {
              await deleteDoc(doc(db, 'users', uid));
              mostrarNotificacao('🗑️ Usuário removido com sucesso!', 'success');
              renderAdminPage();
            } catch(err) { 
              console.error('Erro ao deletar:', err);
              mostrarNotificacao('❌ Erro ao deletar usuário', 'error');
            }
          });
        });
        
      } else {
        listaDiv.innerHTML = '<p>✅ Nenhum cadastro pendente.</p>';
      }
    } catch(err) {
      console.error(err);
      feedbackDiv && (feedbackDiv.textContent = '❌ Erro ao carregar usuários pendentes.');
      mostrarNotificacao('❌ Erro ao carregar lista de usuários', 'error');
    }
  }

  if (btnAdminAccess) {
    btnAdminAccess.addEventListener('click', () => {
      if (userProfile && userProfile.role === 'admin') {
        renderAdminPage();
      } else {
        mostrarNotificacao('❌ Acesso negado. Você não é admin.', 'error');
      }
    });
  }

  // =================== Anotações ====================
  window.listarAnotacoes = async function(dataISO = nowISO()) {
    if (!auth.currentUser) {
      if (feedbackAnotacao) feedbackAnotacao.textContent = '⚠️ Faça login para ver anotações.';
      if (listaAnotacoes) listaAnotacoes.innerHTML = '';
      return;
    }

    if (listaAnotacoes) listaAnotacoes.innerHTML = '<p>🕐 Carregando...</p>';
    if (feedbackAnotacao) feedbackAnotacao.textContent = '';

    try {
      const q = query(
        collection(db, 'anotacoes'),
        where('data', '==', dataISO)
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        listaAnotacoes.innerHTML = `<p>🗒️ Nenhuma anotação em ${isoToPtBR(dataISO)}.</p>`;
        return;
      }

      listaAnotacoes.innerHTML = '';

      snap.forEach(docSnap => {
        const a = docSnap.data();
        const id = docSnap.id;

        const item = document.createElement('div');
        item.className = 'anotacao-item';
        item.innerHTML = `
          <div class="anotacao-bloco">
            <div class="texto-anotacao">${(a.texto || '').replace(/\n/g, '<br>')}</div>
            <span class="anotacao-hora">${a.hora || ''}</span>
            <small style="display:block;color:#666;margin-top:6px">
              ${isoToPtBR(a.data || dataISO)}${a.autor ? ` — <b>${a.autor}</b>` : ''}
            </small>
          </div>
          <div class="acoes-anotacao">
            <button class="btn-editar" data-id="${id}">✏️ Editar</button>
            <button class="btn-excluir" data-id="${id}">🗑️ Excluir</button>
          </div>
        `;
        listaAnotacoes.appendChild(item);
      });

      document.querySelectorAll('.btn-editar').forEach(btn =>
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;
          const snap = await getDoc(doc(db, 'anotacoes', id));
          if (snap.exists()) {
            campoAnotacoes.value = snap.data().texto || '';
            feedbackAnotacao.textContent = '✏️ Editando...';
            salvarAnotacaoBtn.textContent = 'Atualizar Anotação';
            idAnotacaoEditando = id;
          }
        })
      );

      document.querySelectorAll('.btn-excluir').forEach(btn =>
        btn.addEventListener('click', async () => {
          if (!confirm('🗑️ Deseja excluir?')) return;
          try {
            await deleteDoc(doc(db, 'anotacoes', btn.dataset.id));
            feedbackAnotacao.textContent = '🗑️ Excluído.';
            mostrarNotificacao('🗑️ Anotação excluída', 'success');
            listarAnotacoes(dataISO);
          } catch (err) {
            console.error(err);
            if (feedbackAnotacao) feedbackAnotacao.textContent = '❌ Erro ao excluir.';
            mostrarNotificacao('❌ Erro ao excluir anotação', 'error');
          }
        })
      );
    } catch (err) {
      console.error(err);
      listaAnotacoes.innerHTML = `<p>❌ Erro ao carregar anotações.</p>`;
      mostrarNotificacao('❌ Erro ao carregar anotações', 'error');
    }
  }

  salvarAnotacaoBtn && salvarAnotacaoBtn.addEventListener('click', async ev => {
    ev.preventDefault();
    if (!auth.currentUser) {
      if (feedbackAnotacao) feedbackAnotacao.textContent = '⚠️ Faça login para salvar.';
      return;
    }

    const texto = campoAnotacoes.value.trim();
    if (!texto) {
      feedbackAnotacao.textContent = '⚠️ Escreva algo antes de salvar.';
      return;
    }

    const agora = new Date();
    const dataISO = agora.toISOString().split('T')[0];
    const hora = agora.toLocaleTimeString('pt-BR');
    const anotacaoData = {
      texto,
      uid: auth.currentUser.uid,
      autor: auth.currentUser.email,
      data: dataISO,
      hora
    };

    try {
      if (idAnotacaoEditando) {
        await updateDoc(doc(db, 'anotacoes', idAnotacaoEditando), { texto, hora });
        feedbackAnotacao.textContent = '✅ Anotação atualizada!';
        mostrarNotificacao('✅ Anotação atualizada!', 'success');
      } else {
        await addDoc(collection(db, 'anotacoes'), anotacaoData);
        feedbackAnotacao.textContent = '✅ Anotação salva!';
        mostrarNotificacao('✅ Anotação salva com sucesso!', 'success');
      }

      campoAnotacoes.value = '';
      idAnotacaoEditando = null;
      salvarAnotacaoBtn.textContent = 'Salvar Anotações';
      listarAnotacoes(dataISO);
    } catch (err) {
      console.error('Erro ao salvar/atualizar anotação', err);
      feedbackAnotacao.textContent = '❌ Erro ao salvar.';
      mostrarNotificacao('❌ Erro ao salvar anotação', 'error');
    }
  });

  verAntigasBtn && verAntigasBtn.addEventListener('click', () => {
    if (seletorData.value) listarAnotacoes(seletorData.value);
    else mostrarNotificacao('⚠️ Selecione uma data', 'warning');
  });

  // =================== SISTEMA DE PALETAS ===================
  const paletas = [
    { id: 'azul-padrao', nome: '🔵 Azul Padrão', cores: ['#0b4f99', '#2176ff', '#0a4180'] },
    { id: 'roxo-mistico', nome: '🟣 Roxo Místico', cores: ['#6a1b9a', '#9c27b0', '#4a148c'] },
    { id: 'verde-natureza', nome: '🟢 Verde Natureza', cores: ['#2e7d32', '#4caf50', '#1b5e20'] },
    { id: 'laranja-vibrante', nome: '🟠 Laranja Vibrante', cores: ['#e65100', '#ff6f00', '#bf360c'] },
    { id: 'vermelho-intenso', nome: '🔴 Vermelho Intenso', cores: ['#c62828', '#e53935', '#b71c1c'] },
    { id: 'rosa-suave', nome: '🩷 Rosa Suave', cores: ['#c2185b', '#e91e63', '#ad1457'] },
    { id: 'marrom-classico', nome: '🟤 Marrom Clássico', cores: ['#5d4037', '#795548', '#3e2723'] },
    { id: 'ciano-oceano', nome: '🌊 Ciano Oceano', cores: ['#00838f', '#00acc1', '#006064'] },
    { id: 'indigo-profundo', nome: '💙 Índigo Profundo', cores: ['#283593', '#3f51b5', '#1a237e'] },
    { id: 'turquesa-tropical', nome: '🏝️ Turquesa Tropical', cores: ['#00796b', '#009688', '#004d40'] },
    { id: 'ambar-dourado', nome: '🟡 Âmbar Dourado', cores: ['#f57c00', '#ffa726', '#e65100'] },
    { id: 'limao-eletrico', nome: '⚡ Limão Elétrico', cores: ['#827717', '#cddc39', '#f57f17'] }
  ];

  const btnPaletas = $('btn-paletas');
  const painelPaletas = $('painel-paletas');
  const paletteGrid = painelPaletas?.querySelector('.palette-grid');

  if (paletteGrid) {
    paletteGrid.innerHTML = '';
    paletas.forEach(p => {
      const item = document.createElement('div');
      item.className = 'palette-item';
      item.dataset.paleta = p.id;
      item.innerHTML = `
        <div class="palette-name">${p.nome}</div>
        <div class="palette-preview">
          ${p.cores.map(cor => `<div class="palette-color" style="background:${cor}"></div>`).join('')}
        </div>
      `;
      paletteGrid.appendChild(item);
    });
  }

  if (btnPaletas && painelPaletas) {
    btnPaletas.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      painelPaletas.classList.toggle('hidden');
    });
  }

  document.addEventListener('click', (e) => {
    if (painelPaletas && !painelPaletas.contains(e.target) && !btnPaletas?.contains(e.target)) {
      painelPaletas.classList.add('hidden');
    }
  });

  if (paletteGrid) {
    paletteGrid.addEventListener('click', (e) => {
      const item = e.target.closest('.palette-item');
      if (item) {
        aplicarPaleta(item.dataset.paleta);
        mostrarNotificacao('🎨 Paleta aplicada!', 'success');
      }
    });
  }

  // =================== SISTEMA DE TAMANHO DE FONTE PARA ANOTAÇÕES ===================
  const fontSizeCards = document.querySelectorAll('.font-size-card');
  const fontSizeSelect = document.getElementById('fontSizeSelect');

  if (fontSizeCards.length > 0 && fontSizeSelect) {
    function aplicarTamanhoFonte(tamanho) {
      document.documentElement.style.setProperty('--tamanho-fonte', tamanho);
      
      const campoAnotacoes = document.getElementById('campoAnotacoes');
      if (campoAnotacoes) {
        campoAnotacoes.style.fontSize = tamanho;
      }
      
      const textoAnotacoes = document.querySelectorAll('.texto-anotacao, .anotacao-item p');
      textoAnotacoes.forEach(el => {
        el.style.fontSize = tamanho;
      });
      
      fontSizeSelect.value = tamanho;
      
      fontSizeCards.forEach(card => {
        card.classList.remove('active');
        if (card.dataset.size === tamanho) {
          card.classList.add('active');
        }
      });
      
      if (auth.currentUser) {
        updateDoc(doc(db, 'users', auth.currentUser.uid), {
          'preferencias.tamanhoFonte': tamanho
        }).catch(err => console.error('Erro ao salvar tamanho da fonte:', err));
      }
    }
    
    fontSizeCards.forEach(card => {
      card.addEventListener('click', () => {
        const tamanho = card.dataset.size;
        aplicarTamanhoFonte(tamanho);
        mostrarNotificacao(`✨ Tamanho da letra alterado para ${tamanho}`, 'success');
      });
    });
    
    const tamanhoInicial = fontSizeSelect.value || '20px';
    aplicarTamanhoFonte(tamanhoInicial);
  }

  // =================== 🌐 DETECÇÃO ONLINE/OFFLINE ===================
  const onlineStatus = $('online-status');
  const statusIcon = $('status-icon');
  const statusText = $('status-text');

  function atualizarStatusConexao() {
    if (navigator.onLine) {
      if (onlineStatus) {
        onlineStatus.classList.add('online');
        onlineStatus.classList.remove('hidden');
        if (statusIcon) statusIcon.textContent = '✅';
        if (statusText) statusText.textContent = 'Online';
        
        // Remove indicador após 3 segundos se estiver online
        setTimeout(() => {
          onlineStatus.classList.add('hidden');
        }, 3000);
      }
      console.log('🌐 Conexão restaurada!');
    } else {
      if (onlineStatus) {
        onlineStatus.classList.remove('online');
        onlineStatus.classList.remove('hidden');
        if (statusIcon) statusIcon.textContent = '📡';
        if (statusText) statusText.textContent = 'Modo Offline';
      }
      console.log('📡 Sem conexão - Modo Offline ativado');
      mostrarNotificacao('📡 Sem conexão. Funcionando offline com dados salvos.', 'warning');
    }
  }

  // Detecta mudanças de conexão
  window.addEventListener('online', () => {
    atualizarStatusConexao();
    mostrarNotificacao('✅ Conexão restaurada!', 'success');
  });

  window.addEventListener('offline', () => {
    atualizarStatusConexao();
  });

  // Verifica status inicial
  if (!navigator.onLine) {
    atualizarStatusConexao();
  }

  // =================== 📱 ATUALIZAÇÃO DO SERVICE WORKER ===================
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Nova versão do app disponível!');
      mostrarNotificacao('🔄 Nova versão disponível! Recarregando...', 'info');
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });

    // Botão para limpar cache (útil para desenvolvimento)
    window.limparCache = function() {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CLEAR_CACHE'
        });
        
        mostrarNotificacao('🗑️ Cache limpo! Recarregue a página.', 'info');
      }
    };
  }

  console.log('✅ Sistema ADB Vila Élida carregado e pronto!');
  console.log('📱 PWA: Service Worker ativo');
  console.log('🌐 Status: ' + (navigator.onLine ? 'Online' : 'Offline'));

}); // FIM do DOMContentLoaded