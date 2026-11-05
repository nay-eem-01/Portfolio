# Nayeem Ahmed: portfolio

Next.js (App Router) exported as static HTML to `out/` and deployed on Netlify (`netlify.toml`).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # writes out/
```

## Editing content

Open **`/admin/`** on the live site and sign in with GitHub. Every Publish is a commit to `main`;
Netlify rebuilds and the change is live in about a minute. Only GitHub accounts with write access to
this repository can sign in.

The panel edits these files, which you can also edit by hand:

- `content/profile.json`: name, role, intro, links, photo, CV, about, skills, education
- `content/experience.json`: jobs
- `content/projects/<slug>.json`: one file per project and its case study (the panel can add new ones)

Screenshots upload to `public/projects/`; the photo to `public/images/`; the CV to `public/`.
`content/site.ts` reads the JSON at build time and fails the build with a clear message if a required
field is missing, so a bad edit never reaches the live site.

### One-time setup for GitHub sign-in

1. GitHub: Settings > Developer settings > OAuth Apps > New OAuth App.
   Homepage URL: `https://nayeem-ahmed-portfolio.netlify.app`.
   Authorization callback URL: `https://api.netlify.com/auth/done`.
   Create it, then generate a client secret.
2. Netlify: Site configuration > Access & security > OAuth > Install provider > GitHub.
   Paste the client ID and secret.
3. Visit `/admin/` and choose Login with GitHub.

### Editing locally without GitHub

```bash
npm run dev            # terminal 1
npx decap-server       # terminal 2, from the repo root
```

Then open `http://localhost:3000/admin/`. Saves write straight to the files in `content/`.

## Code

- `app/page.tsx` is the homepage; `app/projects/[slug]/page.tsx` renders each case study.
- `app/globals.css` holds the design system (light and dark tokens) and all styles.
- `public/admin/config.yml` defines the admin panel's forms.
