/* ============================================================
   ELEVATE — Advanced JavaScript Animations & Interactions
   Premium micro-interactions, scroll effects, and UI logic
   ============================================================ */

(function () {
  'use strict';

  // ========== PRELOADER ==========
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
      initParticles();
    }, 2200);
  });
  document.body.style.overflow = 'hidden';

  // ========== CUSTOM CURSOR ==========
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX - 4 + 'px';
    cursor.style.top = mouseY - 4 + 'px';
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
  const hoverElements = document.querySelectorAll('a, button, .magnetic-btn, .tilt-card');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hover'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
  });

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

    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      const size = Math.random() * 3 + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 20 + 10;
      const delay = Math.random() * 10;
      const opacity = Math.random() * 0.5 + 0.1;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${Math.random() > 0.5 ? 'var(--color-primary-light)' : 'var(--color-secondary)'};
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        opacity: ${opacity};
        animation: particleFloat ${duration}s linear ${delay}s infinite;
        pointer-events: none;
      `;

      container.appendChild(particle);
    }

    // Add particle animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes particleFloat {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
        10% { opacity: 0.5; }
        90% { opacity: 0.5; }
        100% { transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 200}px, -${Math.random() * 600 + 200}px) rotate(360deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // ========== MOUSE FOLLOW GRADIENT GLOW ==========
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mouse-x', x + '%');
    document.documentElement.style.setProperty('--mouse-y', y + '%');
  });

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
