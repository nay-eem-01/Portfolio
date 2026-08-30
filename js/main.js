// --- Header: hide on scroll down, show on scroll up ---
(() => {
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.pageYOffset;
    if (current <= 0) {
      header.style.transform = 'translateY(0)';
      return;
    }
    header.style.transform = current > lastScroll ? 'translateY(-100%)' : 'translateY(0)';
    lastScroll = current;
  });
})();

// --- Animated stat counters: count up once when scrolled into view ---
(() => {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  stats.forEach((stat) => observer.observe(stat));
})();

// --- Scroll-reveal for sections ---
(() => {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach((item) => observer.observe(item));
})();

// --- Contact form: submit to Formspree without leaving the page ---
(() => {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const status = form.querySelector('.form-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending...';
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
