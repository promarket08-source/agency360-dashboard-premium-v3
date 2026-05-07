const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Rutas absolutas para evitar errores
const DB_PATH = 'D:\\AI_Agency\\agency-hub\\backend\\db.sqlite3';
const AGENTS_REPO = 'D:\\AI_Agency\\agency-agents';

console.log('Conectando a DB:', DB_PATH);
const db = new Database(DB_PATH);

// Crear tabla
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
`);

// Verificar cuántos hay
let before = db.prepare('SELECT COUNT(*) as c FROM agents').get();
console.log('Agentes antes de cargar:', before.c);

const divisions = ['engineering','design','marketing','sales','paid-media','product','project-management','testing','support','spatial-computing','specialized'];
let loaded = 0;

divisions.forEach(div => {
  const dir = path.join(AGENTS_REPO, div);
  if (!fs.existsSync(dir)) {
    console.log('No existe:', dir);
    return;
  }
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  console.log(`Procesando ${div}: ${files.length} archivos`);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/m);
    if (!fmMatch) return;
    
    const fm = fmMatch[1];
    const nameMatch = fm.match(/^name:\s*(.+)$/m);
    if (!nameMatch) return;
    
    const id = nameMatch[1].trim().toLowerCase().replace(/\s+/g, '-');
    
    // Verificar si ya existe
    const existing = db.prepare('SELECT id FROM agents WHERE id = ?').get(id);
    if (existing) return;
    
    const descMatch = fm.match(/^description:\s*(.+)$/m);
    const emojiMatch = fm.match(/^emoji:\s*(.+)$/m);
    const colorMatch = fm.match(/^color:\s*(.+)$/m);
    const toolsMatch = fm.match(/^tools:\s*(.+)$/m);
    
    try {
      const stmt = db.prepare(`
        INSERT INTO agents (id, name, description, emoji, color, tools, division, file)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        id,
        nameMatch[1].trim(),
        descMatch ? descMatch[1].trim() : '',
        emojiMatch ? emojiMatch[1].trim() : '',
        colorMatch ? colorMatch[1].trim() : '',
        toolsMatch ? toolsMatch[1].trim() : '',
        div,
        path.join(div, file)
      );
      loaded++;
    } catch (e) {
      console.log('Error insertando', id, e.message);
    }
  });
});

const after = db.prepare('SELECT COUNT(*) as c FROM agents').get();
console.log('Agentes cargados en esta sesión:', loaded);
console.log('Total agentes en DB:', after.c);

// Mostrar muestra
const sample = db.prepare('SELECT id, name, division FROM agents LIMIT 5').all();
console.log('Muestra:', JSON.stringify(sample, null, 2));

db.close();
console.log('¡Listo! Agentes disponibles en D:\\AI_Agency\\agency-hub\\backend\\db.sqlite3');
