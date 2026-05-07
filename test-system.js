const http = require('http');

// Test Hub health
function testHub() {
  return new Promise((resolve) => {
    http.get('http://localhost:3000/health', res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        console.log('Hub Health:', d);
        resolve(JSON.parse(d));
      });
    }).on('error', e => { console.log('Hub error:', e.message); resolve(null); });
  });
}

// Test OpenCode direct
function testOpenCode() {
  return new Promise((resolve) => {
    http.get('http://127.0.0.1:8000/', res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        console.log('OpenCode Status:', res.statusCode);
        console.log('OpenCode Body (first 200 chars):', d.substring(0, 200));
        resolve(res.statusCode);
      });
    }).on('error', e => { console.log('OpenCode error:', e.message); resolve(null); });
  });
}

// Test agents endpoint
function testAgents() {
  return new Promise((resolve) => {
    http.get('http://localhost:3000/agents', res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const agents = JSON.parse(d);
        console.log('Total agents in DB:', agents.length);
        console.log('Sample agent:', JSON.stringify(agents[0]));
        resolve(agents.length);
      });
    }).on('error', e => { console.log('Agents error:', e.message); resolve(0); });
  });
}

// Run all tests
async function runTests() {
  console.log('=== Testing Agency Hub System ===');
  console.log('');
  
  const hubOk = await testHub();
  if (hubOk) {
    console.log('✓ Hub is running');
  } else {
    console.log('✗ Hub is NOT running - start it with: cd D:\\AI_Agency\\agency-hub\\backend && node src/index.js');
  }
  
  console.log('');
  const openCodeStatus = await testOpenCode();
  if (openCodeStatus === 200) {
    console.log('✓ OpenCode is running at 127.0.0.1:8000');
  } else {
    console.log('✗ OpenCode is NOT reachable');
  }
  
  console.log('');
  const agentCount = await testAgents();
  if (agentCount > 0) {
    console.log(`✓ ${agentCount} agents loaded in database`);
  } else {
    console.log('✗ No agents found - run POST /agents/load');
  }
  
  console.log('');
  console.log('=== Integration Points ===');
  console.log('Hub API: http://localhost:3000');
  console.log('OpenCode Brain: http://127.0.0.1:8000');
  console.log('Telegram Webhook: http://localhost:3000/telegram/webhook');
  console.log('');
  console.log('=== Next Steps ===');
  console.log('1. Ensure OpenCode is running on port 8000');
  console.log('2. Configure Telegram bot webhook to: <YOUR_PUBLIC_URL>/telegram/webhook');
  console.log('3. Use the hub endpoints to manage agents and campaigns');
}

runTests();
