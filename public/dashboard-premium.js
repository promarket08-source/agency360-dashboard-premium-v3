// ========== VOICE ASSISTANT ==========
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

// ========== CHARTS ==========
// Revenue Chart
const revCtx = document.getElementById('revenueChart')?.getContext('2d');
if (revCtx) {
  new Chart(revCtx, {
    type: 'line',
    data: {
      labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
      datasets: [{
        label: 'Ingresos 2026',
        data: [45000, 52000, 58000, 62000, 71000, 68500, 73000, 78000, 82000, 79000, 84250, 84250],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      }, {
        label: 'Meta',
        data: [50000, 55000, 60000, 65000, 70000, 75000, 75000, 75000, 75000, 75000, 75000, 75000],
        borderColor: '#f59e0b',
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#8b8b9a', font: { size: 11 } },
        datalabels: { display: false }
      },
      scales: {
        y: { 
          ticks: { color: '#5a5a6a', font: { size: 10 }, callback: v => '$' + (v/1000) + 'K' },
          grid: { color: 'rgba(42,42,58,0.5)' }
        },
        x: { ticks: { color: '#5a5a6a', font: { size: 10 } }, grid: { display: false } }
      }
    }
  });
}

// Funnel Chart
const funnelCtx = document.getElementById('funnelChart')?.getContext('2d');
if (funnelCtx) {
  new Chart(funnelCtx, {
    type: 'bar',
    data: {
      labels: ['Leads (32)', 'Discovery (18)', 'Proposal (12)', 'Negotiation (8)', 'Won (5)'],
      datasets: [{
        label: 'Cantidad',
        data: [32, 18, 12, 8, 5],
        backgroundColor: [
          'rgba(59,130,246,0.8)',
          'rgba(139,92,246,0.8)',
          'rgba(245,158,11,0.8)',
          'rgba(249,115,22,0.8)',
          'rgba(16,185,129,0.8)'
        ],
        borderRadius: 6,
        barPercentage: 0.6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        datalabels: {
          color: '#fff',
          font: { weight: 'bold', size: 12 },
          formatter: (value) => value
        }
      },
      scales: {
        x: { 
          ticks: { color: '#5a5a6a', font: { size: 10 } },
          grid: { color: 'rgba(42,42,58,0.5)' }
        },
        y: { ticks: { color: '#8b8b9a', font: { size: 11 } }, grid: { display: false } }
      }
    }
  });
}

// Campaigns Chart
const campCtx = document.getElementById('campaignsChart')?.getContext('2d');
if (campCtx) {
  new Chart(campCtx, {
    type: 'bar',
    data: {
      labels: ['Black Friday', 'Remate Calzados', 'Google Search', 'TikTok Launch'],
      datasets: [{
        label: 'ROAS',
        data: [6.8, 5.2, 3.1, 4.5],
        backgroundColor: 'rgba(59,130,246,0.8)',
        borderRadius: 6
      }, {
        label: 'Spend ($)',
        data: [8450, 6200, 4100, 3800],
        backgroundColor: 'rgba(245,158,11,0.6)',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#8b8b9a', font: { size: 11 } },
        datalabels: { display: false }
      },
      scales: {
        y: { 
          ticks: { color: '#5a5a6a', font: { size: 10 } },
          grid: { color: 'rgba(42,42,58,0.5)' }
        },
        x: { ticks: { color: '#5a5a6a', font: { size: 10 } }, grid: { display: false } }
      }
    }
  });
}

// Finance Chart
const finCtx = document.getElementById('financeChart')?.getContext('2d');
if (finCtx) {
  new Chart(finCtx, {
    type: 'line',
    data: {
      labels: ['Ene','Feb','Mar','Abr','May','Jun'],
      datasets: [{
        label: 'Ingresos',
        data: [45000, 52000, 58000, 62000, 71000, 84250],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.1)',
        fill: true,
        tension: 0.4
      }, {
        label: 'Gastos',
        data: [18000, 19500, 21000, 22000, 23500, 18200],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#8b8b9a', font: { size: 11 } },
        datalabels: { display: false }
      },
      scales: {
        y: { 
          ticks: { color: '#5a5a6a', font: { size: 10 }, callback: v => '$' + (v/1000) + 'K' },
          grid: { color: 'rgba(42,42,58,0.5)' }
        },
        x: { ticks: { color: '#5a5a6a', font: { size: 10 } }, grid: { display: false } }
      }
    }
  });
}

// ========== SOCIAL GROWTH CHART ==========
let socialChartInitialized = false;
function initSocialChart() {
  if (socialChartInitialized) return;
  const socialCtx = document.getElementById('socialGrowthChart');
  if (socialCtx) {
    new Chart(socialCtx.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'],
        datasets: [
          {
            label: 'Facebook',
            data: [10200, 10800, 11200, 11500, 12000, 12450],
            borderColor: '#1877F2',
            backgroundColor: 'rgba(24,119,242,0.1)',
            tension: 0.4
          },
          {
            label: 'Instagram',
            data: [12400, 13800, 15200, 16500, 17500, 18920],
            borderColor: '#E4405F',
            backgroundColor: 'rgba(228,64,95,0.1)',
            tension: 0.4
          },
          {
            label: 'TikTok',
            data: [3200, 4500, 5800, 6500, 7200, 8750],
            borderColor: '#000000',
            backgroundColor: 'rgba(0,0,0,0.1)',
            tension: 0.4
          },
          {
            label: 'YouTube',
            data: [2100, 2400, 2700, 2900, 3100, 3240],
            borderColor: '#FF0000',
            backgroundColor: 'rgba(255,0,0,0.1)',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#ededf5', font: { size: 11 } },
          datalabels: { display: false }
        },
        scales: {
          y: { ticks: { color: '#8b8b9a', font: { size: 10 } }, grid: { color: 'rgba(42,42,58,0.5)' } },
          x: { ticks: { color: '#8b8b9a', font: { size: 10 } }, grid: { display: false } }
        }
      }
    });
    socialChartInitialized = true;
  }
}

// ========== OPPORTUNITIES CHART ==========
let opportunitiesChartInitialized = false;
function initOpportunitiesChart() {
  if (opportunitiesChartInitialized) return;
  const ctx = document.getElementById('opportunitiesChart');
  if (ctx) {
    new Chart(ctx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'],
        datasets: [{
          label: 'Oportunidades Detectadas',
          data: [8, 12, 15, 18, 22, 28],
          backgroundColor: 'rgba(245,158,11,0.8)',
          borderRadius: 6
        }, {
          label: 'Convertidas',
          data: [3, 5, 7, 9, 12, 15],
          backgroundColor: 'rgba(16,185,129,0.8)',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#8b8b9a', font: { size: 11 } },
          datalabels: { display: false }
        },
        scales: {
          y: { ticks: { color: '#5a5a6a', font: { size: 10 } }, grid: { color: 'rgba(42,42,58,0.5)' } },
          x: { ticks: { color: '#5a5a6a', font: { size: 10 } }, grid: { display: false } }
        }
      }
    });
    opportunitiesChartInitialized = true;
  }
}

// ========== MERCADO PAGO CHARTS ==========
let mercadoPagoChartInitialized = false;
function initMercadoPagoCharts() {
  if (mercadoPagoChartInitialized) return;  
  
  // Ingresos vs Egresos
  const mpCtx = document.getElementById('mercadoPagoChart');
  if (mpCtx) {
    new Chart(mpCtx.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
        datasets: [{
          label: 'Ingresos',
          data: [45000, 52000, 58000, 62000, 84250],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.1)',
          fill: true,
          tension: 0.4
        }, {
          label: 'Egresos',
          data: [12000, 13500, 14200, 15800, 18200],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#8b8b9a', font: { size: 11 } },
          datalabels: { display: false }
        },
        scales: {
          y: { ticks: { color: '#5a5a6a', font: { size: 10 }, callback: v => '$' + (v/1000) + 'K' }, grid: { color: 'rgba(42,42,58,0.5)' } },
          x: { ticks: { color: '#5a5a6a', font: { size: 10 } }, grid: { display: false } }
        }
      }
    });
  }
  
  // Payment Methods
  const pmCtx = document.getElementById('paymentMethodsChart');
  if (pmCtx) {
    new Chart(pmCtx.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Tarjeta Crédito', 'Débito', 'Transferencia', 'Mercado Crédito', 'Otros'],
        datasets: [{
          data: [45, 28, 15, 8, 4],
          backgroundColor: [
            'rgba(59,130,246,0.8)',
            'rgba(16,185,129,0.8)',
            'rgba(245,158,11,0.8)',
            'rgba(139,92,246,0.8)',
            'rgba(156,163,175,0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#8b8b9a', font: { size: 11 } },
          datalabels: {
            color: '#fff',
            font: { weight: 'bold', size: 12 },
            formatter: (value) => value + '%'
          }
        }
      }
    });
  }
  
  mercadoPagoChartInitialized = true;
}

// ========== SWARM CONTROLS ==========
function deploySwarm() {
  const btn = event.target;
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

function syncMercadoPago() {
  const btn = event.target;
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

// Welcome message
setTimeout(() => {
  speak('Bienvenido a Agencia 360 Dashboard Premium v3.0. Todos los módulos están integrados. ¿En qué puedo ayudarte?');
}, 1000);
