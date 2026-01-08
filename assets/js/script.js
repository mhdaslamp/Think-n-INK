// Create floating particles
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 40; i++) {
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

// Menu animation
const menuIcon = document.querySelector('.menu-icon');
menuIcon.addEventListener('click', function() {
    this.classList.toggle('active');
});

// Button interactions
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Parallax effect on mouse move
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    
    document.querySelectorAll('.glow').forEach((glow, index) => {
        const speed = (index + 1) * 0.5;
        glow.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

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
