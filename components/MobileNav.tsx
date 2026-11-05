'use client';
import { useEffect, useRef, useState } from 'react';
import ThemeToggle from './ThemeToggle';

type Item = { href: string; label: string };

// The phone navigation: a top bar with a menu button that opens a full-width sheet.
// Hidden on wide screens, where the rail (home) or the top bar links (case study) take over.
export default function MobileNav({ name, home, items, email, resume }: { name: string; home: string; items: Item[]; email: string; resume: string }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    sheet.current?.querySelector<HTMLElement>('a, button')?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); button.current?.focus(); } };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <div className="mnav">
      <div className="mnav__bar">
        <a className="mnav__name" href={home}>{name}</a>
        <div className="mnav__actions">
          <ThemeToggle />
          <button ref={button} className="btn theme mnav__toggle" type="button" aria-expanded={open} aria-controls="mnav-sheet" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      <div id="mnav-sheet" ref={sheet} className="mnav__sheet" data-open={open} hidden={!open}>
        <nav aria-label="Menu">
          {items.map((i) => <a key={i.href} href={i.href} onClick={() => setOpen(false)}>{i.label}</a>)}
        </nav>
        <div className="mnav__cta">
          <a className="btn btn--primary" href={`mailto:${email}`}>Email me</a>
          <a className="btn" href={resume}>Download CV</a>
        </div>
      </div>
    </div>
  );
}
