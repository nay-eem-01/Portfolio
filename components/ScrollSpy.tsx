'use client';
import { useEffect } from 'react';

// Marks the link in `navSelector` whose section is in view with aria-current="true".
export default function ScrollSpy({ navSelector }: { navSelector: string }) {
  useEffect(() => {
    const links = [...document.querySelectorAll<HTMLAnchorElement>(`${navSelector} a[href*="#"]`)];
    const byId = new Map(links.map((a) => [a.hash.slice(1), a]));
    const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter((s): s is HTMLElement => !!s);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.removeAttribute('aria-current'));
        byId.get(e.target.id)?.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [navSelector]);
  return null;
}
