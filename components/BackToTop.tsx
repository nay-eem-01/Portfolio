'use client';
import { useEffect, useState } from 'react';

// A link to the top of the page. With script it appears after the first screen and scrolls
// smoothly (instantly under reduced motion); without script it is a plain link that still works.
export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <a className="totop" href="#top" aria-label="Back to top" data-show={show} tabIndex={show ? 0 : -1} onClick={(e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      document.getElementById('top')?.focus({ preventScroll: true });
    }}>
      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
    </a>
  );
}
