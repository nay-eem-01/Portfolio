'use client';
import { useState } from 'react';

// Copies the email address. "Copied" only appears once the clipboard has actually accepted it.
export default function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  return (
    <button className="copy" type="button" onClick={async () => {
      try { await navigator.clipboard.writeText(email); setState('copied'); }
      catch { setState('failed'); }
      setTimeout(() => setState('idle'), 2000);
    }}>
      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        {state === 'copied' ? <path d="M5 12l5 5 9-10" /> : <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></>}
      </svg>
      <span aria-live="polite">{state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy'}</span>
    </button>
  );
}
