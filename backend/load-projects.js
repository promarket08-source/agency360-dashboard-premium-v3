const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = 'D:\\AI_Agency\\agency-hub\\backend\\db.sqlite3';
const PROJECTS_DIR = 'D:\\proyectos';

const db = new Database(DB_PATH);

// Create projects table
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    progress INTEGER DEFAULT 0,
    stage TEXT DEFAULT 'landing',
    client_name TEXT,
    niche TEXT,
    files_count INTEGER DEFAULT 0,
    js_files INTEGER DEFAULT 0,
    md_files INTEGER DEFAULT 0,
    html_files INTEGER DEFAULT 0,
    css_files INTEGER DEFAULT 0,
    created_at TEXT,
    updated_at TEXT
  );
`);

// Clear existing projects
db.exec('DELETE FROM projects');

function getAllFiles(dir) {
  let results = [];
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        results = results.concat(getAllFiles(full));
      } else {
        results.push(full);
      }
    }
  } catch(e) {}
  return results;
}

function getStageFromFiles(files) {
  if (files.some(f => f.includes('index.html') || f.includes('landing'))) return 'landing';
  if (files.some(f => f.includes('crm') || f.includes('dashboard'))) return 'crm';
  if (files.some(f => f.includes('api') || f.includes('backend'))) return 'backend';
  if (files.some(f => f.includes('component') || f.includes('src'))) return 'development';
  return 'planning';
}

const stmt = db.prepare(`
  INSERT INTO projects (name, files_count, js_files, md_files, html_files, css_files, stage, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const folders = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true })
  .filter(f => f.isDirectory())
  .map(f => f.name);

console.log('Found', folders.length, 'projects');

folders.forEach(name => {
  const fullPath = path.join(PROJECTS_DIR, name);
  const allFiles = getAllFiles(fullPath);
  const jsFiles = allFiles.filter(f => ['.js','.jsx','.ts','.tsx'].some(ext => f.endsWith(ext))).length;
  const mdFiles = allFiles.filter(f => f.endsWith('.md')).length;
  const htmlFiles = allFiles.filter(f => f.endsWith('.html')).length;
  const cssFiles = allFiles.filter(f => f.endsWith('.css')).length;
  const stage = getStageFromFiles(allFiles.map(f => f.toLowerCase()));
  const stats = fs.statSync(fullPath);
  
  stmt.run(name, allFiles.length, jsFiles, mdFiles, htmlFiles, cssFiles, stage, stats.ctime.toISOString());
  console.log(`Loaded: ${name} (${allFiles.length} files, stage: ${stage})`);
});

const count = db.prepare('SELECT COUNT(*) as cnt FROM projects').get().cnt;
console.log(`\nTotal projects in DB: ${count}`);
db.close();
