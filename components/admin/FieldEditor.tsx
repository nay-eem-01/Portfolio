'use client';
import { useId, useState } from 'react';
import type { Field } from '@/lib/admin/schema';

type V = unknown;
type Obj = Record<string, V>;
export type Uploader = (file: File, dir: string, prefix: string) => Promise<{ value: string; preview: string }>;

// Draws one field from the schema and reports changes upward. Objects and lists recurse.
export function FieldEditor({ field, value, onChange, upload, showAdvanced }: {
  field: Field; value: V; onChange: (v: V) => void; upload: Uploader; showAdvanced: boolean;
}) {
  const id = useId();
  if (field.advanced && !showAdvanced) return null;
  const hint = field.hint ? <p className="af__hint" id={`${id}-hint`}>{field.hint}</p> : null;
  const label = <label className="af__label" htmlFor={id}>{field.label}{field.required && <span className="af__req" aria-hidden="true"> *</span>}</label>;
  const describedBy = field.hint ? `${id}-hint` : undefined;
  const s = (value ?? '') as string;

  switch (field.type) {
    case 'string': case 'url': case 'email':
      return <div className="af">{label}<input id={id} type={field.type === 'string' ? 'text' : field.type} value={s} required={field.required} aria-describedby={describedBy} onChange={(e) => onChange(e.target.value)} />{hint}</div>;
    case 'date': case 'month':
      return <div className="af af--narrow">{label}<input id={id} type={field.type} value={s} required={field.required} aria-describedby={describedBy} onChange={(e) => onChange(e.target.value)} />{hint}</div>;
    case 'number':
      return <div className="af af--narrow">{label}<input id={id} type="number" value={value === undefined || value === null ? '' : String(value)} aria-describedby={describedBy} onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />{hint}</div>;
    case 'boolean':
      return <div className="af af--check"><input id={id} type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />{label}{hint}</div>;
    case 'text':
      return <div className="af">{label}<textarea id={id} value={s} rows={Math.min(10, Math.max(3, Math.ceil(s.length / 90)))} required={field.required} aria-describedby={describedBy} onChange={(e) => onChange(e.target.value)} />{hint}</div>;
    case 'code':
      return <div className="af">{label}<textarea id={id} className="af__code" value={s} rows={Math.max(4, s.split('\n').length + 1)} spellCheck={false} aria-describedby={describedBy} onChange={(e) => onChange(e.target.value)} />{hint}</div>;
    case 'image': case 'file':
      // The visible title is a span: the Upload button is the file input's own label.
      return <MediaField id={id} field={field} value={s} onChange={onChange} upload={upload} hint={hint}
        label={<span className="af__label" id={`${id}-title`}>{field.label}{field.required && <span className="af__req" aria-hidden="true"> *</span>}</span>} />;
    case 'object': {
      const o = (value ?? {}) as Obj;
      return (
        <fieldset className="af-group">
          <legend>{field.label}</legend>
          {hint}
          {field.fields.map((f) => <FieldEditor key={f.key} field={f} value={o[f.key]} upload={upload} showAdvanced={showAdvanced} onChange={(v) => onChange({ ...o, [f.key]: v })} />)}
        </fieldset>
      );
    }
    case 'list':
      return <ListField field={field} value={(value ?? []) as V[]} onChange={onChange} upload={upload} showAdvanced={showAdvanced} hint={hint} />;
  }
}

function MediaField({ id, field, value, onChange, upload, label, hint }: {
  id: string; field: Extract<Field, { type: 'image' | 'file' }>; value: string; onChange: (v: V) => void; upload: Uploader; label: React.ReactNode; hint: React.ReactNode;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [preview, setPreview] = useState('');
  const shown = preview || value;
  return (
    <div className="af">
      {label}
      <div className="af-media">
        {field.type === 'image'
          // eslint-disable-next-line @next/next/no-img-element
          ? <div className="af-media__thumb">{shown ? <img src={shown} alt="" /> : <span>No image</span>}</div>
          : <p className="af-media__file">{value ? <a href={value}>{value.split('/').pop()}</a> : 'No file'}</p>}
        <div className="af-media__actions">
          <input id={id} className="visually-hidden" type="file" accept={field.accept} disabled={busy} aria-labelledby={`${id}-title ${id}-btn`} onChange={async (e) => {
            const file = e.target.files?.[0]; e.target.value = '';
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) { setErr('Files must be 5 MB or smaller.'); return; }
            setBusy(true); setErr('');
            try { const r = await upload(file, field.dir, field.prefix); setPreview(r.preview); onChange(r.value); }
            catch (x) { setErr((x as Error).message); }
            finally { setBusy(false); }
          }} />
          <label className="btn" htmlFor={id} id={`${id}-btn`}>{busy ? 'Uploading…' : value ? 'Replace' : 'Upload'}</label>
          {value && !field.required && <button className="btn btn--quiet" type="button" onClick={() => { setPreview(''); onChange(''); }}>Remove</button>}
        </div>
      </div>
      {err && <p className="af__err" role="alert">{err}</p>}
      {hint}
    </div>
  );
}

function ListField({ field, value, onChange, upload, showAdvanced, hint }: {
  field: Extract<Field, { type: 'list' }>; value: V[]; onChange: (v: V) => void; upload: Uploader; showAdvanced: boolean; hint: React.ReactNode;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const primitive = field.of.type !== 'object';
  const set = (i: number, v: V) => onChange(value.map((x, k) => (k === i ? v : x)));
  const move = (i: number, d: number) => { const j = i + d; if (j < 0 || j >= value.length) return; const n = [...value]; [n[i], n[j]] = [n[j], n[i]]; onChange(n); if (open === i) setOpen(j); };
  const remove = (i: number) => { onChange(value.filter((_, k) => k !== i)); setOpen(null); };
  const add = () => {
    const blank = primitive ? '' : Object.fromEntries((field.of as Extract<Field, { type: 'object' }>).fields.map((f) => [f.key, f.type === 'list' ? [] : f.type === 'object' ? {} : '']));
    onChange([...value, blank]); setOpen(value.length);
  };

  return (
    <fieldset className="af-group af-list">
      <legend>{field.label}</legend>
      {hint}
      <ol className="af-items">
        {value.map((item, i) => {
          const title = primitive ? '' : String((item as Obj)?.[field.summary ?? ''] || `${field.itemLabel} ${i + 1}`);
          return (
            <li key={i} className="af-item">
              {primitive ? (
                <div className="af-item__row">
                  {field.of.type === 'text'
                    ? <textarea aria-label={`${field.itemLabel} ${i + 1}`} value={String(item ?? '')} rows={3} onChange={(e) => set(i, e.target.value)} />
                    : <input aria-label={`${field.itemLabel} ${i + 1}`} type="text" value={String(item ?? '')} onChange={(e) => set(i, e.target.value)} />}
                  <ItemTools i={i} n={value.length} move={move} remove={remove} label={field.itemLabel} />
                </div>
              ) : (
                <>
                  <div className="af-item__head">
                    <button className="af-item__toggle" type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d={open === i ? 'M6 15l6-6 6 6' : 'M9 6l6 6-6 6'} /></svg>
                      {title}
                    </button>
                    <ItemTools i={i} n={value.length} move={move} remove={remove} label={field.itemLabel} />
                  </div>
                  {open === i && (
                    <div className="af-item__body">
                      {(field.of as Extract<Field, { type: 'object' }>).fields.map((f) => (
                        <FieldEditor key={f.key} field={f} value={(item as Obj)?.[f.key]} upload={upload} showAdvanced={showAdvanced} onChange={(v) => set(i, { ...(item as Obj), [f.key]: v })} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ol>
      <button className="btn btn--quiet af-add" type="button" onClick={add}>
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        Add {field.itemLabel.toLowerCase()}
      </button>
    </fieldset>
  );
}

function ItemTools({ i, n, move, remove, label }: { i: number; n: number; move: (i: number, d: number) => void; remove: (i: number) => void; label: string }) {
  return (
    <div className="af-tools">
      <button className="af-tool" type="button" aria-label={`Move ${label.toLowerCase()} ${i + 1} up`} disabled={i === 0} onClick={() => move(i, -1)}>
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6 15l6-6 6 6" /></svg>
      </button>
      <button className="af-tool" type="button" aria-label={`Move ${label.toLowerCase()} ${i + 1} down`} disabled={i === n - 1} onClick={() => move(i, 1)}>
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <button className="af-tool af-tool--danger" type="button" aria-label={`Remove ${label.toLowerCase()} ${i + 1}`} onClick={() => remove(i)}>
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 7h14M10 11v6M14 11v6M7 7l1 12h8l1-12M9 7V4h6v3" /></svg>
      </button>
    </div>
  );
}
