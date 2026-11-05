// Local stand-in for the parts of the GitHub contents API the admin panel uses, backed by the
// files in this repository. Lets you edit content at http://localhost:3000/admin/ with no sign-in.
//   npm run dev            (terminal 1)
//   npm run admin:local    (terminal 2)
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PORT = 8787;
const ALLOWED = ['content/', 'public/']; // the panel may only touch these folders
const sha = (buf) => createHash('sha1').update(buf).digest('hex');

const send = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET,PUT,DELETE,OPTIONS' });
  res.end(body === undefined ? '' : JSON.stringify(body));
};

function resolve(rel) {
  const clean = path.posix.normalize(decodeURIComponent(rel)).replace(/^\/+/, '');
  if (!ALLOWED.some((a) => clean.startsWith(a)) || clean.includes('..')) return null;
  return { rel: clean, abs: path.join(ROOT, clean) };
}

createServer((req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204);
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname === '/user') return send(res, 200, { login: 'local' });
  const m = url.pathname.match(/^\/repos\/[^/]+\/[^/]+(?:\/contents\/(.*))?$/);
  if (!m) return send(res, 404, { message: 'Not found' });
  if (m[1] === undefined) return send(res, 200, { permissions: { push: true } });
  const f = resolve(m[1]);
  if (!f) return send(res, 403, { message: 'Outside content/ and public/' });

  if (req.method === 'GET') {
    if (!existsSync(f.abs)) return send(res, 404, { message: 'Not found' });
    if (statSync(f.abs).isDirectory()) {
      return send(res, 200, readdirSync(f.abs).map((n) => ({ name: n, path: `${f.rel}/${n}`, type: statSync(path.join(f.abs, n)).isDirectory() ? 'dir' : 'file' })));
    }
    const buf = readFileSync(f.abs);
    return send(res, 200, { name: path.basename(f.abs), path: f.rel, sha: sha(buf), content: buf.toString('base64') });
  }

  let body = '';
  req.on('data', (c) => { body += c; });
  req.on('end', () => {
    const b = body ? JSON.parse(body) : {};
    const exists = existsSync(f.abs);
    if (exists && b.sha !== sha(readFileSync(f.abs))) return send(res, 409, { message: 'sha mismatch' });
    if (req.method === 'PUT') {
      if (!exists && b.sha) return send(res, 404, { message: 'Not found' });
      mkdirSync(path.dirname(f.abs), { recursive: true });
      const buf = Buffer.from(b.content, 'base64');
      writeFileSync(f.abs, buf);
      console.log(`saved ${f.rel}: ${b.message}`);
      return send(res, exists ? 200 : 201, { content: { sha: sha(buf), path: f.rel } });
    }
    if (req.method === 'DELETE') {
      if (!exists) return send(res, 404, { message: 'Not found' });
      rmSync(f.abs);
      console.log(`deleted ${f.rel}: ${b.message}`);
      return send(res, 200, {});
    }
    send(res, 405, { message: 'Method not allowed' });
  });
}).listen(PORT, () => console.log(`Admin local file server on http://localhost:${PORT} (editing ${ROOT})`));
