/* =============================================
   PARTICLE CANVAS
   ============================================= */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  const COUNT = Math.min(Math.floor(W / 14), 80);
  const particles = [];

  function rand(min, max) { return Math.random() * (max - min) + min; }

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: rand(0, W),
      y: rand(0, H),
      r: rand(1, 2.5),
      vx: rand(-0.2, 0.2),
      vy: rand(-0.25, -0.05),
      alpha: rand(0.2, 0.7),
      color: Math.random() > 0.6 ? '0,212,255' : '124,58,237',
    });
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,212,255,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
    });
  }

  function updateParticles() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) { p.y = H + 10; p.x = rand(0, W); }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
    });
  }

  let raf;
  function loop() {
    drawFrame();
    updateParticles();
    raf = requestAnimationFrame(loop);
  }
  loop();

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });
})();

/* =============================================
   TYPEWRITER
   ============================================= */
(function initTypewriter() {
  const el = document.querySelector('.typed-text');
  if (!el) return;

  const phrases = [
    'Senior Software Engineer',
    'Technical Lead',
    'Solution Architect',
    'Backend & Full-Stack Developer',
    'Cloud-Native Builder',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  const PAUSE = 1600;
  const TYPE_SPEED = 65;
  const DELETE_SPEED = 35;

  function type() {
    const current = phrases[phraseIdx];
    if (deleting) {
      el.textContent = current.slice(0, --charIdx);
    } else {
      el.textContent = current.slice(0, ++charIdx);
    }

    let delay = deleting ? DELETE_SPEED : TYPE_SPEED;

    if (!deleting && charIdx === current.length) {
      delay = PAUSE;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
})();

/* =============================================
   NAV SCROLL EFFECT
   ============================================= */
(function initNav() {
  const nav = document.querySelector('nav');
  const backTop = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 50);
    if (backTop) backTop.classList.toggle('visible', y > 400);
  }, { passive: true });

  // Hamburger
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(mobileMenu.classList.contains('open')));
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }
})();

/* =============================================
   SCROLL REVEAL
   ============================================= */
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
})();

/* =============================================
   COUNTER ANIMATION
   ============================================= */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1400;
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target + suffix;
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* =============================================
   ACTIVE NAV LINK
   ============================================= */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) {
        current = s.getAttribute('id');
      }
    });
    links.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current
        ? 'var(--accent-cyan)'
        : '';
    });
  }, { passive: true });
})();

/* =============================================
   BACK TO TOP
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.back-to-top');
  if (btn) {
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

/* =============================================
   HERO MOUSE PARALLAX (subtle)
   ============================================= */
(function initParallax() {
  const hero = document.querySelector('#hero');
  if (!hero) return;

  hero.addEventListener('mousemove', (e) => {
    const glow = hero.querySelector('.hero-glow');
    if (!glow) return;
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 40;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 40;
    glow.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  });
})();
