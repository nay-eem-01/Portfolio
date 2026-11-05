import { REPO, apiBase } from './config';

export class GitHubError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

const toBase64 = (text: string) => {
  const bytes = new TextEncoder().encode(text);
  let s = ''; bytes.forEach((b) => { s += String.fromCharCode(b); });
  return btoa(s);
};
const fromBase64 = (b64: string) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\n/g, '')), (c) => c.charCodeAt(0)));

// A thin client for the GitHub contents API, scoped to the portfolio repo and branch.
export class Repo {
  constructor(private token: string) {}

  private async call<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${apiBase()}${path}`, {
      ...init,
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json', ...init.headers },
      cache: 'no-store',
    });
    if (!res.ok) {
      const msg = res.status === 409 ? 'This file changed since you opened it. Reload it, then make your edit again.'
        : res.status === 401 ? 'Your sign-in has expired. Sign in again.'
        : res.status === 403 || res.status === 404 ? 'Your GitHub account cannot edit this repository.'
        : `GitHub answered ${res.status}.`;
      throw new GitHubError(msg, res.status);
    }
    return res.status === 204 ? (undefined as T) : (res.json() as Promise<T>);
  }

  private contents = (path: string) => `/repos/${REPO.owner}/${REPO.name}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;

  async user() { return this.call<{ login: string; avatar_url?: string }>('/user'); }

  async canWrite() {
    const r = await this.call<{ permissions?: { push?: boolean } }>(`/repos/${REPO.owner}/${REPO.name}`);
    return !!r.permissions?.push;
  }

  async list(dir: string) {
    const items = await this.call<{ name: string; path: string; type: string }[]>(`${this.contents(dir)}?ref=${REPO.branch}`);
    return items.filter((i) => i.type === 'file');
  }

  async readJson<T>(path: string): Promise<{ data: T; sha: string }> {
    const f = await this.call<{ content: string; sha: string }>(`${this.contents(path)}?ref=${REPO.branch}`);
    return { data: JSON.parse(fromBase64(f.content)) as T, sha: f.sha };
  }

  async writeJson(path: string, data: unknown, message: string, sha?: string) {
    const r = await this.call<{ content: { sha: string } }>(this.contents(path), {
      method: 'PUT',
      body: JSON.stringify({ message, content: toBase64(JSON.stringify(data, null, 2) + '\n'), branch: REPO.branch, ...(sha ? { sha } : {}) }),
    });
    return r.content.sha;
  }

  async upload(path: string, base64: string, message: string) {
    let sha: string | undefined;
    try { sha = (await this.call<{ sha: string }>(`${this.contents(path)}?ref=${REPO.branch}`)).sha; } catch { /* new file */ }
    await this.call(this.contents(path), { method: 'PUT', body: JSON.stringify({ message, content: base64, branch: REPO.branch, ...(sha ? { sha } : {}) }) });
  }

  async remove(path: string, sha: string, message: string) {
    await this.call(this.contents(path), { method: 'DELETE', body: JSON.stringify({ message, sha, branch: REPO.branch }) });
  }
}
