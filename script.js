/* ============================================================
   IRONFORGE GYM — JavaScript
   ============================================================ */

'use strict';

// ──────────────────────────────────────────────
// PARTICLE SYSTEM
// ──────────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrameId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.r = Math.random() * 1.5 + 0.3;
      this.speed = Math.random() * 0.4 + 0.1;
      this.angle = Math.random() * Math.PI * 2;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
    }
    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.opacity += this.twinkleDir * this.twinkleSpeed;
      if (this.opacity >= 0.6 || this.opacity <= 0.05) this.twinkleDir *= -1;
      if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 100, 30, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    animFrameId = requestAnimationFrame(animate);
  }
  animate();
})();

// ──────────────────────────────────────────────
// NAVBAR — Scroll & Active Link
// ──────────────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const allNavLinks = document.querySelectorAll('.nav-link');

  // Scroll class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveLink();
  }, { passive: true });

  // Mobile toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Active link tracking
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) currentId = sec.id;
    });
    allNavLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }

  // Hero background parallax
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.classList.add('loaded');
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      heroBg.style.transform = `scale(1) translateY(${scroll * 0.3}px)`;
    }, { passive: true });
  }
})();

// ──────────────────────────────────────────────
// SCROLL REVEAL
// ──────────────────────────────────────────────
(function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for sibling cards
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('[data-reveal]'));
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

// ──────────────────────────────────────────────
// COUNTER ANIMATION
// ──────────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString();
    }, step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

// ──────────────────────────────────────────────
// PRICING TOGGLE
// ──────────────────────────────────────────────
(function initPricingTabs() {
  const tabs    = document.querySelectorAll('.pricing-tab');
  const prices  = document.querySelectorAll('.price');
  const periods = document.querySelectorAll('.price-period');

  if (!tabs.length) return;

  // Period label for each plan type
  const periodLabel = {
    monthly:   '/month',
    quarterly: '/quarter',
    annual:    '/year',
  };

  function switchPlan(plan) {
    // Update active tab
    tabs.forEach(t => t.classList.toggle('active', t.dataset.plan === plan));

    // Animate price change
    prices.forEach(price => {
      price.style.transform = 'scale(0.8)';
      price.style.opacity   = '0';
      setTimeout(() => {
        const val = parseInt(price.getAttribute('data-' + plan));
        price.textContent = val.toLocaleString('en-IN');
        price.style.transform = 'scale(1)';
        price.style.opacity   = '1';
      }, 180);
    });

    // Animate period label
    periods.forEach(p => {
      p.style.opacity = '0';
      setTimeout(() => {
        p.textContent = periodLabel[plan];
        p.style.opacity = '1';
      }, 180);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchPlan(tab.dataset.plan));
  });
})();

// ──────────────────────────────────────────────
// GALLERY LIGHTBOX
// ──────────────────────────────────────────────
(function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const lbClose = document.getElementById('lightbox-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');

  if (!lightbox) return;

  let images = [];
  let currentIdx = 0;
  let savedScrollY = 0; // stores scroll position before lightbox opens

  galleryItems.forEach((item, idx) => {
    const img = item.querySelector('img');
    const label = item.querySelector('.gallery-label')?.textContent?.trim() || '';
    images.push({ src: img.src, alt: img.alt, caption: label });

    item.addEventListener('click', () => {
      currentIdx = idx;
      showLightbox(currentIdx);
    });
  });

  function showLightbox(idx) {
    // Only save scroll & lock body the FIRST time lightbox opens
    // (not when navigating next/prev — body is already fixed, scrollY would be 0)
    if (!lightbox.classList.contains('active')) {
      savedScrollY = window.scrollY;
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    }
    lbImg.src = images[idx].src;
    lbImg.alt = images[idx].alt;
    lbCaption.textContent = images[idx].caption;
    lightbox.classList.add('active');
  }

  // Generic close — used by nav links (does NOT restore scroll)
  window.closeLightbox = function closeLightbox() {
    lightbox.classList.remove('active');
    // Restore scroll lock
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
  };

  // ✕ Close button — restores exact scroll position user was at
  lbClose.addEventListener('click', () => {
    window.closeLightbox();
    window.scrollTo({ top: savedScrollY, behavior: 'instant' });
  });

  // Backdrop click — just closes, keeps current scroll
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) {
      window.closeLightbox();
      window.scrollTo({ top: savedScrollY, behavior: 'instant' });
    }
  });

  lbPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIdx = (currentIdx - 1 + images.length) % images.length;
    showLightbox(currentIdx);
  });
  lbNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIdx = (currentIdx + 1) % images.length;
    showLightbox(currentIdx);
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') {
      window.closeLightbox();
      window.scrollTo({ top: savedScrollY, behavior: 'instant' });
    }
    if (e.key === 'ArrowLeft') { currentIdx = (currentIdx - 1 + images.length) % images.length; showLightbox(currentIdx); }
    if (e.key === 'ArrowRight') { currentIdx = (currentIdx + 1) % images.length; showLightbox(currentIdx); }
  });
})();

// ──────────────────────────────────────────────
// TESTIMONIALS CAROUSEL
// ──────────────────────────────────────────────
(function initTestimonialsCarousel() {
  const track = document.getElementById('testimonials-track');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  const dotsContainer = document.getElementById('carousel-dots');

  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let currentIndex = 0;
  let autoplayTimer;
  let cardsPerView = window.innerWidth <= 768 ? 1 : 2;
  const totalSlides = Math.ceil(cards.length / cardsPerView);

  // Create dots
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function goTo(idx) {
    currentIndex = (idx + totalSlides) % totalSlides;
    const cardWidth = cards[0].offsetWidth + 24; // gap
    track.style.transform = `translateX(-${currentIndex * cardsPerView * cardWidth}px)`;
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
    });
    resetAutoplay();
  }

  prevBtn?.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn?.addEventListener('click', () => goTo(currentIndex + 1));

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goTo(currentIndex + 1), 5000);
  }
  resetAutoplay();

  window.addEventListener('resize', () => {
    const newCPV = window.innerWidth <= 768 ? 1 : 2;
    if (newCPV !== cardsPerView) {
      cardsPerView = newCPV;
      currentIndex = 0;
      track.style.transform = 'translateX(0)';
    }
  });

  // Touch swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
  }, { passive: true });
})();

// ──────────────────────────────────────────────
// CONTACT FORM
// ──────────────────────────────────────────────
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit');
  const successMsg = document.getElementById('form-success');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;

    // Simulate sending (replace with actual API)
    await new Promise(resolve => setTimeout(resolve, 2000));

    btnText.style.display = 'inline-flex';
    btnLoading.style.display = 'none';
    submitBtn.disabled = false;
    form.reset();
    successMsg.classList.add('show');

    setTimeout(() => successMsg.classList.remove('show'), 5000);
  });
})();

// ──────────────────────────────────────────────
// BACK TO TOP
// ──────────────────────────────────────────────
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ──────────────────────────────────────────────
// NAVBAR LINK SMOOTH SCROLL
// ──────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    // Always close lightbox first when any nav/anchor link is clicked
    if (typeof window.closeLightbox === 'function') window.closeLightbox();

    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h'));
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ──────────────────────────────────────────────
// CARD TILT EFFECT (services and trainers)
// ──────────────────────────────────────────────
(function initCardTilt() {
  const cards = document.querySelectorAll('.service-card, .trainer-card, .pricing-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -5;
      const rotY = ((x - cx) / cx) * 5;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
})();

// ──────────────────────────────────────────────
// HERO TYPING EFFECT (subtle word rotation)
// ──────────────────────────────────────────────
(function initHeroAnimations() {
  // Animate hero elements in sequence
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;
  heroContent.style.opacity = '0';
  heroContent.style.transform = 'translateY(30px)';

  setTimeout(() => {
    heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
    heroContent.style.opacity = '1';
    heroContent.style.transform = 'translateY(0)';
  }, 200);
})();

// ──────────────────────────────────────────────
// CONSOLE BRANDING
// ──────────────────────────────────────────────
console.log(
  '%c⚡ IRONFORGE GYM %c— Built with fire 🔥',
  'background: #FF4500; color: white; padding: 6px 14px; font-size: 16px; font-weight: bold; border-radius: 4px 0 0 4px;',
  'background: #1a1a1a; color: #FF4500; padding: 6px 14px; font-size: 14px; border-radius: 0 4px 4px 0;'
);
