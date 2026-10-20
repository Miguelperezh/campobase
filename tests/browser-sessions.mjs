import { spawn } from 'node:child_process';

const url = process.env.CAMPOBASE_TEST_URL;
let server;
try {
  if (!url) {
    process.env.CAMPOBASE_TEST_URL = 'http://127.0.0.1:4226';
    server = spawn('python3', ['-c', `from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
class Handler(SimpleHTTPRequestHandler):
 def log_message(self, *args): pass
class Server(ThreadingHTTPServer):
 request_queue_size = 128
Server(('127.0.0.1', 4226), Handler).serve_forever()`], { stdio: ['ignore', 'ignore', 'inherit'] });
    let ready = false;
    for (let attempt = 0; attempt < 50; attempt++) {
      if (server.exitCode !== null) throw new Error('No se pudo iniciar el servidor aislado.');
      try { ready = (await fetch(process.env.CAMPOBASE_TEST_URL + '/index.html')).ok; } catch {}
      if (ready) break;
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    if (!ready) throw new Error('El servidor de pruebas no responde.');
  }
  await import('./browser-session-delete.mjs');
  await import('./browser-session-tools.mjs');
  await import('./browser-session-delete-guard.mjs');
} finally { server?.kill(); }
