require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const express = require('express')
const fs = require('fs')
const path = require('path')
// Node 25+ has native fetch, no import needed
const Database = require('better-sqlite3')

const app = express()
app.use(express.json())
app.use(express.static('D:\\AI_Agency\\agency-hub\\public'))
// CORS for OpenCode and local tools
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

const PORT = process.env.PORT || 3000
const AGENTS_REPO = process.env.AGENTS_REPO || 'D:\\AI_Agency\\agency-agents'
const OPENCODE_URL = process.env.OPENCODE_URL || 'http://127.0.0.1:8000'
const DB_PATH = process.env.DB_PATH || 'D:\\AI_Agency\\agency-hub\\db.sqlite3'

// Initialize SQLite database
const db = new Database(DB_PATH)

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    emoji TEXT,
    color TEXT,
    tools TEXT,
    division TEXT,
    subdivision TEXT,
    file TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft',
    config TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER,
    agent_id TEXT,
    type TEXT,
    input TEXT,
    output TEXT,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
    FOREIGN KEY (agent_id) REFERENCES agents(id)
  );
  
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT,
    level TEXT DEFAULT 'info',
    message TEXT,
    details TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    name TEXT,
    role TEXT DEFAULT 'viewer',
    google_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0,
    priority TEXT DEFAULT 'medium',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT
  );
`)

// Helper to log
function addLog(source, level, message, details) {
  const stmt = db.prepare('INSERT INTO logs (source, level, message, details) VALUES (?, ?, ?, ?)')
  stmt.run(source, level, message, details ? JSON.stringify(details) : null)
}

// Load agents from agency-agents repo (supports subdirectories)
function findAgentFiles(dir) {
  let results = []
  if (!fs.existsSync(dir)) return results
  const items = fs.readdirSync(dir, { withFileTypes: true })
  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    if (item.isDirectory()) {
      results = results.concat(findAgentFiles(fullPath))
    } else if (item.isFile() && item.name.endsWith('.md') && item.name !== 'README.md') {
      results.push(fullPath)
    }
  }
  return results
}

function loadAgentsFromRepo() {
  const divisions = ['academic','design','engineering','finance','game-development','integrations','marketing','paid-media','product','project-management','sales','spatial-computing','specialized','strategy','support','testing']
  let loaded = 0
  
  for (const div of divisions) {
    const dir = path.join(AGENTS_REPO, div)
    const files = findAgentFiles(dir)
    
    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf8')
      const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/m)
      if (!fmMatch) continue
      
      const fm = fmMatch[1]
      const nameMatch = fm.match(/^name:\s*(.+)$/m)
      const descMatch = fm.match(/^description:\s*(.+)$/m)
      const emojiMatch = fm.match(/^emoji:\s*(.+)$/m)
      const colorMatch = fm.match(/^color:\s*(.+)$/m)
      const toolsMatch = fm.match(/^tools:\s*(.+)$/m)
      
      if (!nameMatch) continue
      
      const name = nameMatch[1].trim()
      const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')
      
      const existing = db.prepare('SELECT id FROM agents WHERE id = ?').get(id)
      if (existing) continue
      
      const relativePath = path.relative(AGENTS_REPO, filePath)
      
      // Get subdivision from path
      const pathParts = relativePath.split(path.sep)
      const subdivision = pathParts.length > 2 ? pathParts[1] : null
      
      const stmt = db.prepare(`
        INSERT INTO agents (id, name, description, emoji, color, tools, division, subdivision, file)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      
      stmt.run(
        id,
        name,
        descMatch ? descMatch[1].trim() : '',
        emojiMatch ? emojiMatch[1].trim() : '',
        colorMatch ? colorMatch[1].trim() : '',
        toolsMatch ? toolsMatch[1].trim() : '',
        div,
        subdivision,
        relativePath
      )
      loaded++
    }
  }
  return loaded
}

// Endpoint: health
app.get('/health', (req, res) => {
  const agentCount = db.prepare('SELECT COUNT(*) as cnt FROM agents').get().cnt
  res.json({ status: 'ok', time: new Date().toISOString(), agents: agentCount, db: DB_PATH })
})

// Endpoint: list agents
app.get('/agents', (req, res) => {
  const agents = db.prepare('SELECT * FROM agents ORDER BY division, name').all()
  res.json(agents)
})

// Endpoint: load agents from repo
app.post('/agents/load', (req, res) => {
  try {
    const loaded = loadAgentsFromRepo()
    addLog('hub', 'info', `Loaded ${loaded} agents from repo`)
    res.json({ loaded, total: db.prepare('SELECT COUNT(*) as cnt FROM agents').get().cnt })
  } catch (err) {
    addLog('hub', 'error', 'Failed to load agents', { error: err.message })
    res.status(500).json({ error: err.message })
  }
})

// Endpoint: get single agent
app.get('/agents/:id', (req, res) => {
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(req.params.id)
  if (!agent) return res.status(404).json({ error: 'Not found' })
  res.json(agent)
})

// Endpoint: campaigns
app.get('/campaigns', (req, res) => {
  const campaigns = db.prepare('SELECT * FROM campaigns ORDER BY created_at DESC').all()
  res.json(campaigns)
})

app.post('/campaigns', (req, res) => {
  const { name, description, config } = req.body
  if (!name) return res.status(400).json({ error: 'name required' })
  const stmt = db.prepare('INSERT INTO campaigns (name, description, config) VALUES (?, ?, ?)')
  const result = stmt.run(name, description || '', config ? JSON.stringify(config) : '{}')
  addLog('hub', 'info', `Campaign created: ${name}`)
  res.json({ id: result.lastInsertRowid, name, description })
})

// Endpoint: tasks
app.post('/tasks', (req, res) => {
  const { campaign_id, agent_id, type, input } = req.body
  if (!agent_id) return res.status(400).json({ error: 'agent_id required' })
  const stmt = db.prepare('INSERT INTO tasks (campaign_id, agent_id, type, input) VALUES (?, ?, ?, ?)')
  const result = stmt.run(campaign_id || null, agent_id, type || 'execute', input ? JSON.stringify(input) : null)
  addLog('hub', 'info', `Task created for agent ${agent_id}`)
  res.json({ id: result.lastInsertRowid })
})

// Endpoint: AI prompt - usa Ollama local como brain (OpenCode es el dashboard)
app.post('/opened-code/prompt', async (req, res) => {
  try {
    const prompt = req.body.prompt || req.body.messages?.[0]?.content || ''
    addLog('ai', 'info', 'Prompt sent', { prompt: prompt.substring(0, 100) })
    const model = req.body.model || 'qwen2.5:1.5b'
    const payload = {
      model: model,
      prompt: prompt,
      stream: false
    }
    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Ollama error: ${response.status} - ${errText}`)
    }
    const data = await response.json()
    addLog('ai', 'info', 'Prompt success via Ollama')
    res.json({ response: data.response, model: model, source: 'ollama' })
  } catch (err) {
    addLog('ai', 'error', 'Ollama unavailable', { error: err.message })
    res.status(502).json({ error: 'Ollama unavailable', details: err.message, tip: 'Run: ollama serve' })
  }
})

// Endpoint: Hermes/Telegram webhook (receive messages)
app.post('/telegram/webhook', async (req, res) => {
  try {
    const msg = req.body.message
    if (!msg) return res.json({ ok: true })
    const chatId = msg.chat.id
    const text = msg.text || ''
    addLog('telegram', 'info', `Message from ${chatId}: ${text.substring(0, 50)}`)
    // Simple command handling
    if (text.startsWith('/agents')) {
      const agents = db.prepare('SELECT id, name FROM agents LIMIT 10').all()
      const reply = agents.map(a => `${a.id}`).join('\n')
      // Here you would call Telegram API to send message
      addLog('telegram', 'info', `Listed agents to ${chatId}`)
    } else if (text.startsWith('/prompt ')) {
      const prompt = text.substring(8)
      // Forward to OpenCode
      try {
        const response = await fetch(`${OPENCODE_URL}/prompt`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, context: { source: 'telegram', chatId } })
        })
        const data = await response.json()
        addLog('telegram', 'info', 'Prompt forwarded to OpenCode')
      } catch (e) {
        addLog('telegram', 'error', 'Failed to forward prompt', { error: e.message })
      }
    }
    res.json({ ok: true })
  } catch (err) {
    addLog('telegram', 'error', 'Webhook error', { error: err.message })
    res.status(500).json({ error: err.message })
  }
})

// Endpoint: logs
app.get('/logs', (req, res) => {
  const logs = db.prepare('SELECT * FROM logs ORDER BY created_at DESC LIMIT 100').all()
  res.json(logs)
})

// Endpoint: projects
app.get('/projects', (req, res) => {
  try {
    const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all()
    res.json(projects)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Endpoint: todos
app.get('/todos', (req, res) => {
  try {
    const todos = db.prepare("SELECT id, task, CASE WHEN completed = 1 THEN 'completed' ELSE 'pending' END as status, priority, created_at FROM todos ORDER BY created_at DESC").all()
    res.json(todos)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/todos', (req, res) => {
  try {
    const { task, priority } = req.body
    if (!task) return res.status(400).json({ error: 'task required' })
    const stmt = db.prepare('INSERT INTO todos (task, priority) VALUES (?, ?)')
    const result = stmt.run(task, priority || 'medium')
    addLog('hub', 'info', `TODO added: ${task}`)
    res.json({ id: result.lastInsertRowid, task, status: 'pending', priority: priority || 'medium' })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.put('/todos/:id', (req, res) => {
  try {
    const { completed, task } = req.body
    const fields = []
    const values = []
    if (completed !== undefined) {
      fields.push('completed = ?')
      values.push(completed ? 1 : 0)
    }
    if (task !== undefined) {
      fields.push('task = ?')
      values.push(task)
    }
    fields.push("updated_at = datetime('now')")
    values.push(req.params.id)
    const stmt = db.prepare(`UPDATE todos SET ${fields.join(', ')} WHERE id = ?`)
    stmt.run(...values)
    addLog('hub', 'info', `TODO updated: id ${req.params.id}`)
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.delete('/todos/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM todos WHERE id = ?').run(req.params.id)
    addLog('hub', 'info', `TODO deleted: id ${req.params.id}`)
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Startup
app.listen(PORT, () => {
  console.log(`Agency Hub listening on http://localhost:${PORT}`)
  console.log(`DB: ${DB_PATH}`)
  // Auto-load agents if DB is empty
  const cnt = db.prepare('SELECT COUNT(*) as cnt FROM agents').get().cnt
  if (cnt === 0) {
    const loaded = loadAgentsFromRepo()
    console.log(`Auto-loaded ${loaded} agents from repo`)
  }
  // Seed initial TODOs if empty
  const todoCount = db.prepare('SELECT COUNT(*) as cnt FROM todos').get().cnt
  if (todoCount === 0) {
    const initialTodos = [
      { task: 'Escanear D:\\proyectos y extraer información', completed: 1, priority: 'high' },
      { task: 'Actualizar panel para mostrar cantidad de agentes', completed: 1, priority: 'high' },
      { task: 'Agregar sección Proyectos al panel', completed: 0, priority: 'high' },
      { task: 'Agregar proyectos al CRM', completed: 0, priority: 'medium' },
      { task: 'Crear espacios info faltante', completed: 0, priority: 'medium' },
      { task: 'Implementar dashboard premium 7 módulos', completed: 0, priority: 'high' },
      { task: 'Sincronizar TODO list en panel', completed: 0, priority: 'high' }
    ]
    const stmt = db.prepare('INSERT INTO todos (task, completed, priority) VALUES (?, ?, ?)')
    for (const todo of initialTodos) {
      stmt.run(todo.task, todo.completed, todo.priority)
    }
    console.log('Seeded initial TODOs')
  }
})
