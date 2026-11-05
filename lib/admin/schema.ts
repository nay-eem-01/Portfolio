// What the admin panel can edit, and how each field is shown. The forms are generated from this,
// so adding a field to the site means adding one line here and using it in the page.

type Base = { key: string; label: string; hint?: string; required?: boolean; advanced?: boolean };
export type Field = Base & (
  | { type: 'string' | 'text' | 'url' | 'email' | 'date' | 'month' | 'code' }
  | { type: 'number' }
  | { type: 'boolean' }
  | { type: 'image' | 'file'; dir: string; prefix: string; accept: string }
  | { type: 'object'; fields: Field[] }
  | { type: 'list'; of: Field; itemLabel: string; summary?: string } // summary: a key of the item to show in its header
);

const str = (key: string, label: string, extra: Partial<Base> = {}): Field => ({ key, label, type: 'string', ...extra });
const text = (key: string, label: string, extra: Partial<Base> = {}): Field => ({ key, label, type: 'text', ...extra });
const strings = (key: string, label: string, itemLabel: string, multiline = false, extra: Partial<Base> = {}): Field =>
  ({ key, label, type: 'list', itemLabel, of: { key: 'value', label: itemLabel, type: multiline ? 'text' : 'string' }, ...extra });

export const profileFields: Field[] = [
  str('name', 'Name', { required: true }),
  str('role', 'Role', { required: true, hint: 'Shown under your name.' }),
  text('line', 'One-line introduction', { required: true }),
  str('now', 'Current position', { hint: 'Shown with the green dot.' }),
  str('location', 'Location'),
  { key: 'photo', label: 'Photo', type: 'image', dir: 'public/images', prefix: '/images', accept: 'image/jpeg,image/png,image/webp' },
  { key: 'resume', label: 'CV (PDF)', type: 'file', dir: 'public', prefix: '', accept: 'application/pdf', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'github', label: 'GitHub URL', type: 'url', required: true },
  { key: 'linkedin', label: 'LinkedIn URL', type: 'url', required: true },
  { key: 'medium', label: 'Medium URL', type: 'url' },
  { key: 'about', label: 'About', type: 'object', fields: [text('lead', 'Opening paragraph', { required: true }), text('body', 'Second paragraph')] },
  {
    key: 'skills', label: 'Skills', type: 'list', itemLabel: 'Skill group', summary: 'group',
    of: { key: 'group', label: 'Skill group', type: 'object', fields: [str('group', 'Group name', { required: true }), strings('items', 'Skills', 'Skill', false, { hint: 'Known tools get their logo automatically.' })] },
  },
  str('education', 'Education'),
  {
    key: 'writing', label: 'Writing', type: 'list', itemLabel: 'Post', summary: 'title',
    of: {
      key: 'post', label: 'Post', type: 'object', fields: [
        str('title', 'Title', { required: true }),
        { key: 'url', label: 'Link', type: 'url', required: true },
        { key: 'date', label: 'Published', type: 'date', required: true },
        { key: 'minutes', label: 'Minutes to read', type: 'number' },
        text('summary', 'Summary'),
        strings('tags', 'Tags', 'Tag'),
      ],
    },
  },
  {
    key: 'contact', label: 'Contact card', type: 'object', fields: [
      str('heading', 'Heading', { required: true }), text('text', 'Text'),
      { key: 'formEndpoint', label: 'Formspree form URL', type: 'url', required: true, hint: 'Messages sent through the form are emailed to you by Formspree.' },
    ],
  },
];

export const experienceFields: Field[] = [
  {
    key: 'companies', label: 'Companies', type: 'list', itemLabel: 'Company', summary: 'company',
    of: {
      key: 'company', label: 'Company', type: 'object', fields: [
        str('company', 'Company name', { required: true }),
        str('location', 'Location'),
        {
          key: 'roles', label: 'Roles at this company', type: 'list', itemLabel: 'Role', summary: 'title', hint: 'Add a role here when you are promoted. The newest role shows first.',
          of: {
            key: 'role', label: 'Role', type: 'object', fields: [
              str('title', 'Job title', { required: true }),
              { key: 'start', label: 'Started', type: 'month', required: true },
              { key: 'end', label: 'Ended', type: 'month', hint: 'Leave empty if this is your current role.' },
              text('summary', 'What you did'),
              strings('tags', 'Technologies', 'Technology'),
            ],
          },
        },
      ],
    },
  },
];

export const projectFields: Field[] = [
  str('name', 'Project name', { required: true }),
  { key: 'order', label: 'Position on the homepage', type: 'number', hint: '1 shows first.' },
  text('summary', 'One-sentence summary', { required: true }),
  text('decision', 'Key decision', { required: true, hint: 'Shown on the homepage card.' }),
  str('stack', 'Stack (one line)'),
  { key: 'image', label: 'Screenshot', type: 'image', dir: 'public/projects', prefix: '/projects', accept: 'image/jpeg,image/png,image/webp', hint: '16:10 works best. Leave empty to show a "screenshot coming soon" box.' },
  str('imageAlt', 'Screenshot description', { hint: 'For people using screen readers.' }),
  str('caption', 'Screenshot caption'),
  {
    key: 'links', label: 'Code links', type: 'list', itemLabel: 'Link', summary: 'label',
    of: { key: 'link', label: 'Link', type: 'object', fields: [str('label', 'Label', { required: true }), { key: 'href', label: 'URL', type: 'url', required: true }] },
  },
  { key: 'live', label: 'Live app', type: 'object', fields: [str('label', 'Label'), { key: 'href', label: 'URL', type: 'url', hint: 'Leave empty if there is no live app.' }] },
  { key: 'meta', label: 'Case study details', type: 'object', fields: [str('role', 'My role', { required: true }), str('stack', 'Full stack', { required: true }), text('status', 'Status', { required: true })] },
  strings('problem', 'The problem', 'Paragraph', true),
  text('users', 'Who it is for'),
  strings('built', 'What I built', 'Item'),
  {
    key: 'architecture', label: 'Architecture and request trace', type: 'object', fields: [
      text('intro', 'Architecture paragraph'),
      str('label', 'Trace title', { hint: 'For example: How an order is placed' }),
      {
        key: 'steps', label: 'Trace steps', type: 'list', itemLabel: 'Step', summary: 'label',
        of: { key: 'step', label: 'Step', type: 'object', fields: [str('label', 'Step name', { required: true }), text('text', 'What happens'), strings('on', 'Boxes to highlight', 'Box id', false, { hint: 'Use the ids from the diagram boxes below.' })] },
      },
      {
        key: 'nodes', label: 'Diagram boxes', type: 'list', itemLabel: 'Box', summary: 'label', advanced: true,
        hint: 'Positions on a 640 by 260 canvas.',
        of: { key: 'node', label: 'Box', type: 'object', fields: [str('id', 'Id', { required: true }), str('label', 'Label', { required: true }), { key: 'x', label: 'X', type: 'number' }, { key: 'y', label: 'Y', type: 'number' }, { key: 'quiet', label: 'Faded', type: 'boolean' }] },
      },
      str('edges', 'Diagram lines (SVG path)', { advanced: true }),
    ],
  },
  {
    key: 'decisions', label: 'Key decisions', type: 'list', itemLabel: 'Decision', summary: 'title',
    of: { key: 'decision', label: 'Decision', type: 'object', fields: [str('title', 'Title', { required: true }), text('body', 'Explanation')] },
  },
  { key: 'solved', label: 'How I solved it', type: 'object', fields: [text('before', 'Before the code'), { key: 'code', label: 'Code', type: 'code', hint: 'Copy it from the repository, do not write it fresh.' }, text('after', 'After the code')] },
  strings('next', "What's next", 'Item'),
];

// A new project starts from this, so every field the pages expect exists.
export const blankProject = (slug: string, name: string, order: number) => ({
  order, slug, name, summary: '', decision: '', stack: '', image: '', imageAlt: name, caption: '',
  links: [], live: { label: 'Live app', href: '' },
  meta: { role: '', stack: '', status: '' },
  problem: [], users: '', built: [],
  architecture: { intro: '', label: '', steps: [], nodes: [], edges: '' },
  decisions: [], solved: { before: '', code: '', after: '' }, next: [],
});

// Lists of plain strings are stored as arrays of strings; the editor wraps them as { value }.
export const isPrimitiveList = (f: Field) => f.type === 'list' && f.of.type !== 'object';

export function missingRequired(fields: Field[], value: Record<string, unknown>, path = ''): string[] {
  const out: string[] = [];
  for (const f of fields) {
    const v = value?.[f.key];
    const here = path ? `${path} > ${f.label}` : f.label;
    if (f.type === 'object') out.push(...missingRequired(f.fields, (v ?? {}) as Record<string, unknown>, here));
    else if (f.type === 'list' && f.of.type === 'object') {
      const of = f.of;
      ((v as Record<string, unknown>[]) ?? []).forEach((item, i) => out.push(...missingRequired(of.fields, item, `${here} ${i + 1}`)));
    } else if (f.required && (v === undefined || v === null || v === '')) out.push(here);
  }
  return out;
}
