// ========== DASHBOARD PREMIUM v3.0 - CLEAN VERSION ==========

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
  console.log('Showing section:', name);
  
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
  } else {
    console.error('Section not found: s-' + name);
  }
  
  // Initialize charts for specific sections (lazy loading)
  if (name === 'social') {
    setTimeout(() => initSocialChart(), 200);
  }
  
  if (name === 'opportunities') {
    setTimeout(() => initOpportunitiesChart(), 200);
  }
  
  if (name === 'mercadopago') {
    setTimeout(() => initMercadoPagoCharts(), 200);
  }
  
  if (name === 'executive') {
    setTimeout(() => {
      initRevenueChart();
      initFunnelChart();
    }, 200);
  }
  
  if (name === 'campaigns') {
    setTimeout(() => initCampaignsChart(), 200);
  }
  
  if (name === 'finance') {
    setTimeout(() => initFinanceChart(), 200);
  }
  
  if (name === 'projects') {
    setTimeout(() => loadProjectData(), 200);
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
  if (revenueChartInitialized) return;
  try {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    const chart = new Chart(ctx.getContext('2d'), {
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
  if (funnelChartInitialized) return;
  try {
    const ctx = document.getElementById('funnelChart');
    if (!ctx) return;
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
  if (campaignsChartInitialized) return;
  try {
    const ctx = document.getElementById('campaignsChart');
    if (!ctx) return;
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
  if (financeChartInitialized) return;
  try {
    const ctx = document.getElementById('financeChart');
    if (!ctx) return;
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
  if (socialChartInitialized) return;
  try {
    const ctx = document.getElementById('socialGrowthChart');
    if (!ctx) return;
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
  if (opportunitiesChartInitialized) return;
  try {
    const ctx = document.getElementById('opportunitiesChart');
    if (!ctx) return;
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
  if (mercadoPagoChartInitialized) return;
  try {
    // Income vs Expenses
    const ctx1 = document.getElementById('mercadoPagoChart');
    if (ctx1) {
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
    
    // Payment Methods
    const ctx2 = document.getElementById('paymentMethodsChart');
    if (ctx2) {
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
  alert('Exportando datos...\n\nEsta función exportará:\n- Dashboard Ejecutivo\n- CRM Clientes\n- Campañas\n- Finanzas\n\nEn formato PDF/Excel');
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
    // Get existing memories
    const memories = JSON.parse(localStorage.getItem('projectMemories') || '{}');
    
    if (!memories[projectName]) {
      memories[projectName] = {
        views: 0,
        preferences: {},
        interactions: [],
        lastUpdate: null
      };
    }
    
    // Update data
    memories[projectName].views++;
    memories[projectName].lastUpdate = new Date().toISOString();
    memories[projectName].interactions.push({
      type: interactionType,
      timestamp: new Date().toISOString(),
      data: data || {}
    });
    
    // Keep only last 50 interactions
    if (memories[projectName].interactions.length > 50) {
      memories[projectName].interactions = memories[projectName].interactions.slice(-50);
    }
    
    // Save back to localStorage
    localStorage.setItem('projectMemories', JSON.stringify(memories));
    
    console.log('Project memory updated:', projectName, memories[projectName]);
    
    // Update dashboard preferences based on interaction
    updateDashboardPreferences(projectName, interactionType);
    
    // Auto-update project file (simulated - in real app would call backend)
    autoUpdateProjectFile(projectName, interactionType, data);
    
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
    
    // Add or update project in frequent list
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
    
    // Sort by count
    preferences.frequentProjects.sort((a, b) => b.count - a.count);
    
    // Keep only top 10
    preferences.frequentProjects = preferences.frequentProjects.slice(0, 10);
    
    localStorage.setItem('dashboardPreferences', JSON.stringify(preferences));
    
    console.log('Dashboard preferences updated:', preferences);
  } catch (e) {
    console.error('Error updating preferences:', e);
  }
}

function autoUpdateProjectFile(projectName, interactionType, data) {
  // This simulates updating the project's MD file
  // In a real implementation, this would call a backend API
  console.log(`Auto-updating project file for ${projectName}:`, {
    interactionType,
    timestamp: new Date().toISOString(),
    data: data
  });
  
  // Simulate: Update project memory in UI
  const projectRows = document.querySelectorAll('#projects-tbody tr');
  projectRows.forEach(row => {
    const projectCell = row.cells[0];
    if (projectCell && projectCell.textContent.includes(projectName)) {
      // Add a visual indicator that the project was updated
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
    
    // Update project table with view counts
    const projectRows = document.querySelectorAll('#projects-tbody tr');
    projectRows.forEach(row => {
      const projectCell = row.cells[0];
      if (projectCell) {
        const projectName = projectCell.textContent.trim().split('\n')[0].trim();
        if (projectName && memories[projectName]) {
          // Add view count badge if not exists
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
    
    // Show frequent projects in UI
    if (preferences.frequentProjects && preferences.frequentProjects.length > 0) {
      console.log('Frequent projects:', preferences.frequentProjects.slice(0, 3));
    }
    
  } catch (e) {
    console.error('Error loading project data:', e);
  }
}

function updateDashboardFromMemory() {
  try {
    const preferences = JSON.parse(localStorage.getItem('dashboardPreferences') || '{}');
    
    // Apply UI preferences
    if (preferences.uiPreferences) {
      applyUIPreferences(preferences.uiPreferences);
    }
    
    console.log('Dashboard updated from memory');
  } catch (e) {
    console.error('Error updating dashboard from memory:', e);
  }
}

function applyUIPreferences(uiPrefs) {
  // Apply saved UI preferences
  if (uiPrefs.theme) {
    document.body.setAttribute('data-theme', uiPrefs.theme);
  }
  console.log('UI preferences applied:', uiPrefs);
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
  if (preferences.lastSection) {
    console.log('Last section was:', preferences.lastSection);
  }
  if (preferences.uiPreferences) {
    applyUIPreferences(preferences.uiPreferences);
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
  if ('speechSynthesis' in window) {
    speak('Bienvenido a Agencia 360 Dashboard Premium v3.0. Todos los módulos están integrados. ¿En qué puedo ayudarte?');
  }
}, 1500);

console.log('Dashboard Premium v3.0 initialized successfully!');
