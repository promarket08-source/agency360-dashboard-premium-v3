const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = 'D:\\AI_Agency\\agency-hub\\db.sqlite3';
const AGENTS_REPO = 'D:\\AI_Agency\\agency-agents';

const db = new Database(DB_PATH);

// Create table if not exists
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
`);

function findAgentFiles(dir, division, subdivision = null) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      // Recursively search subdirectories
      const subResults = findAgentFiles(fullPath, division, item.name);
      results = results.concat(subResults);
    } else if (item.isFile() && item.name.endsWith('.md') && item.name !== 'README.md') {
      results.push({
        filePath: fullPath,
        division: division,
        subdivision: subdivision
      });
    }
  }
  
  return results;
}

// All divisions including subdirectories
const divisions = [
  'academic', 'design', 'engineering', 'finance', 'game-development',
  'integrations', 'marketing', 'paid-media', 'product', 
  'project-management', 'sales', 'spatial-computing', 
  'specialized', 'strategy', 'support', 'testing'
];

let loaded = 0;
let skipped = 0;

divisions.forEach(div => {
  const dir = path.join(AGENTS_REPO, div);
  const agentFiles = findAgentFiles(dir, div);
  
  console.log(`Processing ${div}: ${agentFiles.length} files found`);
  
  agentFiles.forEach(({ filePath, division, subdivision }) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/m);
    if (!fmMatch) {
      console.log(`  No frontmatter: ${filePath}`);
      skipped++;
      return;
    }
    
    const fm = fmMatch[1];
    const nameMatch = fm.match(/^name:\s*(.+)$/m);
    if (!nameMatch) {
      console.log(`  No name: ${filePath}`);
      skipped++;
      return;
    }
    
    const name = nameMatch[1].trim();
    const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    
    const existing = db.prepare('SELECT id FROM agents WHERE id = ?').get(id);
    if (existing) {
      skipped++;
      return;
    }
    
    const descMatch = fm.match(/^description:\s*(.+)$/m);
    const emojiMatch = fm.match(/^emoji:\s*(.+)$/m);
    const colorMatch = fm.match(/^color:\s*(.+)$/m);
    const toolsMatch = fm.match(/^tools:\s*(.+)$/m);
    
    const relativePath = path.relative(AGENTS_REPO, filePath);
    
    const stmt = db.prepare(`
      INSERT INTO agents (id, name, description, emoji, color, tools, division, subdivision, file)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      name,
      descMatch ? descMatch[1].trim() : '',
      emojiMatch ? emojiMatch[1].trim() : '',
      colorMatch ? colorMatch[1].trim() : '',
      toolsMatch ? toolsMatch[1].trim() : '',
      division,
      subdivision,
      relativePath
    );
    loaded++;
  });
});

console.log(`\nTotal agents loaded this run: ${loaded}`);
console.log(`Skipped (already exists or invalid): ${skipped}`);
const total = db.prepare('SELECT COUNT(*) as cnt FROM agents').get().cnt;
console.log(`Total agents in DB: ${total}`);
db.close();
