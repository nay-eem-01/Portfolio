# Nayeem Ahmed: portfolio

Next.js (App Router) exported as static HTML to `out/` and deployed on Netlify (`netlify.toml`).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # writes out/
```

## Editing content

Open **`/admin/`** on the live site and sign in with GitHub. The panel uses the site's own design.
Each Publish saves the file to `main` through the GitHub API, and Netlify rebuilds the site in about a
minute. Only GitHub accounts with write access to this repository can edit; anyone else is told they
have no access. The GitHub token lives in the browser tab only and is gone when the tab closes.

The panel edits these files, which you can also edit by hand:

- `content/profile.json`: name, role, intro, links, photo, CV, about, skills, writing, contact card
- `content/experience.json`: companies and their roles (add a role there when you are promoted)
- `content/projects/<slug>.json`: one file per project and its case study (the panel adds and deletes them)

Uploads go to `public/projects/` (screenshots), `public/images/` (photo) and `public/` (CV).
`content/site.ts` reads the JSON at build time and fails the build with a clear message if a required
field is missing, so a bad edit never reaches the live site. The fields the panel shows are defined
in `lib/admin/schema.ts`.

### One-time setup for GitHub sign-in

1. GitHub: Settings > Developer settings > OAuth Apps > New OAuth App.
   Homepage URL: `https://nayeem-ahmed-portfolio.netlify.app`.
   Authorization callback URL: `https://api.netlify.com/auth/done`.
   Create it, then generate a client secret.
2. Netlify: Project configuration > Access & security > OAuth > Install provider > GitHub.
   Paste the client ID and secret.
3. Visit `/admin/` and choose Sign in with GitHub.

### Editing locally without GitHub

```bash
npm run dev            # terminal 1
npm run admin:local    # terminal 2: serves the files in content/ and public/ to the panel
```

Then open `http://localhost:3000/admin/`. Saves write straight to the files on disk.

### Contact form

Messages from the contact card go through Formspree (`contact.formEndpoint` in `profile.json`),
which emails them to you. Manage spam and notifications in your Formspree dashboard.

## Code

- `app/page.tsx` is the homepage; `app/projects/[slug]/page.tsx` renders each case study.
- `app/globals.css` holds the design system (light and dark tokens) and all styles.
- `components/admin/` is the admin panel; `lib/admin/` holds its GitHub client, sign-in and schema.
