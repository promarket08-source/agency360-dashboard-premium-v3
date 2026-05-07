const Database = require('better-sqlite3');
const db = new Database('D:\\AI_Agency\\agency-hub\\db.sqlite3');

console.log('Tables:', db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all());

try {
  const todos = db.prepare('SELECT * FROM todos').all();
  console.log('Todos count:', todos.length);
  console.log('Todos:', JSON.stringify(todos, null, 2));
} catch(e) {
  console.log('Error accessing todos:', e.message);
}

try {
  const projects = db.prepare('SELECT COUNT(*) as cnt FROM projects').get();
  console.log('Projects count:', projects.cnt);
} catch(e) {
  console.log('Error accessing projects:', e.message);
}

db.close();
