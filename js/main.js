// ═══════════════════════════════════════
// CORLA.AI — SHARED JAVASCRIPT
// ═══════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ── SCROLL REVEAL ──────────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  // ── READING PROGRESS BAR ───────────────
  const bar = document.getElementById('reading-progress-bar');
  if (bar) {
    window.addEventListener('scroll', () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      bar.style.width = scrollHeight > 0 ? (scrollTop / scrollHeight * 100) + '%' : '0%';
    }, { passive: true });
  }

  // ── MOBILE MENU ────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  // ── ACTIVE NAV LINK ────────────────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.includes(currentPath)) a.classList.add('active');
    if (currentPath === '' && href === '../index.html') a.classList.add('active');
  });

  // ── SMOOTH SCROLL FOR ANCHOR LINKS ─────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── STAGGER DELAYS ─────────────────────
  document.querySelectorAll('[data-stagger]').forEach((parent, pi) => {
    parent.querySelectorAll(':scope > *').forEach((child, ci) => {
      child.style.transitionDelay = (ci * 80) + 'ms';
    });
  });

  // ── CTA SCROLL ─────────────────────────
  document.querySelectorAll('[data-scroll-to]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.scrollTo);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

});

// ── NETLIFY FORM HANDLER ────────────────
async function handleWaitlistSubmit(e) {
  e.preventDefault();
  const form   = e.target;
  const btn    = form.querySelector('[type="submit"]');
  const status = form.querySelector('.form-status');
  if (!btn) return;

  btn.textContent = 'Submitting...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    });
    if (res.ok) {
      btn.textContent = "✓ You're on the list!";
      btn.style.background = 'var(--green)';
      btn.style.opacity = '1';
      if (status) { status.textContent = "🎉 We'll be in touch within 3 business days."; status.style.color = 'var(--green)'; }
      form.reset();
    } else { throw new Error('status ' + res.status); }
  } catch (err) {
    btn.textContent = 'Request Early Access →';
    btn.disabled = false;
    btn.style.opacity = '1';
    if (status) { status.textContent = '⚠ Something went wrong. Email us at info@noitechnologies.com'; status.style.color = 'var(--red)'; }
  }
}

// ── THEME TOGGLE ─────────────────────────
(function() {
  const root = document.documentElement;
  const saved = localStorage.getItem('corla-theme');
  // Default is light; only apply dark if explicitly saved
  if (saved === 'dark') root.setAttribute('data-theme', 'dark');
})();

function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const root = document.documentElement;

  btn.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      localStorage.setItem('corla-theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('corla-theme', 'dark');
    }
    // Update meta theme-color
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = isDark ? '#F7F5F0' : '#08090D';
  });
}

document.addEventListener('DOMContentLoaded', initThemeToggle);
