// Firebase SDK (mantive sua versão 10.12.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, getDoc, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";



// Configuração Firebase (mantive sua config)
const firebaseConfig = {
  apiKey: "AIzaSyCyoed7aB-MpxQwznvRay4Zw1c69QBtIlc",
  authDomain: "adb28presenca.firebaseapp.com",
  projectId: "adb28presenca",
  storageBucket: "adb28presenca.appspot.com",
  messagingSenderId: "376605186919",
  appId: "1:376605186919:web:0ca2c57dc2a06338d36dc2",
  measurementId: "G-KMN2PWBRL4"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


// Variável global para rastrear se estamos em modo de edição
let idDocumentoEmEdicao = null; 

// =========================================================================
// NOVO: FUNÇÃO PARA PREENCHER O FORMULÁRIO COM OS DADOS EXISTENTES
// =========================================================================
async function preencherFormularioParaEdicao(documentId) {
    // 1. Puxa os dados do documento do Firebase
    const docRef = doc(db, 'presencas', documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const p = docSnap.data();

        // 2. Armazena o ID e muda o botão para MODO EDIÇÃO
        idDocumentoEmEdicao = documentId;
        document.getElementById('salvarBtn').textContent = 'Atualizar Presença';

        // 3. Preenche os campos do formulário (use os IDs dos seus inputs)
        document.getElementById('nome').value = p.nome || '';
        document.getElementById('acompanhante').value = p.acompanhante || '';
        document.getElementById('telefone').value = p.telefone || '';
        document.getElementById('endereco').value = p.endereco || '';

        // Campos de Select/Opções:
        document.getElementById('vinculo').value = p.vinculo || '';
        document.getElementById('vinculoExtra').value = p.vinculoExtra || '';
        document.getElementById('tipo').value = p.tipo || '';
        document.getElementById('tipoExtra').value = p.tipoExtra || '';
        
        // 4. Muda para a aba de Registro
        document.getElementById('btn-registra').click(); 
    }
}

// ==================== NOVO: SINCRONIZA DADOS PESSOAIS (Telefone/Endereco/Vinculo) ====================
async function sincronizarDadosPessoais(dadosNovos, idDocumentoAtual) {
    if (!dadosNovos.nome) return; // Se não tem nome, não faz nada
    
    try {
        // 1. Busca todos os documentos que NÃO são o que acabamos de alterar, 
        // mas que têm o mesmo nome.
        const q = query(collection(db, 'presencas'), where('nome', '==', dadosNovos.nome));
        const snap = await getDocs(q);
        
        const updates = [];
        
        // 2. Itera sobre os documentos encontrados
        snap.docs.forEach(docSnap => {
            // Garante que não estamos atualizando o documento que acabamos de editar
            if (docSnap.id !== idDocumentoAtual) {
                const docRef = doc(db, 'presencas', docSnap.id);
                
                // 3. Cria um objeto com os campos que DEVEM ser sincronizados
                const camposParaSincronizar = {
                    telefone: dadosNovos.telefone,
                    endereco: dadosNovos.endereco,
                    vinculo: dadosNovos.vinculo,
                    vinculoExtra: dadosNovos.vinculoExtra,
                    // Se houver outros campos que devem ser sincronizados (ex: Acompanhante), adicione aqui.
                };
                
                // Adiciona a promessa de atualização ao array
                updates.push(updateDoc(docRef, camposParaSincronizar));
            }
        });
        
        // 4. Executa todas as atualizações em paralelo
        if (updates.length > 0) {
            await Promise.all(updates);
            console.log(`✅ ${updates.length} registros antigos de '${dadosNovos.nome}' sincronizados com sucesso.`);
        }
        
    } catch (error) {
        console.error("Erro durante a sincronização de dados pessoais:", error);
    }
}


// ---------- DOM (mantidos os mesmos IDs/classes do seu HTML) ----------
const authArea = document.getElementById('auth-area');
const presencaArea = document.getElementById('presenca-area');
const headline = document.getElementById('headline');
const submitBtn = document.getElementById('submit-btn');
const switchLink = document.getElementById('switch-link');
const authFeedback = document.getElementById('auth-feedback');
const userEmailSpan = document.getElementById('user-email');
const authForm = document.getElementById('auth-form');
const formPresenca = document.getElementById('formPresenca');
const tabelaBody = document.getElementById('tabelaPresencas');
const contadorEl = document.getElementById('contador');

// Estado
let mode = 'login';

// === Funções de UI / Auth (mantive sua lógica) ===
function setMode(newMode){
  mode = newMode;
  authFeedback.textContent = '';
  if(mode === 'login'){
    headline.textContent = 'Conecte-se';
    submitBtn.textContent = 'Entrar';
    switchLink.textContent = 'Cadastre-se';
  } else {
    headline.textContent = 'Cadastro';
    submitBtn.textContent = 'Criar Conta';
    switchLink.textContent = 'Entrar';
  }
}
switchLink.addEventListener('click', (e)=>{
  e.preventDefault();
  setMode(mode === 'login' ? 'cadastro' : 'login');
});

// --- Olhinho de senha (mantido) ---
const senhaInput = document.getElementById('password');
const toggleSenha = document.createElement('span');
toggleSenha.textContent = '👁️';
toggleSenha.style.position = 'absolute';
toggleSenha.style.right = '12px';
toggleSenha.style.top = '50%';
toggleSenha.style.transform = 'translateY(-50%)';
toggleSenha.style.cursor = 'pointer';
const senhaWrapper = document.createElement('div');
senhaWrapper.style.position = 'relative';
senhaInput.parentNode.insertBefore(senhaWrapper, senhaInput);
senhaWrapper.appendChild(senhaInput);
senhaWrapper.appendChild(toggleSenha);
toggleSenha.addEventListener('click', ()=>{
  if(senhaInput.type === 'password'){
    senhaInput.type = 'text';
    toggleSenha.textContent = '🙈';
  } else {
    senhaInput.type = 'password';
    toggleSenha.textContent = '👁️';
  }
});

// --- Link "Esqueci a senha" (mantido) ---
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

resetLink.addEventListener('click', async (e)=>{
  e.preventDefault();
  const email = prompt("Digite seu e-mail para redefinir a senha:");
  if(email){
    try {
      await sendPasswordResetEmail(auth, email);
      alert("✅ Link de redefinição enviado para seu e-mail!");
    } catch(err) {
      console.error(err);
      alert("❌ Erro: " + (err.message || "Não foi possível enviar o link."));
    }
  }
});

// --- Login / Cadastro (mantido) ---
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authFeedback.textContent = '';
  const email = document.getElementById('email').value.trim();
  const password = senhaInput.value.trim();

  try {
    if (mode === 'login') {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        authFeedback.textContent = '✅ Conta criada! Faça login.';
        setMode('login');
      } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
          authFeedback.textContent = '❌ E-mail já cadastrado! Tente fazer login.';
          setMode('login');
        } else {
          throw err;
        }
      }
    }
    authForm.reset();
  } catch (err) {
    console.error(err);
    authFeedback.textContent = '❌ ' + (err.message || 'Erro');
  }
});

// --- Estado de autenticação (mantido) ---
onAuthStateChanged(auth, user=>{
  if(user){
    authArea.classList.add('hidden');
    presencaArea.classList.remove('hidden');
    userEmailSpan.textContent = user.email;
    mostrarPagina('registro');
    listarPresencas();
    headline.textContent = 'ADB Vila Élida 28';
  } else {
    authArea.classList.remove('hidden');
    presencaArea.classList.add('hidden');
    userEmailSpan.textContent = '';
    setMode('login');
  }
});

// --- Logout (mantido) ---
document.getElementById('logout-btn').addEventListener('click', async ()=>{
  await signOut(auth);
});

// --- Navegação (mantido) ---
window.mostrarPagina = function(id){
  document.querySelectorAll('.pagina').forEach(s => s.classList.remove('ativa'));
  document.getElementById(id).classList.add('ativa');
};

// ==================== Funções de período ====================
// converte string de hora para período (suporta "HH:MM", "HH:MM:SS" e AM/PM se houver)
function obterPeriodoPelaHora(horaString) {
  if (!horaString) return '';
  // extrai número antes dos ":" (ex: "14:30" -> 14)
  const match = horaString.match(/(\d{1,2})/);
  if(!match) return '';
  let h = parseInt(match[1], 10);
  // detecta AM/PM
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

// ==================== Registrar/Atualizar Presença (VERSÃO FINAL SIMPLIFICADA) ====================
formPresenca.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // 1. Coleta de dados do formulário
  const formData = new FormData(formPresenca);
  const presencaData = {
    nome: formData.get('nome')?.trim() || '',
    acompanhante: formData.get('acompanhante')?.trim() || '',
    telefone: formData.get('telefone')?.trim() || '',
    endereco: formData.get('endereco')?.trim() || '',
    vinculo: formData.get('vinculo') || '',
    vinculoExtra: formData.get('vinculoExtra')?.trim() || '',
    tipo: formData.get('tipo') || '',
    tipoExtra: formData.get('tipoExtra')?.trim() || '',
  };

  // 2. Lógica de Salvar/Atualizar
  try {
if (idDocumentoEmEdicao) {
    // MODO EDIÇÃO: ATUALIZA O DOCUMENTO EXISTENTE
    
    const docRef = doc(db, 'presencas', idDocumentoEmEdicao);
    await updateDoc(docRef, presencaData);
    
    // ⭐️ PASSO CHAVE: SINCRONIZA DADOS PESSOAIS NOS REGISTROS ANTIGOS 
    await sincronizarDadosPessoais(presencaData, idDocumentoEmEdicao);
    
    alert('✅ Presença atualizada e registros antigos sincronizados com sucesso!');
} else {
        // MODO REGISTRO: ADICIONA NOVO DOCUMENTO

        // Gerar data/hora APENAS no registro novo
        const agora = new Date();
        presencaData.data = agora.toLocaleDateString('pt-BR'); // DD/MM/YYYY
        presencaData.hora = agora.toLocaleTimeString('pt-BR');
        presencaData.periodo = obterPeriodo();

        await addDoc(collection(db, 'presencas'), presencaData);
        alert('✅ Presença registrada!');
    }
    
    // 3. Limpeza e Reset (CRUCIAL PARA O REGISTRO NORMAL)
    formPresenca.reset();
    idDocumentoEmEdicao = null; 
    document.getElementById('salvarBtn').textContent = 'Registrar Presença'; 
    listarPresencas();

  } catch (err) {
    console.error("Erro ao salvar/atualizar presença:", err);
    // A mensagem de erro geralmente aparece no console, mas este alert ajudará
    alert('❌ Erro ao salvar/atualizar presença. Verifique o console para detalhes.');
  }
});

// ==================== Listar presenças (corrigido) ====================
async function listarPresencas(filtro = {}) {
  tabelaBody.innerHTML = '';

  try {
    const snap = await getDocs(collection(db, 'presencas'));
    let arr = snap.docs.map(d => ({ ...d.data(), id: d.id }));

    // === NOVO: ordenar por data e hora ===
    arr.sort((a, b) => {
      const [da, ma, ya] = (a.data || '').split('/');
      const [db, mb, yb] = (b.data || '').split('/');
      const dataA = new Date(`${ya}-${ma}-${da}T${a.hora || '00:00:00'}`);
      const dataB = new Date(`${yb}-${mb}-${db}T${b.hora || '00:00:00'}`);
      return dataA - dataB;
    });

    // FILTROS ==================================================
    if (filtro.data) {
      arr = arr.filter(p => {
        if (!p.data) return false;
        const [d, m, y] = p.data.split('/');
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}` === filtro.data;
      });
    }

    if (filtro.periodo && filtro.periodo !== '') {
      arr = arr.filter(p => {
        if (p.periodo) return p.periodo === filtro.periodo;
        return obterPeriodoPelaHora(p.hora) === filtro.periodo;
      });
    }

    if (!filtro.data && !filtro.mes && !filtro.ano && !filtro.periodo) {
      const hoje = new Date().toLocaleDateString('pt-BR');
      arr = arr.filter(p => p.data === hoje);
    }

    // RENDER ===================================================
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
      tabelaBody.appendChild(tr);
    });

    // Botões editar
    document.querySelectorAll('.editar-btn').forEach(button => {
      button.addEventListener('click', () =>
        preencherFormularioParaEdicao(button.dataset.id)
      );
    });

    contadorEl.textContent = `Total: ${arr.length}`;
  } catch (err) {
    console.error(err);
  }
}


// ==================== Filtros (botões) ====================
document.getElementById('btnFiltrar').addEventListener('click', ()=>{
  const data = document.getElementById('filtroData').value;
  const periodo = document.getElementById('filtroPeriodo').value;
  listarPresencas({data, periodo});
});

// Botão limpar: limpa apenas os filtros/visual (não apaga do BD)
document.getElementById('btnLimpar').addEventListener('click', ()=>{
  document.getElementById('filtroData').value = '';
  document.getElementById('filtroPeriodo').value = '';
  listarPresencas(); // sem filtros -> mostra só data atual
});

// ==================== Hora em tempo real (mantido) ====================
const horaSpan = document.createElement('span');
horaSpan.id = 'hora-atual';
horaSpan.style.marginLeft = '10px';
document.querySelector('.toolbar .right').prepend(horaSpan);
function atualizarHora() {
  const agora = new Date();
  horaSpan.textContent = agora.toLocaleTimeString('pt-BR');
}
setInterval(atualizarHora, 1000);
atualizarHora();

// ==== MENU ESTILIZADO DE FONTES ====
document.addEventListener("DOMContentLoaded", () => {
  const fontButton = document.querySelector(".font-button");
  const fontList = document.getElementById("lista-fontes");

  if (!fontButton || !fontList) {
    console.warn("⚠️ Elementos de fonte não encontrados no DOM.");
    return;
  }

  const fontes = [
    "Arial", "Roboto", "Verdana", "Poppins", "Georgia",
    "Inter", "Lato", "Montserrat", "Raleway", "Open Sans",
    "Nunito", "Playfair Display", "Dancing Script", "Quicksand"
  ];

  fontes.forEach(f => {
    const item = document.createElement("div");
    item.innerHTML = `<span style="font-family:${f}">${f}</span> <span style="font-size:12px;opacity:0.7;">Aa</span>`;
    item.onclick = () => {
      document.body.style.fontFamily = f;
      fontButton.innerHTML = `🎨 ${f}`;
      fontList.classList.add("hidden");
    };
    fontList.appendChild(item);
  });

  fontButton.onclick = () => fontList.classList.toggle("hidden");

  document.addEventListener("click", (e) => {
    if (!fontList.contains(e.target) && !fontButton.contains(e.target)) {
      fontList.classList.add("hidden");
    }
  });
});

// ==================== Limpeza visual automática diária (mantido) ====================
let dataAtual = new Date().toLocaleDateString('pt-BR');
setInterval(()=>{
  const hoje = new Date().toLocaleDateString('pt-BR');
  if(hoje !== dataAtual){
    dataAtual = hoje;
    listarPresencas(); // lista só da nova data
  }
}, 60000);


// Inicializa
setMode('login');

