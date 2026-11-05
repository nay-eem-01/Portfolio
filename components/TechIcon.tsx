import {
  siApachekafka, siApachemaven, siDocker, siFlyway, siGit, siHibernate, siJunit5, siLinux, siMysql,
  siNeo4j, siOpenjdk, siPostgresql, siReact, siRedis, siSpring, siSpringboot, siSpringsecurity, siTypescript,
} from 'simple-icons';

// Brand marks from Simple Icons (CC0). Skills without a mark render as a text badge.
const icons: Record<string, { path: string }> = {
  java: siOpenjdk, 'spring boot': siSpringboot, 'spring webflux': siSpring, 'project reactor': siSpring,
  'spring mvc': siSpring, 'spring security': siSpringsecurity, 'spring ai': siSpring, 'spring data neo4j': siNeo4j,
  hibernate: siHibernate, postgresql: siPostgresql, pgvector: siPostgresql, neo4j: siNeo4j, mysql: siMysql,
  redis: siRedis, kafka: siApachekafka, 'apache kafka': siApachekafka, flyway: siFlyway, 'junit 5': siJunit5,
  maven: siApachemaven, docker: siDocker, git: siGit, linux: siLinux, typescript: siTypescript, react: siReact,
};

export default function TechIcon({ name }: { name: string }) {
  const icon = icons[name.toLowerCase()];
  if (!icon) return <span className="tech__mono" aria-hidden="true">{name.replace(/[^A-Za-z0-9]/g, '').slice(0, 2)}</span>;
  return (
    <svg className="tech__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={icon.path} fill="currentColor" /></svg>
  );
}
