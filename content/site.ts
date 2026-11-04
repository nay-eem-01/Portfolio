// Everything the site says lives here. Every claim is checked against the project's own repo and docs.

export const person = {
  name: 'Md. Nayeem Ahmed',
  role: 'Backend engineer, Java and Spring Boot',
  line: 'I design APIs, data models and auth for systems that handle money, parcels and people’s data.',
  now: 'Junior backend developer at Dhrubok Infotech, Dhaka',
  email: 'ahmedmdnayeem05@gmail.com',
  github: 'https://github.com/nay-eem-01',
  linkedin: 'https://linkedin.com/in/md-nayeem-ahmed',
  resume: '/Nayeem-Ahmed-Resume.pdf',
  photo: '/images/nayeem.jpg',
};

export const about = {
  lead: 'I work on both sides of Spring: reactive services on WebFlux, Neo4j and Kafka at my job, and servlet systems on MVC, JPA and PostgreSQL in my own products.',
  body: 'What I care about is the part users never see: a checkout that cannot charge twice, a ledger where every taka is accounted for, a session that is really gone when you sign out. I write the plan, the migrations and the tests in the same repository as the code.',
};

export type Job = { title: string; company: string; when: string; from: string; summary: string; tags: string[] };

export const jobs: Job[] = [
  {
    title: 'Junior Backend Developer',
    company: 'Dhrubok Infotech',
    when: '2026 to now',
    from: '2026-01',
    summary:
      'On TaskATask, a task platform on Spring WebFlux and Neo4j: real-time group chat on WebFlux Sinks with Jasypt-encrypted messages, a 10,000-row contact import on Redis job queues, Kafka-driven appointment notifications synced to Google Calendar, OAuth2 sign-in with four providers, and the fix for a Neo4j save that re-fetched every relationship. Also booking and cancellation workflows for Hospitalia, a doctor appointment app.',
    tags: ['WebFlux', 'Reactor', 'Neo4j', 'Kafka', 'Redis', 'OAuth2'],
  },
  {
    title: 'Backend Developer Intern',
    company: 'Dhrubok Infotech',
    when: '2025',
    from: '2025-10',
    summary: 'Full-text search with Hibernate Search on a Lucene backend and custom analyzers.',
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
  image: string;
  imageAlt: string;
  caption: string;
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
    summary: 'An anime merchandise shop for Bangladesh with guest checkout and cash on delivery.',
    decision: 'Stock is taken with one conditional UPDATE, so two buyers can never get the last figure.',
    stack: 'Spring Boot 3.5, PostgreSQL, Flyway, nine Maven modules, React 19',
    image: '/projects/senpai-supply.jpg',
    imageAlt: 'Senpai Supply storefront home page',
    caption: 'The storefront running against the local API with the demo catalogue.',
    links: [
      { label: 'Backend code', href: 'https://github.com/nay-eem-01/E-commerce-application-with-springboot' },
      { label: 'Storefront code', href: 'https://github.com/nay-eem-01/ecommerce_web' },
    ],
    meta: {
      role: 'Sole developer: plan, API, schema, storefront, tests',
      stack: 'Java 21, Spring Boot 3.5, PostgreSQL, Flyway, React 19',
      status: 'Backend and storefront built; online payments coded, not yet sandbox-tested',
    },
    problem: [
      'My first version of this shop seeded admin/adminPass, let anyone read every cart, kept prices in double and never checked stock.',
      'Rewriting it meant answering one question for every endpoint: what happens when two people, or one impatient person, do this at the same time?',
    ],
    users:
      'Shoppers in Bangladesh buying figures, cosplay, bottles and bags, most of them on a phone and many without a card. It is a portfolio project, not a live shop: there are no real customers yet.',
    built: [
      'Guest checkout with cash on delivery, and phone-code sign-in.',
      'A catalogue with options, specs and 360-degree product frames.',
      'Orders with a state machine for their status, and guest order tracking.',
      'Reviews limited to people who received the product.',
      'The React storefront and its Playwright end-to-end tests.',
    ],
    architecture: {
      intro:
        'A modular monolith: nine Maven modules in one deployable. A module may call another only through its api interface or an event, so the compiler stops order from reaching into catalog’s tables.',
      label: 'Request trace: placing a cash-on-delivery order',
      nodes: [
        { id: 'api', label: 'api', x: 250, y: 10 },
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
        { label: 'Request', on: ['api'], text: 'POST /api/orders carries an Idempotency-Key. A retry with the same key returns the order already placed instead of a second one.' },
        { label: 'Price', on: ['order'], text: 'The order module prices the cart again from the database. The browser’s numbers are never used.' },
        { label: 'Stock', on: ['catalog'], text: 'catalog takes stock with one conditional UPDATE. Zero rows updated means sold out, and the whole order rolls back.' },
        { label: 'Commit', on: ['order', 'notification'], text: 'Order, items, status history and the outbox email row commit together, or not at all.' },
        { label: 'Email', on: ['notification'], text: 'After commit, the notification dispatcher claims the email row with SKIP LOCKED, sends it and retries with backoff on failure.' },
      ],
    },
    decisions: [
      {
        title: 'Servlet MVC, not WebFlux',
        body: 'I work on WebFlux every day, and chose not to use it here. Checkout is one transaction across stock, order, items, history and the email row. With JPA that is a single @Transactional method; reactively it is R2DBC and manual transaction plumbing for no gain at this scale.',
      },
      {
        title: 'Never trust the browser with money',
        body: 'The client sends product ids and quantities. Prices, delivery fees and totals are computed on the server from the database, in BigDecimal.',
      },
      {
        title: 'Payment vendors behind one interface',
        body: 'Cash on delivery, bKash and SSLCommerz each implement one PaymentProvider. Which vendor serves which method is a property, so switching one on is configuration, not code. A payment is marked paid only from the provider’s server-side answer.',
      },
    ],
    solved: {
      before: 'Two shoppers buying the last unit is the classic race. A read-then-write check loses it; one conditional statement cannot:',
      code: `update Product p set p.stock = p.stock - :qty, p.version = p.version + 1
where p.id = :id and p.stock >= :qty and p.status = ACTIVE`,
      after:
        'It returns 0 rows when stock ran out, and the order fails cleanly. Rows are updated in product-id order so two carts cannot deadlock each other. Order emails are written to an outbox table in the same transaction and sent afterwards with FOR UPDATE SKIP LOCKED, so a rolled-back order never emails anyone and two instances never send the same message.',
    },
    next: [
      'CI with Testcontainers covering migrations and the checkout transaction.',
      'Sandbox-test bKash and SSLCommerz before switching them on.',
      'Move the rate limiter to Redis, the prerequisite for a second instance.',
    ],
  },
  {
    slug: 'agrotrends',
    name: 'AgroTrends',
    summary: 'A farming knowledge platform whose AI advisor answers from the platform’s own posts.',
    decision: 'The model only sees retrieved posts and returns them as sources, so every answer can be checked.',
    stack: 'Spring Boot 3.5, Spring AI, PostgreSQL with pgvector, React 19',
    image: '/projects/agrotrends.jpg',
    imageAlt: 'AgroTrends stories feed with field notes on crops and livestock',
    caption: 'The stories feed running locally with sample posts.',
    links: [
      { label: 'Backend code', href: 'https://github.com/nay-eem-01/AgroTrends' },
      { label: 'Web app code', href: 'https://github.com/nay-eem-01/agrotrends_web' },
    ],
    meta: {
      role: 'Backend and web app: audit, security, RAG, React frontend',
      stack: 'Java 21, Spring Boot 3.5, Spring AI, PostgreSQL, pgvector, React 19',
      status: '114 of 123 roadmap steps done; not yet public',
    },
    problem: [
      'A plain AI chatbot will happily invent a pesticide dose. Agricultural students and young agronomists in Bangladesh need answers they can check, in Bangla and English.',
      'The codebase I started from had five Gemini keys, the database password and the JWT secret committed to git, and its AI embedded posts but never read them back.',
    ],
    users:
      'Planned for agriculture students and fresh graduates first, then young agronomists as verified experts, and urban growers. It has not launched, so there are no users yet.',
    built: [
      'Stories with drafts, tags, claps, bookmarks and follows, like Medium for farming.',
      'Questions and answers with votes, reputation and per-topic expert badges.',
      'An AI advisor that answers from the platform’s posts and lists the posts it used.',
      'Hardened sign-in, sessions and password reset.',
      'The React 19 web app in Bangla and English, in 130+ small PRs.',
    ],
    architecture: {
      intro:
        'A layered Spring Boot service on PostgreSQL. Posts are split into chunks of about 800 tokens and embedded into pgvector with their blog, author and status as metadata.',
      label: 'Request trace: asking the AI advisor',
      nodes: [
        { id: 'api', label: 'POST /api/ai/ask', x: 230, y: 10 },
        { id: 'quota', label: 'quota', x: 40, y: 108 },
        { id: 'retrieve', label: 'pgvector', x: 250, y: 108 },
        { id: 'model', label: 'Gemini', x: 460, y: 108 },
        { id: 'answer', label: 'answer + sources', x: 230, y: 206 },
      ],
      edges: 'M320 54v54M250 130h-70M390 130h70M320 152v54',
      steps: [
        { label: 'Ask', on: ['api'], text: 'A signed-in user with a confirmed email sends a question of up to 1,000 characters.' },
        { label: 'Quota', on: ['quota'], text: 'A per-user daily quota of 20 questions is checked first, so nobody can run up the model bill.' },
        { label: 'Retrieve', on: ['retrieve'], text: 'The question is embedded and the five closest published chunks above 0.7 similarity are retrieved.' },
        { label: 'Generate', on: ['model'], text: 'Gemini answers from those excerpts only, with a 60-second timeout. Retrieved text is framed as untrusted input.' },
        { label: 'Cite', on: ['answer'], text: 'The answer comes back with its sources: each post’s id and title, most relevant first.' },
      ],
    },
    decisions: [
      {
        title: 'Only published, vetted content reaches the AI',
        body: 'Drafts and unchecked AI answers are never retrievable. AI answers on questions are labelled unchecked until an expert confirms or corrects them, and only then enter the knowledge base.',
      },
      {
        title: 'Sessions that can really be revoked',
        body: 'A 15-minute access token is validated against a session row; the refresh token is opaque, single-use and rotated. Signing out actually ends the session.',
      },
      {
        title: 'Ownership checked in the service',
        body: 'Every mutation goes through AuthorizationService.assertOwnerOrAdmin, so a new endpoint cannot forget it. Public content answers 403, private data answers 404 so its existence does not leak.',
      },
    ],
    solved: {
      before:
        'The AI was write-only: posts were embedded but no answer ever used them, and the embedding model in config had been shut down by Google. I replaced the model, added chunking with metadata, and put a retrieval advisor in front of the chat client:',
      code: `return RetrievalAugmentationAdvisor.builder()
        .documentRetriever(VectorStoreDocumentRetriever.builder()
                .vectorStore(vectorStore)
                .topK(aiProperties.getRag().getTopK())
                .similarityThreshold(aiProperties.getRag().getSimilarityThreshold())
                .filterExpression(DocumentService.publishedOnly())
                .build())
        .queryAugmenter(blogQueryAugmenter())
        .build();`,
      after: 'Blog updates replace their vectors and deletes remove them, so the advisor never cites a post that changed or no longer exists.',
    },
    next: [
      'Flyway migrations for the existing schema, then ddl-auto=validate.',
      'Testcontainers with pgvector so the context test runs in CI.',
      'GitHub Actions with build, tests and gitleaks.',
    ],
  },
  {
    slug: 'courier',
    name: 'Courier backend',
    summary: 'Parcel delivery with cash on delivery and merchant settlement, in the mould of Steadfast and Pathao.',
    decision: 'A parcel can only move along its state machine, and each move writes history and ledger lines in one transaction.',
    stack: 'Spring MVC, JPA, PostgreSQL, Flyway, @Version locking',
    image: '/projects/courier.jpg',
    imageAlt: 'Courier API rider endpoints in Swagger UI',
    caption: 'The rider endpoints in Swagger UI. The backend has no web app yet.',
    links: [{ label: 'Backend code', href: 'https://github.com/nay-eem-01/delivery_app' }],
    meta: {
      role: 'Sole developer, an 8-week MVP plan, 35 PRs',
      stack: 'Java 21, Spring Boot, Spring MVC, JPA, PostgreSQL, Flyway, multi-module Maven',
      status: 'MVP features done; end-to-end findings being fixed before deploy',
    },
    problem: [
      'A courier is not a CRUD app. It has to answer, at any moment, who has which parcel, in which state, at which hub, and with which money.',
      'Merchant creates a parcel, a rider picks it up, it passes a hub, another rider delivers it and collects cash, the courier deducts its fees, and the merchant is paid. Every step can fail or be retried.',
    ],
    users:
      'Designed for three roles: merchants who send parcels, riders who pick up and deliver, and admins who run hubs and approve payouts. It has not been deployed, so there are no users yet.',
    built: [
      'Merchant onboarding, hubs, riders and admin-managed users.',
      'Pricing rules, parcels and pickup requests.',
      'The parcel status state machine with history and a public tracking API.',
      'Rider pickup and delivery flows.',
      'A COD ledger, merchant dashboard, settlement requests and admin approval.',
    ],
    architecture: {
      intro:
        'Multi-module Maven, one module per domain: user, hub, pricing, parcel and ledger. No shared persistence module, so parcel cannot read the ledger’s tables. Servlet MVC on purpose: a status change, its history row and its ledger line belong in one @Transactional method.',
      label: 'Request trace: a rider delivers a parcel',
      nodes: [
        { id: 'api', label: 'PATCH status', x: 250, y: 10 },
        { id: 'parcel', label: 'parcel', x: 250, y: 108 },
        { id: 'history', label: 'history', x: 40, y: 108 },
        { id: 'event', label: 'ParcelDelivered', x: 460, y: 108 },
        { id: 'ledger', label: 'ledger', x: 250, y: 206 },
      ],
      edges: 'M320 54v54M250 130h-70M390 130h70M530 152v20H320v34',
      steps: [
        { label: 'Request', on: ['api'], text: 'The rider sends PATCH /api/rider/parcels/{id}/status with the action DELIVER. Only the assigned rider can act on the parcel.' },
        { label: 'Transition', on: ['parcel'], text: 'The state machine allows DELIVER only from OUT_FOR_DELIVERY. Anything else is refused before a row changes.' },
        { label: 'History', on: ['history'], text: 'A status history row records who moved the parcel, from which state, and when.' },
        { label: 'Event', on: ['event'], text: 'The parcel module publishes ParcelDelivered. It never touches the ledger’s tables itself.' },
        { label: 'Ledger', on: ['ledger'], text: 'The ledger collects the COD line in the same transaction. If anything fails, the status change rolls back too.' },
      ],
    },
    decisions: [
      {
        title: 'Optimistic locking on every parcel',
        body: 'A parcel row carries @Version. Two riders, or a rider and an admin, acting on the same parcel at once: the second write fails instead of silently overwriting the first.',
      },
      {
        title: 'Flyway and NUMERIC(12,2) from day one',
        body: 'ddl-auto=update cannot express money precision, a unique tracking-number index or seeded pricing rows, and it never drops anything. A few hours of migrations up front keeps dev and prod the same.',
      },
      {
        title: 'Net settlement',
        body: 'A merchant is paid what was collected minus delivery charges and COD fees, with any negative balance carried over, so the ledger always adds up.',
      },
    ],
    solved: {
      before:
        'Settlement is where money races hide. A merchant can press request twice, and an admin can approve while another rejects. The settlement request locks the merchant’s open ledger lines, so a second request waits and then finds them claimed:',
      code: `@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("select e from CodEntry e where e.merchantId = :merchantId and e.settlementId is null "
        + "and e.status <> com.delivery.ledger.enums.CodEntryStatus.PENDING")
List<CodEntry> findSettleableForUpdate(@Param("merchantId") Long merchantId);`,
      after:
        'Deciding a settlement locks its row the same way, so two admins run one after the other; tests cover two requests at once and approve against reject. I also ran the whole demo chain end to end over real HTTP and wrote down ten findings, from a health check that reports DOWN without SMTP to an endpoint that exposed any user’s email and phone. The critical ones are first on the list below.',
    },
    next: [
      'Fix the end-to-end findings: lock down the starter’s user endpoints and switch timestamps to ISO-8601.',
      'An Idempotency-Key on parcel creation, so a retry cannot create two COD lines.',
      'Status notifications to merchants and receivers, then proof of delivery.',
    ],
  },
  {
    slug: 'averyday',
    name: 'AveryDay',
    summary: 'A habit tracker for self-directed learners, installed on the phone as a PWA.',
    decision: 'Streaks and progress are computed on read, never stored, so no counter can drift.',
    stack: 'Spring Boot 4, PostgreSQL, Flyway, Testcontainers, React',
    image: '/projects/averyday.jpg',
    imageAlt: 'AveryDay home dashboard with completion rates and goals',
    caption: 'The dashboard running locally with a seeded demo account.',
    links: [
      { label: 'Backend code', href: 'https://github.com/nay-eem-01/habit-tracker' },
      { label: 'Web app code', href: 'https://github.com/nay-eem-01/habit-tracker_web' },
    ],
    live: { label: 'Live beta', href: 'https://averyday.vercel.app' },
    meta: {
      role: 'Sole developer: API, web app, deploy',
      stack: 'Java 21, Spring Boot 4, Spring MVC, JPA, PostgreSQL, Flyway, React',
      status: 'Public beta on Render and Vercel; free hosting, so the first request can take a moment',
    },
    problem: [
      'Generic habit trackers do not connect a habit to what you are learning, and their streaks are either too strict to survive a sick day or too loose to mean anything.',
    ],
    users:
      'Self-directed learners and developers who set a goal like “learn Rust in 60 days” and check in every day. It is in public beta; I make no claims about user numbers.',
    built: [
      'Goals with linked habits, notes and study links.',
      'Build and quit habits, daily, weekday or N-times-a-week schedules.',
      'Streaks, XP, levels and a dashboard of completion rates.',
      'Rest days with a weekly limit, and web push reminders.',
      'Google sign-in, an admin API, and a PWA that installs on the phone.',
    ],
    architecture: {
      intro:
        'One Maven module, package-by-feature. A feature uses another only through its service; repositories are package-private. Flyway owns the schema with ddl-auto=validate.',
      label: 'Request trace: refreshing a session',
      nodes: [
        { id: 'api', label: 'POST /api/auth/refresh', x: 210, y: 10 },
        { id: 'cookie', label: 'httpOnly cookie', x: 40, y: 108 },
        { id: 'hash', label: 'SHA-256 lookup', x: 250, y: 108 },
        { id: 'reuse', label: 'reuse check', x: 460, y: 108 },
        { id: 'rotate', label: 'rotate + new JWT', x: 230, y: 206 },
      ],
      edges: 'M320 54v54M250 130h-70M390 130h70M320 152v54',
      steps: [
        { label: 'Request', on: ['api'], text: 'The web app calls refresh when an access token expires. Concurrent requests share one in-flight refresh.' },
        { label: 'Cookie', on: ['cookie'], text: 'The refresh token travels only in an httpOnly, Secure, SameSite=Strict cookie scoped to /api/auth. JavaScript never sees it.' },
        { label: 'Lookup', on: ['hash'], text: 'The server stores only the token’s SHA-256 hash, so a database leak does not leak sessions.' },
        { label: 'Reuse', on: ['reuse'], text: 'A token that was already rotated and is used again means theft: every token the user has is revoked.' },
        { label: 'Rotate', on: ['rotate'], text: 'Otherwise the token is rotated and a new 15-minute access token is issued.' },
      ],
    },
    decisions: [
      {
        title: 'Numbers are computed on read',
        body: 'Streaks, stats, XP, goal progress and the dashboard are derived from check-ins every time. Nothing is stored that could disagree with the history; cache only when a measurement asks for it.',
      },
      {
        title: 'A day is judged by the rules of that day',
        body: 'A day counts as done when it reached the target that applied when it was logged, so raising a target later never rewrites the past. Changing a schedule starts a new streak but keeps the XP.',
      },
      {
        title: 'Someone else’s data is 404, never 403',
        body: 'Every query is scoped by the user from the security context, so another user’s habit simply does not exist for you.',
      },
    ],
    solved: {
      before:
        'Google sign-in opened an account pre-hijacking hole: someone could register with your email and a password before you ever signed in with Google. Linking a Google identity to an account whose email was never verified now removes that account’s password and sessions. The integration test that proves it:',
      code: `@Test
void linkingAnUnverifiedAccountRemovesItsPasswordAndSessions() throws Exception {
    // someone signed up with this address without owning it (pre-hijacking)
    Cookie squatter = register("victim@gmail.com").andReturn().getResponse().getCookie(REFRESH_COOKIE);
    google("t3", new GoogleIdentity("sub-victim", "victim@gmail.com", true, "Victim"));

    signIn("t3", null).andExpect(status().isOk());
    login("victim@gmail.com").andExpect(status().isUnauthorized());
    mockMvc.perform(post("/api/auth/refresh").cookie(squatter)).andExpect(status().isUnauthorized());
}`,
      after:
        'Google ID tokens are verified locally against Google’s keys (issuer, audience, expiry, email_verified), and a Google email that is not verified is refused outright.',
    },
    next: [
      'Auto check-ins from GitHub: a “push a commit” habit ticked by real activity.',
      'A custom domain, so account email stops landing in spam.',
      'Billing for the Pro plan, once people ask for it.',
    ],
  },
];

export const skills: { group: string; items: string }[] = [
  { group: 'Backend', items: 'Spring Boot, WebFlux, Reactor, Spring MVC, Spring Security, JPA, Spring Data Neo4j, Spring AI' },
  { group: 'Data', items: 'PostgreSQL, pgvector, Neo4j, MySQL, Redis, Kafka, Flyway' },
  { group: 'Quality', items: 'JUnit 5, Mockito, Testcontainers, Playwright' },
  { group: 'Also', items: 'TypeScript and React, Docker, Linux, Git' },
];

export const education = 'B.Sc. in Computer Science and Engineering, Green University of Bangladesh, 2022 to 2026';
