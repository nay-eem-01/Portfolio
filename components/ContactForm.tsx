'use client';
import { useState } from 'react';

type State = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string };

// Posts to Formspree, which emails the message to the site owner. Without script, the form
// submits normally and Formspree shows its own confirmation page.
export default function ContactForm({ endpoint, email }: { endpoint: string; email: string }) {
  const [state, setState] = useState<State>({ kind: 'idle' });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ kind: 'sending' });
    try {
      const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (res.ok) { form.reset(); setState({ kind: 'sent' }); return; }
      const body = await res.json().catch(() => null) as { errors?: { message: string }[] } | null;
      setState({ kind: 'error', message: body?.errors?.map((x) => x.message).join(' ') || 'The message could not be sent.' });
    } catch {
      setState({ kind: 'error', message: 'The message could not be sent. Check your connection and try again.' });
    }
  }

  if (state.kind === 'sent') {
    return (
      <div className="form-done" role="status">
        <p className="form-done__title">Message sent.</p>
        <p>Thanks for reaching out. I’ll reply to the email address you gave.</p>
        <button className="btn" type="button" onClick={() => setState({ kind: 'idle' })}>Send another message</button>
      </div>
    );
  }

  const busy = state.kind === 'sending';
  return (
    <form className="cform" action={endpoint} method="POST" onSubmit={submit} noValidate={false}>
      <div className="field">
        <label htmlFor="c-name">Name</label>
        <input id="c-name" name="name" type="text" autoComplete="name" required maxLength={120} />
      </div>
      <div className="field">
        <label htmlFor="c-email">Email</label>
        <input id="c-email" name="email" type="email" autoComplete="email" required maxLength={200} />
      </div>
      <div className="field">
        <label htmlFor="c-message">Message</label>
        <textarea id="c-message" name="message" rows={5} required maxLength={5000} />
      </div>
      {/* Spam trap: people never see or fill this field. */}
      <input className="visually-hidden" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <input type="hidden" name="_subject" value="New message from your portfolio" />
      {state.kind === 'error' && <p className="form-error" role="alert">{state.message} You can also email <a href={`mailto:${email}`}>{email}</a>.</p>}
      <button className="btn btn--primary" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send message'}</button>
    </form>
  );
}
