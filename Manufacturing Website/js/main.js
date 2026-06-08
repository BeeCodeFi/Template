/**
 * FORGE INDUSTRIES v2 — main.js
 * ─────────────────────────────
 * Brutalist Industrial · IntersectionObserver reveals
 * No AOS · No custom cursor · Clean vanilla JS
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════
     1. PAGE LOAD
  ═══════════════════════════════════ */

  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  // Fallback — if load already fired
  if (document.readyState === 'complete') {
    document.body.classList.add('loaded');
  }


  /* ═══════════════════════════════════
     2. INTERSECTION OBSERVER REVEALS
     Custom system replacing AOS
  ═══════════════════════════════════ */

  const revealElements = document.querySelectorAll('[data-reveal]');
  const staggerElements = document.querySelectorAll('[data-reveal-stagger]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
  staggerElements.forEach(el => revealObserver.observe(el));


  /* ═══════════════════════════════════
     3. NAVIGATION
  ═══════════════════════════════════ */

  const nav = document.getElementById('navbar');
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  // Scroll state
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Add scrolled class
    if (scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  }, { passive: true });

  // Menu toggle
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open');
      menuBtn.classList.toggle('active');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuBtn.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link tracking
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => sectionObserver.observe(s));


  /* ═══════════════════════════════════
     4. SMOOTH SCROLL
  ═══════════════════════════════════ */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ═══════════════════════════════════
     5. ANIMATED COUNTERS
  ═══════════════════════════════════ */

  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(eased * target);

      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }


  /* ═══════════════════════════════════
     6. SWIPER — Testimonials
  ═══════════════════════════════════ */

  if (typeof Swiper !== 'undefined') {
    new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        900: { slidesPerView: 2 },
      },
    });
  }


  /* ═══════════════════════════════════
     7. LIGHTBOX
  ═══════════════════════════════════ */

  const lbDialog = document.getElementById('forge-lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbCounter = document.getElementById('lbCounter');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const lbSpinner = document.getElementById('lbSpinner');

  const galleryItems = document.querySelectorAll('.gallery__item[data-lb-src]');
  let lbIndex = 0;
  const lbImages = [];

  galleryItems.forEach((item, i) => {
    lbImages.push({
      src: item.dataset.lbSrc,
      cap: item.dataset.lbCap || '',
    });
    item.addEventListener('click', () => openLightbox(i));
  });

  function openLightbox(index) {
    if (!lbDialog) return;
    lbIndex = index;
    updateLightboxImage();
    lbDialog.showModal();
    requestAnimationFrame(() => lbDialog.classList.add('lb-open'));
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lbDialog.classList.remove('lb-open');
    setTimeout(() => {
      lbDialog.close();
      document.body.style.overflow = '';
    }, 300);
  }

  function updateLightboxImage() {
    const data = lbImages[lbIndex];
    if (!data) return;
    lbSpinner.style.display = 'flex';
    lbImg.style.opacity = '0';
    lbImg.onload = () => {
      lbSpinner.style.display = 'none';
      lbImg.style.opacity = '1';
    };
    lbImg.src = data.src;
    lbImg.alt = data.cap;
    lbCaption.textContent = data.cap;
    lbCounter.textContent = `${lbIndex + 1} / ${lbImages.length}`;
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev) lbPrev.addEventListener('click', () => {
    lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
    updateLightboxImage();
  });
  if (lbNext) lbNext.addEventListener('click', () => {
    lbIndex = (lbIndex + 1) % lbImages.length;
    updateLightboxImage();
  });

  // ESC + click backdrop
  if (lbDialog) {
    lbDialog.addEventListener('click', (e) => {
      if (e.target === lbDialog) closeLightbox();
    });
    lbDialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lbDialog || !lbDialog.open) return;
    if (e.key === 'ArrowLeft') {
      lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
      updateLightboxImage();
    } else if (e.key === 'ArrowRight') {
      lbIndex = (lbIndex + 1) % lbImages.length;
      updateLightboxImage();
    }
  });


  /* ═══════════════════════════════════
     8. CONTACT FORM
  ═══════════════════════════════════ */

  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const successEl = document.getElementById('contactSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate
      let valid = true;
      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const service = document.getElementById('contactService');
      const message = document.getElementById('contactMessage');

      // Reset errors
      [name, email, service, message].forEach(f => f.classList.remove('error'));
      document.querySelectorAll('.form-error').forEach(e => e.textContent = '');

      if (!name.value.trim()) {
        name.classList.add('error');
        document.getElementById('nameError').textContent = 'Name is required';
        valid = false;
      }

      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add('error');
        document.getElementById('emailError').textContent = 'Valid email is required';
        valid = false;
      }

      if (!service.value) {
        service.classList.add('error');
        document.getElementById('serviceError').textContent = 'Select a service';
        valid = false;
      }

      if (!message.value.trim()) {
        message.classList.add('error');
        document.getElementById('messageError').textContent = 'Message is required';
        valid = false;
      }

      if (!valid) return;

      // Simulate submission
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        form.style.display = 'none';
        successEl.classList.add('visible');
      }, 1500);
    });
  }


  /* ═══════════════════════════════════
     9. BACK TO TOP
  ═══════════════════════════════════ */

  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ═══════════════════════════════════
     10. SCROLL PROGRESS BAR
  ═══════════════════════════════════ */

  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });


  /* ═══════════════════════════════════
     11. TEXT SCRAMBLE EFFECT ON LABELS
  ═══════════════════════════════════ */

  const labels = document.querySelectorAll('.label');
  const scrambleChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`01';

  const labelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.scrambled) {
        entry.target.dataset.scrambled = 'true';
        scrambleText(entry.target);
      }
    });
  }, { threshold: 0.5 });

  labels.forEach(el => labelObserver.observe(el));

  function scrambleText(el) {
    const original = el.textContent.replace(/[\[\]]/g, '').trim();
    let iteration = 0;
    const maxIterations = original.length;

    const interval = setInterval(() => {
      el.textContent = original
        .split('')
        .map((char, index) => {
          if (index < iteration) return original[index];
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        })
        .join('');

      if (iteration >= maxIterations) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, 30);
  }


  /* ═══════════════════════════════════
     12. MARQUEE — rAF driven (CSS anim unreliable on mobile)
  ═══════════════════════════════════ */

  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    // Speed in px per second
    const SPEED = 60;
    let offset = 0;
    let lastTime = null;
    let paused = false;

    // Pause only on real pointer devices (mouse hover)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const marqueeSection = document.querySelector('.marquee-section');
      if (marqueeSection) {
        marqueeSection.addEventListener('mouseenter', () => { paused = true; });
        marqueeSection.addEventListener('mouseleave', () => { paused = false; });
      }
    }

    function tickMarquee(timestamp) {
      if (lastTime !== null && !paused) {
        const delta = (timestamp - lastTime) / 1000; // seconds
        offset += SPEED * delta;
        // Reset when one full half scrolled (two identical content blocks)
        const halfWidth = marqueeTrack.scrollWidth / 2;
        if (offset >= halfWidth) offset -= halfWidth;
        marqueeTrack.style.transform = `translateX(-${offset}px)`;
      }
      lastTime = timestamp;
      requestAnimationFrame(tickMarquee);
    }

    requestAnimationFrame(tickMarquee);
  }

  /* ═══════════════════════════════════
     13. THEME TOGGLE — light / dark
  ═══════════════════════════════════ */

  const themeToggle = document.getElementById('themeToggle');
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');
  const root = document.documentElement;
  const heroImg = document.getElementById('heroImg');

  const HERO_DARK  = 'assets/images/hero.png';
  const HERO_LIGHT = 'assets/images/hero-light.jpg';

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem('forge-theme', theme);

    // Swap hero image
    if (heroImg) {
      heroImg.src = theme === 'light' ? HERO_LIGHT : HERO_DARK;
    }

    // Sync mobile button label
    if (mobileThemeToggle) {
      const isLight = theme === 'light';
      mobileThemeToggle.querySelector('i').className = isLight ? 'ri-moon-line' : 'ri-sun-line';
      mobileThemeToggle.querySelector('span').textContent = isLight ? 'Dark' : 'Light';
    }
  }

  // Set initial mobile button state
  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      applyTheme(isLight ? 'dark' : 'light');
    });
  }

  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      applyTheme(isLight ? 'dark' : 'light');
    });
  }

  /* ═══════════════════════════════════
     12. HERO MOUSE PARALLAX
  ═══════════════════════════════════ */

  const heroContent = document.querySelector('.hero__content');
  const heroImage = document.querySelector('.hero__image');

  if (heroContent && window.matchMedia('(min-width: 900px)').matches) {
    document.querySelector('.hero').addEventListener('mousemove', (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Subtle parallax on text content
      heroContent.style.transform = `translate(${x * 8}px, ${y * 5}px)`;

      // Counter-parallax on image
      if (heroImage) {
        const img = heroImage.querySelector('img');
        if (img) {
          img.style.transform = `translate(${-x * 12}px, ${-y * 8}px) scale(1.05)`;
        }
      }
    });
  }

});
