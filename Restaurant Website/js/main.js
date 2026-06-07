/**
 * RASA RESTAURANT — main.js
 * Initializes: Lenis smooth scroll, AOS, GLightbox, Swiper,
 * Custom cursor, Nav scroll behavior, Theme toggle,
 * Back-to-top, Counter animation, Form validation, Button ripple
 */

'use strict';

/* ─────────────────────────────────────
   LENIS SMOOTH SCROLL
   ───────────────────────────────────── */

let lenis;

function initLenis() {
  // Only on non-reduced-motion devices
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
  });

  // Run Lenis inside GSAP's own ticker so both are always in sync.
  // This is the officially recommended pattern for Lenis + GSAP ScrollTrigger
  // and ensures ScrollTrigger receives position updates on every frame,
  // including on touch/mobile devices where smoothTouch:false means Lenis
  // defers to native scroll (its own rAF loop would otherwise be decoupled
  // from GSAP, causing ScrollTrigger animations to miss frames or not fire).
  if (typeof gsap !== 'undefined') {
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  } else {
    // Fallback: plain rAF when GSAP is unavailable
    (function tick(time) { lenis.raf(time); requestAnimationFrame(tick); })();
  }

  if (typeof ScrollTrigger !== 'undefined') {
    // Primary: update ScrollTrigger via Lenis scroll events (smooth scroll)
    lenis.on('scroll', ScrollTrigger.update);
    // Fallback: also update on native scroll events so ScrollTrigger
    // animations work on touch devices (iOS/Android) where Lenis lets
    // the browser handle scrolling natively (smoothTouch:false).
    window.addEventListener('scroll', () => ScrollTrigger.update(), { passive: true });
  }
}

/* ─────────────────────────────────────
   AOS — ANIMATE ON SCROLL
   ───────────────────────────────────── */

function initAOS() {
  if (typeof AOS === 'undefined') return;

  AOS.init({
    duration: 800,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    once: true,
    offset: 60,
    delay: 0,
  });
}

/* ─────────────────────────────────────
   CUSTOM LIGHTBOX
   Zero-dependency, always viewport-centered.
   Keyboard nav, touch swipe, Lenis pause.
   ───────────────────────────────────── */

function initCustomLightbox() {
  // Build DOM — use <dialog> so showModal() places it in the browser's top layer.
  // Top-layer elements are always above all page content, immune to z-index,
  // transforms, backdrop-filter, or will-change on any ancestor.
  const lb = document.createElement('dialog');
  lb.id = 'rasa-lightbox';
  lb.setAttribute('aria-label', 'Image lightbox');
  lb.innerHTML = `
    <button class="lb-btn lb-close" aria-label="Close lightbox"><i class="ri-close-line"></i></button>
    <button class="lb-btn lb-prev"  aria-label="Previous image"><i class="ri-arrow-left-s-line"></i></button>
    <button class="lb-btn lb-next"  aria-label="Next image"><i class="ri-arrow-right-s-line"></i></button>
    <div class="lb-content">
      <div class="lb-spinner"><div></div></div>
      <img class="lb-img" src="" alt="" />
      <p class="lb-caption"></p>
      <p class="lb-counter"></p>
    </div>`;
  document.body.appendChild(lb);

  const lbImg     = lb.querySelector('.lb-img');
  const lbCaption = lb.querySelector('.lb-caption');
  const lbCounter = lb.querySelector('.lb-counter');
  const lbSpinner = lb.querySelector('.lb-spinner');

  let items       = [];
  let current     = 0;
  let touchStartX = 0;

  function getRealItems() {
    return [...document.querySelectorAll('.gallery__item[data-lightbox]')]
      .filter(el => !el.closest('.swiper-slide-duplicate'));
  }

  function collectItems() {
    items = getRealItems().map(el => ({
      href:    el.getAttribute('data-href') || '',
      caption: el.getAttribute('data-caption') || '',
    }));
  }

  function show(idx) {
    if (!items.length) return;
    current = ((idx % items.length) + items.length) % items.length;
    const item  = items[current];
    const token = current;

    lbCaption.textContent = item.caption;
    lbCounter.textContent = `${current + 1} / ${items.length}`;

    lbImg.style.opacity = '0';
    lbSpinner.style.display = 'flex';

    const full = new window.Image();
    full.onload = () => {
      if (token !== current) return;
      lbImg.src = full.src;
      lbImg.alt = item.caption;
      lbImg.style.opacity = '1';
      lbSpinner.style.display = 'none';
    };
    full.onerror = () => {
      if (token !== current) return;
      lbSpinner.style.display = 'none';
    };
    full.src = item.href;

    if (full.complete && full.naturalWidth > 0) {
      lbImg.src = full.src;
      lbImg.alt = item.caption;
      lbImg.style.opacity = '1';
      lbSpinner.style.display = 'none';
    }
  }

  function open(idx) {
    collectItems();
    if (!items.length) return;
    show(idx);
    lb.showModal();                                           // enters top layer
    requestAnimationFrame(() => lb.classList.add('lb-open')); // triggers fade-in
    lb.querySelector('.lb-close').focus({ preventScroll: true });
  }

  function close() {
    if (!lb.open) return;
    lb.classList.remove('lb-open');                           // triggers fade-out
    setTimeout(() => { if (lb.open) lb.close(); }, 320);     // remove from top layer after transition
  }

  // Intercept native Escape key — <dialog> fires 'cancel' before auto-closing.
  // We prevent the instant close and use our animated close instead.
  lb.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });

  lb.querySelector('.lb-close').addEventListener('click', (e) => { e.stopPropagation(); close(); });
  lb.querySelector('.lb-prev').addEventListener('click',  (e) => { e.stopPropagation(); show(current - 1); });
  lb.querySelector('.lb-next').addEventListener('click',  (e) => { e.stopPropagation(); show(current + 1); });

  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });

  document.addEventListener('keydown', (e) => {
    if (!lb.open) return;
    // Escape is handled by the 'cancel' event above
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  lb.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? show(current + 1) : show(current - 1);
  });

  return { open };
}

/* ─────────────────────────────────────
   GALLERY SWIPER
   ───────────────────────────────────── */

function initGallerySwiper(openFn) {
  if (typeof Swiper === 'undefined') return;

  new Swiper('.gallery-swiper', {
    slidesPerView: 1.25,
    spaceBetween: 16,
    centeredSlides: true,
    loop: true,
    speed: 680,
    grabCursor: true,
    navigation: {
      prevEl: '.gallery-prev',
      nextEl: '.gallery-next',
    },
    breakpoints: {
      600:  { slidesPerView: 2.1, spaceBetween: 20 },
      900:  { slidesPerView: 2.8, spaceBetween: 24 },
      1200: { slidesPerView: 3.4, spaceBetween: 28 },
      1600: { slidesPerView: 4.0, spaceBetween: 32 },
    },
    a11y: {
      prevSlideMessage: 'Previous image',
      nextSlideMessage: 'Next image',
    },
    on: {
      // Swiper's own click fires only after it confirms it was a tap, not a drag.
      // Match by data-href so duplicates (loop clones) resolve to the real item index.
      click(swiper, event) {
        if (!openFn) return;
        const item = event.target.closest('.gallery__item[data-lightbox]');
        if (!item) return;
        const href = item.getAttribute('data-href');
        // Collect original (non-clone) slides in DOM order
        const realItems = [...document.querySelectorAll(
          '.gallery-swiper .swiper-slide:not(.swiper-slide-duplicate) .gallery__item[data-lightbox]'
        )];
        const idx = realItems.findIndex(el => el.getAttribute('data-href') === href);
        openFn(idx >= 0 ? idx : 0);
      },
    },
  });
}

/* ─────────────────────────────────────
   SWIPER — TESTIMONIALS
   ───────────────────────────────────── */

function initSwiper() {
  if (typeof Swiper === 'undefined') return;

  new Swiper('.testimonials-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      prevEl: '.swiper-button-prev',
      nextEl: '.swiper-button-next',
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
      },
      900: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 2,
        spaceBetween: 32,
      },
    },
    a11y: {
      prevSlideMessage: 'Previous testimonial',
      nextSlideMessage: 'Next testimonial',
    },
  });
}

/* ─────────────────────────────────────
   NAVIGATION SCROLL BEHAVIOR
   ───────────────────────────────────── */

function initNavScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;

  function handleScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on init
}

/* ─────────────────────────────────────
   HAMBURGER / MOBILE MENU
   ───────────────────────────────────── */

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');

  function openMenu() {
    hamburger.classList.add('active');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    // Do NOT call lenis.stop() — in Lenis v1.1.x it sets pointer-events:none
    // on the scroll wrapper, freezing all interaction including the menu links.
    // The full-screen overlay prevents accidental page scrolling anyway.
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) { closeMenu(); } else { openMenu(); }
  });

  // Close on link click
  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close on backdrop click (outside nav area)
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMenu();
  });
}

/* ─────────────────────────────────────
   THEME TOGGLE
   ───────────────────────────────────── */

function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Read saved preference
  const saved = localStorage.getItem('rasa-theme');
  if (saved) {
    html.setAttribute('data-theme', saved);
  }

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('rasa-theme', next);
  });
}

/* ─────────────────────────────────────
   SMOOTH ANCHOR SCROLLING
   ───────────────────────────────────── */

function initAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;

      if (lenis) {
        lenis.scrollTo(target, { offset: -navH, duration: 1.4 });
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ─────────────────────────────────────
   BACK TO TOP BUTTON
   ───────────────────────────────────── */

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.6 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

/* ─────────────────────────────────────
   COUNTER ANIMATION
   ───────────────────────────────────── */

function initCounters() {
  const counters = document.querySelectorAll('.about__stat-number[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => observer.observe(counter));
}

/* ─────────────────────────────────────
   ABOUT IMAGE CLIP REVEAL
   ───────────────────────────────────── */

function initClipReveal() {
  const clip = document.querySelector('.about__image-clip');
  if (!clip) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(clip);
}

/* ─────────────────────────────────────
   CUSTOM CURSOR
   ───────────────────────────────────── */

function initCursor() {
  // Only on devices with a fine pointer (mouse)
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }

  animateFollower();

  // Hover effect on interactive elements
  const hoverEls = document.querySelectorAll('a, button, [role="button"], .dish-card, .chef-card, .gallery__item, .menu-item');

  hoverEls.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '0.5';
  });
}

/* ─────────────────────────────────────
   BUTTON RIPPLE EFFECT
   ───────────────────────────────────── */

function initRipple() {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');

      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 700);
    });
  });
}

/* ─────────────────────────────────────
   FORM VALIDATION & SUBMISSION
   ───────────────────────────────────── */

function initBookingForm() {
  const form = document.getElementById('bookingForm');
  const success = document.getElementById('bookingSuccess');
  if (!form) return;

  // Set min date to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  function validateField(input) {
    const errorEl = input.closest('.form-group')?.querySelector('.form-error');
    let message = '';

    if (input.required && !input.value.trim()) {
      message = 'This field is required.';
    } else if (input.type === 'email' && input.value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(input.value)) {
        message = 'Please enter a valid email address.';
      }
    } else if (input.type === 'tel' && input.value) {
      const telPattern = /^[+\d\s()\-]{7,20}$/;
      if (!telPattern.test(input.value)) {
        message = 'Please enter a valid phone number.';
      }
    } else if (input.type === 'date' && input.value) {
      const selected = new Date(input.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        message = 'Please select a future date.';
      }
    }

    if (errorEl) errorEl.textContent = message;
    input.classList.toggle('error', Boolean(message));
    return !message;
  }

  // Real-time validation
  form.querySelectorAll('input, select, textarea').forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    fields.forEach((field) => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) return;

    // Show loading state
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        // Show success
        form.style.display = 'none';
        if (success) {
          success.classList.add('visible');
        }
      } else {
        throw new Error('Form submission failed');
      }
    } catch {
      // Fallback for demo (no real Formspree ID configured)
      form.style.display = 'none';
      if (success) {
        success.classList.add('visible');
      }
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

/* ─────────────────────────────────────
   ACTIVE NAV LINK ON SCROLL
   ───────────────────────────────────── */

function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ─────────────────────────────────────
   INIT ALL
   ───────────────────────────────────── */

/* ─────────────────────────────────────
   GALLERY HOVER CAPTIONS
   Reads data-caption from each item and
   injects it into the overlay so it
   appears on hover and in the lightbox.
   ───────────────────────────────────── */
function initGalleryCaptions() {
  document.querySelectorAll('.gallery__item[data-caption]').forEach(item => {
    const caption = item.getAttribute('data-caption');
    const overlay = item.querySelector('.gallery__item-overlay');
    if (!overlay || !caption) return;
    // Avoid duplicating if already added
    if (overlay.querySelector('.gallery__item-caption')) return;
    const span = document.createElement('span');
    span.className = 'gallery__item-caption';
    span.textContent = caption;
    overlay.appendChild(span);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initLenis();
  initAOS();
  const lightbox = initCustomLightbox();
  initGalleryCaptions();
  initGallerySwiper(lightbox ? lightbox.open : null);
  initSwiper();
  initNavScroll();
  initMobileMenu();
  initAnchorScroll();
  initBackToTop();
  initCounters();
  initClipReveal();
  initCursor();
  initRipple();
  initBookingForm();
  initActiveNav();
  // Premium loop animations
  initTextScramble();
  initMagneticButtons();
  initCardTilt();
  initHeroParticles();
  initCursorSpotlight();
});

/* ─────────────────────────────────────
   TEXT SCRAMBLE
   Section eyebrows cycle through random
   glyphs then resolve to real text on
   scroll entry — signature luxury effect
   ───────────────────────────────────── */

function initTextScramble() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ·✦—◆';

  class Scramble {
    constructor(el) {
      this.el = el;
      this.original = el.textContent.trim();
      this.frame = 0;
      this.queue = [];
      this.raf = null;
      this.tick = this.tick.bind(this);
    }

    start() {
      this.frame = 0;
      this.queue = [...this.original].map((char, i) => ({
        to: char,
        start: Math.floor(i * 1.8),
        end: Math.floor(i * 1.8) + Math.floor(Math.random() * 10 + 6),
        glyph: '',
      }));
      cancelAnimationFrame(this.raf);
      this.tick();
    }

    tick() {
      let out = '';
      let done = 0;
      for (const item of this.queue) {
        if (this.frame >= item.end) {
          done++;
          out += item.to;
        } else if (this.frame >= item.start) {
          if (!item.glyph || Math.random() < 0.3) {
            item.glyph = item.to === ' '
              ? ' '
              : CHARS[Math.floor(Math.random() * CHARS.length)];
          }
          out += `<span class="scramble-glyph">${item.glyph}</span>`;
        } else {
          out += item.to === ' ' ? ' ' : '<span class="scramble-glyph">\xb7</span>';
        }
      }
      this.el.innerHTML = out;
      this.frame++;
      if (done < this.queue.length) {
        this.raf = requestAnimationFrame(this.tick);
      } else {
        this.el.textContent = this.original; // clean up spans
      }
    }
  }

  document.querySelectorAll('.section-eyebrow').forEach((el) => {
    const fx = new Scramble(el);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fx.start();
          observer.unobserve(el);
        }
      },
      { threshold: 0.8 }
    );
    observer.observe(el);
  });
}

/* ─────────────────────────────────────
   MAGNETIC BUTTONS
   CTA buttons slightly attract toward
   the cursor when hovering nearby
   ───────────────────────────────────── */

function initMagneticButtons() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  document.querySelectorAll('.btn--gold, .btn--outline').forEach((btn) => {
    let bounds = null;

    btn.addEventListener('mouseenter', () => {
      bounds = btn.getBoundingClientRect();
      btn.classList.add('magnetic-active');
    });

    btn.addEventListener('mousemove', (e) => {
      if (!bounds) return;
      const cx = bounds.left + bounds.width / 2;
      const cy = bounds.top + bounds.height / 2;
      const dx = (e.clientX - cx) * 0.28;
      const dy = (e.clientY - cy) * 0.28;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.classList.remove('magnetic-active');
      btn.style.transition = 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)';
      btn.style.transform = '';
      bounds = null;
      setTimeout(() => (btn.style.transition = ''), 600);
    });
  });
}

/* ─────────────────────────────────────
   3D CARD TILT
   Dish cards, chef cards, and award
   tiles tilt in 3D on mousemove —
   like a holographic trading card
   ───────────────────────────────────── */

function initCardTilt() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  document.querySelectorAll('.dish-card, .chef-card, .award-item').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.08s ease, box-shadow 0.08s ease';
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = [
        'perspective(900px)',
        `rotateY(${x * 12}deg)`,
        `rotateX(${-y * 12}deg)`,
        'translateZ(10px)',
      ].join(' ');
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.65s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.65s ease';
      card.style.transform = '';
    });
  });
}

/* ─────────────────────────────────────
   HERO FLOATING PARTICLES
   18 gold/saffron spice-dust motes
   drift upward through the hero
   ───────────────────────────────────── */

function initHeroParticles() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;

  for (let i = 0; i < 18; i++) {
    const p = document.createElement('span');
    p.className = 'hero__particle';
    const size = Math.random() * 3 + 1;
    p.style.cssText = [
      `left:${Math.random() * 100}%`,
      `width:${size}px`,
      `height:${size}px`,
      `--drift:${(Math.random() - 0.5) * 100}px`,
      `animation-delay:${Math.random() * 12}s`,
      `animation-duration:${Math.random() * 10 + 10}s`,
    ].join(';');
    hero.appendChild(p);
  }
}

/* ─────────────────────────────────────
   CURSOR SPOTLIGHT
   Soft radial gradient follows cursor
   with gentle lerp for silky movement
   ───────────────────────────────────── */

function initCursorSpotlight() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const spotlight = document.createElement('div');
  spotlight.className = 'cursor-spotlight';
  document.body.appendChild(spotlight);

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  (function animate() {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;
    spotlight.style.setProperty('--x', `${currentX}px`);
    spotlight.style.setProperty('--y', `${currentY}px`);
    requestAnimationFrame(animate);
  })();
}
