// Everything the site says lives here. Every claim is checked against the project's own repo and docs.
// Do not publish API paths, live endpoints or unfixed security findings here.

export const person = {
  name: 'Md. Nayeem Ahmed',
  role: 'Backend Engineer, Java and Spring Boot',
  line: 'I build reliable backend systems: clean APIs, solid data models and secure authentication.',
  now: 'Junior Backend Developer at Dhrubok Infotech, Dhaka',
  email: 'ahmedmdnayeem05@gmail.com',
  github: 'https://github.com/nay-eem-01',
  linkedin: 'https://linkedin.com/in/md-nayeem-ahmed',
  resume: '/Nayeem-Ahmed-Resume.pdf',
  photo: '/images/nayeem.jpg',
};

export const about = {
  lead: 'I’m a backend engineer who works with both reactive and traditional Spring. At work I build features on Spring WebFlux, Neo4j and Kafka; in my own projects I use Spring MVC, JPA and PostgreSQL.',
  body: 'I care most about the parts users never see but always feel: payments that are never taken twice, balances that always add up, and accounts that stay secure. I plan each project before I build it, keep database changes in versioned migrations, and write tests alongside the code.',
};

export type Job = { title: string; company: string; when: string; from: string; summary: string; tags: string[] };

export const jobs: Job[] = [
  {
    title: 'Junior Backend Developer',
    company: 'Dhrubok Infotech',
    when: '2026 to present',
    from: '2026-01',
    summary:
      'I work on TaskATask, a task management platform built with Spring WebFlux and Neo4j. I built its real-time group chat with encrypted messages, a bulk contact import that handles up to 10,000 records, appointment notifications through Kafka with Google Calendar sync, and sign-in with Google, Facebook, Apple and one-time codes. I also tracked down and fixed a Neo4j performance bug that reloaded every relationship on each save. Before that, I built the booking and cancellation flows for Hospitalia, a doctor appointment app.',
    tags: ['Spring WebFlux', 'Project Reactor', 'Neo4j', 'Kafka', 'Redis', 'OAuth2'],
  },
  {
    title: 'Backend Developer Intern',
    company: 'Dhrubok Infotech',
    when: '2025',
    from: '2025-10',
    summary: 'I built full-text search with Hibernate Search and Lucene, including custom analyzers for better matching.',
    tags: ['Hibernate Search', 'Lucene'],
  },
];

export type TraceNode = { id: string; label: string; x: number; y: number; quiet?: boolean };
export type TraceStep = { label: string; on: string[]; text: string };
export type Link = { label: string; href: string };

export type Project = {
  slug: string;
  name: string;
  summary: string;
  decision: string;
  stack: string;
  image?: string; // add public/projects/<slug>.jpg (16:10) and set this; without it a blank slot shows
  imageAlt: string;
  caption?: string;
  links: Link[];
  live?: Link;
  meta: { role: string; stack: string; status: string };
  problem: string[];
  users: string;
  built: string[];
  architecture: { intro: string; label: string; nodes: TraceNode[]; edges: string; steps: TraceStep[] };
  decisions: { title: string; body: string }[];
  solved: { before: string; code?: string; after: string };
  next: string[];
};

export const projects: Project[] = [
  {
    slug: 'senpai-supply',
    name: 'Senpai Supply',
    summary: 'An online store for anime merchandise in Bangladesh, with guest checkout and cash on delivery.',
    decision: 'Stock is reduced in a single database update, so two customers can never buy the last item at the same time.',
    stack: 'Spring Boot 3.5, PostgreSQL, Flyway, modular monolith, React 19',
    image: '/projects/senpai-supply.jpg',
    imageAlt: 'The Senpai Supply storefront home page',
    caption: 'The storefront running locally with demo products.',
    links: [
      { label: 'Backend code', href: 'https://github.com/nay-eem-01/E-commerce-application-with-springboot' },
      { label: 'Frontend code', href: 'https://github.com/nay-eem-01/ecommerce_web' },
    ],
    meta: {
      role: 'Sole developer: planning, backend, database, frontend and tests',
      stack: 'Java 21, Spring Boot 3.5, PostgreSQL, Flyway, React 19',
      status: 'Backend and storefront complete. Online payments are built but not yet tested against the providers’ sandboxes.',
    },
    problem: [
      'This is a full rewrite of an e-commerce project I first built while learning Spring Boot. The first version worked on the happy path, but it had serious gaps: weak security, prices stored as floating-point numbers, and no protection against selling more stock than we had.',
      'For the rewrite, I asked one question of every feature: what happens if two people do this at the same moment, or one person clicks twice?',
    ],
    users:
      'The store is designed for shoppers in Bangladesh who buy figures, cosplay, bottles and bags, mostly on their phones and often without a card. It is a portfolio project and does not have real customers yet.',
    built: [
      'Guest checkout with cash on delivery, and sign-in with a one-time code sent by SMS.',
      'A product catalogue with options, specifications and a 360-degree product viewer.',
      'Order management with a clear status lifecycle, plus order tracking for guests.',
      'Product reviews that only verified buyers can leave.',
      'The React storefront, covered by end-to-end tests with Playwright.',
    ],
    architecture: {
      intro:
        'The backend is a modular monolith: nine Maven modules deployed as one application. Modules can only talk to each other through public interfaces or events, so the compiler prevents one module from reaching into another’s database tables.',
      label: 'How an order is placed',
      nodes: [
        { id: 'api', label: 'checkout', x: 250, y: 10 },
        { id: 'order', label: 'order', x: 250, y: 108 },
        { id: 'catalog', label: 'catalog', x: 40, y: 108 },
        { id: 'payment', label: 'payment', x: 460, y: 108 },
        { id: 'notification', label: 'notification', x: 250, y: 206 },
        { id: 'user', label: 'user', x: 40, y: 10, quiet: true },
        { id: 'cart', label: 'cart', x: 460, y: 10, quiet: true },
        { id: 'review', label: 'review', x: 40, y: 206, quiet: true },
        { id: 'common', label: 'common', x: 460, y: 206, quiet: true },
      ],
      edges: 'M320 54v54M250 130h-70M390 130h70M320 152v54',
      steps: [
        { label: 'Request', on: ['api'], text: 'Every checkout request carries a unique idempotency key. If the request is sent twice, the second one returns the original order instead of creating a new one.' },
        { label: 'Price', on: ['order'], text: 'The order module recalculates every price from the database. Prices sent by the browser are never trusted.' },
        { label: 'Stock', on: ['catalog'], text: 'The catalog module reduces stock with one conditional update. If nothing is left, the whole order is cancelled before anything is saved.' },
        { label: 'Save', on: ['order', 'notification'], text: 'The order, its items, its status history and the confirmation email are all saved in one transaction. Either everything is saved, or nothing is.' },
        { label: 'Email', on: ['notification'], text: 'Once the order is saved, a background job sends the email and retries it if sending fails.' },
      ],
    },
    decisions: [
      {
        title: 'Spring MVC instead of WebFlux',
        body: 'I use WebFlux every day at work, but it was the wrong fit here. Checkout updates stock, the order, its items and its history together, and with JPA that is one simple transaction. A reactive version would have added complexity without any benefit at this scale.',
      },
      {
        title: 'The server owns every price',
        body: 'The browser only sends product IDs and quantities. Prices, delivery charges and totals are always calculated on the server from the database, using BigDecimal so money is never rounded incorrectly.',
      },
      {
        title: 'Payment providers behind one interface',
        body: 'Cash on delivery, bKash and SSLCommerz each implement the same PaymentProvider interface. Which provider handles which payment method is set in configuration, so enabling a new one does not require code changes. An order is marked paid only after the provider confirms it server-to-server.',
      },
    ],
    solved: {
      before: 'When two customers try to buy the last item at the same time, checking the stock first and updating it afterwards is not safe. Both checks can pass. Instead, the check and the update happen in a single statement:',
      code: `update Product p set p.stock = p.stock - :qty, p.version = p.version + 1
where p.id = :id and p.stock >= :qty and p.status = ACTIVE`,
      after:
        'If the stock has already run out, the statement updates nothing and the order fails cleanly. Products are always updated in the same order to avoid deadlocks. Order emails are saved to an outbox table in the same transaction and sent afterwards, so a cancelled order never sends an email and two servers never send the same one twice.',
    },
    next: [
      'Add a CI pipeline with integration tests that run against a real PostgreSQL database.',
      'Test bKash and SSLCommerz in their sandboxes before enabling online payments.',
      'Move rate limiting to Redis so the app can safely run on more than one server.',
    ],
  },
  {
    slug: 'agrotrends',
    name: 'AgroTrends',
    summary: 'A knowledge-sharing platform for agriculture, with an AI advisor that answers questions using the platform’s own articles.',
    decision: 'The AI only answers from articles it has retrieved, and it lists them as sources so every answer can be checked.',
    stack: 'Spring Boot 3.5, Spring AI, PostgreSQL with pgvector, React 19',
    image: '/projects/agrotrends.jpg',
    imageAlt: 'The AgroTrends stories page with articles on crops and livestock',
    caption: 'The stories page running locally with sample articles.',
    links: [
      { label: 'Backend code', href: 'https://github.com/nay-eem-01/AgroTrends' },
      { label: 'Frontend code', href: 'https://github.com/nay-eem-01/agrotrends_web' },
    ],
    meta: {
      role: 'Backend and frontend developer: security, AI features and the React app',
      stack: 'Java 21, Spring Boot 3.5, Spring AI, PostgreSQL, pgvector, React 19',
      status: 'Most of the roadmap is complete. The platform has not launched publicly yet.',
    },
    problem: [
      'General AI chatbots can give confident but wrong farming advice, such as an unsafe pesticide dose. Agriculture students and young agronomists in Bangladesh need answers they can verify, in both Bangla and English.',
      'In the earlier version of the project, the AI feature saved articles as embeddings but never used them to answer questions, and authentication and access control needed a full review.',
    ],
    users:
      'The platform is designed first for agriculture students and recent graduates, then for young agronomists who can become verified experts, and for urban and rooftop growers. It has not launched yet, so it has no users.',
    built: [
      'Articles with drafts, tags, likes, bookmarks and follows, similar to Medium.',
      'A question-and-answer section with voting, reputation and expert badges by topic.',
      'An AI advisor that answers from the platform’s articles and shows which ones it used.',
      'Secure sign-in, session management and password reset.',
      'The React web app in Bangla and English, delivered in more than 130 small pull requests.',
    ],
    architecture: {
      intro:
        'A layered Spring Boot application on PostgreSQL. Each article is split into chunks of about 800 tokens and stored in pgvector, together with details such as its author, category and publishing status.',
      label: 'How a question is answered',
      nodes: [
        { id: 'api', label: 'question', x: 250, y: 10 },
        { id: 'quota', label: 'daily limit', x: 40, y: 108 },
        { id: 'retrieve', label: 'pgvector', x: 250, y: 108 },
        { id: 'model', label: 'Gemini', x: 460, y: 108 },
        { id: 'answer', label: 'answer + sources', x: 230, y: 206 },
      ],
      edges: 'M320 54v54M250 130h-70M390 130h70M320 152v54',
      steps: [
        { label: 'Ask', on: ['api'], text: 'A signed-in user with a confirmed email asks a question of up to 1,000 characters.' },
        { label: 'Limit', on: ['quota'], text: 'Each user can ask 20 questions a day, which keeps the AI costs under control.' },
        { label: 'Search', on: ['retrieve'], text: 'The question is converted into a vector, and the five most relevant published articles are found, as long as they are similar enough to be useful.' },
        { label: 'Answer', on: ['model'], text: 'Gemini writes an answer using only those articles. The article text is treated as untrusted input, and slow responses time out after 60 seconds.' },
        { label: 'Cite', on: ['answer'], text: 'The answer is returned with its sources: the title of each article it used, most relevant first.' },
      ],
    },
    decisions: [
      {
        title: 'Only reviewed content reaches the AI',
        body: 'Drafts and unreviewed AI answers are never used as sources. AI-generated answers to community questions are marked as unchecked until an expert confirms or corrects them, and only then become part of the AI’s knowledge.',
      },
      {
        title: 'Sessions that can actually be ended',
        body: 'Access tokens last 15 minutes and are checked against a stored session on every request. Refresh tokens can only be used once and are replaced each time. When a user signs out, their session really ends.',
      },
      {
        title: 'Permission checks live in the service layer',
        body: 'Every change to content goes through one ownership check in the service layer, so a new endpoint cannot accidentally skip it. Private data returns “not found” rather than “forbidden”, so it does not reveal that it exists.',
      },
    ],
    solved: {
      before:
        'The original AI feature stored articles but never used them, and the embedding model it relied on had been retired by Google. I switched to a supported model, split articles into chunks with useful metadata, and added a retrieval step before the AI answers:',
      code: `return RetrievalAugmentationAdvisor.builder()
        .documentRetriever(VectorStoreDocumentRetriever.builder()
                .vectorStore(vectorStore)
                .topK(aiProperties.getRag().getTopK())
                .similarityThreshold(aiProperties.getRag().getSimilarityThreshold())
                .filterExpression(DocumentService.publishedOnly())
                .build())
        .queryAugmenter(blogQueryAugmenter())
        .build();`,
      after: 'When an article is edited, its stored chunks are replaced, and when it is deleted they are removed. The AI never cites an article that has changed or no longer exists.',
    },
    next: [
      'Move the database schema to Flyway migrations.',
      'Run the full application test against a real database in CI using Testcontainers.',
      'Add a GitHub Actions pipeline for builds, tests and secret scanning.',
    ],
  },
  {
    slug: 'courier',
    name: 'Courier backend',
    summary: 'A parcel delivery backend with cash on delivery and merchant payouts, modelled on couriers like Steadfast and Pathao.',
    decision: 'A parcel can only move through allowed statuses, and every move updates its history and the money ledger together.',
    stack: 'Spring MVC, JPA, PostgreSQL, Flyway, multi-module Maven',
    imageAlt: 'Courier backend',
    links: [{ label: 'Backend code', href: 'https://github.com/nay-eem-01/delivery_app' }],
    meta: {
      role: 'Sole developer. Planned and built as an 8-week MVP in 35 pull requests.',
      stack: 'Java 21, Spring Boot, Spring MVC, JPA, PostgreSQL, Flyway',
      status: 'MVP features are complete. Final testing is in progress before deployment.',
    },
    problem: [
      'A courier service is more than storing records. At any moment it must know who has each parcel, what state it is in, which hub it is at, and how much money is owed to whom.',
      'A parcel goes from the merchant to a pickup rider, through a hub, to a delivery rider who collects the cash, and finally the merchant is paid after fees. Any step can fail or be retried, and the money must always add up.',
    ],
    users:
      'It is designed for three groups: merchants who send parcels, riders who pick up and deliver them, and admins who manage hubs and approve payouts. It has not been deployed yet, so it has no users.',
    built: [
      'Merchant registration, hubs, riders and user management.',
      'Delivery pricing, parcel creation and pickup requests.',
      'A parcel status workflow with full history and public tracking.',
      'Pickup and delivery flows for riders.',
      'A cash-on-delivery ledger, a merchant dashboard, and payout requests with admin approval.',
    ],
    architecture: {
      intro:
        'The project is split into Maven modules by business area: users, hubs, pricing, parcels and the ledger. Each module owns its own tables, so the parcel module cannot change ledger data directly. I chose Spring MVC so that a status change, its history and its ledger entry are saved in one transaction.',
      label: 'How a delivery is recorded',
      nodes: [
        { id: 'api', label: 'rider', x: 250, y: 10 },
        { id: 'parcel', label: 'parcel', x: 250, y: 108 },
        { id: 'history', label: 'history', x: 40, y: 108 },
        { id: 'event', label: 'delivered event', x: 460, y: 108 },
        { id: 'ledger', label: 'ledger', x: 250, y: 206 },
      ],
      edges: 'M320 54v54M250 130h-70M390 130h70M530 152v20H320v34',
      steps: [
        { label: 'Deliver', on: ['api'], text: 'The rider marks the parcel as delivered. Only the rider assigned to that parcel can update it.' },
        { label: 'Check', on: ['parcel'], text: 'The status workflow only allows “delivered” after “out for delivery”. Any other move is rejected before anything changes.' },
        { label: 'History', on: ['history'], text: 'A history record is saved showing who changed the status, from what, and when.' },
        { label: 'Event', on: ['event'], text: 'The parcel module publishes a “parcel delivered” event instead of touching the ledger itself.' },
        { label: 'Ledger', on: ['ledger'], text: 'The ledger records the cash collected in the same transaction. If anything fails, the status change is rolled back too.' },
      ],
    },
    decisions: [
      {
        title: 'Optimistic locking on parcels',
        body: 'Each parcel has a version number. If two people update the same parcel at the same time, the second update fails instead of silently overwriting the first.',
      },
      {
        title: 'Database migrations from day one',
        body: 'I used Flyway instead of letting Hibernate generate the schema. That made it possible to store money with exact precision, enforce unique tracking numbers and seed pricing rules, and it keeps development and production databases identical.',
      },
      {
        title: 'Net payouts',
        body: 'Merchants are paid the cash collected minus delivery and cash-handling fees. Any negative balance carries over to the next payout, so the ledger always balances.',
      },
    ],
    solved: {
      before:
        'Payouts are where money bugs hide. A merchant might request a payout twice, or two admins might approve and reject the same payout at once. When a payout is requested, the merchant’s open ledger entries are locked, so a second request has to wait and then finds nothing left to claim:',
      code: `@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("select e from CodEntry e where e.merchantId = :merchantId and e.settlementId is null "
        + "and e.status <> com.delivery.ledger.enums.CodEntryStatus.PENDING")
List<CodEntry> findSettleableForUpdate(@Param("merchantId") Long merchantId);`,
      after:
        'Approving or rejecting a payout locks it in the same way, so two admins are handled one after the other. Both cases are covered by tests. I also tested the complete flow from merchant sign-up to payout and logged every issue I found to fix before deployment.',
    },
    next: [
      'Fix the remaining issues from end-to-end testing, then deploy.',
      'Make parcel creation safe to retry, so a repeated request cannot create two parcels.',
      'Send status updates to merchants and receivers, then add proof of delivery.',
    ],
  },
  {
    slug: 'averyday',
    name: 'AveryDay',
    summary: 'A habit tracker for self-learners that installs on your phone like an app.',
    decision: 'Streaks and progress are calculated from your check-ins every time, never stored, so they can never be wrong.',
    stack: 'Spring Boot 4, PostgreSQL, Flyway, Testcontainers, React',
    image: '/projects/averyday.jpg',
    imageAlt: 'The AveryDay dashboard with completion rates and goals',
    caption: 'The dashboard running locally with a demo account.',
    links: [
      { label: 'Backend code', href: 'https://github.com/nay-eem-01/habit-tracker' },
      { label: 'Frontend code', href: 'https://github.com/nay-eem-01/habit-tracker_web' },
    ],
    live: { label: 'Live app', href: 'https://averyday.vercel.app' },
    meta: {
      role: 'Sole developer: backend, frontend and deployment',
      stack: 'Java 21, Spring Boot 4, Spring MVC, JPA, PostgreSQL, Flyway, React',
      status: 'In public beta. It runs on free hosting, so the first load can take a few seconds.',
    },
    problem: [
      'Most habit trackers are not built for learning. They don’t connect a habit to the goal behind it, and their streaks are either so strict that one missed day ruins them or so loose that they mean nothing.',
    ],
    users:
      'Self-learners and developers who set a goal, such as learning a new language in 60 days, and check in every day. The app is in public beta.',
    built: [
      'Goals with linked habits, notes and study resources.',
      'Habits to build or to quit, on daily, weekday or weekly schedules.',
      'Streaks, XP, levels and a dashboard of completion rates.',
      'Rest days with a weekly limit, and push notification reminders.',
      'Google sign-in, an admin panel, and an installable web app.',
    ],
    architecture: {
      intro:
        'A single Spring Boot application organised by feature. Features talk to each other only through their services, never through another feature’s repository. Flyway manages every database change.',
      label: 'How a session is kept safe',
      nodes: [
        { id: 'api', label: 'web app', x: 250, y: 10 },
        { id: 'cookie', label: 'secure cookie', x: 40, y: 108 },
        { id: 'hash', label: 'hashed token', x: 250, y: 108 },
        { id: 'reuse', label: 'reuse check', x: 460, y: 108 },
        { id: 'rotate', label: 'new token', x: 250, y: 206 },
      ],
      edges: 'M320 54v54M250 130h-70M390 130h70M320 152v54',
      steps: [
        { label: 'Refresh', on: ['api'], text: 'When the short-lived access token expires, the web app asks for a new one. Several requests at once share a single refresh.' },
        { label: 'Cookie', on: ['cookie'], text: 'The refresh token is kept in a secure, HTTP-only cookie, so JavaScript on the page can never read it.' },
        { label: 'Hash', on: ['hash'], text: 'The server stores only a hash of the token, so even a database leak would not expose anyone’s session.' },
        { label: 'Reuse', on: ['reuse'], text: 'If an old token is ever used again, it is treated as theft and every session for that user is signed out.' },
        { label: 'Rotate', on: ['rotate'], text: 'Otherwise the token is replaced with a new one and a fresh 15-minute access token is issued.' },
      ],
    },
    decisions: [
      {
        title: 'Calculate progress, don’t store it',
        body: 'Streaks, statistics, XP and goal progress are all calculated from check-ins when they are requested. Nothing is stored that could fall out of sync with the history.',
      },
      {
        title: 'Past days follow the rules of that day',
        body: 'A day counts as complete if it met the target that applied on that day. Raising a target later never changes your past results. Changing a schedule starts a new streak but keeps your XP.',
      },
      {
        title: 'Other people’s data simply does not exist',
        body: 'Every query is filtered by the signed-in user. If you request someone else’s habit, you get “not found”, which reveals nothing about whether it exists.',
      },
    ],
    solved: {
      before:
        'Adding Google sign-in created a subtle security risk called account pre-hijacking. Someone could register with your email address and a password before you ever signed in with Google, and keep access to the account. Now, when a Google account is linked to an account whose email was never verified, that account’s password and sessions are removed. This integration test proves it:',
      code: `@Test
void linkingAnUnverifiedAccountRemovesItsPasswordAndSessions() throws Exception {
    // someone signed up with this address without owning it (pre-hijacking)
    register("victim@gmail.com");
    google("t3", new GoogleIdentity("sub-victim", "victim@gmail.com", true, "Victim"));

    signIn("t3", null).andExpect(status().isOk());
    login("victim@gmail.com").andExpect(status().isUnauthorized());
}`,
      after:
        'Google sign-in tokens are verified on the server against Google’s public keys, and a Google account without a verified email is refused.',
    },
    next: [
      'Automatic check-ins from GitHub, so a “commit every day” habit is ticked by real activity.',
      'A custom domain, so account emails stop landing in spam.',
      'A paid Pro plan, once there is demand for it.',
    ],
  },
];

export const skills: { group: string; items: string }[] = [
  { group: 'Backend', items: 'Spring Boot, Spring WebFlux, Project Reactor, Spring MVC, Spring Security, JPA and Hibernate, Spring Data Neo4j, Spring AI' },
  { group: 'Data', items: 'PostgreSQL, pgvector, Neo4j, MySQL, Redis, Kafka, Flyway' },
  { group: 'Testing', items: 'JUnit 5, Mockito, Testcontainers, Playwright' },
  { group: 'Other', items: 'TypeScript, React, Docker, Linux, Git' },
];

export const education = 'B.Sc. in Computer Science and Engineering, Green University of Bangladesh (2022 to 2026)';
