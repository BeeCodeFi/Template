/**
 * RASA RESTAURANT — gsap-animations.js
 * All GSAP-powered animations:
 * - Hero character reveal
 * - Parallax backgrounds
 * - Chef quote section pin
 * - ScrollTrigger section reveals
 */

'use strict';

(function () {
  // Guard: only run if GSAP and ScrollTrigger are loaded
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('Rasa: GSAP or ScrollTrigger not loaded — skipping GSAP animations.');
    return;
  }

  // Skip all GSAP animations for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Still need to make hero elements visible
    revealHeroInstant();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Prevent iOS address-bar resize from spamming ScrollTrigger.refresh()
  ScrollTrigger.config({ ignoreMobileResize: true });

  // Detect real touch devices (phones/tablets)
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  /* ─────────────────────────────────────
     HERO ENTRANCE ANIMATION
     Character-by-character title reveal
     ───────────────────────────────────── */

  function initHeroAnimation() {
    const chars       = document.querySelectorAll('.hero__char');
    const eyebrow     = document.getElementById('heroEyebrow');
    const tagline     = document.getElementById('heroTagline');
    const desc        = document.getElementById('heroDesc');
    const ctas        = document.getElementById('heroCtas');
    const heroBg      = document.querySelector('.hero__bg-img');

    if (!chars.length) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Eyebrow fades in first
    if (eyebrow) {
      tl.to(eyebrow, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: 0.3,
      }, 0);
    }

    // Each character drops in with stagger
    tl.fromTo(
      chars,
      { opacity: 0, y: 60, rotationX: -40 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        transformPerspective: 600,
      },
      0.4
    );

    // Tagline
    if (tagline) {
      tl.to(tagline, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3');
    }

    // Desc
    if (desc) {
      tl.to(desc, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5');
    }

    // CTAs
    if (ctas) {
      tl.to(ctas, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');
    }

    // Hero bg subtle scale-in
    if (heroBg) {
      gsap.to(heroBg, {
        scale: 1,
        duration: 2.5,
        ease: 'power1.out',
      });
    }
  }

  /* ─────────────────────────────────────
     HERO PARALLAX ON SCROLL
     Background image moves slower
     ───────────────────────────────────── */

  function initHeroParallax() {
    const heroBg = document.querySelector('.hero__bg-img');
    if (!heroBg) return;

    gsap.to(heroBg, {
      yPercent: 25,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  /* ─────────────────────────────────────
     ABOUT IMAGE PARALLAX
     ───────────────────────────────────── */

  function initAboutParallax() {
    const img = document.querySelector('.about__image');
    if (!img) return;

    gsap.to(img, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  }

  /* ─────────────────────────────────────
     CHEF QUOTE BAND — PARALLAX BG
     ───────────────────────────────────── */

  function initChefQuoteParallax() {
    const bg = document.querySelector('.chefs__quote-bg img');
    if (!bg) return;

    gsap.to(bg, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.chefs__quote-band',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  /* ─────────────────────────────────────
     SECTION TITLE REVEAL
     Each section title gets a subtle
     clip/translate reveal on scroll entry
     ───────────────────────────────────── */

  function initSectionTitleReveals() {
    const titles = document.querySelectorAll(
      '.about .section-title, .signatures .section-title, ' +
      '.menu-section .section-title, .gallery .section-title, ' +
      '.chefs .section-title, .reservations .section-title, ' +
      '.testimonials .section-title, .awards .section-title, ' +
      '.contact .section-title'
    );

    titles.forEach((title) => {
      const wrap = document.createElement('div');
      wrap.style.overflow = 'hidden';
      wrap.style.display = 'block';
      title.parentNode.insertBefore(wrap, title);
      wrap.appendChild(title);

      gsap.fromTo(
        title,
        { y: '100%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrap,
            start: 'top 85%',
            once: true,
          },
        }
      );
    });
  }

  /* ─────────────────────────────────────
     MARQUEE STRIP — DIRECTION CHANGE ON HOVER
     CSS animation direction is reversed on hover
     (Pure CSS handles this via :hover on .marquee-track,
     GSAP speeds up/slows down on scroll)
     ───────────────────────────────────── */

  function initMarqueeEffect() {
    // Speed up marquee when scrolling fast (ScrollTrigger velocity)
    const marqueeContent = document.querySelectorAll('.marquee-content');
    if (!marqueeContent.length) return;

    // Nothing to do — CSS handles the basic animation
    // GSAP would extend this with velocity-based speed changes
    // Keeping it simple for template demo
  }

  /* ─────────────────────────────────────
     SIGNATURE DISH CARDS — STAGGER SCALE
     Enhanced entry beyond AOS
     ───────────────────────────────────── */

  function initCardReveals() {
    const dishCards = document.querySelectorAll('.signatures__grid .dish-card');

    if (dishCards.length) {
      gsap.fromTo(
        dishCards,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.signatures__grid',
            start: 'top 80%',
            once: true,
          },
        }
      );
    }

    // Chef cards
    const chefCards = document.querySelectorAll('.chefs__grid .chef-card');
    if (chefCards.length) {
      gsap.fromTo(
        chefCards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.chefs__grid',
            start: 'top 80%',
            once: true,
          },
        }
      );
    }
  }

  /* ─────────────────────────────────────
     HERO IMAGE SCALE ON SCROLL (ZOOM OUT)
     ───────────────────────────────────── */

  function initHeroZoom() {
    const heroTitle = document.querySelector('.hero__title');
    if (!heroTitle) return;

    // Fade hero content on scroll down
    gsap.to('.hero__content', {
      opacity: 0,
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '35% top',
        scrub: true,
      },
    });
  }

  /* ─────────────────────────────────────
     ABOUT STATS — SLIDE UP
     ───────────────────────────────────── */

  function initAboutStatsReveal() {
    const stats = document.querySelectorAll('.about__stat');
    if (!stats.length) return;

    gsap.fromTo(
      stats,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about__stats',
          start: 'top 85%',
          once: true,
        },
      }
    );
  }

  /* ─────────────────────────────────────
     AWARDS STRIP — SEQUENTIAL REVEAL
     ───────────────────────────────────── */

  function initAwardsReveal() {
    const awards = document.querySelectorAll('.award-item');
    if (!awards.length) return;

    gsap.fromTo(
      awards,
      { opacity: 0, scale: 0.9, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: '.awards__strip',
          start: 'top 85%',
          once: true,
        },
      }
    );
  }

  /* ─────────────────────────────────────
     FOOTER BRAND — FADE UP
     ───────────────────────────────────── */

  function initFooterReveal() {
    gsap.fromTo(
      '.footer__brand',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.footer',
          start: 'top 90%',
          once: true,
        },
      }
    );
  }

  /* ─────────────────────────────────────
     INSTANT HERO REVEAL (reduced motion)
     ───────────────────────────────────── */

  function revealHeroInstant() {
    const elements = [
      '#heroEyebrow',
      '#heroTagline',
      '#heroDesc',
      '#heroCtas',
      ...Array.from(document.querySelectorAll('.hero__char')),
    ];

    elements.forEach((el) => {
      const node = typeof el === 'string' ? document.querySelector(el) : el;
      if (node) {
        node.style.opacity = '1';
        node.style.transform = 'none';
      }
    });
  }

  /* ─────────────────────────────────────
     INITIALIZE ALL
     Wait for DOMContentLoaded
     ───────────────────────────────────── */

  /* ─────────────────────────────────────
     GALLERY FLOATING REVEAL
     Items start scattered at small scale with gentle
     ambient float. On scroll into view they snap
     back to their grid positions with staggered spring.
     ───────────────────────────────────── */

  /* ─────────────────────────────────────
     GALLERY CAROUSEL — SCROLL-SCRUBBED REVEAL
     Tied directly to scroll position so it
     fades in as you scroll down and fades out
     if you scroll back up. No once:true.
     ───────────────────────────────────── */

  function initGalleryReveal() {
    const wrap = document.querySelector('.gallery__carousel-wrap');
    if (!wrap) return;

    // Set initial hidden state inline (GSAP controls it, not CSS).
    // Use once:true + toggleActions instead of scrub so the animation
    // fires as a one-shot trigger and doesn't require continuous
    // ScrollTrigger.update calls — which don't arrive on mobile because
    // Lenis runs with smoothTouch:false and touch scroll events bypass
    // the lenis.on('scroll', ScrollTrigger.update) integration.
    gsap.fromTo(
      wrap,
      { opacity: 0, y: 70 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: wrap,
          start: 'top 90%',
          once: true,
          toggleActions: 'play none none none',
        },
      }
    );
  }

  /* ─────────────────────────────────────
     RASA TITLE — LOOPING MULTI-EFFECT ANIMATION
     Five premium effects cycle indefinitely
     after the hero entrance completes:
       1. Saffron shimmer wave
       2. Levitate wave
       3. 3D perspective tilt
       4. Scale radiate from centre
       5. Glitch & elastic snap
     ───────────────────────────────────── */

  function initRasaLoopAnimation() {
    const chars = document.querySelectorAll('.hero__char');
    if (!chars.length) return;

    const GOLD  = '#E8A020';
    const WHITE = '#ffffff';
    const PAUSE = 1.6; // seconds of calm between each effect

    // ── 1. EXPLOSIVE SCATTER — chars hurl outward then elastic-snap back ──
    function explosiveScatter() {
      const vectors = [
        { x: -160, y: -90,  r: -220 },
        { x: -60,  y:  120, r:  180 },
        { x:  60,  y:  130, r: -160 },
        { x:  170, y: -80,  r:  200 },
      ];
      return gsap.timeline()
        .to(chars, {
          x: (i) => vectors[i % vectors.length].x,
          y: (i) => vectors[i % vectors.length].y,
          rotation: (i) => vectors[i % vectors.length].r,
          scale: 0.25,
          opacity: 0,
          duration: 0.5,
          stagger: 0.07,
          ease: 'power3.in',
        })
        .to(chars, {
          x: 0, y: 0, rotation: 0, scale: 1, opacity: 1,
          duration: 1.0,
          stagger: { each: 0.09, from: 'end' },
          ease: 'elastic.out(1, 0.48)',
        }, '+=0.06');
    }

    // ── 2. NEON STROBE — sharp gold lightning cascades letter-by-letter ──
    function neonStrobe() {
      const tl = gsap.timeline();
      Array.from(chars).forEach((c, i) => {
        tl.to(c, {
          color: '#FFE566',
          textShadow: '0 0 6px #fff, 0 0 18px #FFD700, 0 0 55px rgba(232,160,32,0.9), 0 0 110px rgba(232,100,0,0.5)',
          scale: 1.18,
          duration: 0.07,
          ease: 'none',
        }, i * 0.13)
        .to(c, {
          color: WHITE,
          textShadow: '0 0 0 transparent',
          scale: 1,
          duration: 0.6,
          ease: 'power3.out',
        }, i * 0.13 + 0.1);
      });
      return tl;
    }

    // ── 3. ROLODEX FLIP — letters vanish backward, reappear from front ──
    function rolodexFlip() {
      return gsap.timeline()
        .to(chars, {
          rotationX: -90,
          opacity: 0,
          y: -20,
          transformPerspective: 500,
          duration: 0.38,
          stagger: 0.1,
          ease: 'power2.in',
        })
        .set(chars, { rotationX: 90, y: 20 })
        .to(chars, {
          rotationX: 0,
          opacity: 1,
          y: 0,
          duration: 0.62,
          stagger: 0.1,
          ease: 'back.out(2)',
        }, '-=0.08');
    }

    // ── 4. LIQUID MELT — letters drip flat then spring back tall ──
    function liquidMelt() {
      return gsap.timeline()
        .to(chars, {
          scaleY: 0.05,
          scaleX: 1.4,
          y: 30,
          color: GOLD,
          transformOrigin: 'center bottom',
          duration: 0.42,
          stagger: { each: 0.09, ease: 'power2.in' },
          ease: 'power3.in',
        })
        .to(chars, {
          scaleY: 1,
          scaleX: 1,
          y: 0,
          color: WHITE,
          transformOrigin: 'center bottom',
          duration: 0.8,
          stagger: { each: 0.1, from: 'end' },
          ease: 'elastic.out(1.3, 0.4)',
        }, '+=0.04');
    }

    // ── 5. ORBITAL SWEEP — letters arc far right with skew blur, whip back ──
    function orbitalSweep() {
      return gsap.timeline()
        .to(chars, {
          x: (i) => 80 + i * 55,
          skewX: -30,
          opacity: 0.2,
          color: GOLD,
          duration: 0.44,
          stagger: 0.07,
          ease: 'power3.in',
        })
        .to(chars, {
          x: 0,
          skewX: 0,
          opacity: 1,
          color: WHITE,
          duration: 0.75,
          stagger: { each: 0.09, from: 'end' },
          ease: 'back.out(2.2)',
        }, '+=0.02');
    }

    const effects = [explosiveScatter, neonStrobe, rolodexFlip, liquidMelt, orbitalSweep];
    let effectIndex = 0;

    function playNextEffect() {
      const tl = effects[effectIndex]();
      effectIndex = (effectIndex + 1) % effects.length;
      tl.eventCallback('onComplete', () => {
        gsap.delayedCall(PAUSE, playNextEffect);
      });
    }

    // Start after the entrance animation finishes (~3.8 s)
    gsap.delayedCall(3.8, playNextEffect);
  }

  // Mobile: only the hero entrance + RASA letter loop.
  // All ScrollTrigger-based scroll animations are skipped on touch devices
  // because iOS Safari's event model is incompatible with ScrollTrigger's
  // position tracking. AOS (initialized in main.js) covers scroll reveals.
  function initMobile() {
    initHeroAnimation();
    initRasaLoopAnimation();
  }

  // Desktop: full animation suite with ScrollTrigger
  function init() {
    initHeroAnimation();
    initRasaLoopAnimation();
    initHeroParallax();
    initHeroZoom();
    initAboutParallax();
    initChefQuoteParallax();
    initSectionTitleReveals();
    initCardReveals();
    initAboutStatsReveal();
    initAwardsReveal();
    initFooterReveal();
    initMarqueeEffect();
    initGalleryReveal();
    ScrollTrigger.refresh();
  }

  const runner = isTouchDevice ? initMobile : init;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runner);
  } else {
    runner();
  }

  // Resize + load refresh only needed on desktop (ScrollTrigger)
  if (!isTouchDevice) {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
})();
