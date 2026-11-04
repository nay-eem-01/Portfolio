# Nayeem Ahmed: portfolio

Next.js (App Router) exported as static HTML to `out/` and deployed on Netlify (`netlify.toml`).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # writes out/
```

- `content/site.ts` holds every word: profile, experience, projects and their case studies, skills.
  Each case study answers the same seven questions; its `architecture.steps` drive the request trace.
- `app/page.tsx` is the homepage; `app/projects/[slug]/page.tsx` renders one case study per project.
- `app/globals.css` holds the design system (tokens for light and dark) and all styles.
- Screenshots: `public/projects/<slug>.jpg` at 16:10. The resume PDF: `public/Nayeem-Ahmed-Resume.pdf`
  (LaTeX source in `resume/`).
