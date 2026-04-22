// test.js - Simple test script to verify API endpoints
const axios = require('axios');

const baseURL = 'http://localhost:3000';

async function testEndpoints() {
  try {
    // Test home endpoint
    console.log('Testing home endpoint...');
    const homeResponse = await axios.get(`${baseURL}/`);
    console.log('Home response:', homeResponse.data);

    // Note: OAuth endpoints require browser interaction and proper Facebook app setup
    console.log('\nOAuth2 endpoints require browser authentication:');
    console.log('- Visit: http://localhost:3000/auth/facebook');
    console.log('- Callback: http://localhost:3000/auth/facebook/callback');

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Only run if server is not already running
const { spawn } = require('child_process');
const server = spawn('node', ['server.js'], { cwd: process.cwd() });

server.stdout.on('data', (data) => {
  console.log(`Server: ${data}`);
  if (data.toString().includes('Server running on port 3000')) {
    testEndpoints().then(() => {
      server.kill();
      process.exit(0);
    });
  }
});

server.stderr.on('data', (data) => {
  console.error(`Server error: ${data}`);
});