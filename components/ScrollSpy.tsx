'use client';
import { useEffect } from 'react';

// Marks the link in `navSelector` for the section being read with aria-current="true".
// The current section is the last one whose top has passed a line a third of the way down the
// screen; at the very bottom of the page it is the last section, even if that section is short.
// In a horizontally scrolling bar (the case-study contents on phones) the current link slides into view.
export default function ScrollSpy({ navSelector }: { navSelector: string }) {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(navSelector);
    if (!nav) return;
    const links = [...nav.querySelectorAll<HTMLAnchorElement>('a[href*="#"]')];
    const sections = links.map((a) => document.getElementById(a.hash.slice(1))).filter((s): s is HTMLElement => !!s);
    let current = -1, frame = 0, lockUntil = 0, unlock = 0;

    const mark = (i: number) => {
      if (i === current) return;
      current = i;
      links.forEach((a, k) => (k === i ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
      const a = links[i];
      if (a && nav.scrollWidth > nav.clientWidth) {
        nav.scrollTo({ left: a.offsetLeft - nav.clientWidth / 2 + a.offsetWidth / 2, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }
    };
    const update = () => {
      frame = 0;
      if (performance.now() < lockUntil) return; // a clicked link keeps its highlight while the page jumps
      const line = window.innerHeight / 3;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let i = atBottom ? sections.length - 1 : -1;
      if (!atBottom) sections.forEach((s, k) => { if (s.getBoundingClientRect().top <= line) i = k; });
      mark(i);
    };
    const onScroll = () => {
      if (performance.now() < lockUntil) { clearTimeout(unlock); unlock = window.setTimeout(() => { lockUntil = 0; }, 150); return; }
      if (!frame) frame = requestAnimationFrame(update);
    };
    // A click marks its link at once, so the highlight never lags behind the jump.
    // After the jump settles, normal reading takes over again on the next scroll.
    const onClick = (e: Event) => {
      const k = links.indexOf(e.currentTarget as HTMLAnchorElement);
      if (k < 0) return;
      mark(k);
      lockUntil = performance.now() + 1500;
      clearTimeout(unlock); unlock = window.setTimeout(() => { lockUntil = 0; }, 1500);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    links.forEach((a) => a.addEventListener('click', onClick));
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); links.forEach((a) => a.removeEventListener('click', onClick)); cancelAnimationFrame(frame); clearTimeout(unlock); };
  }, [navSelector]);
  return null;
}
