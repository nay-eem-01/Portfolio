// Everything the page says lives here. Edit this file to update the portfolio.

export const person = {
  name: 'Md. Nayeem Ahmed',
  role: 'Java backend developer at Dhrubok Infotech, Dhaka.',
  email: 'ahmedmdnayeem05@gmail.com',
  phone: '+880 1833-849973',
  github: 'https://github.com/nay-eem-01',
  linkedin: 'https://linkedin.com/in/md-nayeem-ahmed',
  resume: '/Nayeem-Ahmed-Resume.pdf',
  photo: '/images/nayeem.jpg',
  now: 'Building chat and sign-in on TaskATask, a Spring WebFlux and Neo4j platform.',
};

export type Role = {
  title: string;
  company: string;
  place: string;
  from: string; // ISO month, for <time>
  dates: string;
  current?: boolean;
  work: { name: string; what: string; points: string[] }[];
};

export const experience: Role[] = [
  {
    title: 'Junior Backend Developer (Java)',
    company: 'Dhrubok Infotech Services Limited',
    place: 'Dhaka',
    from: '2026-01',
    dates: 'Jan 2026 to now',
    current: true,
    work: [
      {
        name: 'TaskATask',
        what: 'Task management platform on Spring WebFlux and Neo4j.',
        points: [
          'Real-time group chat on WebFlux Sinks: pin, archive, mute, scheduled and self-destructing messages, bodies encrypted with Jasypt.',
          'Bulk contact import of up to 10,000 rows on Redis job queues, chunked, with batched duplicate checks.',
          'Appointment accept, reject and reschedule with Kafka notifications synced to Google Calendar and iCalendar.',
          'OAuth2 sign-in with Google, Facebook, Apple and email or phone OTP.',
          'Fixed a Neo4j bug where every save re-fetched every relationship: projection updates for fields, Cypher for relationships.',
        ],
      },
      {
        name: 'Hospitalia',
        what: 'Doctor appointment booking.',
        points: ['Booking, schedule lookup and cancellation workflows that stop double-booking between doctors and patients.'],
      },
    ],
  },
  {
    title: 'Backend Developer (Java) Intern',
    company: 'Dhrubok Infotech Services Limited',
    place: 'Dhaka',
    from: '2025-10',
    dates: 'Oct to Dec 2025',
    work: [
      {
        name: 'Search',
        what: 'Full-text search for an internal product.',
        points: ['Hibernate Search on a Lucene backend with custom analyzers.'],
      },
    ],
  },
];

export type Project = {
  slug: string;
  name: string;
  what: string;
  points: string[];
  stack: string;
  image?: string; // put the screenshot in public/projects/<slug>.png and set this
  imageAlt: string;
  links: { label: string; href: string; kind: 'code' | 'live' }[];
};

export const projects: Project[] = [
  {
    slug: 'agrotrends',
    image: '/projects/agrotrends.jpg',
    name: 'AgroTrends',
    what: 'A farming knowledge platform, like Medium for agriculture, with an AI advisor that answers from the platform’s own posts and cites them.',
    points: [
      'Retrieval-augmented answers: posts chunked into pgvector, top five above 0.7 similarity, sources returned with every answer.',
      'Hardened auth: 15-minute JWTs checked against a session row, rotating single-use refresh tokens, owner-or-admin checks.',
      'React 19 web app in Bangla and English: feeds, claps, bookmarks, Q&A.',
    ],
    stack: 'Spring Boot 3.5, Spring AI, PostgreSQL + pgvector, React 19',
    imageAlt: 'The AgroTrends stories feed with field notes on crops and livestock',
    links: [
      { label: 'Backend code', href: 'https://github.com/nay-eem-01/AgroTrends', kind: 'code' },
      { label: 'Frontend code', href: 'https://github.com/nay-eem-01/agrotrends_web', kind: 'code' },
    ],
  },
  {
    slug: 'senpai-supply',
    image: '/projects/senpai-supply.jpg',
    name: 'Senpai Supply',
    what: 'An anime merchandise shop for Bangladesh: guest checkout, cash on delivery, phone-code sign-in and a 360 product viewer.',
    points: [
      'Modular monolith of nine Maven modules that talk only through interfaces and events.',
      'COD, bKash and SSLCommerz behind one PaymentProvider interface, chosen by config.',
      'Checkout safe to retry with an Idempotency-Key; order emails through a transactional outbox.',
    ],
    stack: 'Spring Boot 3.5, PostgreSQL, Flyway, React 19, Playwright',
    imageAlt: 'The Senpai Supply storefront home page',
    links: [
      { label: 'Backend code', href: 'https://github.com/nay-eem-01/E-commerce-application-with-springboot', kind: 'code' },
      { label: 'Frontend code', href: 'https://github.com/nay-eem-01/ecommerce_web', kind: 'code' },
    ],
  },
  {
    slug: 'courier',
    image: '/projects/courier.jpg',
    name: 'Courier delivery backend',
    what: 'Parcel delivery in the Steadfast and Pathao mould: pickup, hub, rider, cash on delivery and merchant settlement.',
    points: [
      'A parcel moves only along its state machine, with a status history row and @Version optimistic locking.',
      'A COD ledger fed by parcel events; merchants request settlements and admins approve them.',
      'Tests for two settlement requests at once and for approve against reject.',
    ],
    stack: 'Spring Boot, Spring MVC, JPA, PostgreSQL, Flyway, multi-module Maven',
    imageAlt: 'The courier rider endpoints in Swagger UI',
    links: [{ label: 'Backend code', href: 'https://github.com/nay-eem-01/delivery_app', kind: 'code' }],
  },
  {
    slug: 'averyday',
    image: '/projects/averyday.jpg',
    name: 'AveryDay',
    what: 'A habit tracker for self-directed learners, installed on the phone as a PWA.',
    points: [
      'Streaks, XP and goal progress computed on read, so no stored counter can drift; rest days with a weekly limit.',
      'Web push reminders, Google sign-in verified against Google’s keys, refresh-token reuse detection.',
      'Deployed on Render and Vercel; free hosting, so the first request can take a moment to wake.',
    ],
    stack: 'Spring Boot 4, PostgreSQL, Flyway, Testcontainers, React',
    imageAlt: 'The AveryDay home dashboard with completion rates and goals',
    links: [
      { label: 'Live app', href: 'https://averyday.vercel.app', kind: 'live' },
      { label: 'Backend code', href: 'https://github.com/nay-eem-01/habit-tracker', kind: 'code' },
      { label: 'Frontend code', href: 'https://github.com/nay-eem-01/habit-tracker_web', kind: 'code' },
    ],
  },
];

export const skills: { group: string; items: string }[] = [
  { group: 'Languages', items: 'Java, SQL, Cypher, TypeScript, JavaScript, Python' },
  { group: 'Backend', items: 'Spring Boot, Spring WebFlux, Project Reactor, Spring MVC, Spring Security, JPA and Hibernate, Spring Data Neo4j, Spring AI' },
  { group: 'Data and messaging', items: 'PostgreSQL, pgvector, Neo4j, MySQL, Redis, Kafka, Flyway, Lucene' },
  { group: 'Testing and ops', items: 'JUnit 5, Mockito, Testcontainers, Playwright, Docker, GitHub Actions, Linux, Git' },
];

export const education = {
  degree: 'B.Sc. in Computer Science and Engineering',
  school: 'Green University of Bangladesh',
  dates: 'Feb 2022 to Feb 2026',
  note: 'CGPA 3.32',
};
