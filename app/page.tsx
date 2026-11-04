import Link from 'next/link';
import Links from '@/components/Links';
import Reveal from '@/components/Reveal';
import ScrollSpy from '@/components/ScrollSpy';
import { about, education, jobs, person, projects, skills } from '@/content/site';

const sections = [['about', 'About'], ['experience', 'Experience'], ['projects', 'Projects'], ['skills', 'Skills'], ['contact', 'Contact']];

export default function Home() {
  return (
    <div className="container shell">
      <header className="rail">
        <div className="rail__id">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="avatar" src={person.photo} alt="" width={64} height={64} />
          <h1>{person.name}</h1>
          <p className="rail__role">{person.role}</p>
          <p className="rail__line">{person.line}</p>
          <p className="rail__now"><span className="now-dot" aria-hidden="true" />{person.now}</p>
        </div>
        <nav className="rail__nav" aria-label="Sections">
          {sections.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
        <Links />
      </header>

      <main id="main" className="content">
        <section id="about" className="block">
          <h2 className="visually-hidden">About</h2>
          <p className="about__lead">{about.lead}</p>
          <p>{about.body}</p>
        </section>

        <section id="experience" className="block" data-reveal>
          <h2>Experience</h2>
          <ol className="jobs">
            {jobs.map((j) => (
              <li key={j.title} className="job">
                <p className="job__when"><time dateTime={j.from}>{j.when}</time></p>
                <div>
                  <h3>{j.title} <span className="at">at {j.company}</span></h3>
                  <p>{j.summary}</p>
                  <ul className="tags" aria-label="Technologies">{j.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
              </li>
            ))}
          </ol>
          <a className="more" href={person.resume}>Full CV, PDF</a>
        </section>

        <section id="projects" className="block">
          <h2>Projects</h2>
          <p className="muted block__sub">Built alone, end to end. Each one has a case study on the decision worth asking about.</p>
          {projects.map((p) => (
            <article key={p.slug} className="proj" data-reveal>
              <Link className="proj__shot" href={`/projects/${p.slug}/`} tabIndex={-1} aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt="" loading="lazy" />
              </Link>
              <div className="proj__body">
                <h3><Link href={`/projects/${p.slug}/`}>{p.name}</Link></h3>
                <p>{p.summary}</p>
                <p className="decision"><span>The decision</span>{p.decision}</p>
                <p className="proj__stack">{p.stack}</p>
                <p className="proj__links">
                  <Link href={`/projects/${p.slug}/`}>Read the case study</Link>
                  {p.live && <a className="live" href={p.live.href}>{p.live.label}</a>}
                  <a href={p.links[0].href}>Code</a>
                </p>
              </div>
            </article>
          ))}
        </section>

        <section id="skills" className="block" data-reveal>
          <h2>Skills</h2>
          <dl className="skills">
            {skills.map((s) => <div key={s.group}><dt>{s.group}</dt><dd>{s.items}</dd></div>)}
          </dl>
          <p className="edu">{education}</p>
        </section>

        <section id="contact" className="block contact" data-reveal>
          <h2>Hiring for a backend role?</h2>
          <p>Email reaches me fastest. Based in Dhaka, open to on-site or remote roles.</p>
          <p><a className="btn btn--primary" href={`mailto:${person.email}`}>{person.email}</a></p>
        </section>

        <footer className="colophon muted">Built with Next.js and plain CSS, exported as static HTML. Set in Hepta Slab and Rethink Sans. <a href="https://github.com/nay-eem-01/Portfolio">Source</a>.</footer>
      </main>
      <ScrollSpy navSelector=".rail__nav" />
      <Reveal />
    </div>
  );
}
