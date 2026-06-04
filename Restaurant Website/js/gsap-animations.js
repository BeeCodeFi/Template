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

    // Animate from off-state to full visibility, scrubbed to scroll.
    // ease:'none' is required for scrub to work linearly.
    gsap.fromTo(
      wrap,
      { opacity: 0, y: 70 },
      {
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top 92%',
          end: 'top 28%',
          scrub: 1.4,
          // No once:true — reverses when scrolling back up
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

    // ── 1. Saffron shimmer: gold wash sweeps L→R then resets R→L ──
    function shimmerWave() {
      return gsap.timeline()
        .to(chars, {
          color: GOLD,
          textShadow: '0 0 40px rgba(232,160,32,0.75), 0 0 90px rgba(232,160,32,0.3)',
          duration: 0.38,
          stagger: { each: 0.13, ease: 'power1.in' },
          ease: 'power2.out',
        })
        .to(chars, {
          color: WHITE,
          textShadow: '0 0 0px rgba(232,160,32,0)',
          duration: 0.45,
          stagger: { each: 0.11, from: 'end', ease: 'power1.out' },
          ease: 'power2.in',
        }, '+=0.18');
    }

    // ── 2. Levitate wave: letters rise in sequence then settle ──
    function levitateWave() {
      return gsap.timeline()
        .to(chars, {
          y: -30,
          duration: 0.45,
          stagger: { each: 0.11, ease: 'sine.inOut' },
          ease: 'power2.out',
        })
        .to(chars, {
          y: 0,
          duration: 0.55,
          stagger: { each: 0.11, from: 'end', ease: 'sine.inOut' },
          ease: 'power2.inOut',
        }, '-=0.12');
    }

    // ── 3. 3D perspective tilt: letters rotate on Y axis with depth ──
    function perspectiveTilt() {
      return gsap.timeline()
        .to(chars, {
          rotationY: 24,
          transformPerspective: 480,
          color: 'rgba(255,255,255,0.55)',
          duration: 0.52,
          stagger: 0.08,
          ease: 'power2.inOut',
        })
        .to(chars, {
          rotationY: 0,
          color: WHITE,
          duration: 0.58,
          stagger: { each: 0.08, from: 'end' },
          ease: 'back.out(1.6)',
        }, '-=0.08');
    }

    // ── 4. Scale radiate: letters pulse outward from centre ──
    function scaleRadiate() {
      return gsap.timeline()
        .to(chars, {
          scale: 1.22,
          color: GOLD,
          textShadow: '0 0 24px rgba(232,160,32,0.55)',
          duration: 0.48,
          stagger: { each: 0.1, from: 'center', ease: 'power1.out' },
          ease: 'power2.out',
        })
        .to(chars, {
          scale: 1,
          color: WHITE,
          textShadow: '0 0 0px rgba(232,160,32,0)',
          duration: 0.52,
          stagger: { each: 0.1, from: 'center', ease: 'power1.in' },
          ease: 'power2.in',
        }, '+=0.14');
    }

    // ── 5. Glitch & elastic snap: brief displacement then spring back ──
    function glitchSnap() {
      // Pre-compute offsets so they are stable within one play
      const offsets = Array.from(chars).map(() => ({
        x: (Math.random() - 0.5) * 16,
        y: (Math.random() - 0.5) * 12,
        skewX: (Math.random() - 0.5) * 10,
      }));
      return gsap.timeline()
        .to(chars, {
          x: (i) => offsets[i].x,
          y: (i) => offsets[i].y,
          skewX: (i) => offsets[i].skewX,
          color: GOLD,
          duration: 0.09,
          stagger: 0.025,
          ease: 'none',
        })
        .to(chars, {
          x: 0,
          y: 0,
          skewX: 0,
          color: WHITE,
          duration: 0.65,
          stagger: 0.04,
          ease: 'elastic.out(1, 0.45)',
        }, '+=0.05');
    }

    const effects = [shimmerWave, levitateWave, perspectiveTilt, scaleRadiate, glitchSnap];
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

    // Refresh ScrollTrigger after all animations are set up
    ScrollTrigger.refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-calculate on window resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
  });
})();
