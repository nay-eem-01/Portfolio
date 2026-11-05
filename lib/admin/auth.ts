// GitHub sign-in through Netlify's OAuth provider (the same flow Decap CMS uses):
// a popup on api.netlify.com does the OAuth dance and hands the token back with postMessage.
const NETLIFY = 'https://api.netlify.com';
const KEY = 'admin-github-token';

export function savedToken(): string | null {
  try { return sessionStorage.getItem(KEY); } catch { return null; }
}
export function forgetToken() {
  try { sessionStorage.removeItem(KEY); } catch { /* nothing stored */ }
}

export function signIn(): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = `${NETLIFY}/auth?provider=github&site_id=${encodeURIComponent(window.location.host)}&scope=public_repo`;
    const popup = window.open(url, 'github-sign-in', 'width=960,height=640');
    if (!popup) { reject(new Error('The sign-in window was blocked. Allow pop-ups for this site and try again.')); return; }

    const done = (fn: () => void) => { window.removeEventListener('message', onMessage); clearInterval(watch); fn(); };
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== NETLIFY || typeof e.data !== 'string') return;
      if (e.data === 'authorizing:github') { popup.postMessage(e.data, e.origin); return; } // handshake
      if (e.data.startsWith('authorization:github:success:')) {
        const { token } = JSON.parse(e.data.slice('authorization:github:success:'.length)) as { token: string };
        try { sessionStorage.setItem(KEY, token); } catch { /* token lasts for this page only */ }
        done(() => resolve(token));
      } else if (e.data.startsWith('authorization:github:error:')) {
        done(() => reject(new Error('GitHub sign-in failed. Check the OAuth setup in Netlify.')));
      }
    };
    const watch = setInterval(() => { if (popup.closed) done(() => reject(new Error('The sign-in window was closed.'))); }, 500);
    window.addEventListener('message', onMessage);
  });
}
