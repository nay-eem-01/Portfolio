import { person } from '@/content/site';
import { GitHubIcon, LinkedInIcon, MediumIcon } from './Icons';

export default function Footer({ base = '' }: { base?: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className="foot">
      <div className="container foot__grid">
        <div className="foot__id">
          <p className="foot__name">{person.name}</p>
          <p className="muted">{person.role}</p>
          <p className="muted">{person.location}</p>
        </div>
        <nav className="foot__nav" aria-label="Footer">
          <a href={`${base}#experience`}>Experience</a>
          <a href={`${base}#projects`}>Projects</a>
          <a href={`${base}#writing`}>Writing</a>
          <a href={`${base}#contact`}>Contact</a>
          <a href={person.resume}>CV</a>
        </nav>
        <div className="foot__social">
          <a className="btn theme" href={person.github} aria-label="GitHub"><GitHubIcon /></a>
          <a className="btn theme" href={person.linkedin} aria-label="LinkedIn"><LinkedInIcon /></a>
          {person.medium && <a className="btn theme" href={person.medium} aria-label="Medium"><MediumIcon /></a>}
          <a className="foot__mail" href={`mailto:${person.email}`}>{person.email}</a>
        </div>
      </div>
      <div className="container foot__legal muted">© {year} {person.name}</div>
    </footer>
  );
}
