/* ============================================
   MAIN.JS — GSAP, ScrollTrigger, Lenis, Preloader
   ============================================ */

// Wait for DOM and all scripts to load
window.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // PRELOADER
    // ============================================
    const preloader = document.getElementById('preloader');
    const preloaderCounter = document.querySelector('.preloader-counter');
    const preloaderBarFill = document.querySelector('.preloader-bar-fill');
    let progress = 0;

    const preloaderInterval = setInterval(() => {
        progress += Math.random() * 12;
        if (progress > 100) progress = 100;
        preloaderCounter.textContent = Math.floor(progress) + '%';
        preloaderBarFill.style.width = progress + '%';

        if (progress >= 100) {
            clearInterval(preloaderInterval);
            setTimeout(() => {
                preloader.classList.add('loaded');
                initAnimations();
            }, 500);
        }
    }, 80);

    // ============================================
    // THEME TOGGLE
    // ============================================
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('portfolio-theme', next);

        // Reinitialize particles for theme change
        if (window.initParticles) {
            window.initParticles();
        }
    });

    // ============================================
    // MOBILE MENU
    // ============================================
    const menuBtn = document.getElementById('nav-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ============================================
    // LENIS SMOOTH SCROLL
    // ============================================
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.0,
            easing: (t) => 1 - Math.pow(1 - t, 4), // quartic ease-out: smooth but not sluggish
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.5,
            infinite: false,
        });

        // Expose globally so interactions.js can call lenis.scrollTo()
        window.lenis = lenis;

        // Drive Lenis from GSAP's ticker — single RAF, no conflicts
        if (typeof gsap !== 'undefined') {
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
        lenis.on('scroll', () => {
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
        });
    }

    // ============================================
    // FOOTER MARQUEE — rAF driven (manufacturing-website approach)
    // ============================================
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        const SPEED = 60; // px/sec — frame-rate independent
        let offset = 0;
        let lastTime = null;
        let marqueePaused = false;

        // Pause only on real pointer devices (mouse hover) — touch :hover gets stuck on mobile
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            const marqueeSection = document.querySelector('.footer-marquee');
            if (marqueeSection) {
                marqueeSection.addEventListener('mouseenter', () => { marqueePaused = true; });
                marqueeSection.addEventListener('mouseleave', () => { marqueePaused = false; });
            }
        }

        function tickMarquee(timestamp) {
            if (lastTime !== null && !marqueePaused) {
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

    // ============================================
    // TESTIMONIALS CAROUSEL
    // ============================================
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentTestimonial = 0;

    // Ensure first card is active on load
    testimonialCards.forEach((card, i) => {
        card.classList.toggle('active', i === 0);
    });
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === 0);
    });

    function showTestimonial(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            currentTestimonial = parseInt(dot.dataset.index);
            showTestimonial(currentTestimonial);
        });
    });

    // Auto-rotate testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }, 5000);

    // ============================================
    // NAV ACTIVE LINK ON SCROLL
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // Navbar stays fixed — no auto-hide

    // ============================================
    // GSAP ANIMATIONS
    // ============================================
    function initAnimations() {
        gsap.registerPlugin(ScrollTrigger, TextPlugin);

        // Set initial hidden states in GSAP (not CSS) — elements visible by default without JS
        gsap.set('.hero-greeting', { opacity: 0, y: 30 });
        gsap.set('.hero-description', { opacity: 0, y: 20 });
        gsap.set('.hero-cta', { opacity: 0, y: 20 });
        gsap.set('.hero-stats', { opacity: 0, y: 20 });

        // Hero entrance animations
        const heroTl = gsap.timeline({ delay: 0.3 });

        heroTl
            .to('.hero-greeting', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
            .from('.hero-name', { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' }, '-=0.4')
            .from('.hero-role', { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out' }, '-=0.4')
            .to('.hero-description', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
            .to('.hero-cta', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
            .to('.hero-stats', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');

        // Role text rotation
        const roles = ['digital experiences', 'web applications', 'interactive UIs', 'creative solutions', 'scalable systems'];
        let roleIndex = 0;
        const roleText = document.getElementById('role-text');

        function rotateRole() {
            roleIndex = (roleIndex + 1) % roles.length;
            gsap.to(roleText, {
                duration: 0.4,
                opacity: 0,
                y: -10,
                ease: 'power2.in',
                onComplete: () => {
                    roleText.textContent = roles[roleIndex];
                    gsap.to(roleText, {
                        duration: 0.4,
                        opacity: 1,
                        y: 0,
                        ease: 'power2.out'
                    });
                }
            });
        }
        setInterval(rotateRole, 3000);

        // Counter animation
        document.querySelectorAll('.stat-number').forEach(stat => {
            const target = parseInt(stat.dataset.count);
            ScrollTrigger.create({
                trigger: stat,
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    gsap.to(stat, {
                        duration: 2,
                        ease: 'power2.out',
                        innerText: target,
                        snap: { innerText: 1 },
                        onUpdate: function() {
                            stat.textContent = Math.floor(parseFloat(stat.textContent));
                        }
                    });
                }
            });
        });

        // Section reveals — exclude testimonial cards (handled by carousel JS)
        document.querySelectorAll('.section').forEach(section => {
            const elements = section.querySelectorAll(
                '.section-header, .about-grid, .skills-bento, .contact-grid, ' +
                '.glass-card:not(.testimonial-card), .testimonials-carousel, .testimonial-dots'
            );
            if (!elements.length) return;
            gsap.from(elements, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 75%',
                    toggleActions: 'play none none none'
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power3.out',
                clearProps: 'opacity,transform'
            });
        });

        // Timeline items — fromTo so GSAP owns both start and end values
        document.querySelectorAll('.timeline-item').forEach((item, i) => {
            const direction = item.classList.contains('left') ? -60 : 60;
            gsap.fromTo(item,
                { x: direction, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: i * 0.08,
                    ease: 'power3.out',
                    clearProps: 'transform'
                }
            );
        });

        // Timeline SVG draw
        const timelineDraw = document.querySelector('.timeline-draw');
        if (timelineDraw) {
            gsap.to(timelineDraw, {
                scrollTrigger: {
                    trigger: '.timeline',
                    start: 'top 60%',
                    end: 'bottom 40%',
                    scrub: 1
                },
                strokeDashoffset: 0,
                ease: 'none'
            });
        }

        // Timeline node pulse on scroll
        document.querySelectorAll('.timeline-node').forEach(node => {
            ScrollTrigger.create({
                trigger: node,
                start: 'top 70%',
                once: true,
                onEnter: () => {
                    node.style.animation = 'nodePulse 2s ease-in-out infinite';
                }
            });
        });

        // Skill bars fill on scroll
        document.querySelectorAll('.skill-bar-fill').forEach(bar => {
            const width = bar.dataset.width;
            ScrollTrigger.create({
                trigger: bar,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    bar.style.width = width + '%';
                }
            });
        });

        // Text scramble effect for section titles
        document.querySelectorAll('[data-animate="scramble"]').forEach(el => {
            const originalText = el.textContent;
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

            ScrollTrigger.create({
                trigger: el,
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    let iterations = 0;
                    const interval = setInterval(() => {
                        el.textContent = originalText
                            .split('')
                            .map((char, index) => {
                                if (index < iterations) return originalText[index];
                                if (char === ' ') return ' ';
                                return chars[Math.floor(Math.random() * chars.length)];
                            })
                            .join('');

                        iterations += 1 / 3;
                        if (iterations >= originalText.length) {
                            el.textContent = originalText;
                            clearInterval(interval);
                        }
                    }, 30);
                }
            });
        });

        // Parallax effect on hero elements
        gsap.to('.hero-grid-pulse', {
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: -100,
            opacity: 0
        });

        gsap.to('.ambient-orbs', {
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: -50
        });

        // Contact form validation visual feedback
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = form.querySelector('.btn-send');
                btn.querySelector('span').textContent = 'Sent! ✓';
                btn.style.pointerEvents = 'none';
                setTimeout(() => {
                    btn.querySelector('span').textContent = 'Send Message';
                    btn.style.pointerEvents = '';
                    form.reset();
                }, 3000);
            });
        }
    }
});
