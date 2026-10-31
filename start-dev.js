const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = __dirname;
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

console.log('\n=============================================');
console.log('       🏋️ WORKOUT BUDDY (MERN + CONTEXT)       ');
console.log('=============================================\n');

// 1. Check & Install Dependencies if needed
function ensureDependencies(dir, name) {
  const nodeModulesPath = path.join(dir, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log(`📦 Installing dependencies for ${name}... (this only happens once)`);
    try {
      execSync('npm install', { cwd: dir, stdio: 'inherit', shell: true });
      console.log(`✅ ${name} dependencies installed successfully!\n`);
    } catch (err) {
      console.error(`❌ Failed to install dependencies for ${name}:`, err.message);
    }
  }
}

ensureDependencies(backendDir, 'backend');
ensureDependencies(frontendDir, 'frontend');

// 2. Start Backend
console.log('🚀 Starting Backend server (Express + MongoDB)...');
const backendProcess = spawn('npm', ['run', 'dev'], {
  cwd: backendDir,
  shell: true,
  stdio: 'pipe',
});

backendProcess.stdout.on('data', (data) => {
  const msg = data.toString().trim();
  if (msg) console.log(`\x1b[36m[BACKEND]\x1b[0m ${msg}`);
});

backendProcess.stderr.on('data', (data) => {
  const msg = data.toString().trim();
  if (msg) console.error(`\x1b[31m[BACKEND ERROR]\x1b[0m ${msg}`);
});

// 3. Start Frontend
console.log('⚡ Starting Frontend client (React + Vite)...');
const frontendProcess = spawn('npm', ['run', 'dev'], {
  cwd: frontendDir,
  shell: true,
  stdio: 'pipe',
});

let openedBrowser = false;

frontendProcess.stdout.on('data', (data) => {
  const msg = data.toString().trim();
  if (msg) console.log(`\x1b[32m[FRONTEND]\x1b[0m ${msg}`);

  // Automatically open browser when frontend is ready
  if (!openedBrowser && (msg.includes('Local:') || msg.includes('5173') || msg.includes('ready in'))) {
    openedBrowser = true;
    const url = 'http://localhost:5173';
    console.log(`\n\x1b[35m✨ App is live! Opening ${url} in your browser...\x1b[0m\n`);
    const openCmd = process.platform === 'win32' ? `start ${url}` : process.platform === 'darwin' ? `open ${url}` : `xdg-open ${url}`;
    try {
      execSync(openCmd, { stdio: 'ignore', shell: true });
    } catch (e) {
      // browser launch failed, user can click link
    }
  }
});

frontendProcess.stderr.on('data', (data) => {
  const msg = data.toString().trim();
  if (msg) console.error(`\x1b[33m[FRONTEND LOG]\x1b[0m ${msg}`);
});

// Clean shutdown on Ctrl+C
function cleanup() {
  console.log('\n🛑 Shutting down Workout Buddy servers...');
  if (backendProcess) {
    if (process.platform === 'win32') {
      execSync(`taskkill /pid ${backendProcess.pid} /t /f`, { stdio: 'ignore' });
    } else {
      backendProcess.kill('SIGINT');
    }
  }
  if (frontendProcess) {
    if (process.platform === 'win32') {
      execSync(`taskkill /pid ${frontendProcess.pid} /t /f`, { stdio: 'ignore' });
    } else {
      frontendProcess.kill('SIGINT');
    }
  }
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
