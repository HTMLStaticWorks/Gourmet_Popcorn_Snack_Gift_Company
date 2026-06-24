/* ==========================================================================
   ANIMATIONS.JS - Premium Motion & GSAP Visual Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial page reveal
    document.body.classList.add('page-reveal');

    // 2. Initialize scroll observer for CSS animations fallback
    initScrollAnimations();

    // 3. GSAP Animation Setup (Optional but highly recommended)
    if (typeof gsap !== 'undefined') {
        initGsapAnimations();
    }
});

/* ==========================================================================
   INTERSECTION OBSERVER SCROLL REVEALS (CSS Fades)
   ========================================================================== */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animates only once
            }
        });
    }, observerOptions);

    // Collect all elements with fade-up classes or premium cards
    const animatableElements = document.querySelectorAll('.fade-up-element, .product-card, .glass-card, .section-header');
    
    animatableElements.forEach((el, index) => {
        // Add class if not already there
        if (!el.classList.contains('fade-up-element')) {
            el.classList.add('fade-up-element');
        }
        
        // Add inline transition delay for staggered effect
        const delay = (index % 3) * 0.15;
        el.style.transitionDelay = `${delay}s`;
        
        scrollObserver.observe(el);
    });
}

/* ==========================================================================
   GSAP ANIMATIONS (Triggers & Reveals)
   ========================================================================== */
function initGsapAnimations() {
    // Hero Banner text animation
    const heroTitle = document.querySelector('.hero-title');
    const heroSub = document.querySelector('.hero-sub');
    const heroDesc = document.querySelector('.hero-desc');
    const heroBtns = document.querySelector('.hero-buttons');
    const heroImg = document.querySelector('.hero-image-wrapper');

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (heroSub) {
        heroTl.fromTo(heroSub, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 });
    }
    if (heroTitle) {
        heroTl.fromTo(heroTitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');
    }
    if (heroDesc) {
        heroTl.fromTo(heroDesc, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.5');
    }
    if (heroBtns) {
        heroTl.fromTo(heroBtns, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4');
    }
    if (heroImg) {
        heroTl.fromTo(heroImg, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1 }, '-=0.8');
    }

    // Smooth hover effect for cards
    const cards = document.querySelectorAll('.product-card, .glass-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { y: -8, shadow: '0 20px 40px -10px rgba(124, 45, 18, 0.15)', duration: 0.3 });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { y: 0, shadow: '0 10px 30px -10px rgba(124, 45, 18, 0.08)', duration: 0.3 });
        });
    });
}
