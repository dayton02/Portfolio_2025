// Smooth scroll animations and parallax effects
class ScrollAnimator {
    constructor() {
        this.elements = [];
        this.parallaxElements = [];
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.init();
    }

    init() {
        this.setupElements();
        this.bindEvents();
        this.startAnimationLoop();
    }

    setupElements() {
        // Elements for scroll animations
        this.elements = [
            ...document.querySelectorAll('.fade-in-up'),
            ...document.querySelectorAll('.slide-in-left'),
            ...document.querySelectorAll('.slide-in-right'),
            ...document.querySelectorAll('.scale-in'),
            ...document.querySelectorAll('.rotate-in')
        ].filter(el => el !== null);

        // Elements for parallax effects
        this.parallaxElements = [
            ...document.querySelectorAll('.parallax-bg'),
            ...document.querySelectorAll('.parallax-element'),
            ...document.querySelectorAll('.hero-bg'),
            ...document.querySelectorAll('.floating-element')
        ].filter(el => el !== null);

        // Add animation classes to existing elements
        this.addAnimationClasses();
    }

    addAnimationClasses() {
        // Add fade-in-up to sections
        document.querySelectorAll('section').forEach((section, index) => {
            if (!section.classList.contains('hero')) {
                section.classList.add('fade-in-up');
                section.style.animationDelay = `${index * 0.1}s`;
            }
        });

        // Add slide animations to project cards
        document.querySelectorAll('.project-card').forEach((card, index) => {
            card.classList.add(index % 2 === 0 ? 'slide-in-left' : 'slide-in-right');
            card.style.animationDelay = `${index * 0.1}s`;
        });

        // Add scale-in to buttons and interactive elements
        document.querySelectorAll('.cta-button, .submit-btn, .project-link').forEach((element, index) => {
            element.classList.add('scale-in');
            element.style.animationDelay = `${index * 0.05}s`;
        });
    }

    bindEvents() {
        // Throttled scroll event
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
        
        // Resize event for recalculations
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Intersection Observer for scroll animations
        this.setupIntersectionObserver();
    }

    handleScroll() {
        if (!this.isScrolling) {
            requestAnimationFrame(() => {
                this.updateParallax();
                this.updateScrollProgress();
                this.isScrolling = false;
            });
            this.isScrolling = true;
        }

        // Clear existing timeout
        clearTimeout(this.scrollTimeout);
        
        // Set new timeout for scroll end
        this.scrollTimeout = setTimeout(() => {
            this.handleScrollEnd();
        }, 150);
    }

    handleScrollEnd() {
        // Trigger any scroll-end animations
        this.elements.forEach(element => {
            if (this.isElementInViewport(element)) {
                element.classList.add('animate');
            }
        });
    }

    handleResize() {
        // Recalculate element positions on resize
        this.updateElementPositions();
    }

    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                        
                        // Add staggered animation for child elements
                        const children = entry.target.querySelectorAll('.animate-child');
                        children.forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('animate');
                            }, index * 100);
                        });
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            this.elements.forEach(element => {
                observer.observe(element);
            });
        }
    }

    updateParallax() {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;

        this.parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            const elementHeight = rect.height;
            
            // Calculate parallax speed based on data attribute
            const speed = parseFloat(element.dataset.parallaxSpeed) || 0.5;
            const direction = element.dataset.parallaxDirection || 'up';
            
            // Calculate parallax offset
            const parallaxOffset = (scrollY - elementTop + windowHeight) * speed;
            
            // Apply parallax transform
            if (direction === 'up') {
                element.style.transform = `translateY(${-parallaxOffset}px)`;
            } else if (direction === 'down') {
                element.style.transform = `translateY(${parallaxOffset}px)`;
            } else if (direction === 'left') {
                element.style.transform = `translateX(${-parallaxOffset}px)`;
            } else if (direction === 'right') {
                element.style.transform = `translateX(${parallaxOffset}px)`;
            }
            
            // Add opacity effect for some elements
            if (element.classList.contains('parallax-fade')) {
                const opacity = Math.max(0, 1 - (parallaxOffset / windowHeight));
                element.style.opacity = opacity;
            }
        });
    }

    updateScrollProgress() {
        // Update scroll progress indicators
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollHeight > 0 ? (window.pageYOffset / scrollHeight) * 100 : 0;
        
        // Update progress bar if exists
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = `${Math.min(100, Math.max(0, scrollProgress))}%`;
        }
        
        // Update scroll percentage indicator
        const scrollPercent = document.querySelector('.scroll-percent');
        if (scrollPercent) {
            scrollPercent.textContent = `${Math.round(Math.min(100, Math.max(0, scrollProgress)))}%`;
        }
    }

    updateElementPositions() {
        // Recalculate element positions for parallax
        this.parallaxElements.forEach(element => {
            element.dataset.originalTop = element.getBoundingClientRect().top + window.pageYOffset;
        });
    }

    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= windowHeight &&
            rect.right <= windowWidth
        );
    }

    startAnimationLoop() {
        // Continuous animation loop for smooth effects
        const animate = () => {
            this.updateParallax();
            requestAnimationFrame(animate);
        };
        
        // Start the animation loop
        requestAnimationFrame(animate);
    }

    // Smooth scroll to element
    smoothScrollTo(target, duration = 1000) {
        const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();

        const easeInOutQuad = (t) => {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        };

        const scroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = easeInOutQuad(progress);
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (elapsed < duration) {
                requestAnimationFrame(scroll);
            }
        };

        requestAnimationFrame(scroll);
    }

    // Add smooth scroll behavior to all anchor links
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = anchor.getAttribute('href');
                this.smoothScrollTo(target);
            });
        });
    }
}

// Add CSS animations dynamically
const addScrollAnimationsCSS = () => {
    const style = document.createElement('style');
    style.textContent = `
        /* Scroll Animation Classes */
        .fade-in-up {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in-up.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .slide-in-left {
            opacity: 0;
            transform: translateX(-30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .slide-in-left.animate {
            opacity: 1;
            transform: translateX(0);
        }
        
        .slide-in-right {
            opacity: 0;
            transform: translateX(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .slide-in-right.animate {
            opacity: 1;
            transform: translateX(0);
        }
        
        .scale-in {
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 0.4s ease, transform 0.4s ease;
        }
        
        .scale-in.animate {
            opacity: 1;
            transform: scale(1);
        }
        
        .rotate-in {
            opacity: 0;
            transform: rotate(-5deg);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .rotate-in.animate {
            opacity: 1;
            transform: rotate(0);
        }
        
        /* Parallax Elements */
        .parallax-element {
            will-change: transform;
        }
        
        /* Scroll Progress Indicator */
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-purple), var(--secondary-purple));
            z-index: 996;
            transition: width 0.1s ease;
        }
        
        .scroll-percent {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(19, 17, 28, 0.9);
            color: var(--text-primary);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 500;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(132, 94, 247, 0.2);
            z-index: 996;
        }
    `;
    document.head.appendChild(style);
};

// Initialize scroll animator
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        addScrollAnimationsCSS();
        const scrollAnimator = new ScrollAnimator();
        scrollAnimator.setupSmoothScroll();
        window.scrollAnimator = scrollAnimator;
    });
} else {
    addScrollAnimationsCSS();
    const scrollAnimator = new ScrollAnimator();
    scrollAnimator.setupSmoothScroll();
    window.scrollAnimator = scrollAnimator;
}