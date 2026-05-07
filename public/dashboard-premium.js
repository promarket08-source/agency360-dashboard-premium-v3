// ========== DASHBOARD PREMIUM v3.0 - COMPLETE VERSION ==========

// ========== MOBILE MENU ==========
function toggleMenu() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  
  if (sidebar && overlay) {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
  }
}

// Add event listeners to nav items to close menu on mobile
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      toggleMenu();
    }
  });
});

// ========== CONFIGURATION ==========
const CONFIG = {
  voiceEnabled: true,
  chartsEnabled: true,
  autoUpdateEnabled: true,
  theme: 'dark',
  modules: {
    executive: { enabled: true, label: 'Dashboard Ejecutivo' },
    crm: { enabled: true, label: 'CRM / Clientes' },
    campaigns: { enabled: true, label: 'Panel de Campañas' },
    sales: { enabled: true, label: 'Sales Pipeline' },
    social: { enabled: true, label: 'Redes Sociales' },
    opportunities: { enabled: true, label: 'Oportunidades' },
    mercadopago: { enabled: true, label: 'Mercado Pago' },
    operations: { enabled: true, label: 'Operaciones Internas' },
    finance: { enabled: true, label: 'Finanzas' },
    ai: { enabled: true, label: 'IA + Automatizaciones' },
    reports: { enabled: true, label: 'Reportes' },
    projects: { enabled: true, label: 'Proyectos' },
    agents: { enabled: true, label: 'Agentes' },
    resources: { enabled: true, label: 'Recursos' },
    repos: { enabled: true, label: 'Repos Clonados' },
    pages: { enabled: true, label: 'Mis Páginas' },
    settings: { enabled: true, label: 'Configuración' }
  }
};

// ========== VOICE ASSISTANT ==========
let voiceActive = false;
let recognition = null;

function toggleVoice() {
  if (!CONFIG.voiceEnabled) {
    alert('El asistente de voz está desactivado. Actívalo en Configuración.');
    return;
  }
  
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
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

// ========== NAVIGATION ==========
function showSection(name) {
  console.log('Showing section:', name);
  
  // Check if module is enabled
  if (CONFIG.modules[name] && !CONFIG.modules[name].enabled) {
    alert(`El módulo "${CONFIG.modules[name].label}" está desactivado. Actívalo en Configuración.`);
    return;
  }
  
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  
  // Update nav items
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.section === name);
  });
  
  // Show selected section
  const section = document.getElementById('s-' + name);
  if (section) {
    section.classList.add('active');
    console.log('Section found and activated:', name);
  }
  
  // Initialize charts for specific sections (lazy loading)
  if (name === 'social' && CONFIG.chartsEnabled) {
    setTimeout(() => initSocialChart(), 200);
  }
  
  if (name === 'opportunities' && CONFIG.chartsEnabled) {
    setTimeout(() => initOpportunitiesChart(), 200);
  }
  
  if (name === 'mercadopago' && CONFIG.chartsEnabled) {
    setTimeout(() => initMercadoPagoCharts(), 200);
  }
  
  if (name === 'executive' && CONFIG.chartsEnabled) {
    setTimeout(() => {
      initRevenueChart();
      initFunnelChart();
    }, 200);
  }
  
  if (name === 'campaigns' && CONFIG.chartsEnabled) {
    setTimeout(() => initCampaignsChart(), 200);
  }
  
  if (name === 'finance' && CONFIG.chartsEnabled) {
    setTimeout(() => initFinanceChart(), 200);
  }
  
  if (name === 'projects') {
    setTimeout(() => loadProjectData(), 200);
  }
  
  if (name === 'pages') {
    setTimeout(() => loadPagesData(), 200);
  }
  
  if (name === 'settings') {
    setTimeout(() => loadSettingsUI(), 200);
  }
  
  // Save last section
  try {
    const preferences = JSON.parse(localStorage.getItem('dashboardPreferences') || '{}');
    preferences.lastSection = name;
    localStorage.setItem('dashboardPreferences', JSON.stringify(preferences));
  } catch (e) {
    console.error('Error saving section:', e);
  }
}

// ========== GLOBAL SEARCH ==========
function globalSearch(value) {
  if (!value) return;
  console.log('Searching:', value);
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
  const countEl = document.getElementById('todoCount');
  if (countEl) {
    countEl.textContent = (total - checked) + ' tareas pendientes';
  }
}

// ========== CHARTS (LAZY LOADING) ==========
// Revenue Chart
let revenueChartInitialized = false;
function initRevenueChart() {
  if (revenueChartInitialized || !CONFIG.chartsEnabled) return;
  try {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded');
      return;
    }
    new Chart(ctx.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
        datasets: [{
          label: 'Ingresos 2026',
          data: [45000, 52000, 58000, 62000, 71000, 68500, 73000, 78000, 82000, 79000, 84250, 84250],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.1)',
          fill: true,
          tension: 0.4
        }, {
          label: 'Meta',
          data: [50000, 55000, 60000, 65000, 70000, 75000, 75000, 75000, 75000, 75000, 75000, 75000],
          borderColor: '#f59e0b',
          borderDash: [5, 5],
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#8b8b9a' } } },
        scales: {
          y: { ticks: { color: '#5a5a6a', callback: v => '$' + (v/1000) + 'K' } },
          x: { ticks: { color: '#5a5a6a' } }
        }
      }
    });
    revenueChartInitialized = true;
    console.log('Revenue chart initialized');
  } catch (e) {
    console.error('Error revenue chart:', e);
  }
}

// Funnel Chart
let funnelChartInitialized = false;
function initFunnelChart() {
  if (funnelChartInitialized || !CONFIG.chartsEnabled) return;
  try {
    const ctx = document.getElementById('funnelChart');
    if (!ctx) return;
    if (typeof Chart === 'undefined') return;
    new Chart(ctx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Leads', 'Discovery', 'Proposal', 'Negotiation', 'Won'],
        datasets: [{
          data: [32, 18, 12, 8, 5],
          backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#f97316', '#10b981']
        }]
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: { legend: { display: false } }
      }
    });
    funnelChartInitialized = true;
    console.log('Funnel chart initialized');
  } catch (e) {
    console.error('Error funnel chart:', e);
  }
}

// Campaigns Chart
let campaignsChartInitialized = false;
function initCampaignsChart() {
  if (campaignsChartInitialized || !CONFIG.chartsEnabled) return;
  try {
    const ctx = document.getElementById('campaignsChart');
    if (!ctx) return;
    if (typeof Chart === 'undefined') return;
    new Chart(ctx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Black Friday', 'Remate Calzados', 'Google Search', 'TikTok Launch'],
        datasets: [{
          label: 'ROAS',
          data: [6.8, 5.2, 3.1, 4.5],
          backgroundColor: '#3b82f6'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#8b8b9a' } } }
      }
    });
    campaignsChartInitialized = true;
    console.log('Campaigns chart initialized');
  } catch (e) {
    console.error('Error campaigns chart:', e);
  }
}

// Finance Chart
let financeChartInitialized = false;
function initFinanceChart() {
  if (financeChartInitialized || !CONFIG.chartsEnabled) return;
  try {
    const ctx = document.getElementById('financeChart');
    if (!ctx) return;
    if (typeof Chart === 'undefined') return;
    new Chart(ctx.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Ene','Feb','Mar','Abr','May','Jun'],
        datasets: [{
          label: 'Ingresos',
          data: [45000, 52000, 58000, 62000, 71000, 84250],
          borderColor: '#10b981',
          fill: true
        }, {
          label: 'Gastos',
          data: [18000, 19500, 21000, 22000, 23500, 18200],
          borderColor: '#ef4444',
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#8b8b9a' } } }
      }
    });
    financeChartInitialized = true;
    console.log('Finance chart initialized');
  } catch (e) {
    console.error('Error finance chart:', e);
  }
}

// Social Chart
let socialChartInitialized = false;
function initSocialChart() {
  if (socialChartInitialized || !CONFIG.chartsEnabled) return;
  try {
    const ctx = document.getElementById('socialGrowthChart');
    if (!ctx) return;
    if (typeof Chart === 'undefined') return;
    new Chart(ctx.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'],
        datasets: [
          { label: 'Facebook', data: [10200, 10800, 11200, 11500, 12000, 12450], borderColor: '#1877F2', fill: true },
          { label: 'Instagram', data: [12400, 13800, 15200, 16500, 17500, 18920], borderColor: '#E4405F', fill: true },
          { label: 'TikTok', data: [3200, 4500, 5800, 6500, 7200, 8750], borderColor: '#000000', fill: true }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#8b8b9a' } } }
      }
    });
    socialChartInitialized = true;
    console.log('Social chart initialized');
  } catch (e) {
    console.error('Error social chart:', e);
  }
}

// Opportunities Chart
let opportunitiesChartInitialized = false;
function initOpportunitiesChart() {
  if (opportunitiesChartInitialized || !CONFIG.chartsEnabled) return;
  try {
    const ctx = document.getElementById('opportunitiesChart');
    if (!ctx) return;
    if (typeof Chart === 'undefined') return;
    new Chart(ctx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'],
        datasets: [{
          label: 'Detectadas',
          data: [8, 12, 15, 18, 22, 28],
          backgroundColor: '#f59e0b'
        }, {
          label: 'Convertidas',
          data: [3, 5, 7, 9, 12, 15],
          backgroundColor: '#10b981'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#8b8b9a' } } }
      }
    });
    opportunitiesChartInitialized = true;
    console.log('Opportunities chart initialized');
  } catch (e) {
    console.error('Error opportunities chart:', e);
  }
}

// Mercado Pago Charts
let mercadoPagoChartInitialized = false;
function initMercadoPagoCharts() {
  if (mercadoPagoChartInitialized || !CONFIG.chartsEnabled) return;
  try {
    const ctx1 = document.getElementById('mercadoPagoChart');
    if (ctx1 && typeof Chart !== 'undefined') {
      new Chart(ctx1.getContext('2d'), {
        type: 'line',
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
          datasets: [{
            label: 'Ingresos',
            data: [45000, 52000, 58000, 62000, 84250],
            borderColor: '#10b981',
            fill: true
          }, {
            label: 'Egresos',
            data: [12000, 13500, 14200, 15800, 18200],
            borderColor: '#ef4444',
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: '#8b8b9a' } } }
        }
      });
    }
    
    const ctx2 = document.getElementById('paymentMethodsChart');
    if (ctx2 && typeof Chart !== 'undefined') {
      new Chart(ctx2.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: ['Tarjeta', 'Débito', 'Transferencia', 'Crédito', 'Otros'],
          datasets: [{ data: [45, 28, 15, 8, 4], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#9ca3af'] }]
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: '#8b8b9a' } } }
        }
      });
    }
    
    mercadoPagoChartInitialized = true;
    console.log('Mercado Pago charts initialized');
  } catch (e) {
    console.error('Error Mercado Pago charts:', e);
  }
}

// ========== SWARM CONTROLS ==========
function deploySwarm(btn) {
  if (!btn) btn = document.querySelector('[onclick*="deploySwarm"]');
  if (!btn) return;
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
  alert('Estado del Enjambre:\n• Agentes Activos: 147/192\n• En Espera: 32\n• Con Errores: 13\n• Tareas Completadas Hoy: 2,847\n• Eficiencia: 76%');
}

// ========== UTILITY FUNCTIONS ==========
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Copiado al portapapeles!');
  }).catch(err => {
    console.error('Error copying:', err);
  });
}

function exportData() {
  try {
    // Collect all data
    const data = {
      executive: {
        revenue: 84250,
        target: 75000,
        clients: 23,
        churn: 2.1
      },
      crm: {
        totalClients: 23,
        active: 21,
        inactive: 2,
        newThisMonth: 3
      },
      campaigns: {
        totalSpend: 28450,
        roas: 4.2,
        conversions: 1247,
        ctr: 2.8
      },
      finance: {
        mrr: 312000,
        profitMargin: 33.8,
        burnRate: 18200,
        runway: 14
      },
      projects: {
        total: 31,
        byStage: { landing: 12, crm: 8, backend: 6, planning: 5 }
      },
      agents: {
        total: 192,
        active: 147,
        waiting: 32,
        errors: 13
      },
      exportDate: new Date().toISOString(),
      exportedBy: 'Agencia 360 Dashboard v3.0'
    };
    
    // Create JSON file
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
    jsonLink.click();
    
    // Create CSV file
    const csvContent = [
      ['Módulo', 'Métrica', 'Valor'],
      ['Executive', 'Revenue', data.executive.revenue],
      ['Executive', 'Target', data.executive.target],
      ['CRM', 'Total Clients', data.crm.totalClients],
      ['CRM', 'Active', data.crm.active],
      ['Campaigns', 'Spend', data.campaigns.totalSpend],
      ['Campaigns', 'ROAS', data.campaigns.roas],
      ['Finance', 'MRR', data.finance.mrr],
      ['Finance', 'Profit Margin', data.finance.profitMargin],
      ['Projects', 'Total', data.projects.total],
      ['Agents', 'Total', data.agents.total]
    ].map(row => row.join(',')).join('\n');
    
    const csvBlob = new Blob([csvContent], { type: 'text/csv' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const csvLink = document.createElement('a');
    csvLink.href = csvUrl;
    csvLink.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.csv`;
    csvLink.click();
    
    alert('✅ Datos exportados exitosamente!\n\nSe han descargado:\n• Archivo JSON con todos los datos\n• Archivo CSV para Excel\n\nRevisa tu carpeta de Descargas.');
  } catch (e) {
    console.error('Error exporting data:', e);
    alert('❌ Error al exportar datos: ' + e.message);
  }
}

function filterProjects(value) {
  const rows = document.querySelectorAll('#projects-tbody tr');
  const lowerValue = value.toLowerCase();
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(lowerValue) ? '' : 'none';
  });
  
  const visibleRows = document.querySelectorAll('#projects-tbody tr:not([style*="display: none"])').length;
  const totalRows = rows.length;
  const headerEl = document.querySelector('#s-projects .chart-title');
  if (headerEl) {
    headerEl.textContent = `📁 Detalle de Proyectos (${visibleRows} de ${totalRows})`;
  }
}

function connectMercadoPago() {
  alert('🔗 Conectando con Mercado Pago API...\n\nClient ID: APP_USR-1234567890\nRedirect URI: http://localhost:3000/mercadopago/callback');
}

function syncMercadoPago(btn) {
  if (!btn) btn = document.querySelector('[onclick*="syncMercadoPago"]');
  if (!btn) return;
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

function viewProject(name) {
  if (name) {
    updateProjectMemory(name, 'view', {
      source: 'crm_table',
      timestamp: new Date().toISOString()
    });
    alert(`📁 Proyecto: ${name}\n\nInteracción registrada. El sistema ha actualizado la memoria del proyecto.`);
  }
}

// ========== PROJECT MEMORY & AUTO-UPDATE SYSTEM ==========
function updateProjectMemory(projectName, interactionType, data) {
  try {
    const memories = JSON.parse(localStorage.getItem('projectMemories') || '{}');
    
    if (!memories[projectName]) {
      memories[projectName] = {
        views: 0,
        preferences: {},
        interactions: [],
        lastUpdate: null
      };
    }
    
    memories[projectName].views++;
    memories[projectName].lastUpdate = new Date().toISOString();
    memories[projectName].interactions.push({
      type: interactionType,
      timestamp: new Date().toISOString(),
      data: data || {}
    });
    
    if (memories[projectName].interactions.length > 50) {
      memories[projectName].interactions = memories[projectName].interactions.slice(-50);
    }
    
    localStorage.setItem('projectMemories', JSON.stringify(memories));
    console.log('Project memory updated:', projectName, memories[projectName]);
    
    if (CONFIG.autoUpdateEnabled) {
      updateDashboardPreferences(projectName, interactionType);
      autoUpdateProjectFile(projectName, interactionType, data);
    }
  } catch (e) {
    console.error('Error updating project memory:', e);
  }
}

function updateDashboardPreferences(projectName, interactionType) {
  try {
    const preferences = JSON.parse(localStorage.getItem('dashboardPreferences') || '{}');
    
    if (!preferences.frequentProjects) {
      preferences.frequentProjects = [];
    }
    
    const existing = preferences.frequentProjects.find(p => p.name === projectName);
    if (existing) {
      existing.count++;
      existing.lastAccess = new Date().toISOString();
    } else {
      preferences.frequentProjects.push({
        name: projectName,
        count: 1,
        lastAccess: new Date().toISOString()
      });
    }
    
    preferences.frequentProjects.sort((a, b) => b.count - a.count);
    preferences.frequentProjects = preferences.frequentProjects.slice(0, 10);
    
    localStorage.setItem('dashboardPreferences', JSON.stringify(preferences));
    console.log('Dashboard preferences updated:', preferences);
  } catch (e) {
    console.error('Error updating preferences:', e);
  }
}

function autoUpdateProjectFile(projectName, interactionType, data) {
  console.log(`Auto-updating project file for ${projectName}:`, {
    interactionType,
    timestamp: new Date().toISOString(),
    data: data
  });
  
  const projectRows = document.querySelectorAll('#projects-tbody tr');
  projectRows.forEach(row => {
    const projectCell = row.cells[0];
    if (projectCell && projectCell.textContent.includes(projectName)) {
      row.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
      setTimeout(() => {
        row.style.backgroundColor = '';
      }, 2000);
    }
  });
}

function loadProjectData() {
  try {
    const memories = JSON.parse(localStorage.getItem('projectMemories') || '{}');
    const preferences = JSON.parse(localStorage.getItem('dashboardPreferences') || '{}');
    
    console.log('Loading project data...', { memories, preferences });
    
    const projectRows = document.querySelectorAll('#projects-tbody tr');
    projectRows.forEach(row => {
      const projectCell = row.cells[0];
      if (projectCell) {
        const projectName = projectCell.textContent.trim().split('\n')[0].trim();
        if (projectName && memories[projectName]) {
          if (!row.querySelector('.view-count')) {
            const badge = document.createElement('span');
            badge.className = 'badge badge-blue view-count';
            badge.style.marginLeft = '8px';
            badge.textContent = `👁️ ${memories[projectName].views} vistas`;
            projectCell.appendChild(badge);
          } else {
            row.querySelector('.view-count').textContent = `👁️ ${memories[projectName].views} vistas`;
          }
        }
      }
    });
  } catch (e) {
    console.error('Error loading project data:', e);
  }
}

function updateDashboardFromMemory() {
  try {
    const preferences = JSON.parse(localStorage.getItem('dashboardPreferences') || '{}');
    if (preferences.uiPreferences) {
      applyUIPreferences(preferences.uiPreferences);
    }
    console.log('Dashboard updated from memory');
  } catch (e) {
    console.error('Error updating dashboard from memory:', e);
  }
}

function applyUIPreferences(uiPrefs) {
  if (uiPrefs.theme) {
    document.body.setAttribute('data-theme', uiPrefs.theme);
  }
  console.log('UI preferences applied:', uiPrefs);
}

// ========== LOAD PAGES SECTION ==========
function loadPagesData() {
  const vercelDeployments = [
    { name: 'agency-hub (Latest)', url: 'https://agency-hub-rho.vercel.app', status: 'Production' },
    { name: 'agency-hub v8', url: 'https://agency-8khxdc8qi-promarket08-9994s-projects.vercel.app', status: 'Ready' },
    { name: 'agency-hub v7', url: 'https://agency-r4v7bhupl-promarket08-9994s-projects.vercel.app', status: 'Ready' },
    { name: 'agency-hub v6', url: 'https://agency-q9jmlu76d-promarket08-9994s-projects.vercel.app', status: 'Ready' },
    { name: 'agency-hub v5', url: 'https://agency-lg8zeyb7t-promarket08-9994s-projects.vercel.app', status: 'Ready' },
    { name: 'agency-hub v4', url: 'https://agency-mjmvesa77-promarket08-9994s-projects.vercel.app', status: 'Ready' },
    { name: 'agency-hub v3', url: 'https://agency-f2ju96p2r-promarket08-9994s-projects.vercel.app', status: 'Ready' },
    { name: 'agency-hub v2', url: 'https://agency-imu7zu92a-promarket08-9994s-projects.vercel.app', status: 'Ready' },
    { name: 'agency-hub v1', url: 'https://agency-bund8th4v-promarket08-9994s-projects.vercel.app', status: 'Ready' }
  ];
  
  const githubRepos = [
    { name: 'agency360-dashboard-premium-v3', desc: 'Dashboard Premium v3.0 - Interactivo, 192 agentes', url: 'https://github.com/promarket08-source/agency360-dashboard-premium-v3' },
    { name: 'burbuja-oceana-landing', desc: 'Landing Burbuja x Oceana - Innovación hotelera', url: 'https://github.com/promarket08-source/burbuja-oceana-landing' },
    { name: 'clinica-dental-araucania', desc: 'Clínica Dental Araucanía', url: 'https://github.com/promarket08-source/clinica-dental-araucania' },
    { name: 'center-full-coleccion', desc: 'Center Full Colección', url: 'https://github.com/promarket08-source/center-full-coleccion' },
    { name: 'farmacia-molco', desc: 'Landing page Farmacia Molco', url: 'https://github.com/promarket08-source/farmacia-molco' },
    { name: 'landing-pages', desc: 'Landing pages collection', url: 'https://github.com/promarket08-source/landing-pages' },
    { name: 'claudia-core-v3', desc: 'Motor Central Claudia V3 - Google AI', url: 'https://github.com/promarket08-source/claudia-core-v3' },
    { name: 'ep360-tuwebpro', desc: 'Centro Control TuWebPro360 - Plantillas Premium', url: 'https://github.com/promarket08-source/ep360-tuwebpro' },
    { name: 'claudia-agente-v3', desc: 'Claudia Agente 3.0 - Bot Telegram IA', url: 'https://github.com/promarket08-source/claudia-agente-v3' },
    { name: 'cafe-huiti', desc: 'Sitio web Café Huití - Cafetería Villarrica', url: 'https://github.com/promarket08-source/cafe-huiti' },
    { name: 'tiempo-propiedades', desc: 'Tiempo Propiedades - Parcelas y Casas', url: 'https://github.com/promarket08-source/tiempo-propiedades' },
    { name: 'streamvault', desc: 'Plataforma streaming digital con MercadoPago', url: 'https://github.com/promarket08-source/streamvault' },
    { name: 'tuwebpro360-landing', desc: 'Landing Page Premium TuWebPro360', url: 'https://github.com/promarket08-source/tuwebpro360-landing' },
    { name: 'tuwebpro360-webapp', desc: 'TuWebPro360 WebApp - Sistema ventas', url: 'https://github.com/promarket08-source/tuwebpro360-webapp' },
    { name: 'web-calistenia', desc: 'Web Calistenia', url: 'https://github.com/promarket08-source/web-calistenia' },
    { name: 'webpro360-replica', desc: 'Réplica idéntica WEB PRO 360', url: 'https://github.com/promarket08-source/webpro360-replica' },
    { name: 'EP360', desc: 'Sistema Gestión 360 Agencia Marketing', url: 'https://github.com/promarket08-source/EP360' },
    { name: 'transporte-jorcano', desc: 'Transporte Jorcano', url: 'https://github.com/promarket08-source/transporte-jorcano' }
  ];
  
  const vercelContainer = document.getElementById('vercel-deployments');
  if (vercelContainer) {
    vercelContainer.innerHTML = vercelDeployments.map(d => `
      <div class="card" style="padding:12px;font-size:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <strong style="color:var(--text-primary)">${d.name}</strong>
          <span class="badge ${d.status === 'Production' ? 'badge-green' : 'badge-blue'}" style="font-size:10px">${d.status}</span>
        </div>
        <a href="${d.url}" target="_blank" style="color:var(--accent-blue);text-decoration:none;font-size:11px">${d.url.replace('https://', '')}</a>
      </div>
    `).join('');
  }
  
  const githubContainer = document.getElementById('github-repos');
  if (githubContainer) {
    githubContainer.innerHTML = githubRepos.map(r => `
      <div class="card" style="padding:12px;font-size:12px">
        <div style="margin-bottom:8px">
          <strong style="color:var(--text-primary)">${r.name}</strong>
        </div>
        <div style="color:var(--text-secondary);font-size:11px;margin-bottom:8px">${r.desc}</div>
        <a href="${r.url}" target="_blank" style="color:var(--accent-blue);text-decoration:none;font-size:11px">Ver Repositorio →</a>
      </div>
    `).join('');
  }
  
  const quickAccessContainer = document.getElementById('quick-access');
  if (quickAccessContainer) {
    const quickLinks = [
      { name: 'Dashboard Premium', url: 'https://agency-hub-rho.vercel.app/dashboard-premium.html', icon: '📊' },
      { name: 'Burbuja Landing', url: 'https://burbuja-oceana-landing.vercel.app', icon: '🏨' },
      { name: 'Clínica Dental', url: 'https://clinica-dental-araucania.vercel.app', icon: '🦷' },
      { name: 'EP360 Sistema', url: 'https://ep360-tuwebpro.vercel.app', icon: '🚀' },
      { name: 'TuWebPro360', url: 'https://tuwebpro360-landing.vercel.app', icon: '🌐' },
      { name: 'StreamVault', url: 'https://streamvault.vercel.app', icon: '🎬' },
      { name: 'GitHub (todos)', url: 'https://github.com/promarket08-source?tab=repositories', icon: '🐙' },
      { name: 'Vercel Dashboard', url: 'https://vercel.com/promarket08-9994s-projects', icon: '⚙️' }
    ];
    
    quickAccessContainer.innerHTML = quickLinks.map(link => `
      <a href="${link.url}" target="_blank" style="padding:8px;background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.3);border-radius:6px;color:var(--accent-blue);text-decoration:none;font-size:11px;text-align:center">
        ${link.icon} ${link.name}<br><span style="font-size:10px;color:var(--text-muted)">Acceder</span>
      </a>
    `).join('');
  }
  
  console.log('Pages section loaded with', vercelDeployments.length, 'Vercel deployments and', githubRepos.length, 'GitHub repos');
}

// ========== SETTINGS & CONFIGURATION ==========
function loadSettingsUI() {
  const settingsContainer = document.getElementById('settings-content');
  if (!settingsContainer) return;
  
  settingsContainer.innerHTML = `
    <div class="grid grid-2">
      <div class="card">
        <div class="card-header">
          <div class="card-title">🎤 Asistente de Voz</div>
        </div>
        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:16px">
          Configura el asistente de voz para navegación y comandos
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <span style="font-size:13px">Activar Asistente</span>
          <label class="switch">
            <input type="checkbox" id="voiceToggle" ${CONFIG.voiceEnabled ? 'checked' : ''} onchange="toggleConfig('voiceEnabled', this.checked)">
            <span class="slider"></span>
          </label>
        </div>
        <div style="font-size:11px;color:var(--text-muted)">
          ${CONFIG.voiceEnabled ? '✅ Asistente ACTIVO' : '❌ Asistente DESACTIVADO'}
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <div class="card-title">📊 Gráficos</div>
        </div>
        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:16px">
          Controla la visualización de gráficos Chart.js
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <span style="font-size:13px">Activar Gráficos</span>
          <label class="switch">
            <input type="checkbox" id="chartsToggle" ${CONFIG.chartsEnabled ? 'checked' : ''} onchange="toggleConfig('chartsEnabled', this.checked)">
            <span class="slider"></span>
          </label>
        </div>
        <div style="font-size:11px;color:var(--text-muted)">
          ${CONFIG.chartsEnabled ? '✅ Gráficos ACTIVOS' : '❌ Gráficos DESACTIVADOS'}
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <div class="card-title">🔄 Auto-Actualización</div>
        </div>
        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:16px">
          Actualiza automáticamente la memoria y preferencias
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <span style="font-size:13px">Activar Auto-Actualización</span>
          <label class="switch">
            <input type="checkbox" id="autoUpdateToggle" ${CONFIG.autoUpdateEnabled ? 'checked' : ''} onchange="toggleConfig('autoUpdateEnabled', this.checked)">
            <span class="slider"></span>
          </label>
        </div>
        <div style="font-size:11px;color:var(--text-muted)">
          ${CONFIG.autoUpdateEnabled ? '✅ Auto-actualización ACTIVA' : '❌ Auto-actualización DESACTIVADA'}
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <div class="card-title">🎨 Tema</div>
        </div>
        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:16px">
          Personaliza la apariencia del dashboard
        </div>
        <div style="display:flex;gap:8px;margin-bottom:12px">
          <button onclick="setTheme('dark')" style="padding:8px 16px;background:${CONFIG.theme === 'dark' ? 'var(--accent-blue)' : 'var(--bg-card)'};color:${CONFIG.theme === 'dark' ? 'white' : 'var(--text-primary)'};border:1px solid var(--border);border-radius:6px;cursor:pointer">🌙 Oscuro</button>
          <button onclick="setTheme('light')" style="padding:8px 16px;background:${CONFIG.theme === 'light' ? 'var(--accent-blue)' : 'var(--bg-card)'};color:${CONFIG.theme === 'light' ? 'white' : 'var(--text-primary)'};border:1px solid var(--border);border-radius:6px;cursor:pointer">☀️ Claro</button>
        </div>
        <div style="font-size:11px;color:var(--text-muted)">
          Tema actual: ${CONFIG.theme === 'dark' ? '🌙 Oscuro' : '☀️ Claro'}
        </div>
      </div>
    </div>
    
    <div class="card" style="margin-top:16px">
      <div class="card-header">
        <div class="card-title">📂 Módulos del Dashboard</div>
      </div>
      <div style="font-size:13px;color:var(--text-secondary);margin-bottom:16px">
        Activa o desactiva módulos según tus necesidades
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(200px, 1fr));gap:8px">
        ${Object.keys(CONFIG.modules).map(key => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:8px;border:1px solid var(--border);border-radius:6px">
            <span style="font-size:12px">${CONFIG.modules[key].label}</span>
            <label class="switch" style="transform:scale(0.8)">
              <input type="checkbox" ${CONFIG.modules[key].enabled ? 'checked' : ''} onchange="toggleModule('${key}', this.checked)">
              <span class="slider"></span>
            </label>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="card" style="margin-top:16px">
      <div class="card-header">
        <div class="card-title">💾 Gestión de Datos</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button onclick="exportData()" style="padding:8px 16px;background:var(--accent-blue);color:white;border:none;border-radius:6px;cursor:pointer">📥 Exportar Datos</button>
        <button onclick="clearAllData()" style="padding:8px 16px;background:var(--accent-red);color:white;border:none;border-radius:6px;cursor:pointer">🗑️ Limpiar Todo</button>
        <button onclick="resetConfig()" style="padding:8px 16px;background:var(--bg-card);color:var(--text-primary);border:1px solid var(--border);border-radius:6px;cursor:pointer">🔄 Restaurar Defecto</button>
      </div>
    </div>
  `;
}

function toggleConfig(key, value) {
  CONFIG[key] = value;
  console.log(`Config updated: ${key} = ${value}`);
  
  // Save to localStorage
  try {
    const preferences = JSON.parse(localStorage.getItem('dashboardPreferences') || '{}');
    preferences.config = CONFIG;
    localStorage.setItem('dashboardPreferences', JSON.stringify(preferences));
  } catch (e) {
    console.error('Error saving config:', e);
  }
  
  // Update UI
  loadSettingsUI();
}

function toggleModule(module, enabled) {
  if (CONFIG.modules[module]) {
    CONFIG.modules[module].enabled = enabled;
    console.log(`Module ${module} ${enabled ? 'enabled' : 'disabled'}`);
    
    // Update nav items visibility
    const navItem = document.querySelector(`.nav-item[data-section="${module}"]`);
    if (navItem) {
      navItem.style.display = enabled ? 'flex' : 'none';
    }
    
    // Save to localStorage
    try {
      const preferences = JSON.parse(localStorage.getItem('dashboardPreferences') || '{}');
      preferences.config = CONFIG;
      localStorage.setItem('dashboardPreferences', JSON.stringify(preferences));
    } catch (e) {
      console.error('Error saving module config:', e);
    }
  }
}

function setTheme(theme) {
  CONFIG.theme = theme;
  document.body.setAttribute('data-theme', theme);
  
  // Save to localStorage
  try {
    const preferences = JSON.parse(localStorage.getItem('dashboardPreferences') || '{}');
    preferences.config = CONFIG;
    localStorage.setItem('dashboardPreferences', JSON.stringify(preferences));
  } catch (e) {
    console.error('Error saving theme:', e);
  }
  
  loadSettingsUI();
}

function clearAllData() {
  if (confirm('¿Estás seguro de que deseas eliminar TODOS los datos guardados? Esta acción no se puede deshacer.')) {
    localStorage.removeItem('dashboardPreferences');
    localStorage.removeItem('projectMemories');
    alert('✅ Todos los datos han sido eliminados. La página se recargará.');
    setTimeout(() => location.reload(), 1000);
  }
}

function resetConfig() {
  if (confirm('¿Restaurar configuración por defecto?')) {
    CONFIG.voiceEnabled = true;
    CONFIG.chartsEnabled = true;
    CONFIG.autoUpdateEnabled = true;
    CONFIG.theme = 'dark';
    
    Object.keys(CONFIG.modules).forEach(key => {
      CONFIG.modules[key].enabled = true;
    });
    
    localStorage.removeItem('dashboardPreferences');
    alert('✅ Configuración restaurada a valores por defecto.');
    loadSettingsUI();
  }
}

// ========== INIT ==========
// Set current date
const dateEl = document.getElementById('currentDate');
if (dateEl) {
  dateEl.textContent = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
}

// Initialize todo count
updateTodoCount();

// Load saved preferences
try {
  const preferences = JSON.parse(localStorage.getItem('dashboardPreferences') || '{}');
  
  // Restore CONFIG if saved
  if (preferences.config) {
    Object.assign(CONFIG, preferences.config);
  }
    
  if (preferences.lastSection) {
    console.log('Last section was:', preferences.lastSection);
  }
} catch (e) {
  console.error('Error loading preferences:', e);
}

// Initialize project view buttons
setTimeout(() => {
  try {
    const viewButtons = document.querySelectorAll('td button');
    viewButtons.forEach(btn => {
      if (btn.textContent.trim() === 'Ver') {
        btn.addEventListener('click', function(e) {
          const row = this.closest('tr');
          const projectName = row?.cells[0]?.textContent?.trim().split('\n')[0]?.trim();
          if (projectName) {
            viewProject(projectName);
          }
        });
      }
    });
    console.log('Project view buttons initialized');
  } catch (e) {
    console.error('Error initializing view buttons:', e);
  }
}, 500);

// Update dashboard from memory
setTimeout(() => {
  updateDashboardFromMemory();
}, 1000);

// Welcome message
setTimeout(() => {
  if ('speechSynthesis' in window && CONFIG.voiceEnabled) {
    speak('Bienvenido a Agencia 360 Dashboard Premium v3.0. Todos los módulos están integrados. ¿En qué puedo ayudarte?');
  }
}, 1500);

console.log('Dashboard Premium v3.0 initialized successfully!');
