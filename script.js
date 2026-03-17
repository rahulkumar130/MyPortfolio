/* =============================================
   script.js — Portfolio interactions v4
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    // -------- ELEMENTS --------
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const allNavLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');

    // -------- HERO PARTICLES --------
    const heroParticles = document.getElementById('heroParticles');
    if (heroParticles) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 4 + 's';
            particle.style.animationDuration = (3 + Math.random() * 3) + 's';
            particle.style.width = (2 + Math.random() * 3) + 'px';
            particle.style.height = particle.style.width;
            heroParticles.appendChild(particle);
        }
    }

    // -------- CONTINUOUS TYPEWRITER ANIMATION --------
    const typewriter1 = document.getElementById('typewriter1');
    const typewriter2 = document.getElementById('typewriter2');
    const cursor = document.querySelector('.typewriter-cursor');
    const dividers = document.querySelectorAll('.title-divider');

    const line1Parts = [
        { text: 'Aspiring', className: 'typed-accent' },
        { text: ' Data Analyst' }
    ];
    const line2Text = 'Data Science Student';

    function typeText(el, parts, speed, callback) {
        let partIndex = 0;
        let charIndex = 0;
        let html = '';

        function next() {
            if (partIndex >= parts.length) {
                if (callback) callback();
                return;
            }

            const part = parts[partIndex];
            const text = part.text;
            const cls = part.className || '';

            if (charIndex === 0 && cls) {
                html += `<span class="${cls}">`;
            }

            if (charIndex < text.length) {
                html += text[charIndex];
                el.innerHTML = cls ? html + '</span>' : html;
                charIndex++;
                setTimeout(next, speed + Math.random() * 25);
            } else {
                if (cls) html += '</span>';
                charIndex = 0;
                partIndex++;
                setTimeout(next, speed);
            }
        }
        next();
    }

    function eraseText(el, speed, callback) {
        const text = el.textContent;
        let i = text.length;

        function erase() {
            if (i <= 0) {
                el.innerHTML = '';
                if (callback) callback();
                return;
            }
            i--;
            // Rebuild from original parts up to i characters
            el.textContent = text.substring(0, i);
            setTimeout(erase, speed);
        }
        erase();
    }

    function runTypewriterLoop() {
        // Phase 1: Type line 1
        if (cursor) cursor.style.display = 'inline-block';
        typeText(typewriter1, line1Parts, 70, () => {
            // Phase 2: Pause, then show dividers and type line 2
            setTimeout(() => {
                if (cursor) cursor.style.display = 'none';
                dividers.forEach(d => d.classList.add('show'));

                setTimeout(() => {
                    typeText(typewriter2, [{ text: line2Text }], 55, () => {
                        // Phase 3: Hold for 3 seconds
                        setTimeout(() => {
                            // Phase 4: Erase line 2
                            eraseText(typewriter2, 35, () => {
                                dividers.forEach(d => d.classList.remove('show'));

                                setTimeout(() => {
                                    // Phase 5: Erase line 1
                                    if (cursor) cursor.style.display = 'inline-block';
                                    eraseText(typewriter1, 40, () => {
                                        // Phase 6: Pause then restart
                                        setTimeout(runTypewriterLoop, 800);
                                    });
                                }, 300);
                            });
                        }, 3000);
                    });
                }, 300);
            }, 400);
        });
    }

    // Start the loop after initial delay
    setTimeout(runTypewriterLoop, 900);

    // -------- NAVBAR SCROLL --------
    const handleScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        backToTop.classList.toggle('visible', window.scrollY > 500);

        // Active section highlighting
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    allNavLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // -------- MOBILE NAV --------
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // -------- SCROLL ANIMATIONS (Intersection Observer) --------
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach((el) => {
        const parent = el.parentElement;
        const siblings = parent.querySelectorAll(':scope > .animate-on-scroll');
        const sibIndex = Array.from(siblings).indexOf(el);
        el.dataset.delay = sibIndex * 120;
        observer.observe(el);
    });

    // -------- COUNTER ANIMATION (for stats + leetcode) --------
    const counterElements = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.dataset.count);
                let current = 0;
                const duration = 1500;
                const increment = countTo / (duration / 16);

                const counter = setInterval(() => {
                    current += increment;
                    if (current >= countTo) {
                        target.textContent = countTo;
                        clearInterval(counter);
                    } else {
                        target.textContent = Math.floor(current);
                    }
                }, 16);

                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));

    // -------- BACK TO TOP --------
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // -------- CONTACT FORM (Netlify Forms) --------
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const originalHTML = btn.innerHTML;

        // Show loading state
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
        btn.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });

            if (response.ok) {
                btn.innerHTML = '<i class="fas fa-check"></i> <span>Message Sent!</span>';
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (err) {
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>Failed — try again</span>';
            btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        }

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    });

    // -------- SMOOTH SCROLL for anchor links --------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // -------- CERTIFICATES INFINITE SLIDER (with swipe/drag) --------
    const certTrack = document.getElementById('certificatesTrack');
    const certSlider = document.getElementById('certificatesSlider');
    if (certTrack && certSlider) {
        // Clone all cards for seamless infinite loop
        const originalCards = certTrack.querySelectorAll('.certificate-card');
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            certTrack.appendChild(clone);
        });

        // Scroll state
        let scrollPos = 0;
        const autoSpeed = 0.8; // px per frame (~48px/s at 60fps)
        let isDragging = false;
        let dragStartX = 0;
        let dragStartScroll = 0;
        let velocity = 0;
        let lastDragX = 0;
        let lastDragTime = 0;
        let hasDragged = false;
        let resumeTimer = null;
        let isPaused = false;

        // Calculate half-width (original cards width) for wrap-around
        function getHalfWidth() {
            return certTrack.scrollWidth / 2;
        }

        // Wrap position for seamless loop
        function wrapPosition() {
            const half = getHalfWidth();
            if (scrollPos >= half) scrollPos -= half;
            if (scrollPos < 0) scrollPos += half;
        }

        // Apply transform
        function applyTransform() {
            certTrack.style.transform = `translateX(${-scrollPos}px)`;
        }

        // Animation loop
        function animate() {
            if (!isDragging) {
                if (Math.abs(velocity) > 0.2) {
                    // Momentum glide after drag
                    scrollPos += velocity;
                    velocity *= 0.95; // deceleration
                } else if (!isPaused) {
                    // Auto-scroll
                    velocity = 0;
                    scrollPos += autoSpeed;
                }
            }
            wrapPosition();
            applyTransform();
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);

        // --- Drag / Touch handlers ---
        function onDragStart(x) {
            isDragging = true;
            hasDragged = false;
            velocity = 0;
            dragStartX = x;
            dragStartScroll = scrollPos;
            lastDragX = x;
            lastDragTime = performance.now();
            certTrack.classList.add('dragging');
            clearTimeout(resumeTimer);
            isPaused = true;
        }

        function onDragMove(x) {
            if (!isDragging) return;
            const diff = dragStartX - x;
            if (Math.abs(diff) > 3) hasDragged = true;
            scrollPos = dragStartScroll + diff;

            // Track velocity for momentum
            const now = performance.now();
            const dt = now - lastDragTime;
            if (dt > 0) {
                velocity = (lastDragX - x) / dt * 16; // normalize to ~per-frame
            }
            lastDragX = x;
            lastDragTime = now;
        }

        function onDragEnd() {
            if (!isDragging) return;
            isDragging = false;
            certTrack.classList.remove('dragging');

            // Cap velocity
            velocity = Math.max(-20, Math.min(20, velocity));

            // Resume auto scroll after momentum fades
            resumeTimer = setTimeout(() => {
                isPaused = false;
            }, 1500);
        }

        // Mouse events
        certSlider.addEventListener('mousedown', (e) => {
            e.preventDefault();
            onDragStart(e.clientX);
        });
        window.addEventListener('mousemove', (e) => onDragMove(e.clientX));
        window.addEventListener('mouseup', onDragEnd);

        // Touch events
        certSlider.addEventListener('touchstart', (e) => {
            onDragStart(e.touches[0].clientX);
        }, { passive: true });
        certSlider.addEventListener('touchmove', (e) => {
            onDragMove(e.touches[0].clientX);
        }, { passive: true });
        certSlider.addEventListener('touchend', onDragEnd);

        // Prevent click on cards if user dragged (so lightbox doesn't open on swipe)
        certSlider.addEventListener('click', (e) => {
            if (hasDragged) {
                e.stopPropagation();
                e.preventDefault();
            }
        }, true);

        // Mouse wheel / trackpad scroll
        certSlider.addEventListener('wheel', (e) => {
            // Use whichever delta is larger (supports both trackpad & mouse wheel)
            const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            e.preventDefault();

            scrollPos += delta * 1.2;
            velocity = delta * 0.3;
            isPaused = true;
            clearTimeout(resumeTimer);
            resumeTimer = setTimeout(() => {
                isPaused = false;
            }, 1500);
        }, { passive: false });
    }

    // -------- CERTIFICATE LIGHTBOX --------
    const certLightbox = document.getElementById('certLightbox');
    const certLightboxImg = document.getElementById('certLightboxImg');
    const certLightboxClose = document.getElementById('certLightboxClose');

    if (certLightbox && certLightboxImg) {
        // Open lightbox on certificate card click
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.certificate-card');
            if (card) {
                const imgSrc = card.getAttribute('data-cert-img');
                if (imgSrc) {
                    certLightboxImg.src = imgSrc;
                    certLightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }
        });

        // Close lightbox
        const closeLightbox = () => {
            certLightbox.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => { certLightboxImg.src = ''; }, 350);
        };

        certLightboxClose.addEventListener('click', closeLightbox);

        certLightbox.addEventListener('click', (e) => {
            if (e.target === certLightbox || e.target === certLightbox.querySelector('.cert-lightbox-content')) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && certLightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }
});
