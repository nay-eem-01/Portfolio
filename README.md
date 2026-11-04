# Nayeem Ahmed: portfolio

Next.js (App Router) exported as a static site to `out/`, deployed on Netlify (`netlify.toml`).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # writes out/
```

- Everything the page says is in `content/site.ts`: experience, projects, skills, links.
- Project screenshots live in `public/projects/<slug>.jpg` (16:10). A project without `image` shows a
  placeholder slot.
- The resume PDF is `public/Nayeem-Ahmed-Resume.pdf`; its LaTeX source is `resume/`.
- Tokens and base styles: `app/tokens.css`, `app/base.css`; page styles: `app/globals.css`.
