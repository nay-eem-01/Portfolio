'use client';
import { useEffect, useRef, useState } from 'react';

// On phones the project list becomes a swipeable row (CSS scroll-snap, so it works without this script).
// This adds previous/next buttons and a position count; on wide screens the list stays a list.
export default function ProjectRail({ count, children }: { count: number; children: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const on = () => {
      const card = el.firstElementChild as HTMLElement | null;
      if (!card) return;
      setAt(Math.round(el.scrollLeft / (card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0'))));
    };
    el.addEventListener('scroll', on, { passive: true });
    return () => el.removeEventListener('scroll', on);
  }, []);
  const go = (d: number) => {
    const el = track.current;
    const card = el?.children[Math.min(count - 1, Math.max(0, at + d))] as HTMLElement | undefined;
    if (!el || !card) return;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: still ? 'auto' : 'smooth' });
  };
  return (
    <div className="prail">
      <div className="prail__track" ref={track} role="region" aria-label="Projects, swipe for more" tabIndex={0}>{children}</div>
      <div className="prail__controls">
        <button className="btn theme" type="button" aria-label="Previous project" onClick={() => go(-1)} disabled={at <= 0}>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <p className="prail__count" aria-live="polite">{Math.min(at + 1, count)} of {count}</p>
        <button className="btn theme" type="button" aria-label="Next project" onClick={() => go(1)} disabled={at >= count - 1}>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  );
}
