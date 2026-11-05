// Where the admin panel reads and writes content.
export const REPO = { owner: 'nay-eem-01', name: 'Portfolio', branch: 'main' };

// On localhost the panel talks to scripts/admin-local.mjs, which edits the files on disk;
// everywhere else it talks to GitHub with the signed-in user's token.
export const isLocal = () => typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
export const apiBase = () => (isLocal() ? 'http://localhost:8787' : 'https://api.github.com');
