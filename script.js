
// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Configuração Firebase
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

// DOM
const authArea = document.getElementById('auth-area');
const presencaArea = document.getElementById('presenca-area');
const headline = document.getElementById('headline');
const submitBtn = document.getElementById('submit-btn');
const switchLink = document.getElementById('switch-link');
const authFeedback = document.getElementById('auth-feedback');
const userEmailSpan = document.getElementById('user-email');
const authForm = document.getElementById('auth-form');

let mode = 'login';

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

// Alternar login/cadastro
switchLink.addEventListener('click', (e)=>{
  e.preventDefault();
  setMode(mode === 'login' ? 'cadastro' : 'login');
});

// --- Olhinho de senha ---
const senhaInput = document.getElementById('password');

// Criar olhinho
const toggleSenha = document.createElement('span');
toggleSenha.textContent = '👁️';
toggleSenha.style.position = 'absolute';
toggleSenha.style.right = '12px';
toggleSenha.style.top = '50%';
toggleSenha.style.transform = 'translateY(-50%)';
toggleSenha.style.cursor = 'pointer';

// Criar wrapper para posicionamento
const senhaWrapper = document.createElement('div');
senhaWrapper.style.position = 'relative';
senhaInput.parentNode.insertBefore(senhaWrapper, senhaInput);
senhaWrapper.appendChild(senhaInput);
senhaWrapper.appendChild(toggleSenha);

// Alternar visibilidade
toggleSenha.addEventListener('click', ()=>{
  if(senhaInput.type === 'password'){
    senhaInput.type = 'text';
    toggleSenha.textContent = '🙈';
  } else {
    senhaInput.type = 'password';
    toggleSenha.textContent = '👁️';
  }
});

// --- Link "Esqueci a senha" ---
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

// Login / Cadastro
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

// Estado de autenticação
onAuthStateChanged(auth, user=>{
  if(user){
    authArea.classList.add('hidden');
    presencaArea.classList.remove('hidden');
    userEmailSpan.textContent = user.email;
    mostrarPagina('registro');
    listarPresencas();
  } else {
    authArea.classList.remove('hidden');
    presencaArea.classList.add('hidden');
    userEmailSpan.textContent = '';
    setMode('login');
  }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', async ()=>{
  await signOut(auth);
});

// Navegação
window.mostrarPagina = function(id){
  document.querySelectorAll('.pagina').forEach(s => s.classList.remove('ativa'));
  document.getElementById(id).classList.add('ativa');
};

// Registrar presença
const formPresenca = document.getElementById('formPresenca');
formPresenca.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const acompanhante = document.getElementById('acompanhante').value.trim();
  const vinculo = document.getElementById('vinculo').value;
  const vinculoExtra = document.getElementById('vinculoExtra').value.trim();
  const tipo = document.getElementById('tipo').value;
  const tipoExtra = document.getElementById('tipoExtra').value.trim();
  const agora = new Date();
  try {
    await addDoc(collection(db,'presencas'), {
      nome, acompanhante, vinculo, vinculoExtra, tipo, tipoExtra,
      data: agora.toLocaleDateString('pt-BR'),
      hora: agora.toLocaleTimeString('pt-BR')
    });
    alert('✅ Presença registrada!');
    formPresenca.reset();
    listarPresencas();
  } catch (err) {
    console.error(err);
    alert('❌ Erro ao salvar presença');
  }
});

// Listar presenças
async function listarPresencas(filtro={}){
  const tbody = document.getElementById('tabelaPresencas');
  tbody.innerHTML = '';
  try {
    const snap = await getDocs(collection(db,'presencas'));
    let arr = snap.docs.map(d => d.data());

    if(filtro.data) {
      arr = arr.filter(p => {
        const [d,m,y] = p.data.split('/');
        return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}` === filtro.data;
      });
    }
    if(filtro.mes) {
      arr = arr.filter(p => {
        const parts = p.data.split('/');
        return `${parts[2]}-${parts[1].padStart(2,'0')}` === filtro.mes;
      });
    }
    if(filtro.ano) {
      arr = arr.filter(p => p.data.split('/')[2] === filtro.ano);
    }
arr.forEach(p => {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${p.nome}</td>
    <td>${p.acompanhante || ''}</td>
    <td>${p.vinculo}</td>
    <td>${p.vinculoExtra || ''}</td>
    <td>${p.tipo}</td>
    <td>${p.tipoExtra || ''}</td> <!-- Coluna nova -->
    <td>${p.data}</td>
    <td>${p.hora}</td>
  `;
  tbody.appendChild(tr);
});

    document.getElementById('contador').textContent = `Total: ${arr.length}`;
  } catch (err) {
    console.error(err);
  }
}

// Filtros
document.getElementById('btnFiltrar').addEventListener('click', ()=>{
  const data = document.getElementById('filtroData').value;
  const mes = document.getElementById('filtroMes').value;
  const ano = document.getElementById('filtroAno').value.trim();
  listarPresencas({data, mes, ano});
});
document.getElementById('btnLimpar').addEventListener('click', ()=>{
  document.getElementById('filtroData').value='';
  document.getElementById('filtroMes').value='';
  document.getElementById('filtroAno').value='';
  listarPresencas();
});

// --- Hora em tempo real ---
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

// --- Seletor de fontes ---
const fonteSelect = document.getElementById('seletor-fontes');
const btnFontes = document.getElementById('btn-fontes');

// lista de fontes
['Arial','Roboto','Verdana','Poppins','Courier New','Georgia','Inter','Tahoma','Lato','Montserrat','Nunito','Raleway','Open Sans','Quicksand','Playfair Display','Dancing Script']
.forEach(f => {
  const opt = document.createElement('option');
  opt.value = f;
  opt.textContent = f;
  fonteSelect.appendChild(opt);
});

// mostrar/esconder seletor ao clicar no botão
btnFontes.addEventListener('click', () => {
  fonteSelect.classList.toggle('show');
});

// aplicar fonte ao trocar no seletor
fonteSelect.addEventListener('change', () => {
  document.querySelectorAll('#registro, #lista').forEach(sec => {
    sec.style.fontFamily = fonteSelect.value;
  });
});

// Início
setMode('login');
