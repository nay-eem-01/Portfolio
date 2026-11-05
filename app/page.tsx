import Link from 'next/link';
import BackToTop from '@/components/BackToTop';
import ContactForm from '@/components/ContactForm';
import CopyEmail from '@/components/CopyEmail';
import Footer from '@/components/Footer';
import { BriefcaseIcon, GitHubIcon, LinkedInIcon, MediumIcon, PinIcon } from '@/components/Icons';
import Links from '@/components/Links';
import MobileNav from '@/components/MobileNav';
import ProjectRail from '@/components/ProjectRail';
import Reveal from '@/components/Reveal';
import ScrollSpy from '@/components/ScrollSpy';
import TechIcon from '@/components/TechIcon';
import { about, companies, contact, education, person, projects, skills, writing } from '@/content/site';
import { duration, monthLabel, months } from '@/lib/time';

const sections = [['about', 'About'], ['experience', 'Experience'], ['projects', 'Projects'], ['writing', 'Writing'], ['skills', 'Skills'], ['contact', 'Contact']];
const handle = (url: string) => url.replace(/\/+$/, '').split('/').pop() ?? url;
const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function Home() {
  return (
    <>
      <MobileNav name={person.name} home="#top" email={person.email} resume={person.resume} items={sections.map(([id, label]) => ({ href: `#${id}`, label }))} />
      <div className="container shell" id="top" tabIndex={-1}>
        <header className="rail">
          <div className="rail__id">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="avatar" src={person.photo} alt="" width={64} height={64} />
            <h1>{person.name}</h1>
            <p className="rail__role">{person.role}</p>
            <p className="rail__line">{person.line}</p>
            <p className="rail__now"><BriefcaseIcon /><span>{person.now}</span></p>
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
            {companies.map((c) => {
              const first = c.roles[c.roles.length - 1], last = c.roles[0];
              return (
                <article key={c.company} className="company">
                  <header className="company__head">
                    <span className="company__mark" aria-hidden="true">{c.company.charAt(0)}</span>
                    <div>
                      <h3>{c.company}</h3>
                      <p className="muted">{duration(months(first.start, last.end))}, {c.location}</p>
                    </div>
                  </header>
                  <ol className="roles">
                    {c.roles.map((r, i) => (
                      <li key={r.title} className={`role${r.end ? '' : ' role--now'}`}>
                        <span className="role__dot" aria-hidden="true" />
                        <div className="role__body">
                          <p className="role__title">
                            <strong>{r.title}</strong>
                            {!r.end && <span className="pill pill--now">Current</span>}
                            {i < c.roles.length - 1 && <span className="pill">Promoted</span>}
                          </p>
                          <p className="role__when">
                            <time dateTime={r.start}>{monthLabel(r.start)}</time> to {r.end ? <time dateTime={r.end}>{monthLabel(r.end)}</time> : 'present'}
                            <span className="muted">, {duration(months(r.start, r.end))}</span>
                          </p>
                          <p>{r.summary}</p>
                          <ul className="tags" aria-label="Technologies">{r.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                        </div>
                      </li>
                    ))}
                  </ol>
                </article>
              );
            })}
            <a className="more" href={person.resume}>Download full CV (PDF)</a>
          </section>

          <section id="projects" className="block">
            <h2>Projects</h2>
            <p className="muted block__sub">Projects I designed and built on my own, from the database to the user interface. Each one has a case study explaining the key technical decisions.</p>
            <ProjectRail count={projects.length}>
              {projects.map((p) => (
                <article key={p.slug} className="proj">
                  <Link className="proj__shot" href={`/projects/${p.slug}/`} tabIndex={-1} aria-hidden="true">
                    {p.image
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={p.image} alt="" loading="lazy" />
                      : <span className="slot">Screenshot coming soon</span>}
                  </Link>
                  <div className="proj__body">
                    <h3><Link href={`/projects/${p.slug}/`}>{p.name}</Link></h3>
                    <p>{p.summary}</p>
                    <p className="decision"><span>Key decision</span>{p.decision}</p>
                    <p className="proj__stack">{p.stack}</p>
                    <p className="proj__links">
                      <Link href={`/projects/${p.slug}/`}>Read the case study</Link>
                      {p.live && <a className="live" href={p.live.href}>{p.live.label}</a>}
                      <a href={p.links[0].href}>Code</a>
                    </p>
                  </div>
                </article>
              ))}
            </ProjectRail>
          </section>

          {writing.length > 0 && (
            <section id="writing" className="block" data-reveal>
              <h2>Writing</h2>
              <p className="muted block__sub">Notes on Java and backend engineering, published on Medium.</p>
              <ul className="posts">
                {writing.map((w) => (
                  <li key={w.url}>
                    <a className="post" href={w.url}>
                      <span className="post__meta"><time dateTime={w.date}>{dateFmt.format(new Date(w.date))}</time>, {w.minutes} min read</span>
                      <span className="post__title">{w.title}</span>
                      <span className="post__sum">{w.summary}</span>
                      <span className="post__go">Read on Medium</span>
                    </a>
                  </li>
                ))}
              </ul>
              {person.medium && <a className="more" href={person.medium}>All posts on Medium</a>}
            </section>
          )}

          <section id="skills" className="block" data-reveal>
            <h2>Skills</h2>
            <div className="skillset">
              {skills.map((s) => (
                <div key={s.group} className="skillgroup">
                  <h3>{s.group}</h3>
                  <ul className="techs">
                    {s.items.map((t) => <li key={t} className="tech"><TechIcon name={t} /><span>{t}</span></li>)}
                  </ul>
                </div>
              ))}
            </div>
            <p className="edu"><strong>Education</strong> {education}</p>
          </section>

          <section id="contact" className="block" data-reveal>
            <h2>{contact.heading}</h2>
            <div className="contact">
              <p className="contact__lead">{contact.text}</p>
              <div className="contact__mail">
                <a className="contact__email" href={`mailto:${person.email}`}>{person.email.split('@')[0]}@<wbr />{person.email.split('@')[1]}</a>
                <CopyEmail email={person.email} />
              </div>
              <ul className="contact__links">
                <li><a href={person.linkedin}><LinkedInIcon /><span>{handle(person.linkedin)}</span></a></li>
                <li><a href={person.github}><GitHubIcon /><span>{handle(person.github)}</span></a></li>
                {person.medium && <li><a href={person.medium}><MediumIcon /><span>{handle(person.medium)}</span></a></li>}
                <li className="contact__place"><PinIcon /><span>{person.location}</span></li>
              </ul>
              <div className="contact__form">
                <h3>Or send a message</h3>
                <ContactForm endpoint={contact.formEndpoint} email={person.email} />
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
      <BackToTop />
      <ScrollSpy navSelector=".rail__nav" />
      <Reveal />
    </>
  );
}
