(function () {
    'use strict';

    // Throttle function for performance
    function throttle(func, delay) {
        let lastCall = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func(...args);
            }
        };
    }

    // Respect user's motion preference and viewport size before creating visual effects
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLargeViewport = window.matchMedia('(min-width: 768px)').matches;

    // Create floating particles only when appropriate
    const particlesContainer = document.getElementById('particles');
    const shouldCreateParticles = particlesContainer && isLargeViewport && !prefersReducedMotion;
    if (shouldCreateParticles) {
        // Reduced particle count for performance on mid-range devices
        const PARTICLE_COUNT = 12;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
            particle.style.setProperty('--ty', (Math.random() - 0.5) * 200 + 'px');
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Menu animation with overlay control
    const menuIcon = document.querySelector('.menu-icon');
    const navOverlay = document.querySelector('.nav-overlay');
    const navOverlayLinks = document.querySelectorAll('.nav-overlay-link');
    const navOverlayClose = document.querySelector('.nav-overlay-close');
    const navOverlayRegister = document.querySelector('.nav-overlay-register');

    if (menuIcon && navOverlay) {
        // Function to close menu
        const closeMenu = () => {
            menuIcon.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        // Toggle menu
        menuIcon.addEventListener('click', function () {
            this.classList.toggle('active');
            navOverlay.classList.toggle('active');
            // Prevent body scroll when menu is open
            document.body.style.overflow = navOverlay.classList.contains('active') ? 'hidden' : '';
        });

        // Close button
        if (navOverlayClose) {
            navOverlayClose.addEventListener('click', closeMenu);
        }

        // Close menu when clicking on links
        navOverlayLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu when clicking register button
        if (navOverlayRegister) {
            navOverlayRegister.addEventListener('click', closeMenu);
        }

        // Close menu on Escape key for accessibility
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // Button interactions - Add keyboard accessibility
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Parallax effect on mouse move (throttled for performance) — only when motion is allowed
    const parallaxEffect = throttle((e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        document.querySelectorAll('.glow').forEach((glow, index) => {
            const speed = (index + 1) * 0.5;
            glow.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    }, 16); // ~60fps

    if (!prefersReducedMotion) {
        document.addEventListener('mousemove', parallaxEffect);
    }

    // Scroll reveal animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.guideline-card, .about-content, .advisory-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // Timeline scroll animation
    const timelineSection = document.querySelector('.timeline-section');
    const timelineLine = document.getElementById('timelineLine');
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (timelineSection && timelineLine && timelineItems.length > 0) {
        // Animate timeline line and trigger item animations on scroll
        const animateTimelineLine = throttle(() => {
            const timelineRect = timelineSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Check if timeline section is in view
            if (timelineRect.top < windowHeight && timelineRect.bottom > 0) {
                // Calculate how much of the timeline is visible
                const visibleHeight = Math.min(windowHeight - timelineRect.top, timelineRect.height);
                const scrollPercentage = Math.max(0, Math.min(1, visibleHeight / timelineRect.height));

                // Get the total height of all timeline items
                const containerHeight = document.querySelector('.timeline-container').offsetHeight;

                // Animate the line height based on scroll
                const lineHeight = containerHeight * scrollPercentage;
                timelineLine.style.height = lineHeight + 'px';

                // Trigger animations for items when line reaches them
                timelineItems.forEach((item, index) => {
                    const itemTop = item.offsetTop;

                    // Check if the line has reached this item (with a small offset for better timing)
                    if (lineHeight >= itemTop - 20) {
                        item.classList.add('line-reached');
                    }
                });
            }
        }, 16); // ~60fps

        // Initial call and scroll listener
        window.addEventListener('scroll', animateTimelineLine);
        window.addEventListener('resize', animateTimelineLine); // Keep resize listener
        animateTimelineLine(); // Initial call
    }

    // ScrollSpy for Desktop Navigation
    const isDesktop = window.matchMedia('(min-width: 769px)').matches;

    if (isDesktop) {
        const sections = document.querySelectorAll('section[id]');
        const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');
        const overlayLinks = document.querySelectorAll('.nav-overlay-link[data-section]');

        const scrollSpyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');

                    // Update Desktop Links
                    desktopLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('data-section') === sectionId) {
                            link.classList.add('active');
                        }
                    });

                    // Update Overlay Links (keep in sync)
                    overlayLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('data-section') === sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -60% 0px'
        });

        // Observe all sections
        sections.forEach(section => {
            scrollSpyObserver.observe(section);
        });
    }

})();
