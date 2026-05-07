// ========== VOICE ASSISTANT ==========
// Register Chart.js plugins
if (typeof Chart !== 'undefined' && typeof ChartDataLabels !== 'undefined') {
  Chart.register(ChartDataLabels);
}

let voiceActive = false;
let recognition = null;

function toggleVoice() {
  const modal = document.getElementById('voiceModal');
  const btn = document.getElementById('voiceBtn');
  
  if (!voiceActive) {
    modal.classList.add('active');
    btn.classList.add('listening');
    startVoiceRecognition();
  } else {
    modal.classList.remove('active');
    btn.classList.remove('listening');
    stopVoiceRecognition();
  }
  voiceActive = !voiceActive;
}

function startVoiceRecognition() {
  const statusEl = document.getElementById('voiceStatus');
  const waveEl = document.getElementById('voiceWave');
  const transcriptEl = document.getElementById('voiceTranscript');
  
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onstart = function() {
      statusEl.textContent = 'Escuchando...';
      waveEl.style.display = 'inline-flex';
    };
    
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      transcriptEl.textContent = transcript;
      
      // Process voice commands
      processVoiceCommand(transcript.toLowerCase());
    };
    
    recognition.onerror = (event) => {
      statusEl.textContent = 'Error: ' + event.error;
      console.error('Voice error:', event.error);
    };
    
    recognition.onend = () => {
      if (voiceActive) {
        recognition.start();
      }
    };
    
    recognition.start();
  } else {
    statusEl.textContent = 'Tu navegador no soporta reconocimiento de voz';
    transcriptEl.textContent = 'Prueba con Chrome o Edge';
  }
}

function stopVoiceRecognition() {
  const statusEl = document.getElementById('voiceStatus');
  const waveEl = document.getElementById('voiceWave');
  
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
  statusEl.textContent = 'Listo para escuchar';
  waveEl.style.display = 'none';
}

function processVoiceCommand(command) {
  if (command.includes('abrir dashboard') || command.includes('mostrar ejecutivo')) {
    showSection('executive');
    speak('Abriendo dashboard ejecutivo');
  } else if (command.includes('abrir clientes') || command.includes('mostrar crm')) {
    showSection('crm');
    speak('Abriendo CRM de clientes');
  } else if (command.includes('abrir campañas')) {
    showSection('campaigns');
    speak('Abriendo panel de campañas');
  } else if (command.includes('abrir ventas') || command.includes('mostrar pipeline')) {
    showSection('sales');
    speak('Abriendo sales pipeline');
  } else if (command.includes('abrir finanzas')) {
    showSection('finance');
    speak('Abriendo módulo de finanzas');
  } else if (command.includes('abrir ia') || command.includes('mostrar agentes')) {
    showSection('ai');
    speak('Abriendo módulo de IA y automatizaciones');
  } else if (command.includes('abrir proyectos')) {
    showSection('projects');
    speak('Abriendo gestión de proyectos');
  } else if (command.includes('abrir redes') || command.includes('mostrar social') || command.includes('redes sociales')) {
    showSection('social');
    speak('Abriendo gestión de redes sociales');
  } else if (command.includes('abrir oportunidades') || command.includes('mostrar negocios')) {
    showSection('opportunities');
    speak('Abriendo oportunidades de negocio');
  } else if (command.includes('abrir mercado pago') || command.includes('mostrar pagos')) {
    showSection('mercadopago');
    speak('Abriendo Mercado Pago');
  } else if (command.includes('desplegar enjambre') || command.includes('activar agentes')) {
    deploySwarm();
    speak('Desplegando enjambre de agentes');
  } else if (command.includes('sincronizar mercado') || command.includes('actualizar pagos')) {
    syncMercadoPago();
    speak('Sincronizando Mercado Pago');
  } else if (command.includes('ayuda') || command.includes('qué puedes hacer')) {
    speak('Puedo navegar por el dashboard, mostrar módulos, desplegar enjambre de agentes y ayudarte con la gestión de la agencia');
  }
}

function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

// ========== NAVIGATION ==========
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.section === name));
  const section = document.getElementById('s-' + name);
  if (section) {
    section.classList.add('active');
  }
  
  // Initialize social chart when social section is shown
  if (name === 'social') {
    setTimeout(() => initSocialChart(), 100);
  }
  
  // Initialize opportunities chart
  if (name === 'opportunities') {
    setTimeout(() => initOpportunitiesChart(), 100);
  }
  
  // Initialize mercado pago charts
  if (name === 'mercadopago') {
    setTimeout(() => initMercadoPagoCharts(), 100);
  }

  // Initialize executive charts (revenue, funnel)
  if (name === 'executive') {
    setTimeout(() => {
      initRevenueChart();
      initFunnelChart();
    }, 100);
  }

  // Initialize campaigns chart
  if (name === 'campaigns') {
    setTimeout(() => initCampaignsChart(), 100);
  }

  // Initialize finance chart
  if (name === 'finance') {
    setTimeout(() => initFinanceChart(), 100);
  }

  // Initialize projects section
  if (name === 'projects') {
    setTimeout(() => {
      loadProjectData();
      console.log('Projects section shown, loading updated data...');
    }, 100);
  }
  
  // Update page title
  const titles = {
    'executive': 'Dashboard Ejecutivo',
    'crm': 'CRM / Clientes',
    'campaigns': 'Panel de Campañas',
    'sales': 'Sales Pipeline',
    'social': 'Redes Sociales - Integración Total',
    'opportunities': 'Oportunidades de Negocio',
    'mercadopago': 'Mercado Pago - Integración Completa',
    'operations': 'Operaciones Internas',
    'finance': 'Finanzas',
    'ai': 'IA + Automatizaciones',
    'reports': 'Reportes',
    'projects': 'Proyectos',
    'agents': 'Agentes',
    'resources': 'Recursos',
    'repos': 'Repos Clonados',
    'settings': 'Configuración'
  };
  document.title = 'Agencia 360 - ' + (titles[name] || 'Dashboard Premium');

  // Save last section to preferences
  try {
    const preferences = JSON.parse(localStorage.getItem('dashboardPreferences') || '{}');
    preferences.lastSection = name;
    localStorage.setItem('dashboardPreferences', JSON.stringify(preferences));
  } catch (e) {
    console.error('Error saving last section:', e);
  }
}

// ========== GLOBAL SEARCH ==========
function globalSearch(value) {
  if (!value) return;
  console.log('Buscando:', value);
}

// ========== TASK MANAGEMENT ==========
function toggleTask(checkbox) {
  const label = checkbox.nextElementSibling;
  if (checkbox.checked) {
    label.style.textDecoration = 'line-through';
    label.style.color = 'var(--text-muted)';
  } else {
    label.style.textDecoration = 'none';
    label.style.color = 'var(--text-primary)';
  }
  updateTodoCount();
}

function updateTodoCount() {
  const checkboxes = document.querySelectorAll('#todoListExecutive input[type="checkbox"]');
  const checked = Array.from(checkboxes).filter(c => c.checked).length;
  const total = checkboxes.length;
  document.getElementById('todoCount').textContent = (total - checked) + ' tareas pendientes';
}

// CHARTS COMMENTED OUT FOR DEBUGGING
// Will restore after menu works CONTROLS ==========
function deploySwarm(btn) {
  if (!btn) btn = document.querySelector('[onclick*="deploySwarm"]');
  btn.textContent = '🚀 Desplegando...';
  btn.disabled = true;
  
  setTimeout(() => {
    btn.textContent = '✅ Enjambre Activo';
    btn.style.background = 'var(--accent-green)';
    btn.disabled = false;
    alert('Enjambre de 192 agentes desplegado exitosamente.\n147 agentes activos | 32 en espera | 13 errores');
  }, 2000);
}

function monitorSwarm() {
  const stats = {
    active: 147,
    waiting: 32,
    errors: 13,
    tasksCompleted: 2847,
    efficiency: '76%'
  };
  
  const message = `Estado del Enjambre:
  
• Agentes Activos: ${stats.active}/192
• En Espera: ${stats.waiting}
• Con Errores: ${stats.errors}
• Tareas Completadas Hoy: ${stats.tasksCompleted}
• Eficiencia: ${stats.efficiency}
  
• Redes Sociales Cubiertas: 6 (FB, IG, TT, YT, LI, X)
• Automatizaciones Activas: 89%`;
  
  alert(message);
}

// ========== UTILITY FUNCTIONS ==========
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Copiado al portapapeles!');
  });
}

function exportData() {
  alert('Exportando datos...\n\nEsta función exportará:\n- Dashboard Ejecutivo\n- CRM Clientes\n- Campañas\n- Finanzas\n\nEn formato PDF/Excel');
}

function filterProjects(value) {
  const rows = document.querySelectorAll('#projects-tbody tr');
  const lowerValue = value.toLowerCase();
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    if (text.includes(lowerValue)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
  
  // Update count
  const visibleRows = document.querySelectorAll('#projects-tbody tr:not([style*="display: none"])').length;
  const totalRows = rows.length;
  const headerEl = document.querySelector('#s-projects .chart-title');
  if (headerEl) {
    headerEl.textContent = `📁 Detalle de Proyectos (${visibleRows} de ${totalRows})`;
  }
}

function connectMercadoPago() {
  alert('🔗 Conectando con Mercado Pago API...\n\nPor favor, autoriza la aplicación en la ventana emergente.\n\nClient ID: APP_USR-1234567890\nRedirect URI: http://localhost:3000/mercadopago/callback');
}

function syncMercadoPago(btn) {
  if (!btn) btn = document.querySelector('[onclick*="syncMercadoPago"]');
  btn.textContent = '🔄 Sincronizando...';
  btn.disabled = true;
  
  setTimeout(() => {
    btn.textContent = '✅ Sincronizado';
    btn.disabled = false;
    alert('✅ Sincronización completa!\n\n• 156 transacciones nuevas\n• Balance actualizado: $48,750\n• Última sync: ' + new Date().toLocaleString('es-ES'));
  }, 2000);
}

function refreshOpportunities() {
  alert('🔄 Actualizando oportunidades...\n\n• 3 nuevas oportunidades detectadas\n• Valor total: $284K\n• 2 oportunidades requieren atención inmediata');
}

// ========== INIT ==========
// Set current date
document.getElementById('currentDate').textContent = new Date().toLocaleDateString('es-ES', { 
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
});

// Initialize todo count
updateTodoCount();

// Load saved preferences
try {
  const preferences = JSON.parse(localStorage.getItem('dashboardPreferences') || '{}');
  
  // Restore last section if available
  if (preferences.lastSection) {
    console.log('Restoring last section:', preferences.lastSection);
    // Don't auto-navigate, just log it
  }
  
  // Apply UI preferences
  if (preferences.uiPreferences) {
    applyUIPreferences(preferences.uiPreferences);
  }
  
  console.log('Preferences loaded:', Object.keys(preferences));
} catch (e) {
  console.error('Error loading preferences:', e);
}

// Initialize project view buttons
setTimeout(() => {
  initProjectViewButtons();
}, 500);

// Update dashboard from memory
setTimeout(() => {
  updateDashboardFromMemory();
}, 1000);

// Welcome message
setTimeout(() => {
  speak('Bienvenido a Agencia 360 Dashboard Premium v3.0. Todos los módulos están integrados. ¿En qué puedo ayudarte?');
}, 1000);
