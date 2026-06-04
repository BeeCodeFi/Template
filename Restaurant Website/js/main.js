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

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // GSAP ScrollTrigger integration
  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
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
   GLIGHTBOX — GALLERY LIGHTBOX
   ───────────────────────────────────── */

function initGLightbox() {
  if (typeof GLightbox === 'undefined') return;

  GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    autoplayVideos: false,
    openEffect: 'fade',
    closeEffect: 'fade',
    cssEfects: {
      fade: { in: 'fadeIn', out: 'fadeOut' }
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
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
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

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initLenis();
  initAOS();
  initGLightbox();
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
});
