import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requestedPort = process.env.TACTILE_WORLD_PORT || '8765';
if (!/^\d+$/.test(requestedPort) || +requestedPort < 1 || +requestedPort > 65535) throw new Error('TACTILE_WORLD_PORT must be an integer from 1 to 65535.');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8','.pdf':'application/pdf','.csv':'text/csv; charset=utf-8','.png':'image/png'};
const server = http.createServer((req, res) => {
  if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405, {'Allow':'GET, HEAD'}); res.end(); return;}
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    const pieces = pathname.split(/[\\/]+/);
    if (pieces.some(x => x.startsWith('.') && x !== '')) {res.writeHead(403);res.end('Forbidden');return;}
    if (pathname === '/') {res.writeHead(302, {'Location':'/web/'});res.end();return;}
    let target = path.resolve(root, '.' + pathname);
    if (!target.startsWith(root + path.sep)) {res.writeHead(403);res.end('Forbidden');return;}
    if (fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    const stat = fs.statSync(target);
    if (!stat.isFile()) throw new Error('Not a file');
    res.writeHead(200, {'Content-Type':mime[path.extname(target)] || 'application/octet-stream','Content-Length':stat.size,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    if (req.method === 'HEAD') res.end(); else fs.createReadStream(target).pipe(res);
  } catch {
    res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});res.end('Not found');
  }
});
server.on('error', error => {console.error(`Preview unavailable: ${error.message}. Set TACTILE_WORLD_PORT to another free port if needed.`);process.exitCode=1;});
server.listen(+requestedPort, '127.0.0.1', () => console.log(`Tactile World: http://127.0.0.1:${requestedPort}/web/\nPress Ctrl+C to stop.`));
for (const signal of ['SIGINT','SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));

