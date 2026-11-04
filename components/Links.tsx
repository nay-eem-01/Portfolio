import { person } from '@/content/site';
import { GitHubIcon, LinkedInIcon } from './Icons';
import ThemeToggle from './ThemeToggle';

export default function Links() {
  return (
    <div className="rail__links">
      <a className="btn btn--primary" href={`mailto:${person.email}`}>Email me</a>
      <a className="btn" href={person.resume}>CV</a>
      <a className="btn theme" href={person.github} aria-label="GitHub"><GitHubIcon /></a>
      <a className="btn theme" href={person.linkedin} aria-label="LinkedIn"><LinkedInIcon /></a>
      <ThemeToggle />
    </div>
  );
}
