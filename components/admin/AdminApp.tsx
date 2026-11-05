'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { forgetToken, savedToken, signIn } from '@/lib/admin/auth';
import { REPO, isLocal } from '@/lib/admin/config';
import { GitHubError, Repo } from '@/lib/admin/github';
import { blankProject, experienceFields, missingRequired, profileFields, projectFields, type Field } from '@/lib/admin/schema';
import { FieldEditor, type Uploader } from './FieldEditor';

type Obj = Record<string, unknown>;
type Doc = { path: string; title: string; fields: Field[]; data: Obj; sha: string; saved: string };
type Status = { kind: 'idle' } | { kind: 'saving' } | { kind: 'saved' } | { kind: 'error'; message: string };
type Phase = { kind: 'signed-out'; error?: string } | { kind: 'checking' } | { kind: 'no-access'; login: string } | { kind: 'ready'; login: string; avatar?: string };

const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
const fileToBase64 = (file: File) => new Promise<string>((res, rej) => {
  const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1] ?? ''); r.onerror = () => rej(new Error('Could not read the file.')); r.readAsDataURL(file);
});

export default function AdminApp() {
  const [phase, setPhase] = useState<Phase>({ kind: 'checking' });
  const [repo, setRepo] = useState<Repo | null>(null);
  const [projects, setProjects] = useState<{ path: string; name: string }[]>([]);
  const [doc, setDoc] = useState<Doc | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [advanced, setAdvanced] = useState(false);
  const [menu, setMenu] = useState(false);

  const dirty = !!doc && JSON.stringify(doc.data) !== doc.saved;

  // Start: reuse a token from this tab, or the local file server on localhost.
  const connect = useCallback(async (token: string) => {
    setPhase({ kind: 'checking' });
    const r = new Repo(token);
    try {
      const me = await r.user();
      if (!(await r.canWrite())) { setPhase({ kind: 'no-access', login: me.login }); return; }
      setRepo(r); setPhase({ kind: 'ready', login: me.login, avatar: me.avatar_url });
    } catch (e) {
      forgetToken();
      setPhase({ kind: 'signed-out', error: e instanceof GitHubError && e.status === 401 ? 'Your sign-in expired. Sign in again.' : (e as Error).message });
    }
  }, []);

  useEffect(() => {
    if (isLocal()) { void connect('local'); return; }
    const t = savedToken();
    if (t) void connect(t); else setPhase({ kind: 'signed-out' });
  }, [connect]);

  const loadProjects = useCallback(async (r: Repo) => {
    const files = (await r.list('content/projects')).filter((f) => f.name.endsWith('.json'));
    const items = await Promise.all(files.map(async (f) => {
      const { data } = await r.readJson<{ name?: string; order?: number }>(f.path);
      return { path: f.path, name: data.name || f.name, order: data.order ?? 99 };
    }));
    setProjects(items.sort((a, b) => a.order - b.order));
  }, []);

  const open = useCallback(async (path: string, title: string, fields: Field[]) => {
    if (!repo) return;
    if (dirty && !window.confirm('You have unsaved changes. Leave without saving?')) return;
    setLoading(true); setStatus({ kind: 'idle' }); setMenu(false);
    try {
      const { data, sha } = await repo.readJson<Obj>(path);
      setDoc({ path, title, fields, data, sha, saved: JSON.stringify(data) });
      document.querySelector('.adm-main')?.scrollTo(0, 0);
    } catch (e) { setStatus({ kind: 'error', message: (e as Error).message }); }
    finally { setLoading(false); }
  }, [repo, dirty]);

  useEffect(() => {
    if (!repo) return;
    void loadProjects(repo).catch((e) => setStatus({ kind: 'error', message: (e as Error).message }));
    void open('content/profile.json', 'Profile', profileFields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const upload: Uploader = useMemo(() => async (file, dir, prefix) => {
    if (!repo) throw new Error('Not signed in.');
    const dot = file.name.lastIndexOf('.');
    const name = `${slugify(dot > 0 ? file.name.slice(0, dot) : file.name) || 'file'}${dot > 0 ? file.name.slice(dot).toLowerCase() : ''}`;
    await repo.upload(`${dir}/${name}`, await fileToBase64(file), `content: upload ${name}`);
    return { value: `${prefix}/${name}`, preview: URL.createObjectURL(file) };
  }, [repo]);

  async function save() {
    if (!repo || !doc) return;
    const missing = missingRequired(doc.fields, doc.data);
    if (missing.length) { setStatus({ kind: 'error', message: `Fill in: ${missing.slice(0, 4).join(', ')}${missing.length > 4 ? ` and ${missing.length - 4} more` : ''}.` }); return; }
    setStatus({ kind: 'saving' });
    try {
      const sha = await repo.writeJson(doc.path, doc.data, `content: update ${doc.title.toLowerCase()}`, doc.sha);
      setDoc({ ...doc, sha, saved: JSON.stringify(doc.data) });
      setStatus({ kind: 'saved' });
      if (doc.path.startsWith('content/projects/')) void loadProjects(repo);
    } catch (e) { setStatus({ kind: 'error', message: (e as Error).message }); }
  }

  async function newProject() {
    if (!repo) return;
    const name = window.prompt('Project name')?.trim();
    if (!name) return;
    const slug = slugify(name);
    if (!slug) return;
    const path = `content/projects/${slug}.json`;
    if (projects.some((p) => p.path === path)) { setStatus({ kind: 'error', message: `A project called ${slug} already exists.` }); return; }
    setStatus({ kind: 'saving' });
    try {
      await repo.writeJson(path, blankProject(slug, name, projects.length + 1), `content: add ${slug}`);
      await loadProjects(repo);
      setDoc(null);
      await open(path, name, projectFields);
    } catch (e) { setStatus({ kind: 'error', message: (e as Error).message }); }
  }

  async function deleteProject() {
    if (!repo || !doc || !window.confirm(`Delete ${doc.title}? Its page disappears from the site after the next deploy.`)) return;
    setStatus({ kind: 'saving' });
    try {
      await repo.remove(doc.path, doc.sha, `content: remove ${doc.path.split('/').pop()?.replace('.json', '')}`);
      setDoc(null); await loadProjects(repo);
      setStatus({ kind: 'idle' });
      void open('content/profile.json', 'Profile', profileFields);
    } catch (e) { setStatus({ kind: 'error', message: (e as Error).message }); }
  }

  if (phase.kind !== 'ready') {
    return (
      <main className="adm-gate">
        <div className="adm-gate__card">
          <p className="adm-gate__brand">Portfolio admin</p>
          {phase.kind === 'checking' && <p className="muted" role="status">Checking your access…</p>}
          {phase.kind === 'signed-out' && (
            <>
              <h1>Sign in to edit your site</h1>
              <p className="muted">Use the GitHub account that owns {REPO.owner}/{REPO.name}. Every change you publish is saved to the repository, and the site updates about a minute later.</p>
              {phase.error && <p className="af__err" role="alert">{phase.error}</p>}
              <button className="btn btn--primary" type="button" onClick={async () => {
                try { await connect(await signIn()); } catch (e) { setPhase({ kind: 'signed-out', error: (e as Error).message }); }
              }}>Sign in with GitHub</button>
            </>
          )}
          {phase.kind === 'no-access' && (
            <>
              <h1>No access</h1>
              <p className="muted">The GitHub account <strong>{phase.login}</strong> cannot edit {REPO.owner}/{REPO.name}.</p>
              <button className="btn" type="button" onClick={() => { forgetToken(); setPhase({ kind: 'signed-out' }); }}>Use another account</button>
            </>
          )}
          <a className="adm-gate__back" href="/">Back to the site</a>
        </div>
      </main>
    );
  }

  const isProject = doc?.path.startsWith('content/projects/');
  const nav = (
    <nav className="adm-nav" aria-label="Content">
      <p className="adm-nav__group">Site</p>
      <button type="button" aria-current={doc?.path === 'content/profile.json'} onClick={() => open('content/profile.json', 'Profile', profileFields)}>Profile, skills and writing</button>
      <button type="button" aria-current={doc?.path === 'content/experience.json'} onClick={() => open('content/experience.json', 'Experience', experienceFields)}>Experience</button>
      <p className="adm-nav__group">Projects</p>
      {projects.map((p) => (
        <button key={p.path} type="button" aria-current={doc?.path === p.path} onClick={() => open(p.path, p.name, projectFields)}>{p.name}</button>
      ))}
      <button type="button" className="adm-nav__new" onClick={newProject}>
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        New project
      </button>
      <div className="adm-nav__account">
        <p className="adm-nav__group">Account</p>
        <p className="adm-nav__user">Signed in as {phase.login}</p>
        <a href="/">View site</a>
        {!isLocal() && <button type="button" onClick={() => { forgetToken(); setRepo(null); setDoc(null); setPhase({ kind: 'signed-out' }); }}>Sign out</button>}
      </div>
    </nav>
  );

  return (
    <div className="adm">
      <header className="adm-top">
        <button className="btn theme adm-menu" type="button" aria-label={menu ? 'Close sections' : 'Open sections'} aria-expanded={menu} onClick={() => setMenu(!menu)}>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d={menu ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
        </button>
        <p className="adm-top__brand">Portfolio <span>admin</span></p>
        <div className="adm-top__right">
          {isLocal() && <span className="pill">Local files</span>}
          <a className="adm-top__link" href="/">View site</a>
          <ThemeToggle />
          <span className="adm-top__user">{phase.avatar && /* eslint-disable-next-line @next/next/no-img-element */ <img src={phase.avatar} alt="" width={28} height={28} />}{phase.login}</span>
          {!isLocal() && <button className="btn btn--quiet" type="button" onClick={() => { forgetToken(); setRepo(null); setDoc(null); setPhase({ kind: 'signed-out' }); }}>Sign out</button>}
        </div>
      </header>

      <div className="adm-body">
        <aside className="adm-side" data-open={menu}>{nav}</aside>
        <main className="adm-main" id="main">
          {loading && <p className="muted" role="status">Loading…</p>}
          {!loading && doc && (
            <form className="adm-doc" onSubmit={(e) => { e.preventDefault(); void save(); }} noValidate>
              <div className="adm-doc__head">
                <div>
                  <h1>{doc.title}</h1>
                  <p className="muted">{doc.path}</p>
                </div>
                {isProject && <button className="btn btn--quiet btn--danger" type="button" onClick={deleteProject}>Delete project</button>}
              </div>
              {isProject && (
                <label className="adm-adv"><input type="checkbox" checked={advanced} onChange={(e) => setAdvanced(e.target.checked)} /> Show diagram settings (advanced)</label>
              )}
              {doc.fields.map((f) => (
                <FieldEditor key={`${doc.path}:${f.key}`} field={f} value={doc.data[f.key]} upload={upload} showAdvanced={advanced}
                  onChange={(v) => { setDoc({ ...doc, data: { ...doc.data, [f.key]: v } }); if (status.kind === 'saved') setStatus({ kind: 'idle' }); }} />
              ))}
              {/* Pinned to the bottom of the screen, so Publish is always within reach, on phones too. */}
              <div className="adm-bar">
                <div className="adm-bar__status" role="status" aria-live="polite">
                  {status.kind === 'saving' && <p className="muted">Publishing…</p>}
                  {status.kind === 'saved' && !dirty && <p className="adm-status__ok">Published. The site updates in about a minute.</p>}
                  {status.kind === 'error' && <p className="adm-bar__err">{status.message}</p>}
                  {status.kind !== 'saving' && status.kind !== 'error' && !(status.kind === 'saved' && !dirty) && <p className="muted">{dirty ? 'You have unsaved changes.' : 'No changes yet.'}</p>}
                </div>
                <button className="btn btn--primary" type="submit" disabled={!dirty || status.kind === 'saving'}>{status.kind === 'saving' ? 'Publishing…' : 'Publish'}</button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
