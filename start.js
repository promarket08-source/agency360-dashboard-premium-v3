// Startup script to load agents and start server
require('dotenv').config({ path: require('path').join(__dirname, 'backend', '.env') })
const { execSync } = require('child_process')

console.log('Starting Agency Hub...')
console.log('Loading agents from repo...')

// Load agents by running the load endpoint via direct function call
const Database = require('better-sqlite3')
const fs = require('fs')
const path = require('path')

const DB_PATH = 'D:\\AI_Agency\\agency-hub\\db.sqlite3'
const AGENTS_REPO = 'D:\\AI_Agency\\agency-agents'

const db = new Database(DB_PATH)

// Create tables if not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    emoji TEXT,
    color TEXT,
    tools TEXT,
    division TEXT,
    file TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`)

const divisions = ['engineering','design','marketing','sales','paid-media','product','project-management','testing','support','spatial-computing','specialized']
let loaded = 0

for (const div of divisions) {
  const dir = path.join(AGENTS_REPO, div)
  if (!fs.existsSync(dir)) continue
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'))
  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), 'utf8')
    const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/)
    if (!fmMatch) continue
    const fm = fmMatch[1]
    const nameMatch = fm.match(/^name:\s*(.+)$/m)
    const descMatch = fm.match(/^description:\s*(.+)$/m)
    const emojiMatch = fm.match(/^emoji:\s*(.+)$/m)
    const colorMatch = fm.match(/^color:\s*(.+)$/m)
    const toolsMatch = fm.match(/^tools:\s*(.+)$/m)
    if (!nameMatch) continue
    const id = nameMatch[1].trim().toLowerCase().replace(/\s+/g, '-')
    const existing = db.prepare('SELECT id FROM agents WHERE id = ?').get(id)
    if (existing) continue
    const stmt = db.prepare(`
      INSERT INTO agents (id, name, description, emoji, color, tools, division, file)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    stmt.run(
      id,
      nameMatch[1].trim(),
      descMatch ? descMatch[1].trim() : '',
      emojiMatch ? emojiMatch[1].trim() : '',
      colorMatch ? colorMatch[1].trim() : '',
      toolsMatch ? toolsMatch[1].trim() : '',
      div,
      path.join(div, file)
    )
    loaded++
  }
}

console.log(`Loaded ${loaded} agents into database`)
console.log(`Total agents: ${db.prepare('SELECT COUNT(*) as cnt FROM agents').get().cnt}`)

db.close()

// Start the server
console.log('Starting Express server...')
require('./backend/src/index.js')
