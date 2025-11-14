// Enhanced Hero Animations and Interactions
document.addEventListener('DOMContentLoaded', () => {
    // Role rotation animation
    const roles = document.querySelectorAll('.role');
    let currentRole = 0;
    
    function rotateRoles() {
        roles.forEach(role => role.classList.remove('current'));
        roles[currentRole].classList.add('current');
        currentRole = (currentRole + 1) % roles.length;
    }
    
    // Start role rotation
    rotateRoles();
    setInterval(rotateRoles, 3000);

    // Enhanced glitch effect with random intervals
    const glitchElement = document.querySelector('.glitch');
    if (glitchElement) {
        function triggerGlitch() {
            glitchElement.style.animation = 'none';
            setTimeout(() => {
                glitchElement.style.animation = 'glitch 0.5s infinite';
            }, 50);
        }
        
        // Random glitch triggers
        setInterval(() => {
            if (Math.random() > 0.7) {
                triggerGlitch();
            }
        }, 2000);
    }

    // Terminal typing animation
    const codeDisplay = document.querySelector('.code-display');
    if (codeDisplay) {
        const codeSnippets = [
            `class Developer {
    constructor() {
        this.name = "Dayton Ng";
        this.skills = ["C++", "Unity", "Blender"];
        this.passion = "Creating amazing games";
    }
    
    create() {
        return this.passion + " with " + this.skills.join(", ");
    }
}`,
            `void GameLoop() {
    while (isRunning) {
        ProcessInput();
        UpdateGame();
        RenderFrame();
    }
}`,
            `public class Player : MonoBehaviour {
    [SerializeField] private float speed = 5f;
    private Rigidbody2D rb;
    
    void Start() {
        rb = GetComponent<Rigidbody2D>();
    }
}`
        ];
        
        let currentSnippet = 0;
        
        function typeCode() {
            const snippet = codeSnippets[currentSnippet];
            let index = 0;
            codeDisplay.innerHTML = '';
            codeDisplay.className = 'code-display language-cpp';
            
            function typeCharacter() {
                if (index < snippet.length) {
                    codeDisplay.textContent += snippet[index];
                    index++;
                    setTimeout(typeCharacter, 50 + Math.random() * 50);
                } else {
                    // Highlight syntax after typing
                    if (window.Prism) {
                        Prism.highlightElement(codeDisplay);
                    }
                    
                    // Move to next snippet after delay
                    setTimeout(() => {
                        currentSnippet = (currentSnippet + 1) % codeSnippets.length;
                        typeCode();
                    }, 3000);
                }
            }
            
            typeCharacter();
        }
        
        // Start typing after a delay
        setTimeout(typeCode, 1500);
    }

    // Interactive particle system for hero section
    createParticleSystem();
    
    function createParticleSystem() {
        const heroSection = document.querySelector('#hero');
        if (!heroSection) return;
        
        const canvas = document.createElement('canvas');
        canvas.className = 'particle-canvas';
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        
        heroSection.style.position = 'relative';
        heroSection.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: 0, y: 0 };
        
        function resizeCanvas() {
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Mouse tracking
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        
        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.color = Math.random() > 0.5 ? '#845EF7' : '#B197FC';
            }
            
            update() {
                // Mouse interaction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    this.vx -= (dx / distance) * force * 0.02;
                    this.vy -= (dy / distance) * force * 0.02;
                }
                
                this.x += this.vx;
                this.y += this.vy;
                
                // Boundary check
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
                
                // Friction
                this.vx *= 0.99;
                this.vy *= 0.99;
            }
            
            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
        
        // Create particles
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
        
        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Draw connections
            particles.forEach((particle, i) => {
                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.save();
                        ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                        ctx.strokeStyle = '#845EF7';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                        ctx.restore();
                    }
                });
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    // Parallax effect for hero section
    function createParallaxEffect() {
        const heroContainer = document.querySelector('.hero-container');
        if (!heroContainer) return;
        
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const parallaxElements = heroContainer.querySelectorAll('.hero-left, .hero-right');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.2);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }
    
    createParallaxEffect();

    // Add hover effects to interactive elements
    addHoverEffects();
    
    function addHoverEffects() {
        // Terminal window glow effect
        const terminalWindow = document.querySelector('.terminal-window');
        if (terminalWindow) {
            terminalWindow.addEventListener('mouseenter', () => {
                terminalWindow.style.boxShadow = '0 20px 60px rgba(132, 94, 247, 0.4)';
            });
            
            terminalWindow.addEventListener('mouseleave', () => {
                terminalWindow.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
            });
        }
        
        // CTA button pulse effect
        const ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.animation = 'pulse 1s infinite';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.animation = 'none';
            });
        });
    }

    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .role {
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .role.current {
            animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .particle-canvas {
            opacity: 0.6;
            transition: opacity 0.3s ease;
        }
        
        .hero-container:hover .particle-canvas {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});