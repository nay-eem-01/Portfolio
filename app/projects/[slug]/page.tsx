import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ScrollSpy from '@/components/ScrollSpy';
import ThemeToggle from '@/components/ThemeToggle';
import Trace from '@/components/Trace';
import { person, projects } from '@/content/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: `${p.name} case study`, description: p.summary, openGraph: { images: p.image ? [p.image] : ["/images/nayeem.jpg"] } } : {};
}

const toc = [['problem', 'The problem'], ['users', 'Who it is for'], ['built', 'What I built'], ['architecture', 'Architecture'], ['decisions', 'Key decisions'], ['solved', 'How I solved it'], ['next', 'What’s next']];

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];

  return (
    <>
      <header className="bar container">
        <Link className="bar__home" href="/">{person.name}</Link>
        <nav aria-label="Site">
          <Link href="/#projects">Projects</Link>
          <a href={person.resume}>CV</a>
          <ThemeToggle />
          <a className="btn btn--primary" href={`mailto:${person.email}`}>Email me</a>
        </nav>
      </header>

      <main id="main">
        <section className="intro container">
          <Link className="back" href="/#projects">All projects</Link>
          <h1>{p.name}</h1>
          <p className="intro__lead">{p.summary}</p>
          <dl className="meta">
            <div><dt>My role</dt><dd>{p.meta.role}</dd></div>
            <div><dt>Stack</dt><dd>{p.meta.stack}</dd></div>
            <div><dt>Status</dt><dd>{p.meta.status}</dd></div>
            <div><dt>Links</dt><dd>{p.live && <a href={p.live.href}>{p.live.label}</a>} {p.links.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}</dd></div>
          </dl>

        </section>

        <div className="container shot-wrap">
          <figure className="hero-shot">
            {p.image
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={p.image} alt={p.imageAlt} fetchPriority="high" />
              : <span className="slot slot--wide">Screenshot coming soon</span>}
            {p.caption && <figcaption className="muted">{p.caption}</figcaption>}
          </figure>
        </div>

        <div className="container doc">
          <nav className="toc" aria-label="On this page">
            <p className="toc__title">On this page</p>
            {toc.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          </nav>

          <article className="prose">
            <section id="problem"><h2>The problem</h2>{p.problem.map((t) => <p key={t}>{t}</p>)}</section>
            <section id="users"><h2>Who it is for</h2><p>{p.users}</p></section>
            <section id="built"><h2>What I built</h2><ul>{p.built.map((t) => <li key={t}>{t}</li>)}</ul></section>
            <section id="architecture">
              <h2>Architecture</h2>
              <p>{p.architecture.intro}</p>
              <Trace label={p.architecture.label} nodes={p.architecture.nodes} edges={p.architecture.edges} steps={p.architecture.steps} />
            </section>
            <section id="decisions">
              <h2>Key decisions</h2>
              {p.decisions.map((d) => <div key={d.title} className="decision-block"><h3>{d.title}</h3><p>{d.body}</p></div>)}
            </section>
            <section id="solved">
              <h2>How I solved it</h2>
              <p>{p.solved.before}</p>
              {p.solved.code && <pre tabIndex={0} aria-label="Code from the repository"><code>{p.solved.code}</code></pre>}
              <p>{p.solved.after}</p>
            </section>
            <section id="next"><h2>What’s next</h2><ul>{p.next.map((t) => <li key={t}>{t}</li>)}</ul></section>

            <nav className="pager" aria-label="More projects">
              <Link href={`/projects/${next.slug}/`}><span className="muted">Next case study</span>{next.name}</Link>
            </nav>
          </article>
        </div>
      </main>
      <ScrollSpy navSelector=".toc" />
    </>
  );
}
