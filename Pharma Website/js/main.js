/* ═══════════════════════════════════════════════════════════
   VITALCARE — MAIN JAVASCRIPT
   ─────────────────────────────────────────────────────────
   Modules:
   1. Preloader
   2. Navigation (scroll, hamburger, active link)
   3. Theme Toggle (light/dark)
   4. Scroll Animations (IntersectionObserver)
   5. Stats Counter
   6. Department Tabs (filter)
   7. FAQ Accordion
   8. Testimonials Slider (Swiper)
   9. Appointment Form
   10. Floating CTA & Back-to-Top
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ─────────────────────────────────────
     1. PRELOADER
     ───────────────────────────────────── */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('loaded');
    }, 600);
  });

  /* ─────────────────────────────────────
     2. NAVIGATION
     ───────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.nav__link');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll — add shadow
  function handleNavScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('nav--scrolled');
    } else {
      navbar.classList.remove('nav--scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded',
      hamburger.classList.contains('active').toString()
    );
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Active nav link on scroll
  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* ─────────────────────────────────────
     3. THEME TOGGLE
     ───────────────────────────────────── */
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const STORAGE_KEY = 'vitalcare-theme';

  // Load saved theme
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  }

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  /* ─────────────────────────────────────
     4. SCROLL ANIMATIONS (IntersectionObserver)
     ───────────────────────────────────── */
  const animatedElements = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    animatedElements.forEach(el => animationObserver.observe(el));
  } else {
    // Fallback: show all elements immediately
    animatedElements.forEach(el => el.classList.add('animated'));
  }

  /* ─────────────────────────────────────
     5. STATS COUNTER
     ───────────────────────────────────── */
  const counters = document.querySelectorAll('.stats__number[data-count]');
  let counterAnimated = false;

  function animateCounters() {
    if (counterAnimated) return;
    counterAnimated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      function updateCounter() {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      }

      updateCounter();
    });
  }

  // Trigger when stats section is visible
  const statsSection = document.querySelector('.stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  /* ─────────────────────────────────────
     6. DEPARTMENT TABS (FILTER)
     ───────────────────────────────────── */
  const deptTabs = document.querySelectorAll('.dept-tab');
  const deptCards = document.querySelectorAll('.dept-card');

  deptTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-dept');

      // Update active tab
      deptTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Filter cards with animation
      deptCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ─────────────────────────────────────
     7. FAQ ACCORDION
     ───────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all items
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
        i.querySelector('.faq__answer').style.maxHeight = null;
      });

      // Open clicked item (if it wasn't already open)
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ─────────────────────────────────────
     8. TESTIMONIALS SLIDER (Swiper)
     ───────────────────────────────────── */
  if (typeof Swiper !== 'undefined') {
    new Swiper('.testimonials__slider', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }

  /* ─────────────────────────────────────
     9. APPOINTMENT FORM
     ───────────────────────────────────── */
  const appointmentForm = document.getElementById('appointmentForm');
  const dateInput = document.getElementById('appointDate');

  // Set min date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(appointmentForm);
      const data = Object.fromEntries(formData.entries());

      // Basic validation
      const name = document.getElementById('patientName').value.trim();
      const phone = document.getElementById('patientPhone').value.trim();
      const dept = document.getElementById('deptSelect').value;
      const date = document.getElementById('appointDate').value;

      if (!name || !phone || !dept || !date) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }

      // Simulate submission
      const submitBtn = appointmentForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="ri-loader-4-line" style="animation: spin 1s linear infinite;"></i> Booking...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="ri-check-line"></i> Appointment Booked!';
        submitBtn.style.background = 'var(--color-green)';

        showNotification('Appointment booked successfully! We\'ll send a confirmation shortly.', 'success');

        setTimeout(() => {
          appointmentForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  // Notification helper
  function showNotification(message, type) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <i class="${type === 'success' ? 'ri-check-double-line' : 'ri-error-warning-line'}"></i>
      <span>${message}</span>
      <button class="notification__close" aria-label="Close notification"><i class="ri-close-line"></i></button>
    `;

    // Styles
    Object.assign(notification.style, {
      position: 'fixed',
      top: '100px',
      right: '20px',
      zIndex: '9999',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem 1.5rem',
      borderRadius: '12px',
      fontSize: '0.875rem',
      fontWeight: '500',
      maxWidth: '400px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      transform: 'translateX(120%)',
      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      background: type === 'success' ? '#059669' : '#E11D48',
      color: '#FFFFFF'
    });

    document.body.appendChild(notification);

    // Slide in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });

    // Close button
    notification.querySelector('.notification__close').addEventListener('click', () => {
      notification.style.transform = 'translateX(120%)';
      setTimeout(() => notification.remove(), 400);
    });

    // Auto close
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 400);
      }
    }, 5000);
  }

  /* ─────────────────────────────────────
     10. FLOATING CTA & BACK TO TOP
     ───────────────────────────────────── */
  const floatingCta = document.getElementById('floatingCta');
  const backToTop = document.getElementById('backToTop');

  function handleScrollUI() {
    const scrollY = window.scrollY;

    // Show floating CTA after hero
    if (floatingCta) {
      if (scrollY > 600) {
        floatingCta.classList.add('visible');
      } else {
        floatingCta.classList.remove('visible');
      }
    }

    // Back to top
    if (backToTop) {
      if (scrollY > 800) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScrollUI, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─────────────────────────────────────
     SPIN ANIMATION (for loader)
     ───────────────────────────────────── */
  const spinStyle = document.createElement('style');
  spinStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(spinStyle);

  /* ─────────────────────────────────────
     SMOOTH SCROLL for anchor links
     ───────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 76;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
});
