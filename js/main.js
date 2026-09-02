'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------------------------
   Theme — apply before paint to avoid a flash of wrong theme.
   Order of precedence:
     1. localStorage("theme") if the user has explicitly chosen
     2. prefers-color-scheme media query
     3. default to "dark"
--------------------------------------------------------------------------- */
(() => {
  const STORAGE_KEY = 'portfolio-theme';
  const root = document.documentElement;

  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (_) { /* private mode */ }

  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const theme = saved === 'light' || saved === 'dark'
    ? saved
    : (prefersLight ? 'light' : 'dark');

  root.setAttribute('data-theme', theme);
})();

/* ---------------------------------------------------------------------------
   Theme toggle button
   - Reads the current [data-theme] from <html> on click and flips it.
   - Persists the choice in localStorage so reloads keep it.
   - Updates aria-pressed for screen readers.
   - Stays in sync with the OS preference if the user hasn't made an
     explicit choice (i.e. localStorage has no value).
--------------------------------------------------------------------------- */
(() => {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  const STORAGE_KEY = 'portfolio-theme';
  const mq = window.matchMedia('(prefers-color-scheme: light)');

  const apply = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    btn.setAttribute('aria-pressed', String(theme === 'light'));
  };

  // Set the correct pressed-state on first paint.
  apply(document.documentElement.getAttribute('data-theme') || 'dark');

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (_) { /* ignore */ }
  });

  // If the user has never toggled, follow the OS preference live.
  mq.addEventListener('change', (e) => {
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (_) {}
    if (saved === 'light' || saved === 'dark') return; // user has a choice
    apply(e.matches ? 'light' : 'dark');
  });
})();

/* ---------------------------------------------------------------------------
   Header: hide on scroll down, reveal on scroll up
--------------------------------------------------------------------------- */
(() => {
  const header = document.querySelector('.header');
  if (!header) return;
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.pageYOffset;
    if (current <= 0) {
      header.style.transform = 'translateY(0)';
      lastScroll = 0;
      return;
    }
    // don't hide while the mobile menu is open
    if (document.querySelector('.nav-links.open')) return;
    header.style.transform = current > lastScroll ? 'translateY(-100%)' : 'translateY(0)';
    lastScroll = current;
  }, { passive: true });
})();

/* ---------------------------------------------------------------------------
   Mobile navigation toggle
--------------------------------------------------------------------------- */
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  const setOpen = (open) => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => {
    setOpen(!links.classList.contains('open'));
  });

  links.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav')) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) setOpen(false);
  });
})();

/* ---------------------------------------------------------------------------
   Scroll-reveal for sections
   - Marks any element with the .reveal class as is-visible when it enters
     the viewport, then unobserves it (one-shot animation, no jank on
     scroll-back).
   - Inside every .reveal section, we look for child elements that opt in
     via [data-reveal] and stagger their entrance with --reveal-delay so
     each block cascades in instead of popping all at once.
   - Hero (the first section) reveals immediately on first paint so users
     see motion before they ever start scrolling.
--------------------------------------------------------------------------- */
(() => {
  const items = Array.from(document.querySelectorAll('.reveal'));
  if (!items.length) return;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach((i) => {
      i.classList.add('is-visible');
      i.querySelectorAll('[data-reveal]').forEach((c) => c.classList.add('is-visible'));
    });
    return;
  }

  // Stagger direct children that opt in via data-reveal, so cards / list
  // items inside a section cascade in instead of flashing together.
  items.forEach((section) => {
    const children = section.querySelectorAll('[data-reveal]');
    children.forEach((child, i) => {
      child.style.setProperty('--reveal-delay', `${Math.min(i * 70, 420)}ms`);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        entry.target.querySelectorAll('[data-reveal]').forEach((c) =>
          c.classList.add('is-visible')
        );
        observer.unobserve(entry.target);
      });
    },
    {
      // Reveal as soon as ~12% of the element is in view; this fires early
      // enough that the animation finishes before the user has read the
      // top of the section, so it never feels late.
      threshold: 0.12,
      // Pull the trigger a touch early so the lift completes in time.
      rootMargin: '0px 0px -8% 0px',
    }
  );

  items.forEach((item, idx) => {
    // The very first .reveal (hero) is above the fold; mark it visible on
    // the next frame so the entrance plays immediately without scroll.
    if (idx === 0) {
      requestAnimationFrame(() => item.classList.add('is-visible'));
    }
    observer.observe(item);
  });
})();

/* ---------------------------------------------------------------------------
   Query console — types real Cypher, then shows the result.
   Replaces the fake terminal, the big-number stats, and the count-up JS.
--------------------------------------------------------------------------- */
(() => {
  const qEl = document.getElementById('consoleQuery');
  const rEl = document.getElementById('consoleResult');
  if (!qEl || !rEl) return;

  const kw = (s) => `<span class="kw">${s}</span>`;
  const rel = (s) => `<span class="rel">${s}</span>`;

  const queries = [
    {
      plain: 'MATCH (me)-[:BUILT]->(p:Project) RETURN count(p)',
      html: `${kw('MATCH')} (me)-[:${rel('BUILT')}]->(p:Project) ${kw('RETURN')} count(p)`,
      result: '<span class="num">6</span> projects shipped',
    },
    {
      plain: 'MATCH (me)-[:KNOWS]->(t:Tech) RETURN count(t)',
      html: `${kw('MATCH')} (me)-[:${rel('KNOWS')}]->(t:Tech) ${kw('RETURN')} count(t)`,
      result: '<span class="num">15+</span> tools &amp; technologies',
    },
    {
      plain: 'MATCH (me)-[:WORKED_AT]->(:Company) RETURN me.since',
      html: `${kw('MATCH')} (me)-[:${rel('WORKED_AT')}]->(:Company) ${kw('RETURN')} me.since`,
      result: 'in production since <span class="num">2025</span>',
    },
    {
      plain: 'MATCH (me)-[:WROTE]->(post) RETURN count(post)',
      html: `${kw('MATCH')} (me)-[:${rel('WROTE')}]->(post) ${kw('RETURN')} count(post)`,
      result: '<span class="num">2</span> articles published',
    },
  ];

  // Reduced motion: show the first query and its result, statically.
  if (reduceMotion) {
    qEl.innerHTML = queries[0].html;
    rEl.innerHTML = '→ ' + queries[0].result;
    return;
  }

  let qi = 0;

  const type = (text, i, done) => {
    qEl.textContent = text.slice(0, i);
    if (i <= text.length) {
      setTimeout(() => type(text, i + 1, done), 34 + Math.random() * 26);
    } else {
      done();
    }
  };

  const runQuery = () => {
    const cur = queries[qi];
    rEl.innerHTML = '';
    type(cur.plain, 0, () => {
      qEl.innerHTML = cur.html;                 // colourise once fully typed
      setTimeout(() => {
        rEl.innerHTML = '→ ' + cur.result;
        setTimeout(() => {
          rEl.style.opacity = '0';
          setTimeout(() => {
            rEl.style.opacity = '1';
            qi = (qi + 1) % queries.length;
            runQuery();
          }, 350);
        }, 2600);
      }, 380);
    });
  };

  rEl.style.transition = 'opacity 0.3s ease';
  setTimeout(runQuery, 700);
})();

/* ---------------------------------------------------------------------------
   Experience: expand / collapse long bullet lists
--------------------------------------------------------------------------- */
(() => {
  document.querySelectorAll('.exp-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const details = btn.nextElementSibling;
      const isOpen = details.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
      btn.querySelector('.toggle-label').textContent = isOpen ? 'Show less' : 'Show details';
    });
  });
})();

/* ---------------------------------------------------------------------------
   Contact form: submit to Formspree without leaving the page
--------------------------------------------------------------------------- */
(() => {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const status = form.querySelector('.form-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending…';
    status.className = 'form-status';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        status.textContent = "Message sent — I'll get back to you soon.";
        status.className = 'form-status success';
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      status.textContent = 'Something went wrong. Please email me directly instead.';
      status.className = 'form-status error';
    }
  });
})();

/* ---------------------------------------------------------------------------
   Touch feedback for cards (mobile)
--------------------------------------------------------------------------- */
(() => {
  const cards = document.querySelectorAll('.project-card, .blog-card, .skill-category');
  cards.forEach((card) => {
    let t;
    card.addEventListener('touchstart', () => {
      card.classList.add('is-touched');
      clearTimeout(t);
    }, { passive: true });
    card.addEventListener('touchend', () => {
      t = setTimeout(() => card.classList.remove('is-touched'), 400);
    }, { passive: true });
  });
})();
