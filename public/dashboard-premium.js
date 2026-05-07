// DASHBOARD PREMIUM v3.0 - WORKING VERSION
console.log('Dashboard Premium v3.0 Loading...');

// ========== CONFIGURATION ==========
const CONFIG = {
  voiceEnabled: true,
  chartsEnabled: true
};

// ========== NAVIGATION ==========
function showSection(sectionId) {
  console.log('Switching to:', sectionId);
  
  // Hide all sections
  var sections = document.querySelectorAll('.section');
  sections.forEach(function(s) { s.classList.remove('active'); });
  
  // Show target
  var target = document.getElementById('s-' + sectionId);
  if (target) {
    target.classList.add('active');
  }
  
  // Update sidebar
  var items = document.querySelectorAll('.nav-item');
  items.forEach(function(item) {
    item.classList.remove('active');
    if (item.getAttribute('data-section') === sectionId) {
      item.classList.add('active');
    }
  });
}

// ========== VOICE ==========
function toggleVoice() {
  CONFIG.voiceEnabled = !CONFIG.voiceEnabled;
  var btn = document.getElementById('voiceBtn');
  if (btn) {
    btn.style.opacity = CONFIG.voiceEnabled ? '1' : '0.5';
  }
  if (CONFIG.voiceEnabled && 'speechSynthesis' in window) {
    var u = new SpeechSynthesisUtterance('Asistente activado');
    u.lang = 'es-ES';
    speechSynthesis.speak(u);
  }
}

// ========== PROJECT TASKS ==========
var PROJECT_TASKS = {
  'Biocuantum': [
    { id: 1, task: 'Integrate CRM', priority: 'high', status: 'pending' },
    { id: 2, task: 'Setup MercadoPago', priority: 'high', status: 'pending' }
  ],
  'Burbuja': [
    { id: 1, task: 'Mobile version', priority: 'high', status: 'pending' },
    { id: 2, task: 'Weather API', priority: 'medium', status: 'pending' }
  ]
};

function followProject(name) {
  console.log('Following:', name);
  var tasks = PROJECT_TASKS[name] || [];
  alert('Project: ' + name + '\nTasks: ' + tasks.length);
}

// ========== CLIENT MODAL ==========
function openNewClientModal() {
  var modal = document.getElementById('newClientModal');
  if (modal) modal.style.display = 'flex';
}

function closeNewClientModal() {
  var modal = document.getElementById('newClientModal');
  if (modal) modal.style.display = 'none';
}

function saveNewClient() {
  var nameInput = document.getElementById('clientName');
  if (!nameInput || !nameInput.value.trim()) {
    alert('Name required');
    return;
  }
  alert('Client ' + nameInput.value + ' saved!');
  closeNewClientModal();
  showSection('crm');
}

// ========== TELEGRAM ==========
function openTelegramBot(type) {
  var bots = {
    'main': 'https://t.me/Agencia360Bot',
    'opencode': 'https://t.me/opencode_bot'
  };
  window.open(bots[type] || bots['main'], '_blank');
}

function sendTelegramCommand(cmd) {
  fetch('http://localhost:3000/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: cmd })
  })
  .then(function() { alert('Command sent: ' + cmd); })
  .catch(function() { alert('Error. Backend not running.'); });
}

// ========== ACTIONS ==========
function executeAction(action) {
  switch(action) {
    case 'start-all':
      alert('Factory Started!\nBackend: localhost:3000\nn8n: localhost:5678\n192 Agents ready.');
      window.open('https://agency-hub-rho.vercel.app/dashboard-premium.html');
      break;
    default:
      alert('Action: ' + action);
  }
}

function controlService(service) {
  alert('Controlling: ' + service);
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
  console.log('Dashboard Loaded');
  showSection('executive');
  
  if ('speechSynthesis' in window) {
    setTimeout(function() {
      var u = new SpeechSynthesisUtterance('Bienvenido a Agencia 360 Dashboard Premium v3.0');
      u.lang = 'es-ES';
      speechSynthesis.speak(u);
    }, 2000);
  }
});

console.log('Dashboard Premium v3.0 Ready!');