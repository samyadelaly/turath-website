import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Launch Vite Server
console.log('[Dev Server] Launching Vite on port 5173...');
const vitePath = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');
const vite = spawn('node', [vitePath, '--host', '0.0.0.0', '--port', '5173'], {
  cwd: rootDir,
  stdio: ['ignore', 'pipe', 'pipe']
});

vite.stdout.on('data', (d) => {
  const msg = d.toString();
  if (msg.includes('Local:')) {
    console.log('[Dev Server Ready]:', msg.trim());
  }
});

vite.stderr.on('data', (d) => {
  console.error('[Dev Server Error]:', d.toString().trim());
});

// 2. Launch Cloudflare Tunnel with auto-restart
const cloudflaredExe = path.join(rootDir, 'cloudflared.exe');
let tunnel = null;
let restartTimeout = null;

function startTunnel() {
  console.log('[Cloudflare Tunnel] Starting tunnel for http://127.0.0.1:5173...');
  tunnel = spawn(cloudflaredExe, ['tunnel', '--url', 'http://127.0.0.1:5173'], {
    cwd: rootDir,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  const onData = (data) => {
    const text = data.toString();
    const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
    if (match) {
      const tunnelUrl = match[0];
      const calcUrl = `${tunnelUrl}/calculator.html`;
      console.log('\n======================================================');
      console.log('>>> [LIVE MOBILE URL FOR CALCULATOR]:');
      console.log(calcUrl);
      console.log('======================================================\n');
      fs.writeFileSync(path.join(rootDir, 'live_mobile_url.txt'), calcUrl, 'utf8');
    }
  };

  tunnel.stderr.on('data', onData);
  tunnel.stdout.on('data', onData);

  tunnel.on('close', (code) => {
    console.log(`[Cloudflare Tunnel] Exited with code ${code}. Reconnecting in 3 seconds...`);
    clearTimeout(restartTimeout);
    restartTimeout = setTimeout(startTunnel, 3000);
  });
}

startTunnel();

process.on('SIGINT', () => {
  clearTimeout(restartTimeout);
  if (vite) vite.kill();
  if (tunnel) tunnel.kill();
  process.exit();
});
