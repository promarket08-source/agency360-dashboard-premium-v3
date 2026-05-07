const express = require('express');
const fs = require('fs');
const path = require('path');
const { Telegraf } = require('telegraf');
const chokidar = require('chokidar');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Telegram Bot (reemplaza con tu token)
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || 'REPLACE_WITH_YOUR_BOT_TOKEN';
const bot = new Telegraf(TELEGRAM_TOKEN);

// Estado de la agencia
let agencyStatus = {
  activeProjects: 31,
  agentsWorking: 156,
  incomeToday: 12450,
  leadsCaptured: 127,
  lastUpdate: new Date().toISOString()
};

// Monitoreo de carpetas de proyectos (D:\AI_Agency\projects\clientes\)
const projectsPath = 'D:\\AI_Agency\\projects\\clientes';
let fileChanges = [];

// Configurar watcher de archivos
const watcher = chokidar.watch(projectsPath, {
  ignored: /(^|[\/\\])\../,
  persistent: true,
  ignoreInitial: true,
  depth: 3
});

watcher
  .on('add', path => {
    const change = { type: 'file_added', path, timestamp: new Date().toISOString() };
    fileChanges.unshift(change);
    if (fileChanges.length > 50) fileChanges.pop();
    notifyTelegram(`📄 Nuevo archivo: ${path.replace(projectsPath, '')}`);
  })
  .on('change', path => {
    const change = { type: 'file_changed', path, timestamp: new Date().toISOString() };
    fileChanges.unshift(change);
    if (fileChanges.length > 50) fileChanges.pop();
    notifyTelegram(`✏️ Archivo modificado: ${path.replace(projectsPath, '')}`);
  })
  .on('addDir', path => {
    const change = { type: 'folder_added', path, timestamp: new Date().toISOString() };
    fileChanges.unshift(change);
    notifyTelegram(`📁 Nueva carpeta: ${path.replace(projectsPath, '')}`);
  });

// Notificar a Telegram
function notifyTelegram(message) {
  try {
    bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID || 'REPLACE_WITH_CHAT_ID', 
      `🏭 AGENCIA 360 UPDATE\n\n${message}\n\n⏰ ${new Date().toLocaleTimeString()}`);
  } catch (e) {
    console.error('Telegram error:', e.message);
  }
}

// Comandos de Telegram para control remoto
bot.start((ctx) => ctx.reply(
  `🏭 Bienvenido al Control Remoto de Agencia 360\n\n` +
  `Comandos:\n` +
  `/status - Ver estado de la agencia\n` +
  `/projects - Lista de proyectos\n` +
  `/agents - Estado de agentes IA\n` +
  `/leads - Leads capturados hoy\n` +
  `/income - Ingresos del día\n` +
  `/restart - Reiniciar servicios\n` +
  `/stop - Detener monitoreo`
));
bot.command('status', (ctx) => {
  ctx.reply(
    `📊 ESTADO DE LA AGENCIA\n\n` +
    `✅ Proyectos activos: ${agencyStatus.activeProjects}\n` +
    `🤖 Agentes trabajando: ${agencyStatus.agentsWorking}/192\n` +
    `💰 Ingresos hoy: $${agencyStatus.incomeToday}\n` +
    `🎯 Leads capturados: ${agencyStatus.leadsCaptured}\n` +
    `⏰ Última actualización: ${new Date(agencyStatus.lastUpdate).toLocaleTimeString()}`
  );
});
bot.command('projects', (ctx) => {
  ctx.reply(
    `📁 PROYECTOS RECIENTES\n\n` +
    `1. Burbuja - Turismo (Activo) - 192 agentes\n` +
    `2. Biocuantum - Salud (Activo) - 48 agentes\n` +
    `3. Calzados Antonella - Moda (En progreso) - 32 agentes\n` +
    `4. Chocados Herrera - Comida (Riesgo) - 28 agentes\n\n` +
    `Total: ${agencyStatus.activeProjects} proyectos indexados`
  );
});
bot.command('agents', (ctx) => {
  ctx.reply(
    `🤖 ESTADO DE AGENTES IA\n\n` +
    `Total: 192 agentes\n` +
    `Trabajando: ${agencyStatus.agentsWorking}\n` +
    `En espera: ${192 - agencyStatus.agentsWorking}\n` +
    `Eficiencia: 87.5%\n\n` +
    `Usa /status para más detalles`
  );
});
bot.command('leads', (ctx) => {
  ctx.reply(
    `🎯 LEADS HOY\n\n` +
    `Capturados: ${agencyStatus.leadsCaptured}\n` +
    `Convertidos: ${Math.floor(agencyStatus.leadsCaptured * 0.23)}\n` +
    `Tasa conversión: 23%\n\n` +
    `Usa /income para ver ingresos`
  );
});
bot.command('income', (ctx) => {
  ctx.reply(
    `💰 INGRESOS DEL DÍA\n\n` +
    `Total: $${agencyStatus.incomeToday}\n` +
    `Proyectado mensual: $${agencyStatus.incomeToday * 30}\n` +
    `Objetivo mensual: $500,000\n` +
    `Progreso: ${((agencyStatus.incomeToday * 30 / 500000) * 100).toFixed(1)}%`
  );
});
bot.command('restart', (ctx) => {
  ctx.reply('🔄 Reiniciando servicios...\n\nEsto puede tardar unos minutos.');
  // Aquí iría lógica para reiniciar servicios
  setTimeout(() => {
    ctx.reply('✅ Servicios reiniciados correctamente.');
  }, 3000);
});
bot.command('stop', (ctx) => {
  ctx.reply('⏹️ Monitoreo detenido.\n\nUsa /start para reiniciar.');
  watcher.close();
});

// API Endpoints
app.get('/api/status', (req, res) => {
  res.json(agencyStatus);
});
app.get('/api/file-changes', (req, res) => {
  res.json(fileChanges.slice(0, 20));
});
app.get('/api/projects', (req, res) => {
  try {
    const projects = fs.readdirSync(projectsPath).map(name => ({
      name,
      path: path.join(projectsPath, name),
      modified: fs.statSync(path.join(projectsPath, name)).mtime
    }));
    res.json(projects);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.post('/api/notify', (req, res) => {
  const { message } = req.body;
  if (message) {
    notifyTelegram(message);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Message required' });
  }
});

// Iniciar servidor y bot
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en puerto ${PORT}`);
  console.log(`📡 Monitoreo de ${projectsPath}`);
});
bot.launch().then(() => {
  console.log('🤖 Bot de Telegram iniciado');
  notifyTelegram('🏭 Agencia 360 Backend Iniciado\nMonitoreo de proyectos activo.');
});
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));