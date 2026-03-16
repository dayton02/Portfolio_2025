// Game Dev Themed Interactive Enhancements
// Subtle effects that enhance without overwhelming

class PortfolioInteractivity {
    constructor() {
        this.particles = [];
        this.init();
    }

    init() {
        this.setupScrollEffects();
        this.setupClickEffects();
        this.setupTagInteractions();
        this.setupCursorFollower();
        
        // Show welcome message
        setTimeout(() => {
            this.showTooltip('Portfolio loaded', 'Go ahead and browse!');
        }, 1000);
    }

    // Section reveal animations on scroll
    setupScrollEffects() {
        // Observe all major sections
        const sections = document.querySelectorAll('section, .experience-card, .achievement-card, .project-card, .skill-category');
        
        const observerOptions = {
            threshold: 0.15, // Trigger when 15% of element is visible
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add reveal animation
                    entry.target.classList.add('reveal-active');
                    
                    // Create subtle particle effect at section top
                    const rect = entry.target.getBoundingClientRect();
                    this.createScrollParticles(rect.left + rect.width / 2, rect.top);
                }
            });
        }, observerOptions);
        
        // Add reveal-ready class to all sections
        sections.forEach(section => {
            section.classList.add('reveal-ready');
            observer.observe(section);
        });
    }

    // Create subtle particles when sections appear
    createScrollParticles(x, y) {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'scroll-particle';
                particle.style.left = `${x + (Math.random() - 0.5) * 100}px`;
                particle.style.top = `${y}px`;
                
                document.body.appendChild(particle);
                
                requestAnimationFrame(() => {
                    particle.classList.add('active');
                });
                
                setTimeout(() => particle.remove(), 1000);
            }, i * 100);
        }
    }

    // Particle burst and ripple on ANY click
    setupClickEffects() {
        document.addEventListener('click', (e) => {
            // Trigger effects on every click
            this.createParticleBurst(e.clientX, e.clientY);
            this.createRipple(e.clientX, e.clientY);
        });
    }

    createParticleBurst(x, y, count = 8) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const angle = (Math.PI * 2 * i) / count;
            const velocity = 50 + Math.random() * 50;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            
            document.body.appendChild(particle);
            
            requestAnimationFrame(() => {
                particle.classList.add('explode');
            });
            
            setTimeout(() => particle.remove(), 800);
        }
    }

    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.left = `${x - 10}px`;
        ripple.style.top = `${y - 10}px`;
        
        document.body.appendChild(ripple);
        
        requestAnimationFrame(() => {
            ripple.classList.add('active');
        });
        
        setTimeout(() => ripple.remove(), 600);
    }

    // Special interactions for tags
    setupTagInteractions() {
        // Mark special tags
        const tags = document.querySelectorAll('.tag');
        
        tags.forEach(tag => {
            const text = tag.textContent.toLowerCase();
            if (text.includes('game') || text.includes('developer')) {
                tag.setAttribute('data-interactive', 'game-dev');
            }
        });
    }

    // Custom cursor follower
    setupCursorFollower() {
        const follower = document.createElement('div');
        follower.className = 'cursor-follower';
        document.body.appendChild(follower);

        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            follower.style.left = `${mouseX}px`;
            follower.style.top = `${mouseY}px`;
        });

        // Expand on hover over interactive elements
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, .tag, .cta-button, .project-card')) {
                follower.classList.add('active');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('a, button, .tag, .cta-button, .project-card')) {
                follower.classList.remove('active');
            }
        });
    }

    showTooltip(title, subtitle) {
        const tooltip = document.createElement('div');
        tooltip.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(26, 22, 37, 0.95);
            color: #B197FC;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            border: 1px solid #845EF7;
            z-index: 10000;
            font-family: 'Fira Code', monospace;
            box-shadow: 0 4px 20px rgba(132, 94, 247, 0.3);
            animation: slideInRight 0.3s ease-out;
            pointer-events: none;
        `;
        tooltip.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 0.25rem; font-size: 0.95rem;">${title}</div>
            <div style="font-size: 0.75rem; opacity: 0.8;">${subtitle}</div>
        `;

        document.body.appendChild(tooltip);

        setTimeout(() => {
            tooltip.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => tooltip.remove(), 300);
        }, 3000);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.interactivity = new PortfolioInteractivity();
    });
} else {
    window.interactivity = new PortfolioInteractivity();
}

// Add slide animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);