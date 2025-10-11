:root {
  --tamanho-fonte: 20px;
  --cor-primaria: #0b4f99;
  --cor-secundaria: #2176ff;
  --cor-destaque: #0a4180;
  --cor-fundo-card: #ffffff;
  --cor-texto: #042a57;
  --cor-botao-hover: #2176ff;
}

/* === CSS Base === */
*{box-sizing:border-box}
html,body{height:100%;margin:0;font-family:Inter, system-ui, Arial, sans-serif;-webkit-font-smoothing:antialiased}

/* Fundo */
.bg{
  position:fixed;inset:0;
  background:linear-gradient(180deg, rgba(2,35,86,0.95) 0%, rgba(7,54,99,0.95) 100%), url('https://img.freepik.com/fotos-gratis/a-biblia-aberta-sobre-a-mesa-de-madeira-com-luz-suave_1232-2198.jpg') center/cover no-repeat;
  filter:brightness(0.6);
  z-index:-1;
}

/* Container central */
.wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:100px}
.card{width:100%;max-width:2000px;background:linear-gradient(180deg,#ffffffee,#ffffffdd);border-radius:14px;padding:100px;box-shadow:0 10px 30px rgba(0,0,0,0.25);display:flex;flex-direction:column;gap:18px}

/* Top */
.card-top{display:flex;flex-direction:column;align-items:center;gap:12px;margin-bottom:4px}
.logo{width:110px;height:110px;border-radius:999px;object-fit:cover;border:6px solid #042a57;background:white;padding:6px}
#headline{color:#042a57;font-size:28px;margin:0}

/* Forms */
.form{display:flex;flex-direction:column;gap:12px;width:100%}
.form input,.form select{padding:12px;border-radius:8px;border:1px solid #d6dbe6;font-size:15px;width:100%}
.btn{padding:12px 14px;border-radius:10px;border:0;cursor:pointer;font-weight:600;transition:all 0.3s ease}
.btn.primary{background:#0b4f99;color:white}
.btn.ghost{background:transparent;border:1px solid rgba(5,75,135,0.12);color:#0b4f99}
.btn.secondary{background:#6c757d;color:white}

/* Small text */
.small{font-size:14px;color:#042a57}
.muted{color:#425c77}

/* Auth */
#auth-switch{text-align:center;margin-top:6px}
#auth-switch a{color:#0b4f99;text-decoration:none;font-weight:700}
.feedback{min-height:18px;text-align:center;color:#b73838}

/* =========================================================
   🔔 SISTEMA DE NOTIFICAÇÕES
   ========================================================= */
#notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.notification {
  background: white;
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  max-width: 400px;
  opacity: 0;
  transform: translateX(400px);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  pointer-events: auto;
  border-left: 4px solid;
}

.notification.show {
  opacity: 1;
  transform: translateX(0);
}

.notification-success {
  border-left-color: #28a745;
  background: linear-gradient(135deg, #f0fff4 0%, #ffffff 100%);
}

.notification-error {
  border-left-color: #dc3545;
  background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
}

.notification-warning {
  border-left-color: #ffc107;
  background: linear-gradient(135deg, #fffbf0 0%, #ffffff 100%);
}

.notification-info {
  border-left-color: #17a2b8;
  background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
}

.notif-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.notif-message {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

/* =========================================================
   📊 ÁREA DE RELATÓRIOS
   ========================================================= */
.relatorios-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card:nth-child(1) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card:nth-child(2) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card:nth-child(3) {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-card:nth-child(4) {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-icon {
  font-size: 48px;
  opacity: 0.9;
}

.stat-info h3 {
  font-size: 36px;
  margin: 0 0 5px 0;
  font-weight: 700;
}

.stat-info p {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

.filtros-graficos {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  flex-wrap: wrap;
}

.filtros-graficos label {
  font-weight: 600;
  color: var(--cor-primaria);
}

.filtros-graficos select {
  padding: 10px 15px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  font-size: 15px;
  min-width: 200px;
}

.graficos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 25px;
}

.grafico-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.grafico-card h3 {
  margin: 0 0 20px 0;
  color: var(--cor-primaria);
  font-size: 18px;
  font-weight: 600;
}

.grafico-card canvas {
  max-height: 300px;
}

/* =========================================================
   🔍 FILTROS AVANÇADOS (AJUSTADO PARA FICAR EMBAIXO)
   ========================================================= */
.filtros-avancados {
  background: linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%);
  padding: 25px;
  border-radius: 15px;
  margin-top: 30px; /* 🆕 Espaçamento superior maior quando está embaixo */
  margin-bottom: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.filtros-avancados h3 {
  grid-column: 1 / -1;
  text-align: center;
  margin-bottom: 10px;
  color: var(--cor-primaria);
  font-size: 1.2rem;
  font-weight: 600;
}

.filtro-grupo {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filtro-grupo label {
  font-weight: 600;
  font-size: 13px;
  color: var(--cor-primaria);
  display: flex;
  align-items: center;
  gap: 5px;
}

.filtro-grupo input,
.filtro-grupo select {
  padding: 10px 12px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  font-size: 14px;
  transition: all 0.3s ease;
}

.filtro-grupo input:focus,
.filtro-grupo select:focus {
  border-color: var(--cor-secundaria);
  outline: none;
  box-shadow: 0 0 0 3px rgba(33, 118, 255, 0.1);
}

.filtro-acoes {
  grid-column: 1 / -1;
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

.filtro-acoes .btn {
  min-width: 150px;
}

/* =========================================================
   📥 BOTÕES DE EXPORTAÇÃO (AJUSTADOS PARA O TOPO)
   ========================================================= */
.export-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 25px; /* 🆕 Espaçamento inferior antes da tabela */
  justify-content: flex-end;
  flex-wrap: wrap;
}

.export-btn {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(17, 153, 142, 0.3);
}

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(17, 153, 142, 0.4);
}

.export-btn:active {
  transform: translateY(0);
}

/* Presença area */
.hidden{display:none}
.presenca-main {
  position: relative;
  overflow: hidden;
  min-height: 600px;
}

/* =========================================================
   TOOLBAR CENTRALIZADA
   ========================================================= */
.toolbar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 20px 0;
  margin-top: 10px;
  background: linear-gradient(180deg, rgba(255,255,255,0.5), rgba(240,246,255,0.3));
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.left {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
}

.right {
  flex-wrap: nowrap;
  white-space: nowrap;
}

/* Páginas */
.pagina {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 40px 20px;
  box-sizing: border-box;
}

.pagina h2 {
  margin-bottom: 24px;
  text-align: center;
}

.pagina form,
.pagina .historico-anotacoes,
.pagina .table-wrap {
  width: 100%;
  max-width: 900px;
}

.pagina.ativa {
  opacity: 1;
  visibility: visible;
  z-index: 2;
  position: relative;
}

/* Tabela */
.table-wrap{overflow-x:auto;background:white;padding:12px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.12)}
table{width:100%;border-collapse:collapse;font-size:13px}
thead{background:#0b4f99;color:white}
th,td{padding:8px;border:1px solid #ddd;text-align:left}
tbody tr:nth-child(even){background:#f9f9f9}
#contador{font-weight:600;margin-top:6px}

/* Footer */
footer{margin-top:400px;text-align:center;color:#d6dbe6;font-weight:600;display:flex;flex-direction:column;align-items:center;gap:6px}
footer .logos-rodape{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
footer img{width:40px;height:40px;object-fit:cover}

/* Ajustes tabela */
#lista table {
    table-layout: auto;
    width: 100%;
    border-collapse: collapse; 
}

#lista table td, 
#lista table th {
    vertical-align: middle;
    padding: 8px;
    border: 1px solid #ddd;
}

#lista table td:nth-child(1),
#lista table td:nth-child(9),
#lista table td:nth-child(10),
#lista table td:nth-child(11) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

#lista table td:nth-child(2),
#lista table td:nth-child(3),
#lista table td:nth-child(4),
#lista table td:nth-child(5),
#lista table td:nth-child(6),
#lista table td:nth-child(7),
#lista table td:nth-child(8) {
    white-space: normal;
    word-wrap: break-word;
}

.editar-btn {
    background-color: #f39c12;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 0.9em;
}

/* =========================================================
   📱 RESPONSIVIDADE
   ========================================================= */
@media (max-width: 768px) {
  .wrap {
    padding: 20px;
  }

  .card {
    padding: 24px;
    width: 100%;
    box-shadow: none;
  }

  .toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .left,
  .right {
    flex-wrap: wrap;
    width: 100%;
  }

  .filtros-avancados {
    grid-template-columns: 1fr;
  }

  .graficos-grid {
    grid-template-columns: 1fr;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  #notification-container {
    right: 10px;
    left: 10px;
    top: 10px;
  }

  .notification {
    min-width: auto;
    max-width: 100%;
  }

  .export-buttons {
    justify-content: center;
  }

  .btn,
  .font-button {
    width: 100%;
    text-align: center;
  }

  #campoAnotacoes {
    min-height: 140px;
    font-size: 1rem;
  }

  table {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .wrap {
    padding: 12px;
  }

  .toolbar {
    gap: 0.8rem;
    align-items: center;
  }

  #campoAnotacoes {
    font-size: 0.95rem;
    padding: 0.8rem;
  }

  table {
    font-size: 0.85rem;
    width: 100%;
  }

  table th,
  table td {
    padding: 6px 4px;
  }

  .btn {
    font-size: 1rem;
    padding: 0.8rem;
  }
}

/* ======= MENU DE FONTES ======= */
.font-menu {
  position: relative;
  display: inline-block;
}

.font-button {
  background: linear-gradient(90deg, #0b4f99, #2176ff);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s ease;
}

.font-button:hover {
  opacity: 0.9;
  box-shadow: 0 4px 12px rgba(11, 79, 153, 0.4);
}

.font-list {
  position: absolute;
  background: white;
  color: #333;
  border-radius: 10px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  top: 45px;
  left: 0;
  width: 220px;
  z-index: 1000;
  overflow-y: auto;
  max-height: 280px;
  padding: 5px 0;
  animation: fadeIn 0.25s ease;
  display: none;
}

.font-list.hidden {
  display: none;
}

.font-list:not(.hidden) {
  display: block;
}

.font-list div {
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #333;
}

.font-list div:hover {
  background: #f0f6ff;
  color: #0b4f99;
  transform: scale(1.02);
}

@keyframes fadeIn {
  from {opacity: 0; transform: translateY(-5px);}
  to {opacity: 1; transform: translateY(0);}
}

/* ==================== ANOTAÇÕES ==================== */
#anotacoes {
  text-align: center;
  margin: 0 auto;
  max-width: 1400px;
  width: 90%;
  padding: 50px 80px;
  background: linear-gradient(180deg, #ffffffcc, #f6f8ffcc);
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 25px;
}

#anotacoes h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

#campoAnotacoes {
  width: 90%;
  height: 180px;
  padding: 18px;
  font-size: var(--tamanho-fonte, 20px);
  line-height: 1.8em;
  border: 2px solid #dcdcdc;
  border-radius: 12px;
  resize: vertical;
  background: repeating-linear-gradient(
    to bottom,
    #fff,
    #fff 34px,
    #d8e0ff 35px
  );
  background-size: 100% 35px;
  color: #333;
  font-family: "Poppins", "Inter", sans-serif;
  outline: none;
  transition: box-shadow 0.3s, border-color 0.3s;
}

#campoAnotacoes:focus {
  border-color: #7b9aff;
  box-shadow: 0 0 10px rgba(123, 154, 255, 0.4);
}

#salvarAnotacao {
  margin-top: 15px;
  background: linear-gradient(90deg, #5a7fff, #7ba3ff);
  color: white;
  font-size: 1rem;
  padding: 10px 22px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

#salvarAnotacao:hover {
  background: linear-gradient(90deg, #4b6cff, #6c91ff);
  transform: scale(1.05);
}

.historico-anotacoes {
  margin-top: 40px;
  text-align: center;
}

.historico-anotacoes h3 {
  color: #444;
  font-size: 1.4rem;
  margin-bottom: 10px;
}

.lista-anotacoes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 22px;
  padding: 30px;
  justify-content: center;
}

.anotacao-item {
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
  border-left: 8px solid #4e7cff;
  border-radius: 20px;
  padding: 26px 28px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 200px;
  position: relative;
}

.anotacao-item:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.anotacao-item p,
.texto-anotacao {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: var(--tamanho-fonte, 20px);
  color: #1a1a1a;
  line-height: 2.2;
  font-weight: 400;
  margin-bottom: 18px;
  position: relative;
  padding-left: 18px;
}

.texto-anotacao::before,
.anotacao-item p::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #4e7cff;
  font-size: 1em;
  line-height: 2.2;
}

.anotacao-hora {
  display: block;
  text-align: right;
  font-size: 0.9rem;
  color: #666;
  margin-top: 8px;
}

/* =========================================================
   ✨ SELETOR DE TAMANHO DE FONTE - DESIGN MODERNO
   ========================================================= */
.font-size-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin: 20px auto;
  padding: 25px;
  background: linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  max-width: 600px;
}

.font-size-control label {
  font-weight: 700;
  color: var(--cor-primaria);
  font-size: 16px;
  text-align: center;
  margin-bottom: 5px;
}

/* Esconder o select padrão */
#fontSizeSelect {
  display: none;
}

/* Container dos cards de tamanho */
.font-size-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  width: 100%;
}

/* Cards individuais de tamanho */
.font-size-card {
  background: white;
  border: 3px solid #e0e7ff;
  border-radius: 12px;
  padding: 20px 15px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.font-size-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}

.font-size-card:hover::before {
  left: 100%;
}

.font-size-card:hover {
  transform: translateY(-5px);
  border-color: var(--cor-secundaria);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.font-size-card.active {
  background: linear-gradient(135deg, var(--cor-primaria), var(--cor-secundaria));
  border-color: var(--cor-primaria);
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.font-size-card.active .font-size-icon,
.font-size-card.active .font-size-label {
  color: white;
}

.font-size-icon {
  font-size: 32px;
  margin-bottom: 8px;
  display: block;
  transition: transform 0.3s ease;
  color: var(--cor-primaria);
}

.font-size-card:hover .font-size-icon {
  transform: scale(1.2);
}

.font-size-card.active .font-size-icon {
  transform: scale(1.15);
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.font-size-label {
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
}

.font-size-value {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
  font-weight: 500;
}

.font-size-card.active .font-size-value {
  color: rgba(255, 255, 255, 0.9);
}

/* Indicador visual do tamanho selecionado */
.font-size-card.active::after {
  content: '✓';
  position: absolute;
  top: 8px;
  right: 8px;
  background: white;
  color: var(--cor-primaria);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  animation: checkmark 0.3s ease;
}

@keyframes checkmark {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

/* Responsivo */
@media (max-width: 600px) {
  .font-size-options {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .font-size-card {
    padding: 15px 10px;
  }
  
  .font-size-icon {
    font-size: 28px;
  }
}

/* Modo escuro */
body.dark-mode .font-size-control {
  background: linear-gradient(135deg, #2b2b2b 0%, #1e1e1e 100%);
}

body.dark-mode .font-size-card {
  background: #3a3a3a;
  border-color: #555;
}

body.dark-mode .font-size-card:hover {
  border-color: var(--cor-secundaria);
  background: #4a4a4a;
}

body.dark-mode .font-size-label {
  color: #e5e7eb;
}

body.dark-mode .font-size-value {
  color: #9ca3af;
}

.acoes-anotacao {
  margin-top: 8px;
  display: flex;
  gap: 8px;
}

.acoes-anotacao button {
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s;
}

.btn-editar {
  background: #f7d067;
}

.btn-excluir {
  background: #e57373;
}

.btn-editar:hover {
  background: #f9e08c;
}

.btn-excluir:hover {
  background: #ef9a9a;
}

/* Botões especiais - AGORA USAM AS VARIÁVEIS DO TEMA */
#btn-registra {
  background: linear-gradient(135deg, var(--cor-primaria), var(--cor-destaque)) !important;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  padding: 10px 22px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

#btn-registra:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, var(--cor-secundaria), var(--cor-primaria)) !important;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

#btn-registra:active {
  transform: scale(0.98);
}

#btn-lista {
  background: linear-gradient(135deg, var(--cor-secundaria), var(--cor-destaque)) !important;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  padding: 10px 22px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

#btn-lista:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, var(--cor-destaque), var(--cor-secundaria)) !important;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

#btn-lista:active {
  transform: scale(0.98);
}

#btn-anotacoes {
  background: linear-gradient(135deg, var(--cor-destaque), var(--cor-primaria)) !important;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  padding: 10px 22px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

#btn-anotacoes:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, var(--cor-primaria), var(--cor-secundaria)) !important;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

#btn-anotacoes:active {
  transform: scale(0.98);
}

/* 🆕 Botão Relatórios */
#btn-relatorios {
  background: linear-gradient(135deg, var(--cor-secundaria), var(--cor-destaque)) !important;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  padding: 10px 22px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

#btn-relatorios:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, var(--cor-destaque), var(--cor-primaria)) !important;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

#btn-relatorios:active {
  transform: scale(0.98);
}

#salvarBtn {
  display: block;
  margin: 20px auto;
  background: linear-gradient(135deg, var(--cor-primaria), var(--cor-secundaria)) !important;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  padding: 12px 28px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

#salvarBtn:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, var(--cor-secundaria), var(--cor-destaque)) !important;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

#salvarBtn:active {
  transform: scale(0.97);
}

#dataAnotacoes {
  padding: 10px 14px;
  border-radius: 10px;
  border: 2px solid #2176ff;
  background: #f9fbff;
  font-weight: 500;
  color: #1a1a1a;
  box-shadow: 0 2px 6px rgba(33, 118, 255, 0.2);
  transition: all 0.3s ease;
}

#dataAnotacoes:hover,
#dataAnotacoes:focus {
  border-color: #0b4f99;
  box-shadow: 0 4px 10px rgba(33, 118, 255, 0.3);
  outline: none;
}

#verAntigasBtn {
  background: linear-gradient(90deg, #689ed8, #4d4588);
  color: #fff !important;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(33, 118, 255, 0.3);
}

#verAntigasBtn:hover {
  transform: scale(1.05);
  background: linear-gradient(90deg, #2176ff, #3372b5);
  box-shadow: 0 6px 16px rgba(33, 118, 255, 0.4);
}

#verAntigasBtn:active {
  transform: scale(0.95);
}

#logout-btn {
  background: linear-gradient(90deg, #0b4f99, #2176ff);
  color: #fff !important;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(33, 118, 255, 0.3);
}

#logout-btn:hover {
  transform: scale(1.05);
  background: linear-gradient(90deg, #2176ff, #0b4f99);
  box-shadow: 0 6px 16px rgba(33, 118, 255, 0.4);
}

#logout-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 6px rgba(33, 118, 255, 0.3);
}

#filtroData {
  border: none;
  background: #fff;
  border-radius: 10px;
  padding: 10px 15px;
  font-size: 15px;
  color: #333;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

#filtroData:hover, #filtroData:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(33,118,255,0.3);
}

#filtroPeriodo {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: #ffffff;
  border: 2px solid #d6e2f3;
  border-radius: 10px;
  padding: 10px 40px 10px 16px;
  font-size: 15px;
  font-weight: 500;
  color: #033760;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 3px 10px rgba(11, 79, 153, 0.08);
  background-image: url("data:image/svg+xml;utf8,<svg fill='%230b4f99' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
}

#filtroPeriodo:hover {
  border-color: #2176ff;
  box-shadow: 0 6px 14px rgba(33, 118, 255, 0.16);
}

#filtroPeriodo:focus {
  outline: none;
  border-color: #0b4f99;
  box-shadow: 0 0 0 3px rgba(33, 118, 255, 0.25);
}

#filtroPeriodo option {
  font-weight: 500;
  color: #033760;
  background-color: #ffffff;
}

#btnFiltrar {
  background: linear-gradient(90deg, var(--cor-primaria), var(--cor-secundaria)) !important;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  padding: 10px 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

#btnFiltrar:hover {
  transform: scale(1.05);
  background: linear-gradient(90deg, var(--cor-secundaria), var(--cor-destaque)) !important;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

button.alterar-btn,
#tabelaPresencas button {
  background: linear-gradient(90deg, var(--cor-destaque), var(--cor-primaria)) !important;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
}

button.alterar-btn:hover,
#tabelaPresencas button:hover {
  transform: scale(1.05);
  background: linear-gradient(90deg, var(--cor-secundaria), var(--cor-destaque)) !important;
}

#registro h2 {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

.theme-toggle {
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.3s ease, background 0.3s ease;
  background: #fff;
}

.theme-toggle:hover {
  transform: rotate(20deg);
}

/* =========================================================
   🌙 MODO ESCURO
   ========================================================= */
body.dark-mode {
  background-color: #121212;
  color: #f1f1f1;
}

body.dark-mode .card,
body.dark-mode .wrap,
body.dark-mode .toolbar {
  background: #1e1e1e;
  color: #fff;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.05);
}

body.dark-mode input,
body.dark-mode select,
body.dark-mode textarea {
  background-color: #2b2b2b;
  color: #fff;
  border: 1px solid #444;
}

body.dark-mode button {
  background: linear-gradient(135deg, #0d6efd, #0a58ca);
  color: #fff;
  border: none;
}

body.dark-mode button:hover {
  background: linear-gradient(135deg, #2b7bff, #1556d1);
}

body.dark-mode table {
  background-color: #1f1f1f;
  border-collapse: collapse;
}

body.dark-mode th {
  background-color: #0d47a1;
  color: #fff;
}

body.dark-mode td {
  background-color: #262626;
  color: #ddd;
}

body.dark-mode .theme-toggle {
  background: #333;
  color: #ffd700;
}

body.dark-mode .font-list {
  background: #2b2b2b;
  color: #f1f1f1;
  border: 1px solid #444;
  box-shadow: 0 6px 18px rgba(255, 255, 255, 0.1);
}

body.dark-mode .font-list div {
  color: #f1f1f1;
}

body.dark-mode .font-list div:hover {
  background: #3a3a3a;
  color: #ffffff;
}

body.dark-mode .grafico-card,
body.dark-mode .filtros-graficos {
  background: #2b2b2b;
  color: #f1f1f1;
}

body.dark-mode .notification {
  background: #2b2b2b;
  color: #f1f1f1;
}

/* =========================================================
   👑 ÁREA DO ADMINISTRADOR
   ========================================================= */
#admin-button-area {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

#admin-button-area.hidden {
  display: none !important;
}

#btn-admin-access {
  background: linear-gradient(90deg, #f7d067, #f5c542);
  color: #333;
  font-weight: 700;
  border: 2px solid #ffeb3b;
  border-radius: 12px;
  padding: 8px 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(245, 197, 66, 0.4);
}

#btn-admin-access:hover {
  transform: scale(1.05);
}

.admin-icon-btn .icon {
  margin-right: 6px;
  font-size: 1.2em;
}

/* =========================================================
   👤 ÁREA DE USUÁRIO NO TOPO
   ========================================================= */
#user-top-area {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0;
  margin-top: -45px;
  position: relative;
  z-index: 10;
}

#user-top-area.hidden {
  display: none !important;
}

#user-top-area:not(.hidden) {
  display: flex !important;
}

#admin-button-area:not(.hidden) {
  display: block !important;
}

.user-info-top {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(90deg, #f0f6ff, #e6f0ff);
  padding: 8px 16px;
  border-radius: 12px;
  border: 2px solid var(--cor-primaria);
  box-shadow: 0 3px 10px rgba(11, 79, 153, 0.15);
}

.user-info-top .small {
  font-weight: 600;
  color: var(--cor-primaria);
  font-size: 14px;
}

#user-email-top {
  padding-left: 10px;
  border-left: 2px solid var(--cor-primaria);
}

#admin-aprovacao {
  padding: 20px 0;
  text-align: center;
}

.usuarios-pendentes {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.usuario-item {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.user-info {
  text-align: left;
}

.user-info strong {
  display: block;
  font-size: 1.1em;
  color: #333;
  margin-bottom: 4px;
}

.user-info span {
  color: #777;
  font-size: 0.9em;
}

.user-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.btn-aceitar-user {
  background: linear-gradient(90deg, #28a745, #20c997) !important;
  color: white !important;
  font-weight: 600;
  border: none;
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(40, 167, 69, 0.2);
}

.btn-aceitar-user:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
  background: linear-gradient(90deg, #218838, #1aa179) !important;
}

.btn-aceitar-admin {
  background: linear-gradient(90deg, #f7d067, #f5c542) !important;
  color: #333 !important;
  font-weight: 700;
  border: 2px solid #ffeb3b;
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(245, 197, 66, 0.2);
}

.btn-aceitar-admin:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.5);
  background: linear-gradient(90deg, #f9e08c, #f7d067) !important;
}

.btn-recusar {
  background: linear-gradient(90deg, #dc3545, #c82333) !important;
  color: white !important;
  font-weight: 600;
  border: none;
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(220, 53, 69, 0.2);
}

.btn-recusar:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
  background: linear-gradient(90deg, #c82333, #bd2130) !important;
}

/* =========================================================
   🎨 SELETOR DE PALETAS
   ========================================================= */
.palette-menu {
  position: relative;
  display: inline-block;
  z-index: 100;
}

.palette-button {
  background: linear-gradient(90deg, #0b4f99, #2176ff);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s ease;
}

.palette-button:hover {
  opacity: 0.9;
  box-shadow: 0 4px 12px rgba(11, 79, 153, 0.4);
}

.palette-panel {
  position: absolute;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  top: 50px;
  left: 0;
  width: 320px;
  max-height: 450px;
  overflow-y: auto;
  z-index: 1000;
  padding: 15px;
  display: block;
  opacity: 1;
  visibility: visible;
  transition: opacity 0.25s ease, visibility 0.25s ease;
}

.palette-panel.hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.palette-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.palette-item {
  border-radius: 10px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 3px solid transparent;
  text-align: center;
  position: relative;
}

.palette-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.palette-item.ativa {
  border-color: #28a745;
  box-shadow: 0 0 0 2px #28a745;
}

.palette-item.ativa::after {
  content: "✓";
  position: absolute;
  top: 5px;
  right: 5px;
  background: #28a745;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
}

.palette-name {
  font-weight: 600;
  font-size: 13px;
  margin-top: 8px;
}

.palette-preview {
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-top: 6px;
}

.palette-color {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,0.1);
}

body.dark-mode .palette-panel {
  background: #2b2b2b;
  color: #f1f1f1;
  border: 1px solid #444;
}

body.dark-mode .palette-item {
  background: #3a3a3a;
}

body.dark-mode .palette-item:hover {
  background: #4a4a4a;
}

body.dark-mode .palette-name {
  color: #f1f1f1;
}

/* =========================================================
   APLICAÇÃO DAS PALETAS
   ========================================================= */
body[data-paleta="azul-padrao"] {
  --cor-primaria: #0b4f99;
  --cor-secundaria: #2176ff;
  --cor-destaque: #0a4180;
}

body[data-paleta="roxo-mistico"] {
  --cor-primaria: #6a1b9a;
  --cor-secundaria: #9c27b0;
  --cor-destaque: #4a148c;
}

body[data-paleta="verde-natureza"] {
  --cor-primaria: #2e7d32;
  --cor-secundaria: #4caf50;
  --cor-destaque: #1b5e20;
}

body[data-paleta="laranja-vibrante"] {
  --cor-primaria: #e65100;
  --cor-secundaria: #ff6f00;
  --cor-destaque: #bf360c;
}

body[data-paleta="vermelho-intenso"] {
  --cor-primaria: #c62828;
  --cor-secundaria: #e53935;
  --cor-destaque: #b71c1c;
}

body[data-paleta="rosa-suave"] {
  --cor-primaria: #c2185b;
  --cor-secundaria: #e91e63;
  --cor-destaque: #ad1457;
}

body[data-paleta="marrom-classico"] {
  --cor-primaria: #5d4037;
  --cor-secundaria: #795548;
  --cor-destaque: #3e2723;
}

body[data-paleta="ciano-oceano"] {
  --cor-primaria: #00838f;
  --cor-secundaria: #00acc1;
  --cor-destaque: #006064;
}

body[data-paleta="indigo-profundo"] {
  --cor-primaria: #283593;
  --cor-secundaria: #3f51b5;
  --cor-destaque: #1a237e;
}

body[data-paleta="turquesa-tropical"] {
  --cor-primaria: #00796b;
  --cor-secundaria: #009688;
  --cor-destaque: #004d40;
}

body[data-paleta="ambar-dourado"] {
  --cor-primaria: #f57c00;
  --cor-secundaria: #ffa726;
  --cor-destaque: #e65100;
}

body[data-paleta="limao-eletrico"] {
  --cor-primaria: #827717;
  --cor-secundaria: #cddc39;
  --cor-destaque: #f57f17;
}

.btn.primary,
#salvarBtn,
#salvarAnotacao,
#btnFiltrar,
.theme-toggle,
.font-button,
.palette-button {
  background: linear-gradient(90deg, var(--cor-primaria), var(--cor-secundaria)) !important;
}

.btn.primary:hover,
#salvarBtn:hover,
#salvarAnotacao:hover,
#btnFiltrar:hover {
  background: linear-gradient(90deg, var(--cor-secundaria), var(--cor-destaque)) !important;
}

thead {
  background: var(--cor-primaria) !important;
}

a, #switch-link {
  color: var(--cor-primaria) !important;
}

/* =========================================================
   📧 ÁREA DE EMAIL E HORÁRIO
   ========================================================= */
#user-info-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  padding: 15px 0;
}

#user-info-center.hidden {
  display: none !important;
}

.user-email-display {
  font-size: 18px;
  font-weight: 600;
  color: var(--cor-primaria);
  padding: 8px 20px;
  background: linear-gradient(90deg, #f0f6ff, #e6f0ff);
  border-radius: 10px;
  border: 2px solid var(--cor-secundaria);
  box-shadow: 0 3px 10px rgba(11, 79, 153, 0.15);
}

.user-time-display {
  font-size: 20px;
  font-weight: 700;
  color: var(--cor-secundaria);
  padding: 6px 18px;
  background: linear-gradient(90deg, #e6f0ff, #d6e9ff);
  border-radius: 8px;
  border: 2px solid var(--cor-primaria);
  box-shadow: 0 2px 8px rgba(33, 118, 255, 0.2);
  font-variant-numeric: tabular-nums;
  letter-spacing: 1px;
}

.admin-btn {
  background: linear-gradient(90deg, #f7d067, #f5c542) !important;
  color: #333 !important;
  font-weight: 700 !important;
  border: 2px solid #ffeb3b !important;
  box-shadow: 0 4px 10px rgba(245, 197, 66, 0.4);
}

.admin-btn:hover {
  transform: scale(1.05);
  background: linear-gradient(90deg, #f9e08c, #f7d067) !important;
}

.admin-btn .icon {
  margin-right: 6px;
  font-size: 1.2em;
}

.admin-btn.hidden {
  display: none !important;
}

body.dark-mode .user-email-display,
body.dark-mode .user-time-display {
  background: linear-gradient(90deg, #2b2b2b, #3a3a3a);
  border-color: #555;
  color: #f1f1f1;
}

body.dark-mode .admin-btn {
  background: linear-gradient(90deg, #f9e08c, #f7d067) !important;
  border-color: #f5c542 !important;
}

#btn-admin-access {
  display: inline-block !important;
}

#btn-admin-access.hidden {
  display: none !important;
}

.admin-btn:not(.hidden) {
  display: inline-block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

#presenca-area {
  display: none !important;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

#presenca-area:not(.hidden) {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
}

#presenca-area.hidden,
#presenca-area.hidden * {
  pointer-events: none !important;
}

#presenca-area:not(.hidden) * {
  pointer-events: auto;
}

body #presenca-area.hidden .toolbar,
body #presenca-area.hidden #user-info-center,
body #presenca-area.hidden .presenca-main,
body #presenca-area.hidden section {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
}

#auth-area {
  display: block;
}

#auth-area.hidden {
  display: none !important;
}

#btnLimpar { 
  display: none !important; 
}

/* Ajustes responsivos adicionais */
@media (max-width: 768px) {
  .filtro-grupo input,
  .filtro-grupo select {
    font-size: 14px;
  }
  
  #user-info-center {
    padding: 10px 0;
  }
  
  .user-email-display,
  .user-time-display {
    font-size: 16px;
    padding: 6px 15px;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .stat-icon {
    font-size: 36px;
  }
  
  .stat-info h3 {
    font-size: 28px;
  }
}

/* Ajustes para impressão */
@media print {
  .toolbar,
  .export-buttons,
  .filtros-avancados,
  footer,
  .btn {
    display: none !important;
  }
  
  .card {
    box-shadow: none;
    padding: 20px;
  }
  
  table {
    page-break-inside: avoid;
  }
}

/* Animações suaves */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.pagina.ativa {
  animation: slideInRight 0.3s ease-out;
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: var(--cor-secundaria);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--cor-primaria);
}

body.dark-mode ::-webkit-scrollbar-track {
  background: #2b2b2b;
}

body.dark-mode ::-webkit-scrollbar-thumb {
  background: #555;
}

body.dark-mode ::-webkit-scrollbar-thumb:hover {
  background: #777;
}

/* Loading spinner (caso necessário) */
.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Tooltips simples */
[data-tooltip] {
  position: relative;
  cursor: help;
}

[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-5px);
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 1000;
}

[data-tooltip]:hover::after {
  opacity: 1;
}

/* Melhorias de acessibilidade */
.btn:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid var(--cor-secundaria);
  outline-offset: 2px;
}

/* Estados de carregamento */
.btn.loading {
  opacity: 0.7;
  cursor: not-allowed;
  pointer-events: none;
}

/* Indicador visual de campo obrigatório */
input:required,
select:required {
  border-left: 3px solid #ffc107;
}

input:required:valid {
  border-left-color: #28a745;
}

input:required:invalid:not(:placeholder-shown) {
  border-left-color: #dc3545;
}

/* Seleção de texto personalizada */
::selection {
  background-color: var(--cor-secundaria);
  color: white;
}

::-moz-selection {
  background-color: var(--cor-secundaria);
  color: white;
}

/* Transições suaves globais */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

button, input, select, textarea {
  transition: all 0.3s ease;
}



/* Fim do CSS */
