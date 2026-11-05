// Reads the site's content from the JSON files the admin panel (/admin) edits:
//   content/profile.json, content/experience.json, content/projects/*.json
// Runs at build time only. Do not publish API paths, live endpoints or unfixed security findings.
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

export type Job = { title: string; company: string; when: string; from: string; summary: string; tags: string[] };
export type TraceNode = { id: string; label: string; x: number; y: number; quiet?: boolean };
export type TraceStep = { label: string; on: string[]; text: string };
export type Link = { label: string; href: string };

export type Project = {
  order: number;
  slug: string;
  name: string;
  summary: string;
  decision: string;
  stack: string;
  image?: string; // without it a blank "screenshot coming soon" slot shows
  imageAlt: string;
  caption?: string;
  links: Link[];
  live?: Link;
  meta: { role: string; stack: string; status: string };
  problem: string[];
  users: string;
  built: string[];
  architecture: { intro: string; label: string; nodes: TraceNode[]; edges: string; steps: TraceStep[] };
  decisions: { title: string; body: string }[];
  solved: { before: string; code?: string; after: string };
  next: string[];
};

type Profile = {
  name: string; role: string; line: string; now: string;
  email: string; github: string; linkedin: string; resume: string; photo: string;
  about: { lead: string; body: string };
  skills: { group: string; items: string }[];
  education: string;
};

const dir = path.join(process.cwd(), 'content');
const read = <T,>(file: string): T => JSON.parse(readFileSync(path.join(dir, file), 'utf8')) as T;

// Fail the build with a readable message rather than publishing a half-empty page.
function need(file: string, obj: Record<string, unknown>, keys: string[]) {
  const missing = keys.filter((k) => obj[k] === undefined || obj[k] === null || obj[k] === '');
  if (missing.length) throw new Error(`${file}: missing ${missing.join(', ')}`);
}

const profile = read<Profile>('profile.json');
need('profile.json', profile, ['name', 'role', 'line', 'email', 'github', 'linkedin', 'resume', 'about', 'skills']);

export const person = {
  name: profile.name, role: profile.role, line: profile.line, now: profile.now,
  email: profile.email, github: profile.github, linkedin: profile.linkedin, resume: profile.resume, photo: profile.photo,
};
export const about = profile.about;
export const skills = profile.skills;
export const education = profile.education;

export const jobs: Job[] = read<{ jobs: Job[] }>('experience.json').jobs ?? [];

export const projects: Project[] = readdirSync(path.join(dir, 'projects'))
  .filter((f) => f.endsWith('.json'))
  .map((f) => {
    const p = read<Project>(`projects/${f}`);
    need(`projects/${f}`, p, ['slug', 'name', 'summary', 'decision', 'architecture', 'meta']);
    // Optional fields the panel may save as empty strings: treat them as absent.
    if (!p.image) delete p.image;
    if (!p.caption) delete p.caption;
    if (!p.live?.href) delete p.live;
    if (!p.solved?.code) delete p.solved.code;
    return p;
  })
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
