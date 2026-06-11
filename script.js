/* ================================================
   LuxeHaven Real Estate — JavaScript
   Three.js 3D Scenes, Animations, Interactions
   ================================================ */

// ---- Wait for DOM ----
document.addEventListener('DOMContentLoaded', () => {

    // ========================
    // PRELOADER
    // ========================
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            initHeroScene();
            initTourScene();
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

        // Update 3D scenes
        if (window.heroScene) updateHeroTheme(!isDark);
        if (window.tourScene) updateTourTheme(!isDark);
    });

    // ========================
    // NAVIGATION
    // ========================
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
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

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinksArr.forEach(l => l.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    });

    // ========================
    // PROPERTY FILTERS
    // ========================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const propertyCards = document.querySelectorAll('.property-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            propertyCards.forEach((card, i) => {
                const category = card.dataset.category;
                const show = filter === 'all' || category === filter;

                card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                if (show) {
                    card.style.display = '';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, i * 80);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => { card.style.display = 'none'; }, 400);
                }
            });
        });
    });

    // ========================
    // TESTIMONIAL CAROUSEL
    // ========================
    const track = document.getElementById('testimonialTrack');
    const dots = document.querySelectorAll('.test-dot');
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

    // Auto-advance
    setInterval(() => goToSlide(currentSlide + 1), 6000);

    // ========================
    // CONTACT FORM
    // ========================
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>Message Sent!</span> <i class="ri-check-line"></i>';
        btn.style.background = 'linear-gradient(135deg, #27ae60, #1e8449)';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            contactForm.reset();
        }, 3000);
    });

    // ========================
    // SCROLL REVEAL
    // ========================
    function initScrollAnimations() {
        // Add reveal classes
        document.querySelectorAll('.about-visual').forEach(el => el.classList.add('reveal-left'));
        document.querySelectorAll('.about-content').forEach(el => el.classList.add('reveal-right'));
        document.querySelectorAll('.section-header').forEach(el => el.classList.add('reveal'));
        document.querySelectorAll('.property-card').forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.1}s`;
        });
        document.querySelectorAll('.service-card').forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.1}s`;
        });
        document.querySelectorAll('.tour-wrapper').forEach(el => el.classList.add('reveal'));
        document.querySelectorAll('.testimonial-carousel').forEach(el => el.classList.add('reveal'));
        document.querySelectorAll('.cta-content').forEach(el => el.classList.add('reveal'));
        document.querySelectorAll('.contact-info').forEach(el => el.classList.add('reveal-left'));
        document.querySelectorAll('.contact-form-wrap').forEach(el => el.classList.add('reveal-right'));
        document.querySelectorAll('.property-filters').forEach(el => el.classList.add('reveal'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
            observer.observe(el);
        });
    }

    // ========================
    // COUNTER ANIMATION
    // ========================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count);
                    const duration = 2000;
                    const start = performance.now();

                    function update(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.floor(target * eased).toLocaleString();
                        if (progress < 1) requestAnimationFrame(update);
                    }
                    requestAnimationFrame(update);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => observer.observe(c));
    }

    // ========================
    // TILT EFFECT ON CARDS
    // ========================
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ========================
    // HERO PARTICLES
    // ========================
    const particleContainer = document.getElementById('heroParticles');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: var(--particle-color);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 8 + 6}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
            opacity: ${Math.random() * 0.5 + 0.2};
        `;
        particleContainer.appendChild(particle);
    }

    // Add particle animation
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes particleFloat {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
            25% { transform: translate(${Math.random() * 60 - 30}px, -${Math.random() * 60 + 20}px) scale(1.3); opacity: 0.7; }
            50% { transform: translate(${Math.random() * 40 - 20}px, -${Math.random() * 80 + 30}px) scale(0.8); opacity: 0.5; }
            75% { transform: translate(${Math.random() * 50 - 25}px, -${Math.random() * 40 + 10}px) scale(1.1); opacity: 0.4; }
        }
    `;
    document.head.appendChild(particleStyle);


    // ================================================
    // THREE.JS — HERO SCENE (3D House Exterior)
    // ================================================
    function initHeroScene() {
        const canvas = document.getElementById('heroCanvas');
        if (!canvas) return;
        const isDark = html.getAttribute('data-theme') === 'dark';

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        window.heroScene = { scene, camera, renderer };

        // Sky color
        scene.fog = new THREE.FogExp2(isDark ? 0x0a0a1a : 0xfaf8f4, 0.015);

        // Camera
        camera.position.set(8, 6, 12);
        camera.lookAt(0, 1, 0);

        // Lighting
        const ambientLight = new THREE.AmbientLight(isDark ? 0x222244 : 0xfff5e6, isDark ? 0.3 : 0.7);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(isDark ? 0x6688cc : 0xfff8e0, isDark ? 0.4 : 1.0);
        dirLight.position.set(10, 15, 8);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.set(1024, 1024);
        scene.add(dirLight);

        const pointLight1 = new THREE.PointLight(0xc9a96e, isDark ? 0.8 : 0.2, 20);
        pointLight1.position.set(0, 3, 2);
        scene.add(pointLight1);

        // Store lights for theme updates
        window.heroScene.lights = { ambientLight, dirLight, pointLight1 };

        // ---- GROUND ----
        const groundGeo = new THREE.PlaneGeometry(40, 40);
        const groundMat = new THREE.MeshStandardMaterial({
            color: isDark ? 0x1a2a1a : 0x4a8a3a,
            roughness: 0.9
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);
        window.heroScene.ground = ground;

        // ---- HOUSE BODY ----
        const houseGroup = new THREE.Group();

        // Main structure
        const wallMat = new THREE.MeshStandardMaterial({
            color: isDark ? 0x2a2a3a : 0xf5f0e8,
            roughness: 0.7
        });
        const mainBody = new THREE.Mesh(new THREE.BoxGeometry(6, 3.5, 5), wallMat);
        mainBody.position.set(0, 1.75, 0);
        mainBody.castShadow = true;
        mainBody.receiveShadow = true;
        houseGroup.add(mainBody);

        // Extension wing
        const wing = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3, 4), wallMat);
        wing.position.set(4.5, 1.5, 0.5);
        wing.castShadow = true;
        houseGroup.add(wing);

        // Roof - main
        const roofGeo = new THREE.ConeGeometry(5, 2.2, 4);
        const roofMat = new THREE.MeshStandardMaterial({
            color: isDark ? 0x3a2a1a : 0x8b5e3c,
            roughness: 0.6
        });
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.set(0, 4.6, 0);
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        houseGroup.add(roof);

        // Roof - wing (flat modern)
        const wingRoof = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 4.5), roofMat);
        wingRoof.position.set(4.5, 3.1, 0.5);
        houseGroup.add(wingRoof);

        // Door
        const doorMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.5 });
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.8, 0.1), doorMat);
        door.position.set(0, 0.9, 2.56);
        houseGroup.add(door);

        // Door frame
        const frameMat = new THREE.MeshStandardMaterial({ color: isDark ? 0xc9a96e : 0x6b4f0e });
        const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 0.05), frameMat);
        doorFrame.position.set(0, 1, 2.58);
        houseGroup.add(doorFrame);

        // Windows with glow
        const windowGlowMat = new THREE.MeshStandardMaterial({
            color: isDark ? 0xffcc44 : 0x88ccff,
            emissive: isDark ? 0xffaa22 : 0x4488cc,
            emissiveIntensity: isDark ? 0.8 : 0.15,
            roughness: 0.2,
            transparent: true,
            opacity: 0.9
        });

        const windowPositions = [
            { x: -1.8, y: 2.2, z: 2.51, w: 1, h: 0.8 },
            { x: 1.8, y: 2.2, z: 2.51, w: 1, h: 0.8 },
            { x: -3.01, y: 2.2, z: 0, w: 0.8, h: 0.8 },
            { x: -3.01, y: 2.2, z: -1.5, w: 0.8, h: 0.8 },
            { x: 4.5, y: 2, z: 2.76, w: 1.5, h: 1 },
            { x: 4.5, y: 2, z: -1.76, w: 1.5, h: 1 },
        ];

        const windows = [];
        windowPositions.forEach(wp => {
            const isZFacing = Math.abs(wp.z) > 2;
            const winGeo = new THREE.PlaneGeometry(wp.w, wp.h);
            const win = new THREE.Mesh(winGeo, windowGlowMat.clone());
            win.position.set(wp.x, wp.y, wp.z);

            if (Math.abs(wp.x) > 2.5 && Math.abs(wp.z) < 2) {
                win.rotation.y = Math.PI / 2;
            }

            windows.push(win);
            houseGroup.add(win);
        });
        window.heroScene.windows = windows;
        window.heroScene.wallMat = wallMat;
        window.heroScene.roofMat = roofMat;

        // Window lights (point lights behind windows in dark mode)
        const windowLights = [];
        windowPositions.slice(0, 2).forEach(wp => {
            const wl = new THREE.PointLight(0xffcc44, isDark ? 0.5 : 0, 5);
            wl.position.set(wp.x, wp.y, wp.z - 0.3);
            houseGroup.add(wl);
            windowLights.push(wl);
        });
        window.heroScene.windowLights = windowLights;

        // Chimney
        const chimney = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 1.8, 0.6),
            new THREE.MeshStandardMaterial({ color: isDark ? 0x4a3a2a : 0x8b6b4a, roughness: 0.8 })
        );
        chimney.position.set(-1.5, 4.8, -0.5);
        chimney.castShadow = true;
        houseGroup.add(chimney);

        // Porch / Steps
        const stepMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8 });
        const step1 = new THREE.Mesh(new THREE.BoxGeometry(2, 0.15, 0.8), stepMat);
        step1.position.set(0, 0.07, 3);
        houseGroup.add(step1);
        const step2 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.15, 0.6), stepMat);
        step2.position.set(0, 0.07, 3.5);
        houseGroup.add(step2);

        // ---- TREES ----
        function createTree(x, z, scale = 1) {
            const treeGroup = new THREE.Group();
            const trunk = new THREE.Mesh(
                new THREE.CylinderGeometry(0.15 * scale, 0.2 * scale, 1.5 * scale),
                new THREE.MeshStandardMaterial({ color: 0x6b4226 })
            );
            trunk.position.y = 0.75 * scale;
            trunk.castShadow = true;
            treeGroup.add(trunk);

            const foliageColors = [0x2d6b3a, 0x3a8a4a, 0x1a5a2a];
            for (let i = 0; i < 3; i++) {
                const foliage = new THREE.Mesh(
                    new THREE.ConeGeometry((1.2 - i * 0.25) * scale, (1.5 - i * 0.2) * scale, 8),
                    new THREE.MeshStandardMaterial({ color: foliageColors[i % 3] })
                );
                foliage.position.y = (2 + i * 0.8) * scale;
                foliage.castShadow = true;
                treeGroup.add(foliage);
            }

            treeGroup.position.set(x, 0, z);
            return treeGroup;
        }

        houseGroup.add(createTree(-6, -3, 1.2));
        houseGroup.add(createTree(-5, 4, 0.8));
        houseGroup.add(createTree(8, -2, 1));
        houseGroup.add(createTree(7, 5, 0.7));
        houseGroup.add(createTree(-7, 1, 1.1));

        // ---- PATH ----
        const pathMat = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.9 });
        const path = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 6), pathMat);
        path.rotation.x = -Math.PI / 2;
        path.position.set(0, 0.02, 5.5);
        houseGroup.add(path);

        // ---- POOL (side of house) ----
        const poolMat = new THREE.MeshStandardMaterial({
            color: 0x2288cc,
            roughness: 0.1,
            transparent: true,
            opacity: 0.7
        });
        const pool = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 2), poolMat);
        pool.position.set(-5, 0.05, -3);
        houseGroup.add(pool);

        const poolEdge = new THREE.Mesh(
            new THREE.BoxGeometry(3.4, 0.15, 2.4),
            new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.7 })
        );
        poolEdge.position.set(-5, 0.03, -3);
        houseGroup.add(poolEdge);

        scene.add(houseGroup);
        window.heroScene.houseGroup = houseGroup;

        // ---- FLOATING PARTICLES (3D) ----
        const particleGeo = new THREE.BufferGeometry();
        const particleCount = 200;
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 1] = Math.random() * 15;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat3D = new THREE.PointsMaterial({
            color: isDark ? 0xc9a96e : 0x8b6914,
            size: 0.08,
            transparent: true,
            opacity: 0.6
        });
        const particles3D = new THREE.Points(particleGeo, particleMat3D);
        scene.add(particles3D);
        window.heroScene.particles3D = particles3D;

        // ---- MOUSE PARALLAX ----
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        // ---- ANIMATE ----
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();

            // Slow house rotation
            houseGroup.rotation.y = Math.sin(elapsed * 0.15) * 0.3;

            // Mouse parallax on camera
            camera.position.x = 8 + mouseX * 1.5;
            camera.position.y = 6 + mouseY * -0.8;
            camera.lookAt(0, 1, 0);

            // Floating particles
            particles3D.rotation.y = elapsed * 0.02;
            const posArr = particles3D.geometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                posArr[i * 3 + 1] += Math.sin(elapsed + i) * 0.002;
            }
            particles3D.geometry.attributes.position.needsUpdate = true;

            // Window glow pulsing (dark mode)
            if (html.getAttribute('data-theme') === 'dark') {
                windows.forEach((w, i) => {
                    w.material.emissiveIntensity = 0.6 + Math.sin(elapsed * 2 + i) * 0.25;
                });
            }

            renderer.render(scene, camera);
        }
        animate();

        // Resize
        window.addEventListener('resize', () => {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });
    }

    // Theme update for Hero
    function updateHeroTheme(isDark) {
        const hs = window.heroScene;
        if (!hs) return;

        const { lights, windows, windowLights, particles3D, ground, wallMat, roofMat, scene } = hs;

        // Fog
        scene.fog = new THREE.FogExp2(isDark ? 0x0a0a1a : 0xfaf8f4, 0.015);

        // Lights
        lights.ambientLight.color.setHex(isDark ? 0x222244 : 0xfff5e6);
        lights.ambientLight.intensity = isDark ? 0.3 : 0.7;
        lights.dirLight.color.setHex(isDark ? 0x6688cc : 0xfff8e0);
        lights.dirLight.intensity = isDark ? 0.4 : 1.0;
        lights.pointLight1.intensity = isDark ? 0.8 : 0.2;

        // Ground
        ground.material.color.setHex(isDark ? 0x1a2a1a : 0x4a8a3a);

        // Walls & roof
        wallMat.color.setHex(isDark ? 0x2a2a3a : 0xf5f0e8);
        roofMat.color.setHex(isDark ? 0x3a2a1a : 0x8b5e3c);

        // Windows
        windows.forEach(w => {
            w.material.color.setHex(isDark ? 0xffcc44 : 0x88ccff);
            w.material.emissive.setHex(isDark ? 0xffaa22 : 0x4488cc);
            w.material.emissiveIntensity = isDark ? 0.8 : 0.15;
        });

        // Window point lights
        windowLights.forEach(wl => {
            wl.intensity = isDark ? 0.5 : 0;
        });

        // Particles
        particles3D.material.color.setHex(isDark ? 0xc9a96e : 0x8b6914);
    }

    // ================================================
    // THREE.JS — 3D HOUSE TOUR (Interactive Dollhouse)
    // ================================================
    function initTourScene() {
        const canvas = document.getElementById('tourCanvas');
        if (!canvas) return;
        const container = canvas.parentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(isDark ? 0x111128 : 0xf0ede6);

        const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(8, 8, 12);
        camera.lookAt(0, 1.5, 0);

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;

        window.tourScene = { scene, camera, renderer };

        // Lighting
        const ambient = new THREE.AmbientLight(isDark ? 0x333355 : 0xfff5e6, isDark ? 0.4 : 0.8);
        scene.add(ambient);

        const dirLight = new THREE.DirectionalLight(isDark ? 0x8888cc : 0xfff0d0, isDark ? 0.5 : 0.9);
        dirLight.position.set(8, 12, 5);
        dirLight.castShadow = true;
        scene.add(dirLight);

        window.tourScene.lights = { ambient, dirLight };

        // ---- BUILD HOUSE (Cross-section / Dollhouse view) ----
        const house = new THREE.Group();

        // Materials
        const floorMat = new THREE.MeshStandardMaterial({ color: 0xa0785a, roughness: 0.7 }); // Wood
        const wallMat = new THREE.MeshStandardMaterial({ color: isDark ? 0x2a2a3a : 0xf5f0e8, roughness: 0.8 });
        const accentWall = new THREE.MeshStandardMaterial({ color: isDark ? 0x2a3a4a : 0xd4e8f0, roughness: 0.8 });
        const tileMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.3 });
        const carpetMat = new THREE.MeshStandardMaterial({ color: 0x4a6a8a, roughness: 0.95 });

        window.tourScene.wallMat = wallMat;
        window.tourScene.accentWall = accentWall;

        // Outer floor
        const baseFloor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 8), floorMat);
        baseFloor.receiveShadow = true;
        house.add(baseFloor);

        // Second floor
        const floor2 = new THREE.Mesh(new THREE.BoxGeometry(12, 0.15, 8),
            new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.7 }));
        floor2.position.y = 3;
        house.add(floor2);

        // ---- WALLS ----
        // Back wall
        const backWall = new THREE.Mesh(new THREE.BoxGeometry(12, 3, 0.15), wallMat);
        backWall.position.set(0, 1.5, -4);
        backWall.castShadow = true;
        house.add(backWall);

        // Left wall
        const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3, 8), wallMat);
        leftWall.position.set(-6, 1.5, 0);
        house.add(leftWall);

        // Right wall
        const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3, 8), wallMat);
        rightWall.position.set(6, 1.5, 0);
        house.add(rightWall);

        // Center divider wall (vertical)
        const dividerV = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3, 8), wallMat);
        dividerV.position.set(0, 1.5, 0);
        house.add(dividerV);

        // Center divider wall (horizontal) — left side
        const dividerH1 = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 0.12), wallMat);
        dividerH1.position.set(-3, 1.5, 0);
        house.add(dividerH1);

        // Center divider wall (horizontal) — right side (partial for open plan)
        const dividerH2 = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 0.12), wallMat);
        dividerH2.position.set(4.5, 1.5, 0);
        house.add(dividerH2);

        // ---- ROOM LIGHTS (in-room point lights) ----
        const roomLights = {};
        const lightColors = isDark ? 0xffcc66 : 0xfff5e0;
        const lightIntensity = isDark ? 0.6 : 0.3;

        // Living room (front-left)
        roomLights.living = new THREE.PointLight(lightColors, lightIntensity, 8);
        roomLights.living.position.set(-3, 2.8, 2);
        house.add(roomLights.living);

        // Kitchen (back-left)
        roomLights.kitchen = new THREE.PointLight(lightColors, lightIntensity, 8);
        roomLights.kitchen.position.set(-3, 2.8, -2);
        house.add(roomLights.kitchen);

        // Bedroom (front-right)
        roomLights.bedroom = new THREE.PointLight(lightColors, lightIntensity, 8);
        roomLights.bedroom.position.set(3, 2.8, 2);
        house.add(roomLights.bedroom);

        // Bathroom (back-right)
        roomLights.bathroom = new THREE.PointLight(lightColors, lightIntensity, 8);
        roomLights.bathroom.position.set(3, 2.8, -2);
        house.add(roomLights.bathroom);

        window.tourScene.roomLights = roomLights;

        // ---- FURNITURE ----
        // ===== LIVING ROOM (front-left: x:-6 to 0, z:0 to 4) =====

        // Sofa
        const sofaMat = new THREE.MeshStandardMaterial({ color: 0x4a6a8a, roughness: 0.85 });
        const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 0.9), sofaMat);
        sofaBase.position.set(-3, 0.35, 3);
        house.add(sofaBase);
        const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.6, 0.15), sofaMat);
        sofaBack.position.set(-3, 0.7, 3.45);
        house.add(sofaBack);
        const sofaArm1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.5, 0.9), sofaMat);
        sofaArm1.position.set(-4.2, 0.55, 3);
        house.add(sofaArm1);
        const sofaArm2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.5, 0.9), sofaMat);
        sofaArm2.position.set(-1.8, 0.55, 3);
        house.add(sofaArm2);

        // Coffee table
        const tableMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.5 });
        const coffeeTable = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.6), tableMat);
        coffeeTable.position.set(-3, 0.4, 1.8);
        house.add(coffeeTable);
        // Table legs
        for (let lx of [-0.5, 0.5]) {
            for (let lz of [-0.2, 0.2]) {
                const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35), tableMat);
                leg.position.set(-3 + lx, 0.2, 1.8 + lz);
                house.add(leg);
            }
        }

        // TV Stand
        const tvStand = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 0.3),
            new THREE.MeshStandardMaterial({ color: 0x2a2a3a, roughness: 0.4 }));
        tvStand.position.set(-3, 0.35, 0.3);
        house.add(tvStand);

        // TV Screen
        const tvMat = new THREE.MeshStandardMaterial({
            color: 0x111111,
            emissive: isDark ? 0x2244aa : 0x115588,
            emissiveIntensity: isDark ? 0.3 : 0.1
        });
        const tv = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 0.05), tvMat);
        tv.position.set(-3, 1.05, 0.22);
        house.add(tv);
        window.tourScene.tv = tv;

        // Carpet
        const carpet = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2), carpetMat);
        carpet.rotation.x = -Math.PI / 2;
        carpet.position.set(-3, 0.12, 2);
        house.add(carpet);

        // ===== KITCHEN (back-left: x:-6 to 0, z:-4 to 0) =====

        // Kitchen counter
        const counterMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.2 });
        const counter = new THREE.Mesh(new THREE.BoxGeometry(5, 0.9, 0.6), counterMat);
        counter.position.set(-3, 0.55, -3.5);
        house.add(counter);

        // Upper cabinets
        const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x3a3a4a, roughness: 0.6 });
        const upperCab = new THREE.Mesh(new THREE.BoxGeometry(5, 0.7, 0.35), cabinetMat);
        upperCab.position.set(-3, 2.3, -3.7);
        house.add(upperCab);

        // Kitchen island
        const island = new THREE.Mesh(new THREE.BoxGeometry(2, 0.9, 0.8), counterMat);
        island.position.set(-3, 0.55, -1.5);
        house.add(island);

        // Bar stools
        const stoolMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5 });
        for (let sx of [-3.6, -3, -2.4]) {
            const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06), stoolMat);
            seat.position.set(sx, 0.7, -0.8);
            house.add(seat);
            const stoolLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.65), stoolMat);
            stoolLeg.position.set(sx, 0.35, -0.8);
            house.add(stoolLeg);
        }

        // Fridge
        const fridgeMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.3, metalness: 0.5 });
        const fridge = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.8, 0.65), fridgeMat);
        fridge.position.set(-5.5, 1, -3.5);
        house.add(fridge);

        // ===== BEDROOM (front-right: x:0 to 6, z:0 to 4) =====

        // Bed
        const bedMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.9 });
        const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.35, 2.5),
            new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.6 }));
        bedFrame.position.set(3.5, 0.28, 2.5);
        house.add(bedFrame);

        const mattress = new THREE.Mesh(new THREE.BoxGeometry(2, 0.25, 2.3), bedMat);
        mattress.position.set(3.5, 0.52, 2.5);
        house.add(mattress);

        // Pillow
        const pillowMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.95 });
        const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 0.4), pillowMat);
        pillow1.position.set(3.2, 0.7, 3.4);
        house.add(pillow1);
        const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 0.4), pillowMat);
        pillow2.position.set(3.8, 0.7, 3.4);
        house.add(pillow2);

        // Headboard
        const headboard = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1, 0.1),
            new THREE.MeshStandardMaterial({ color: 0x4a3a2a, roughness: 0.7 }));
        headboard.position.set(3.5, 1, 3.8);
        house.add(headboard);

        // Nightstands
        const nightMat = new THREE.MeshStandardMaterial({ color: 0x5a4a3a, roughness: 0.6 });
        for (let nx of [2.1, 4.9]) {
            const nightstand = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.4), nightMat);
            nightstand.position.set(nx, 0.35, 3.5);
            house.add(nightstand);

            // Small lamp
            const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.15),
                new THREE.MeshStandardMaterial({ color: 0x888888 }));
            lampBase.position.set(nx, 0.67, 3.5);
            house.add(lampBase);
            const lampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.12, 0.18),
                new THREE.MeshStandardMaterial({
                    color: 0xffeecc,
                    emissive: isDark ? 0xffcc88 : 0x000000,
                    emissiveIntensity: isDark ? 0.4 : 0,
                    transparent: true,
                    opacity: 0.8
                }));
            lampShade.position.set(nx, 0.82, 3.5);
            house.add(lampShade);
        }

        // Wardrobe
        const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.4, 0.5),
            new THREE.MeshStandardMaterial({ color: 0x5a4a3a, roughness: 0.6 }));
        wardrobe.position.set(1, 1.3, 3.5);
        house.add(wardrobe);

        // ===== BATHROOM (back-right: x:0 to 6, z:-4 to 0) =====

        // Bathroom floor (tile)
        const bathFloor = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 3.8), tileMat);
        bathFloor.rotation.x = -Math.PI / 2;
        bathFloor.position.set(3, 0.12, -2);
        house.add(bathFloor);

        // Bathtub
        const tubMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.2 });
        const tub = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.55, 0.7), tubMat);
        tub.position.set(4.5, 0.38, -3.3);
        house.add(tub);
        // Water in tub
        const tubWater = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.55),
            new THREE.MeshStandardMaterial({ color: 0x4488cc, transparent: true, opacity: 0.5, roughness: 0.1 }));
        tubWater.position.set(4.5, 0.58, -3.3);
        house.add(tubWater);

        // Toilet
        const toiletBase = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.5), tubMat);
        toiletBase.position.set(1.2, 0.28, -3.5);
        house.add(toiletBase);
        const toiletTank = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, 0.2), tubMat);
        toiletTank.position.set(1.2, 0.45, -3.8);
        house.add(toiletTank);

        // Vanity / Sink
        const vanity = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.45), counterMat);
        vanity.position.set(2.8, 0.5, -3.6);
        house.add(vanity);

        // Mirror
        const mirror = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1),
            new THREE.MeshStandardMaterial({ color: 0xaabbcc, metalness: 0.8, roughness: 0.1 }));
        mirror.position.set(2.8, 1.7, -3.93);
        house.add(mirror);

        // Shower area
        const showerGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 2.5),
            new THREE.MeshStandardMaterial({ color: 0x88aacc, transparent: true, opacity: 0.2, roughness: 0.1 }));
        showerGlass.position.set(5.3, 1.35, -1.5);
        showerGlass.rotation.y = Math.PI / 2;
        house.add(showerGlass);

        // ---- ROOF (decorative visible edges) ----
        const roofEdge = new THREE.Mesh(new THREE.BoxGeometry(12.4, 0.1, 8.4),
            new THREE.MeshStandardMaterial({ color: isDark ? 0x3a2a1a : 0x8b5e3c }));
        roofEdge.position.y = 3.1;
        house.add(roofEdge);

        scene.add(house);
        window.tourScene.house = house;

        // ---- ROOM HIGHLIGHT PLANES ----
        const highlightMat = new THREE.MeshStandardMaterial({
            color: 0xc9a96e,
            transparent: true,
            opacity: 0,
            emissive: 0xc9a96e,
            emissiveIntensity: 0
        });

        const roomHighlights = {
            living: createHighlight(-3, 0.13, 2, 5.5, 3.5),
            kitchen: createHighlight(-3, 0.13, -2, 5.5, 3.5),
            bedroom: createHighlight(3, 0.13, 2, 5.5, 3.5),
            bathroom: createHighlight(3, 0.13, -2, 5.5, 3.5),
        };

        function createHighlight(x, y, z, w, d) {
            const mat = highlightMat.clone();
            const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
            mesh.rotation.x = -Math.PI / 2;
            mesh.position.set(x, y, z);
            house.add(mesh);
            return mesh;
        }

        window.tourScene.roomHighlights = roomHighlights;

        // ---- CAMERA POSITIONS FOR ROOMS ----
        const cameraPositions = {
            living: { pos: { x: -3, y: 5, z: 8 }, look: { x: -3, y: 0.5, z: 2 } },
            kitchen: { pos: { x: -3, y: 5, z: -6 }, look: { x: -3, y: 0.5, z: -2 } },
            bedroom: { pos: { x: 8, y: 5, z: 6 }, look: { x: 3.5, y: 0.5, z: 2.5 } },
            bathroom: { pos: { x: 8, y: 5, z: -6 }, look: { x: 3, y: 0.5, z: -2 } },
            exterior: { pos: { x: 8, y: 8, z: 12 }, look: { x: 0, y: 1.5, z: 0 } },
        };

        window.tourScene.cameraPositions = cameraPositions;

        // ---- ROOM NAVIGATION ----
        const roomBtns = document.querySelectorAll('.room-btn');
        let currentRoom = 'living';

        roomBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const room = btn.dataset.room;
                if (room === currentRoom) return;
                currentRoom = room;

                roomBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Animate camera
                const target = cameraPositions[room];
                animateCamera(target.pos, target.look);

                // Highlight room
                Object.entries(roomHighlights).forEach(([key, mesh]) => {
                    const isActive = key === room && room !== 'exterior';
                    animateHighlight(mesh, isActive);
                });

                // Boost room light
                Object.entries(roomLights).forEach(([key, light]) => {
                    const isActive = key === room;
                    animateLightIntensity(light, isActive ? 1.2 : (isDarkMode() ? 0.6 : 0.3));
                });
            });
        });

        function isDarkMode() {
            return html.getAttribute('data-theme') === 'dark';
        }

        function animateCamera(pos, look) {
            const startPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
            const startTime = performance.now();
            const duration = 1200;

            function update(now) {
                const elapsed = now - startTime;
                const t = Math.min(elapsed / duration, 1);
                const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic

                camera.position.x = startPos.x + (pos.x - startPos.x) * ease;
                camera.position.y = startPos.y + (pos.y - startPos.y) * ease;
                camera.position.z = startPos.z + (pos.z - startPos.z) * ease;
                camera.lookAt(look.x, look.y, look.z);

                if (t < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        }

        function animateHighlight(mesh, show) {
            const startOpacity = mesh.material.opacity;
            const targetOpacity = show ? 0.15 : 0;
            const targetEmissive = show ? 0.3 : 0;
            const startTime = performance.now();

            function update(now) {
                const t = Math.min((now - startTime) / 500, 1);
                mesh.material.opacity = startOpacity + (targetOpacity - startOpacity) * t;
                mesh.material.emissiveIntensity = targetEmissive * t;
                if (t < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        }

        function animateLightIntensity(light, target) {
            const start = light.intensity;
            const startTime = performance.now();

            function update(now) {
                const t = Math.min((now - startTime) / 600, 1);
                light.intensity = start + (target - start) * t;
                if (t < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        }

        // ---- CONTROLS ----
        let isDragging = false;
        let previousMouse = { x: 0, y: 0 };
        let targetRotation = { x: 0, y: 0 };
        let currentRotation = { x: 0, y: 0 };
        let targetZoom = 12;

        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMouse = { x: e.clientX, y: e.clientY };
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - previousMouse.x;
            const dy = e.clientY - previousMouse.y;
            targetRotation.y += dx * 0.005;
            targetRotation.x += dy * 0.005;
            targetRotation.x = Math.max(-0.5, Math.min(1.2, targetRotation.x));
            previousMouse = { x: e.clientX, y: e.clientY };
        });

        canvas.addEventListener('mouseup', () => { isDragging = false; });
        canvas.addEventListener('mouseleave', () => { isDragging = false; });

        // Touch support
        canvas.addEventListener('touchstart', (e) => {
            isDragging = true;
            previousMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }, { passive: true });

        canvas.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const dx = e.touches[0].clientX - previousMouse.x;
            const dy = e.touches[0].clientY - previousMouse.y;
            targetRotation.y += dx * 0.005;
            targetRotation.x += dy * 0.005;
            targetRotation.x = Math.max(-0.5, Math.min(1.2, targetRotation.x));
            previousMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }, { passive: true });

        canvas.addEventListener('touchend', () => { isDragging = false; });

        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            targetZoom += e.deltaY * 0.01;
            targetZoom = Math.max(5, Math.min(20, targetZoom));
        }, { passive: false });

        // Control buttons
        document.getElementById('tourRotateLeft').addEventListener('click', () => { targetRotation.y -= 0.3; });
        document.getElementById('tourRotateRight').addEventListener('click', () => { targetRotation.y += 0.3; });
        document.getElementById('tourZoomIn').addEventListener('click', () => { targetZoom = Math.max(5, targetZoom - 2); });
        document.getElementById('tourZoomOut').addEventListener('click', () => { targetZoom = Math.min(20, targetZoom + 2); });
        document.getElementById('tourReset').addEventListener('click', () => {
            targetRotation = { x: 0, y: 0 };
            targetZoom = 12;
            // Reset to exterior view
            const roomBtnsAll = document.querySelectorAll('.room-btn');
            roomBtnsAll.forEach(b => b.classList.remove('active'));
            document.querySelector('[data-room="exterior"]').classList.add('active');

            Object.values(roomHighlights).forEach(mesh => {
                animateHighlight(mesh, false);
            });
        });

        // ---- ANIMATE ----
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();

            // Smooth rotation
            currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
            currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;

            // Auto-gentle rotation when not interacting
            if (!isDragging) {
                house.rotation.y += (currentRotation.y + Math.sin(elapsed * 0.1) * 0.1 - house.rotation.y) * 0.02;
            } else {
                house.rotation.y += (currentRotation.y - house.rotation.y) * 0.05;
            }

            renderer.render(scene, camera);
        }
        animate();

        // Resize
        window.addEventListener('resize', () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });
    }

    // Theme update for Tour
    function updateTourTheme(isDark) {
        const ts = window.tourScene;
        if (!ts) return;

        ts.scene.background = new THREE.Color(isDark ? 0x111128 : 0xf0ede6);
        ts.lights.ambient.color.setHex(isDark ? 0x333355 : 0xfff5e6);
        ts.lights.ambient.intensity = isDark ? 0.4 : 0.8;
        ts.lights.dirLight.color.setHex(isDark ? 0x8888cc : 0xfff0d0);
        ts.lights.dirLight.intensity = isDark ? 0.5 : 0.9;

        ts.wallMat.color.setHex(isDark ? 0x2a2a3a : 0xf5f0e8);
        ts.accentWall.color.setHex(isDark ? 0x2a3a4a : 0xd4e8f0);

        if (ts.tv) {
            ts.tv.material.emissive.setHex(isDark ? 0x2244aa : 0x115588);
            ts.tv.material.emissiveIntensity = isDark ? 0.3 : 0.1;
        }

        Object.values(ts.roomLights).forEach(light => {
            light.color.setHex(isDark ? 0xffcc66 : 0xfff5e0);
            light.intensity = isDark ? 0.6 : 0.3;
        });
    }

    // ========================
    // SMOOTH SCROLL FOR NAV
    // ========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
