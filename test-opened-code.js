const http = require('http');
const baseUrl = 'http://127.0.0.1:8000';

// Paths to test
const paths = [
  '/',
  '/api',
  '/api/models',
  '/v1/models',
  '/api/chat',
  '/v1/chat/completions',
  '/api/generate',
  '/chat'
];

console.log('Testing OpenCode API endpoints...');
console.log('Base URL:', baseUrl);
console.log('---');

paths.forEach(path => {
  const url = baseUrl + path;
  
  http.get(url, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      console.log(`Path: ${path}`);
      console.log(`  Status: ${res.statusCode}`);
      console.log(`  Content-Type: ${res.headers['content-type']}`);
      console.log(`  Body (first 150 chars): ${data.substring(0, 150)}`);
      console.log('---');
    });
  }).on('error', (err) => {
    console.log(`Path: ${path}`);
    console.log(`  Error: ${err.message}`);
    console.log('---');
  });
});

// Test POST to chat completions
setTimeout(() => {
  console.log('\nTesting POST to /v1/chat/completions...');
  const postData = JSON.stringify({
    model: 'qwen2.5:1.5b',
    messages: [{ role: 'user', content: 'Hola' }]
  });
  
  const options = {
    hostname: '127.0.0.1',
    port: 8000,
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      console.log(`POST /v1/chat/completions`);
      console.log(`  Status: ${res.statusCode}`);
      console.log(`  Response: ${data.substring(0, 200)}`);
    });
  });
  
  req.on('error', (err) => {
    console.log(`POST error: ${err.message}`);
  });
  
  req.write(postData);
  req.end();
}, 2000);
