/**
 * FORGE INDUSTRIES v2 — gsap-animations.js
 * ─────────────────────────────────────────
 * Hero title char-by-char reveal + scroll parallax
 * Everything else uses CSS IntersectionObserver reveals
 */

'use strict';

(function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* ── Hero Title — Split into chars for stagger ── */
  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle) {
    // Wrap each text node letter in a span
    const lines = heroTitle.querySelectorAll('em');
    const textNodes = [];

    heroTitle.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        textNodes.push(node);
      }
    });

    // Wrap main text "Engineering" chars
    textNodes.forEach(node => {
      const text = node.textContent;
      const fragment = document.createDocumentFragment();
      text.split('').forEach(char => {
        if (char === ' ' || char === '\n') {
          fragment.appendChild(document.createTextNode(char));
        } else {
          const span = document.createElement('span');
          span.className = 'h-char';
          span.style.display = 'inline-block';
          span.textContent = char;
          fragment.appendChild(span);
        }
      });
      node.parentNode.replaceChild(fragment, node);
    });

    // Wrap "the Future." chars
    lines.forEach(em => {
      const text = em.textContent;
      em.textContent = '';
      text.split('').forEach(char => {
        if (char === ' ') {
          em.appendChild(document.createTextNode(' '));
        } else {
          const span = document.createElement('span');
          span.className = 'h-char';
          span.style.display = 'inline-block';
          span.textContent = char;
          em.appendChild(span);
        }
      });
    });

    // Animate all chars
    const allChars = heroTitle.querySelectorAll('.h-char');

    gsap.from(allChars, {
      opacity: 0,
      y: 50,
      rotateX: -40,
      stagger: 0.03,
      duration: 0.8,
      ease: 'back.out(1.7)',
      delay: 0.4,
    });
  }

  /* ── Hero Label ── */
  const heroLabel = document.getElementById('heroLabel');
  if (heroLabel) {
    gsap.from(heroLabel, {
      opacity: 0,
      x: -20,
      duration: 0.6,
      ease: 'power3.out',
      delay: 0.2,
    });
  }

  /* ── Hero Image parallax ── */
  const heroImg = document.querySelector('.hero__image img');
  if (heroImg) {
    gsap.to(heroImg, {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      },
    });
  }

  /* ── Parallax for About image ── */
  const aboutImg = document.querySelector('.about__image');
  if (aboutImg) {
    gsap.to(aboutImg, {
      yPercent: -5,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.4,
      },
    });
  }

  /* ── Stats band numbers scale punch ── */
  const statNumbers = document.querySelectorAll('.stat__number');
  if (statNumbers.length) {
    gsap.from(statNumbers, {
      scale: 0.6,
      stagger: 0.1,
      duration: 0.6,
      ease: 'back.out(2)',
      scrollTrigger: {
        trigger: '.stats-band',
        start: 'top 80%',
        once: true,
      },
    });
  }

})();
