/* ============================================================
   ELEVATE — Advanced JavaScript Animations & Interactions
   Premium micro-interactions, scroll effects, and UI logic
   ============================================================ */

(function () {
  'use strict';

  const html = document.documentElement;

  // ========== THEME MANAGEMENT ==========
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  const savedTheme = localStorage.getItem('elevate-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  syncThemeIcon(savedTheme);

  function syncThemeIcon(theme) {
    if (!themeIcon) return;
    themeIcon.className = theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('elevate-theme', next);
      syncThemeIcon(next);
    });
  }

  // ========== SCROLL PROGRESS BAR ==========
  const scrollProgressBar = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgressBar) scrollProgressBar.style.width = pct + '%';
  }

  // ========== PRELOADER ==========
  const preloader = document.getElementById('preloader');

  // Lock scroll on both html + body for mobile Safari
  function lockScroll() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = -window.scrollY + 'px';
  }

  function unlockScroll() {
    const scrollY = Math.abs(parseInt(document.body.style.top || '0'));
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
  }

  lockScroll();

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      unlockScroll();
      initParticles();
      initWordSplit();
      initRipple();
      initStoriesDots();
      initTickerTouch();
    }, 2200);
  });

  // ========== CUSTOM CURSOR ==========
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  // ========== HERO SPOTLIGHT ==========
  const heroSpotlight = document.getElementById('hero-spotlight');

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX - 4 + 'px';
    cursor.style.top = mouseY - 4 + 'px';

    // Update spotlight position inside hero only
    if (heroSpotlight) {
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        const xPct = ((e.clientX - rect.left) / rect.width) * 100;
        const yPct = ((e.clientY - rect.top) / rect.height) * 100;
        heroSpotlight.style.background = `radial-gradient(500px circle at ${xPct}% ${yPct}%, rgba(124,58,237,0.08), transparent 40%)`;
      }
    }
  });

  function animateCursor() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX - 18 + 'px';
    follower.style.top = followerY - 18 + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor hover effect on interactive elements
  function refreshCursorTargets() {
    document.querySelectorAll('a, button, .magnetic-btn, .tilt-card').forEach(el => {
      el.addEventListener('mouseenter', () => follower.classList.add('hover'));
      el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });
  }
  refreshCursorTargets();

  // ========== HEADER SCROLL ==========
  const header = document.getElementById('header');
  let lastScrollY = 0;

  function handleScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateScrollProgress();
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ========== MOBILE NAVIGATION ==========
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // ========== ACTIVE SECTION INDICATOR ==========
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav__link[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ========== SCROLL-TRIGGERED ANIMATIONS ==========
  const animElements = document.querySelectorAll('[data-animate]');

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, parseInt(delay));
        animObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  animElements.forEach(el => animObserver.observe(el));

  // ========== COUNTER ANIMATION ==========
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // ease-out quart
      const current = Math.floor(eased * target);

      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // Hero stats counter
  const heroCounters = document.querySelectorAll('.hero__stat-number[data-count]');
  const heroStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        heroCounters.forEach(counter => animateCounter(counter));
        heroStatsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) heroStatsObserver.observe(heroStats);

  // Results section counter
  const resultCounters = document.querySelectorAll('.result-card__number[data-count]');
  const resultsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        resultCounters.forEach(counter => animateCounter(counter));
        resultsObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const resultsGrid = document.querySelector('.results__grid');
  if (resultsGrid) resultsObserver.observe(resultsGrid);

  // ========== FAQ ACCORDION ==========
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq__answer').style.maxHeight = null;
        i.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked if wasn't active
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ========== MAGNETIC BUTTONS ==========
  const magneticBtns = document.querySelectorAll('.magnetic-btn');

  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  // ========== 3D TILT CARDS ==========
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * 10;
      const rotateY = (x - 0.5) * 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ========== FLOATING PARTICLES ==========
  function initParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;

    const isDark = html.getAttribute('data-theme') !== 'light';
    const particleCount = 50;

    // Clear existing particles
    container.innerHTML = '';

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      const size = Math.random() * 3 + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 25 + 12;
      const delay = Math.random() * 12;
      const opacity = Math.random() * 0.5 + 0.1;
      const colors = ['rgba(167,139,250,', 'rgba(6,182,212,', 'rgba(245,158,11,'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const moveX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 160 + 40);
      const moveY = -(Math.random() * 500 + 150);

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color}${opacity});
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        animation: particleMove${i} ${duration}s linear ${delay}s infinite;
        pointer-events: none;
      `;

      const kf = document.createElement('style');
      kf.textContent = `@keyframes particleMove${i} {
        0% { transform: translate(0,0) scale(1); opacity: 0; }
        10% { opacity: ${opacity}; }
        80% { opacity: ${opacity * 0.6}; }
        100% { transform: translate(${moveX}px,${moveY}px) scale(0.3); opacity: 0; }
      }`;
      document.head.appendChild(kf);
      container.appendChild(particle);
    }
  }

  // ========== MOUSE FOLLOW GRADIENT GLOW ==========
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mouse-x', x + '%');
    document.documentElement.style.setProperty('--mouse-y', y + '%');
  });

  // ========== WORD SPLIT ANIMATION ==========
  function initWordSplit() {
    const heroTitle = document.getElementById('hero-title');
    if (!heroTitle) return;

    // Collect all child nodes (text + element) and rebuild as word spans
    const nodes = Array.from(heroTitle.childNodes);
    const frag = document.createDocumentFragment();
    let wordIndex = 0;

    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const words = text.split(/(\s+)/);
        words.forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            // Preserve whitespace as a text node
            frag.appendChild(document.createTextNode(part));
          } else {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = part;
            span.style.transitionDelay = (wordIndex * 0.08) + 's';
            wordIndex++;
            frag.appendChild(span);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Keep span (e.g. .hero__title-gradient) but wrap its text content too
        node.classList.add('word');
        node.style.transitionDelay = (wordIndex * 0.08) + 's';
        wordIndex++;
        frag.appendChild(node.cloneNode(true));
      }
    });

    // Replace all children at once
    heroTitle.innerHTML = '';
    heroTitle.appendChild(frag);

    // Force a paint of initial hidden state before adding 'animated'
    // Double rAF guarantees the browser has committed the transform/opacity
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroTitle.classList.add('animated');
      });
    });
  }

  // ========== BUTTON RIPPLE EFFECT ==========
  function initRipple() {
    document.querySelectorAll('.btn, .program-card__btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      });
    });
  }

  // ========== STORIES DOTS NAVIGATION ==========
  // ========== TICKER — rAF LOOP (works on mobile, CSS animation freezes) ==========
  function initTickerTouch() {
    const track = document.querySelector('.ticker__track');
    if (!track) return;

    const SPEED = 60; // px per second
    let offset = 0;
    let lastTime = null;
    let paused = false;

    // Hover pause — pointer devices only
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const section = track.closest('.ticker');
      if (section) {
        section.addEventListener('mouseenter', () => { paused = true; });
        section.addEventListener('mouseleave', () => { paused = false; });
      }
    }

    // Touch pause — mobile
    const section = track.closest('.ticker');
    if (section) {
      section.addEventListener('touchstart', () => { paused = true; }, { passive: true });
      section.addEventListener('touchend', () => { paused = false; }, { passive: true });
    }

    function tick(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const delta = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      if (!paused) {
        offset += SPEED * delta;
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0 && offset >= halfWidth) offset -= halfWidth;
        track.style.transform = `translateX(-${offset}px)`;
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function initStoriesDots() {
    const track = document.getElementById('stories-track');
    if (!track) return;

    const cards = track.querySelectorAll('.story-card');
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'stories__dots';

    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'stories__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Story ${i + 1}`);
      dot.addEventListener('click', () => scrollToCard(i));
      dotsContainer.appendChild(dot);
    });

    track.parentElement.appendChild(dotsContainer);
    const dots = dotsContainer.querySelectorAll('.stories__dot');

    function scrollToCard(index) {
      const card = cards[index];
      if (!card) return;
      track.scrollTo({ left: card.offsetLeft - 24, behavior: 'smooth' });
      dots.forEach(d => d.classList.remove('active'));
      dots[index].classList.add('active');
    }

    // Sync dots on manual scroll
    let scrollTimer;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const scrollLeft = track.scrollLeft;
        let closestIdx = 0;
        let closestDist = Infinity;
        cards.forEach((card, i) => {
          const dist = Math.abs(card.offsetLeft - scrollLeft - 24);
          if (dist < closestDist) { closestDist = dist; closestIdx = i; }
        });
        dots.forEach(d => d.classList.remove('active'));
        if (dots[closestIdx]) dots[closestIdx].classList.add('active');
      }, 80);
    }, { passive: true });

    // Auto-advance on mobile
    let autoSlide;
    function startAutoSlide() {
      let current = 0;
      autoSlide = setInterval(() => {
        current = (current + 1) % cards.length;
        scrollToCard(current);
      }, 4000);
    }

    if (window.innerWidth < 768) startAutoSlide();
    track.addEventListener('mouseenter', () => clearInterval(autoSlide));
    track.addEventListener('touchstart', () => clearInterval(autoSlide), { passive: true });
  }

  // ========== BACK TO TOP ==========
  const backToTop = document.getElementById('back-to-top');

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

  // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ========== NEWSLETTER FORM ==========
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.footer__input');
      if (input.value) {
        input.value = '';
        input.placeholder = '✓ Subscribed! Check your inbox.';
        setTimeout(() => {
          input.placeholder = 'Enter your email';
        }, 3000);
      }
    });
  }

  // ========== HORIZONTAL SCROLL FOR STORIES ==========
  const storiesTrack = document.getElementById('stories-track');
  if (storiesTrack) {
    let isDown = false;
    let startX;
    let scrollLeft;

    storiesTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      storiesTrack.style.cursor = 'grabbing';
      startX = e.pageX - storiesTrack.offsetLeft;
      scrollLeft = storiesTrack.scrollLeft;
    });

    storiesTrack.addEventListener('mouseleave', () => {
      isDown = false;
      storiesTrack.style.cursor = 'grab';
    });

    storiesTrack.addEventListener('mouseup', () => {
      isDown = false;
      storiesTrack.style.cursor = 'grab';
    });

    storiesTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - storiesTrack.offsetLeft;
      const walk = (x - startX) * 1.5;
      storiesTrack.scrollLeft = scrollLeft - walk;
    });

    storiesTrack.style.cursor = 'grab';
  }

  // ========== PARALLAX EFFECT ON HERO ORBS ==========
  const orbs = document.querySelectorAll('.hero__gradient-orb');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 0.1;
      orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });

  // ========== TEXT REVEAL ANIMATION FOR HERO TITLE ==========
  const heroTitle = document.querySelector('.hero__title');
  if (heroTitle) {
    const titleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          titleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(30px)';
    heroTitle.style.transition = 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s';
    titleObserver.observe(heroTitle);
  }

})();
