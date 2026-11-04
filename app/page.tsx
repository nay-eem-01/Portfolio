import Field from '@/components/Field';
import Reveal from '@/components/Reveal';
import { GitHubIcon, LinkedInIcon } from '@/components/Icons';
import { education, experience, person, projects, skills } from '@/content/site';

export default function Home() {
  const mail = `mailto:${person.email}`;
  return (
    <>
      <header className="nav">
        <div className="container nav__bar">
          <a className="wordmark" href="#top">Nayeem Ahmed</a>
          <nav aria-label="Sections">
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a className="key key--sm" href={mail}>Email me</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <Field />
          <div className="container hero__grid">
            <div className="hero__text">
              <h1>{person.name}</h1>
              <p className="lead">{person.role}</p>
              <div className="actions">
                <a className="key key--primary" href={mail}>Email me</a>
                <a className="key" href={person.resume}>Resume, PDF</a>
              </div>
              <ul className="connect" aria-label="Elsewhere">
                <li><a href={person.github}><GitHubIcon /><span>GitHub</span></a></li>
                <li><a href={person.linkedin}><LinkedInIcon /><span>LinkedIn</span></a></li>
                <li><a href={mail}><span>{person.email}</span></a></li>
              </ul>
            </div>
            <figure className="portrait">
              <div className="portrait__frame cut">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={person.photo} alt={`Portrait of ${person.name}`} width={1024} height={1024} fetchPriority="high" />
              </div>
              <figcaption className="now graphite cut">
                <span className="now__label">Now</span>
                <span>{person.now}</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="experience" className="section container">
          <div className="head" data-reveal>
            <h2>Where I work</h2>
            <p>Backend developer at Dhrubok Infotech in Dhaka since October 2025.</p>
          </div>
          <ol className="roles">
            {experience.map((r) => (
              <li key={r.title} className={r.current ? 'role role--current' : 'role'} data-reveal>
                <div className="role__when">
                  <time dateTime={r.from}>{r.dates}</time>
                  {r.current && <span className="status">Current role</span>}
                </div>
                <div className="role__body">
                  <h3>{r.title}</h3>
                  <p className="role__org">{r.company}, {r.place}</p>
                  {r.work.map((w) => (
                    <div key={w.name} className="work">
                      <p className="work__name"><strong>{w.name}</strong> <span>{w.what}</span></p>
                      <ul>{w.points.map((p) => <li key={p}>{p}</li>)}</ul>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="projects" className="section section--paper">
          <div className="container">
            <div className="head" data-reveal>
              <h2>Personal projects</h2>
              <p>Built end to end on my own time: API, web app, migrations and tests, all public.</p>
            </div>
            <div className="projects">
              {projects.map((p) => (
                <article key={p.slug} className="project" data-reveal>
                  <figure className="shot cut" data-slot={p.slug} data-alt={p.imageAlt}>
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt={p.imageAlt} loading="lazy" />
                    ) : (
                      <figcaption className="shot__empty">Screenshot goes here: public/projects/{p.slug}.png</figcaption>
                    )}
                  </figure>
                  <div className="project__text">
                    <h3>{p.name}</h3>
                    <p className="project__what">{p.what}</p>
                    <ul>{p.points.map((x) => <li key={x}>{x}</li>)}</ul>
                    <p className="project__stack">{p.stack}</p>
                    <div className="project__links">
                      {p.links.map((l) => (
                        <a key={l.href} className={l.kind === 'live' ? 'key key--sm key--primary' : 'key key--sm'} href={l.href}>
                          {l.kind === 'code' && <GitHubIcon />}
                          <span>{l.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="section container">
          <div className="skills" data-reveal>
            <h2>Skills</h2>
            <table className="ledger">
              <tbody>
                {skills.map((s) => (
                  <tr key={s.group}><th scope="row">{s.group}</th><td>{s.items}</td></tr>
                ))}
                <tr><th scope="row">Education</th><td>{education.degree}, {education.school}. {education.dates}, {education.note}.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="contact" className="close graphite">
          <div className="container close__grid" data-reveal>
            <h2>Hiring a Java backend developer?</h2>
            <div className="close__body">
              <a className="key key--primary" href={mail}>{person.email}</a>
              <p>Dhaka, Bangladesh. Open to backend roles, on site or remote. Phone {person.phone}.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot container">
        <a className="wordmark" href="#top">Nayeem Ahmed</a>
        <ul>
          <li><a href={person.github}>GitHub</a></li>
          <li><a href={person.linkedin}>LinkedIn</a></li>
          <li><a href={person.resume}>Resume</a></li>
        </ul>
      </footer>
      <Reveal />
    </>
  );
}
