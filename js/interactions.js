/* ============================================
   INTERACTIONS.JS — Cursor, Tilt, Magnetic, Scramble
   ============================================ */

(function () {
    'use strict';

    // ============================================
    // CUSTOM CURSOR
    // ============================================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    if (cursorDot && cursorRing && window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;
        const ringSpeed = 0.15; // Spring-like follow

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * ringSpeed;
            ringY += (mouseY - ringY) * ringSpeed;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .btn, .project-card, .skill-card, .social-link, input, textarea');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hovering');
                cursorRing.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hovering');
                cursorRing.classList.remove('hovering');
            });
        });
    } else {
        // Hide cursor elements on mobile
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorRing) cursorRing.style.display = 'none';
    }

    // ============================================
    // MAGNETIC BUTTONS
    // ============================================
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const strength = 0.3;

            btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
            btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            setTimeout(() => {
                btn.style.transition = '';
            }, 400);
        });

        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'none';
        });
    });

    // ============================================
    // VANILLA TILT (3D Card Effect)
    // ============================================
    function initTilt() {
        if (typeof VanillaTilt === 'undefined' || window.innerWidth < 768) return;

        const tiltElements = document.querySelectorAll('[data-tilt]');
        tiltElements.forEach(el => {
            VanillaTilt.init(el, {
                max: 8,
                speed: 400,
                glare: true,
                'max-glare': 0.15,
                perspective: 1000,
                gyroscope: false
            });
        });
    }

    // Initialize tilt after a short delay to ensure DOM is ready
    setTimeout(initTilt, 500);

    // ============================================
    // WORD-BY-WORD REVEAL (About section)
    // ============================================
    function initWordReveal() {
        const elements = document.querySelectorAll('[data-animate="words"]');

        elements.forEach(el => {
            const text = el.textContent;
            const words = text.split(' ');
            el.innerHTML = words.map(word =>
                `<span class="word-reveal" style="opacity:0;display:inline-block;transform:translateY(8px);transition:opacity 0.4s ease,transform 0.4s ease">${word}&nbsp;</span>`
            ).join('');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const wordSpans = el.querySelectorAll('.word-reveal');
                        wordSpans.forEach((span, i) => {
                            setTimeout(() => {
                                span.style.opacity = '1';
                                span.style.transform = 'translateY(0)';
                            }, i * 40);
                        });
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(el);
        });
    }

    // Initialize word reveal after DOM content
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWordReveal);
    } else {
        initWordReveal();
    }

    // ============================================
    // SMOOTH ANCHOR SCROLLING (via Lenis — never native scrollIntoView)
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                if (window.lenis) {
                    window.lenis.scrollTo(target, { offset: -80, duration: 1.2 });
                } else {
                    // Fallback only if Lenis failed to load
                    target.scrollIntoView({ block: 'start' });
                }
            }
        });
    });

    // ============================================
    // NOISE OVERLAY ANIMATION
    // ============================================
    const noiseOverlay = document.querySelector('.noise-overlay');
    if (noiseOverlay) {
        let noiseFrame = 0;
        function animateNoise() {
            noiseFrame++;
            if (noiseFrame % 3 === 0) {
                const x = (Math.random() - 0.5) * 10;
                const y = (Math.random() - 0.5) * 10;
                noiseOverlay.style.transform = `translate(${x}%, ${y}%)`;
            }
            requestAnimationFrame(animateNoise);
        }
        animateNoise();
    }

    // ============================================
    // SKILL ICON HOVER ANIMATION
    // ============================================
    document.querySelectorAll('.skill-card').forEach(card => {
        const icon = card.querySelector('.skill-icon');
        if (!icon) return;

        card.addEventListener('mouseenter', () => {
            icon.style.animation = 'iconBounce 0.5s ease';
        });
        card.addEventListener('animationend', () => {
            icon.style.animation = '';
        });
    });

    // ============================================
    // FORM INPUT RIPPLE EFFECT
    // ============================================
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });

})();
