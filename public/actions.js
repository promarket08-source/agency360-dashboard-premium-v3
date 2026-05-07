// ========== CONECTAR CON IA (OPENCDE) ==========
function sendOrderToIA() {
  var order = prompt('🤖 DALE UNA ORDEN A LA IA:\n\nEjemplos:\n- "Crear landing page para Burbuja"\n- "Generar 100 leads para Biocuantum"\n- "Desplegar dashboard a Vercel"\n- "Agregar cliente Calzados Antonella"');
  
  if (!order || order.trim() === '') {
    alert('❌ Orden cancelada');
    return;
  }
  
  alert('🤖 IA RECIBIÓ ORDEN:\n\n"' + order + '"\n\n⏳ La IA (opencode) está procesando tu orden...\nRevisa el panel para ver resultados.');
  
  if ('speechSynthesis' in window) {
    var u = new SpeechSynthesisUtterance('He recibido tu orden: ' + order + '. Comenzando a trabajar ahora mismo.');
    u.lang = 'es-ES';
    speechSynthesis.speak(u);
  }
  
  // Simular procesamiento de la IA
  setTimeout(function() {
    if (order.toLowerCase().includes('landing') || order.toLowerCase().includes('proyecto')) {
      alert('✅ IA COMPLETÓ: Proyecto creado!\n\nSe ha generado el proyecto y asignado a los agentes.');
      showSection('generator');
    } else if (order.toLowerCase().includes('lead')) {
      alert('✅ IA COMPLETÓ: Leads capturados!\n\nSe han añadido nuevos leads al CRM.');
      showSection('leads');
    } else if (order.toLowerCase().includes('desplegar') || order.toLowerCase().includes('deploy')) {
      alert('✅ IA COMPLETÓ: Despliegue iniciado!\n\nEjecutando: vercel --prod');
    } else if (order.toLowerCase().includes('cliente') || order.toLowerCase().includes('crm')) {
      alert('✅ IA COMPLETÓ: Cliente agregado!\n\nSe ha actualizado el CRM.');
      showSection('crm');
    } else {
      alert('✅ IA COMPLETÓ: Tarea ejecutada!\n\nOrden procesada: ' + order);
    }
  }, 3000);
}

// ========== CONTROL TOWER ACTIONS ==========
function executeAction(action) {
  switch(action) {
    case 'capture-lead':
      captureLead();
      break;
    case 'generate-project':
      showSection('generator');
      if ('speechSynthesis' in window) {
        var u = new SpeechSynthesisUtterance('Abriendo generador de proyectos');
        u.lang = 'es-ES';
        speechSynthesis.speak(u);
      }
      break;
    case 'start-all':
      if (confirm('¿INICIAR FÁBRICA DE CONTENIDO?')) {
        alert('✅ Fábrica iniciada!\n\nBackend: http://localhost:3000\nn8n: http://localhost:5678\n\n192 Agentes listos.');
        window.open('https://agency-hub-rho.vercel.app/dashboard-premium.html');
      }
      break;
    default:
      alert('Acción: ' + action);
  }
}

function captureLead() {
  var name = document.querySelector('#s-leads input[type="text"]')?.value || 'Nuevo Cliente';
  alert('🎯 Lead Capturado!\n\nNombre: ' + name);
  if ('speechSynthesis' in window) {
    var u = new SpeechSynthesisUtterance('Lead capturado: ' + name);
    u.lang = 'es-ES';
    speechSynthesis.speak(u);
  }
}

function controlService(service) {
  alert('Controlando: ' + service);
}

console.log('Actions file loaded!');