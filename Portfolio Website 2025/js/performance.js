// Performance optimization and lazy loading functionality
class PerformanceOptimizer {
    constructor() {
        this.imageObserver = null;
        this.scriptObserver = null;
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.optimizeResourceLoading();
        this.setupPreloading();
        this.monitorPerformance();
    }

    // Lazy loading for images
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observe all images with data-lazy attribute
            document.querySelectorAll('img[data-lazy]').forEach(img => {
                this.imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            document.querySelectorAll('img[data-lazy]').forEach(img => {
                this.loadImage(img);
            });
        }
    }

    loadImage(img) {
        const src = img.getAttribute('data-lazy');
        const srcset = img.getAttribute('data-lazy-srcset');
        
        if (src) {
            img.src = src;
            img.removeAttribute('data-lazy');
        }
        
        if (srcset) {
            img.srcset = srcset;
            img.removeAttribute('data-lazy-srcset');
        }
        
        img.classList.add('loaded');
        
        // Add fade-in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        img.onload = () => {
            img.style.opacity = '1';
        };
    }

    // Optimize resource loading
    optimizeResourceLoading() {
        // Defer non-critical CSS
        this.deferNonCriticalCSS();
        
        // Load scripts asynchronously
        this.loadScriptsAsync();
        
        // Preload critical resources
        this.preloadCriticalResources();
    }

    deferNonCriticalCSS() {
        // Move non-critical styles to load after page render
        const nonCriticalStyles = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css'
        ];

        nonCriticalStyles.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.media = 'print';
            link.onload = function() {
                this.media = 'all';
            };
            document.head.appendChild(link);
        });
    }

    loadScriptsAsync() {
        // Load non-critical scripts after page load
        window.addEventListener('load', () => {
            const scripts = [
                'js/hero-enhanced.js',
                'js/form-validation.js'
            ];

            scripts.forEach(src => {
                if (!document.querySelector(`script[src="${src}"]`)) {
                    const script = document.createElement('script');
                    script.src = src;
                    script.async = true;
                    document.body.appendChild(script);
                }
            });
        });
    }

    preloadCriticalResources() {
        // Preload critical images and fonts
        const criticalResources = [
            { href: 'images/profile.jpg', as: 'image' },
            { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500;600&display=swap', as: 'style' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = resource.as;
            link.href = resource.href;
            document.head.appendChild(link);
        });
    }

    setupPreloading() {
        // Prefetch resources for next navigation
        const prefetchLinks = document.querySelectorAll('a[href^="projects.html"], a[href^="skills.html"]');
        
        prefetchLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                if (!document.querySelector(`link[rel="prefetch"][href="${link.href}"]`)) {
                    const prefetchLink = document.createElement('link');
                    prefetchLink.rel = 'prefetch';
                    prefetchLink.href = link.href;
                    document.head.appendChild(prefetchLink);
                }
            });
        });
    }

    monitorPerformance() {
        // Monitor Core Web Vitals
        if ('web-vitals' in window) {
            this.measureWebVitals();
        }

        // Monitor resource loading
        this.monitorResourceLoading();
        
        // Monitor user interactions
        this.monitorUserInteractions();
    }

    measureWebVitals() {
        // Measure Largest Contentful Paint
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('LCP:', entry.startTime);
                if (entry.startTime > 2500) {
                    console.warn('LCP is above 2.5s, consider optimization');
                }
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Measure First Input Delay
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('FID:', entry.processingStart - entry.startTime);
                if (entry.processingStart - entry.startTime > 100) {
                    console.warn('FID is above 100ms, consider optimization');
                }
            }
        }).observe({ entryTypes: ['first-input'] });

        // Measure Cumulative Layout Shift
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    console.log('CLS:', entry.value);
                    if (entry.value > 0.1) {
                        console.warn('CLS is above 0.1, consider optimization');
                    }
                }
            }
        }).observe({ entryTypes: ['layout-shift'] });
    }

    monitorResourceLoading() {
        // Monitor slow resources
        const slowResourceThreshold = 1000; // 1 second
        
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (entry.duration > slowResourceThreshold) {
                    console.warn(`Slow resource: ${entry.name} took ${entry.duration}ms`);
                }
            }
        }).observe({ entryTypes: ['resource'] });
    }

    monitorUserInteractions() {
        // Track user interaction performance
        let interactionCount = 0;
        let totalInteractionTime = 0;

        document.addEventListener('click', (e) => {
            const startTime = performance.now();
            
            requestAnimationFrame(() => {
                const endTime = performance.now();
                const interactionTime = endTime - startTime;
                
                interactionCount++;
                totalInteractionTime += interactionTime;
                
                const averageInteractionTime = totalInteractionTime / interactionCount;
                
                if (averageInteractionTime > 50) {
                    console.warn('Average interaction time is above 50ms');
                }
            });
        });
    }

    // Utility method to optimize images
    optimizeImages() {
        // Convert images to WebP format where supported
        if (this.supportsWebP()) {
            document.querySelectorAll('img[data-webp]').forEach(img => {
                const webpSrc = img.getAttribute('data-webp');
                if (webpSrc) {
                    img.src = webpSrc;
                }
            });
        }
    }

    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('webp') > -1;
    }
}

// Initialize performance optimizer when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PerformanceOptimizer();
    });
} else {
    new PerformanceOptimizer();
}

// Expose for global use
window.PerformanceOptimizer = PerformanceOptimizer;