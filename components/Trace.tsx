'use client';
import { useRef, useState } from 'react';
import type { TraceNode, TraceStep } from '@/content/site';

// The request trace: step through one request and see which modules it touches.
export default function Trace({ label, nodes, edges, steps }: { label: string; nodes: TraceNode[]; edges: string; steps: TraceStep[] }) {
  const [i, setI] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const on = steps[i].on;
  const move = (n: number) => { const k = (n + steps.length) % steps.length; setI(k); tabs.current[k]?.focus(); };
  return (
    <figure className="trace" aria-label={label}>
      <div className="trace__steps" role="tablist" aria-label="Steps">
        {steps.map((s, k) => (
          <button
            key={s.label}
            ref={(el) => { tabs.current[k] = el; }}
            role="tab"
            id={`step-${k}`}
            aria-selected={k === i}
            aria-controls="trace-text"
            tabIndex={k === i ? 0 : -1}
            onClick={() => setI(k)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') { e.preventDefault(); move(k + 1); }
              if (e.key === 'ArrowLeft') { e.preventDefault(); move(k - 1); }
            }}
          >
            {k + 1}. {s.label}
          </button>
        ))}
      </div>
      <svg className="diagram" viewBox="0 0 640 260" role="img" aria-label={`Diagram of ${nodes.map((n) => n.label).join(', ')}`}>
        <path className="edge" d={edges} />
        {nodes.map((n) => {
          const w = Math.max(140, Math.round(n.label.length * 8.6 + 28));
          const x = n.x + (140 - w) / 2;
          return (
            <g key={n.id} className={`node${n.quiet ? ' node--quiet' : ''}${on.includes(n.id) ? ' is-on' : ''}`}>
              <rect x={x} y={n.y} width={w} height={44} rx={6} />
              <text x={x + w / 2} y={n.y + 27}>{n.label}</text>
            </g>
          );
        })}
      </svg>
      <figcaption id="trace-text" role="tabpanel" aria-labelledby={`step-${i}`} aria-live="polite">{steps[i].text}</figcaption>
    </figure>
  );
}
