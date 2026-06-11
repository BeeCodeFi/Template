/* ================================================
   LuxeHaven Real Estate — script.js
   CSS Photo-Based 3D Tour & Smooth Interactions
   No external JS dependencies required
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========================
    // PRELOADER
    // ========================
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            initHeroParallax();
            initPhotoTour();
            initScrollAnimations();
            animateCounters();
        }, 2200);
    });

    // ========================
    // THEME / LIGHT SWITCH
    // ========================
    const lightSwitch = document.getElementById('lightSwitch');
    const switchStatus = document.querySelector('.switch-status');
    const html = document.documentElement;

    lightSwitch.addEventListener('click', () => {
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        switchStatus.textContent = isDark ? 'Lights On' : 'Lights Off';

        // Flash effect
        const flash = document.createElement('div');
        flash.className = 'theme-flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 700);
    });

    // ========================
    // NAVIGATION
    // ========================
    const navbar    = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks   = document.getElementById('navLinks');
    const navLinksArr = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinksArr.forEach(link => {
        link.addEventListener('click', () => {
            navLinksArr.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Highlight active section on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const top    = section.offsetTop;
            const height = section.offsetHeight;
            const id     = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinksArr.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-link[href="#${id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { passive: true });

    // ========================
    // PROPERTY FILTERS
    // ========================
    const filterBtns    = document.querySelectorAll('.filter-btn');
    const propertyCards = document.querySelectorAll('.property-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            propertyCards.forEach((card, i) => {
                const show = filter === 'all' || card.dataset.category === filter;
                card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
                if (show) {
                    card.style.display = '';
                    setTimeout(() => {
                        card.style.opacity  = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, i * 70);
                } else {
                    card.style.opacity  = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => { card.style.display = 'none'; }, 420);
                }
            });
        });
    });

    // ========================
    // TESTIMONIAL CAROUSEL
    // ========================
    const track   = document.getElementById('testimonialTrack');
    const dots    = document.querySelectorAll('.test-dot');
    const prevBtn = document.getElementById('testPrev');
    const nextBtn = document.getElementById('testNext');
    let currentSlide = 0;
    const totalSlides = 3;

    function goToSlide(index) {
        currentSlide = (index + totalSlides) % totalSlides;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));
    setInterval(() => goToSlide(currentSlide + 1), 6000);

    // ========================
    // CONTACT FORM
    // ========================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.innerHTML = '<span>Message Sent!</span> <i class="ri-check-line"></i>';
            btn.style.background = 'linear-gradient(135deg,#27ae60,#1e8449)';
            setTimeout(() => {
                btn.innerHTML = orig;
                btn.style.background = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // ========================
    // SCROLL REVEAL
    // ========================
    function initScrollAnimations() {
        document.querySelectorAll('.about-visual').forEach(el => el.classList.add('reveal-left'));
        document.querySelectorAll('.about-content').forEach(el => el.classList.add('reveal-right'));
        document.querySelectorAll('.section-header').forEach(el => el.classList.add('reveal'));
        document.querySelectorAll('.property-card').forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.08}s`;
        });
        document.querySelectorAll('.service-card').forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.1}s`;
        });
        document.querySelectorAll('.tour-wrapper, .testimonial-carousel, .cta-content').forEach(el => el.classList.add('reveal'));
        document.querySelectorAll('.contact-info').forEach(el => el.classList.add('reveal-left'));
        document.querySelectorAll('.contact-form-wrap').forEach(el => el.classList.add('reveal-right'));
        document.querySelectorAll('.property-filters').forEach(el => el.classList.add('reveal'));

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
            observer.observe(el);
        });
    }

    // ========================
    // COUNTER ANIMATION
    // ========================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el     = entry.target;
                const target  = parseInt(el.dataset.count);
                const dur     = 2000;
                const start   = performance.now();
                const update  = now => {
                    const p = Math.min((now - start) / dur, 1);
                    const e = 1 - Math.pow(1 - p, 3);
                    el.textContent = Math.floor(target * e).toLocaleString();
                    if (p < 1) requestAnimationFrame(update);
                };
                requestAnimationFrame(update);
                observer.unobserve(el);
            });
        }, { threshold: 0.5 });
        counters.forEach(c => observer.observe(c));
    }

    // ========================
    // CARD TILT EFFECT
    // ========================
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            card.style.transform = `perspective(1000px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });

    // ========================
    // HERO PARALLAX (photo bg)
    // ========================
    function initHeroParallax() {
        const bgImg = document.getElementById('heroBgImage');
        if (!bgImg) return;

        let tX = 0, tY = 0, cX = 0, cY = 0, scrollY = 0;

        document.addEventListener('mousemove', e => {
            tX = (e.clientX / window.innerWidth  - 0.5) * 18;
            tY = (e.clientY / window.innerHeight - 0.5) * 12;
        });

        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
        }, { passive: true });

        (function animate() {
            cX += (tX - cX) * 0.06;
            cY += (tY - cY) * 0.06;
            const tx = -cX * 0.5;
            const ty = -cY * 0.4 + scrollY * 0.22;
            bgImg.style.transform = `scale(1.1) translate(${tx}px, ${ty}px)`;
            requestAnimationFrame(animate);
        })();
    }

    // ========================
    // PHOTO TOUR (3D CSS)
    // ========================
    function initPhotoTour() {
        const viewport = document.getElementById('tourViewport');
        if (!viewport) return;

        const roomBtns = document.querySelectorAll('.room-btn');
        const rooms    = ['living', 'kitchen', 'bedroom', 'bathroom', 'exterior'];
        let currentRoom = 'living';
        let zoom        = 1;

        // ---- 3D TILT on mouse move ----
        viewport.addEventListener('mousemove', e => {
            const rect = viewport.getBoundingClientRect();
            const cx   = rect.width  / 2;
            const cy   = rect.height / 2;
            const rx   = -((e.clientY - rect.top)  - cy) / cy * 5;
            const ry   =  ((e.clientX - rect.left) - cx) / cx * 8;

            const photo = viewport.querySelector('.room-view.active .room-photo');
            if (photo) {
                photo.style.transition = 'transform 0.1s linear';
                photo.style.transform  = `scale(${1.06 * zoom}) rotateX(${rx}deg) rotateY(${ry}deg)`;
            }
        });

        viewport.addEventListener('mouseleave', () => {
            const photo = viewport.querySelector('.room-view.active .room-photo');
            if (photo) {
                photo.style.transition = 'transform 0.8s cubic-bezier(0.4,0,0.2,1)';
                photo.style.transform  = `scale(${1.06 * zoom}) rotateX(0deg) rotateY(0deg)`;
            }
        });

        // Touch support
        viewport.addEventListener('touchmove', e => {
            if (e.touches.length !== 1) return;
            const rect = viewport.getBoundingClientRect();
            const cx   = rect.width  / 2;
            const cy   = rect.height / 2;
            const rx   = -((e.touches[0].clientY - rect.top)  - cy) / cy * 4;
            const ry   =  ((e.touches[0].clientX - rect.left) - cx) / cx * 6;

            const photo = viewport.querySelector('.room-view.active .room-photo');
            if (photo) {
                photo.style.transition = 'transform 0.15s linear';
                photo.style.transform  = `scale(${1.06 * zoom}) rotateX(${rx}deg) rotateY(${ry}deg)`;
            }
        }, { passive: true });

        // ---- ROOM SWITCHING ----
        function switchRoom(name) {
            if (name === currentRoom) return;
            const prev = viewport.querySelector(`.room-view[data-room="${currentRoom}"]`);
            const next = viewport.querySelector(`.room-view[data-room="${name}"]`);
            if (!next) return;

            if (prev) prev.classList.remove('active');
            next.classList.add('active');

            // Reset tilt on new room
            const nextPhoto = next.querySelector('.room-photo');
            if (nextPhoto) {
                nextPhoto.style.transition = 'transform 0.6s ease-out';
                nextPhoto.style.transform  = `scale(${1.06 * zoom}) rotateX(0deg) rotateY(0deg)`;
            }

            currentRoom = name;
            roomBtns.forEach(b => b.classList.toggle('active', b.dataset.room === name));
        }

        roomBtns.forEach(btn => btn.addEventListener('click', () => switchRoom(btn.dataset.room)));

        // Navigation buttons
        document.getElementById('tourRotateLeft')?.addEventListener('click', () => {
            const i = rooms.indexOf(currentRoom);
            switchRoom(rooms[(i - 1 + rooms.length) % rooms.length]);
        });
        document.getElementById('tourRotateRight')?.addEventListener('click', () => {
            const i = rooms.indexOf(currentRoom);
            switchRoom(rooms[(i + 1) % rooms.length]);
        });
        document.getElementById('tourReset')?.addEventListener('click', () => switchRoom('exterior'));

        // Zoom
        document.getElementById('tourZoomIn')?.addEventListener('click', () => {
            zoom = Math.min(zoom + 0.15, 1.6);
            const p = viewport.querySelector('.room-view.active .room-photo');
            if (p) { p.style.transition = 'transform 0.4s ease'; p.style.transform = `scale(${1.06 * zoom})`; }
        });
        document.getElementById('tourZoomOut')?.addEventListener('click', () => {
            zoom = Math.max(zoom - 0.15, 1);
            const p = viewport.querySelector('.room-view.active .room-photo');
            if (p) { p.style.transition = 'transform 0.4s ease'; p.style.transform = `scale(${1.06 * zoom})`; }
        });
    }

    // ========================
    // SMOOTH SCROLL
    // ========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

});
