'use client';
import { useEffect, useRef } from 'react';

// A character field behind the portrait: request noise on the left resolving into quiet lanes.
export default function Field() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const css = getComputedStyle(document.documentElement);
    const tint = ['--color-glyph-1', '--color-glyph-2', '--color-glyph-3', '--color-glyph-4', '--color-accent-deep'].map((v) => css.getPropertyValue(v).trim());
    const ramp = ' .:-=+*#%@';
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, cols = 0, rows = 0, t = 0, on = true, raf = 0;
    const size = () => {
      const r = c.getBoundingClientRect();
      const d = devicePixelRatio || 1;
      w = r.width; h = r.height; c.width = w * d; c.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      cols = Math.ceil(w / 8); rows = Math.ceil(h / 16);
      ctx.font = `12px ${css.getPropertyValue('--font-outlier')}`;
      ctx.textBaseline = 'top';
    };
    const n = (x: number, y: number) => (Math.sin(x * 0.13 + t) + Math.sin(y * 0.31 - t * 0.7) + Math.sin((x + y) * 0.07 + t * 0.4)) / 3;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const laneEvery = Math.max(4, Math.floor(rows / 6));
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const fx = x / cols;
          const lane = y % laneEvery === 0;
          // empty behind the name, densest around the portrait
          const ramp2 = Math.max(0, (fx - 0.42) * 2.2);
          const v = lane ? (fx < 0.42 ? 0 : 0.28 + 0.18 * Math.sin(x * 0.4 - t * 3)) : ((n(x, y) + 1) / 2) * ramp2;
          if (v < 0.2) continue;
          ctx.fillStyle = tint[Math.min(4, Math.floor(v * 5))];
          ctx.fillText(ramp[Math.min(ramp.length - 1, Math.floor(v * ramp.length))], x * 8, y * 16);
        }
      }
    };
    const loop = () => { if (on) { t += 0.02; draw(); } raf = requestAnimationFrame(loop); };
    size(); draw();
    const onResize = () => { size(); draw(); };
    addEventListener('resize', onResize);
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; });
    io.observe(c);
    if (!still) raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', onResize); io.disconnect(); };
  }, []);
  return <canvas ref={ref} className="field" aria-hidden="true" />;
}
