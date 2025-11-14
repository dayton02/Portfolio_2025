// Lazy Loading Implementation
class LazyImageLoader {
    constructor() {
        this.images = [];
        this.observer = null;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.loadImagesInViewport();
    }

    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
        }
    }

    loadImagesInViewport() {
        // Load images that are already in viewport
        const images = document.querySelectorAll('img[data-lazy]');
        images.forEach(img => {
            if (this.isInViewport(img) || !this.observer) {
                this.loadImage(img);
            } else if (this.observer) {
                this.observer.observe(img);
            }
        });
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    loadImage(img) {
        const src = img.dataset.lazy;
        const placeholder = img.parentElement.querySelector('.image-loading-placeholder');
        
        if (!src) return;

        // Create a new image to preload
        const tempImg = new Image();
        
        tempImg.onload = () => {
            // Set the actual source
            img.src = src;
            img.classList.add('loaded');
            
            // Remove loading placeholder
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            
            // Remove data-lazy attribute
            delete img.dataset.lazy;
            
            console.log(`✅ Loaded image: ${src}`);
        };
        
        tempImg.onerror = () => {
            console.error(`❌ Failed to load image: ${src}`);
            
            // Show error state
            img.classList.add('error');
            if (placeholder) {
                placeholder.innerHTML = '<div class="error-text">Failed to load</div>';
            }
        };
        
        // Start loading
        tempImg.src = src;
    }

    // Force load all images (useful for debugging)
    loadAllImages() {
        const images = document.querySelectorAll('img[data-lazy]');
        images.forEach(img => {
            if (this.observer) {
                this.observer.unobserve(img);
            }
            this.loadImage(img);
        });
    }

    // Check for images that failed to load
    checkFailedImages() {
        const images = document.querySelectorAll('img[data-lazy]');
        const failed = [];
        
        images.forEach(img => {
            const src = img.dataset.lazy;
            if (src) {
                failed.push({
                    element: img,
                    src: src,
                    alt: img.alt || 'No alt text'
                });
            }
        });
        
        return failed;
    }
}

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.lazyLoader = new LazyImageLoader();
    });
} else {
    window.lazyLoader = new LazyImageLoader();
}

// Add CSS for lazy loading effects
const addLazyLoadingCSS = () => {
    const style = document.createElement('style');
    style.textContent = `
        /* Lazy Loading Styles */
        .lazy-image {
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            transform: scale(0.95);
        }
        
        .lazy-image.loaded {
            opacity: 1;
            transform: scale(1);
        }
        
        .lazy-image.error {
            opacity: 0.5;
            filter: grayscale(100%);
        }
        
        .image-loading-placeholder {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(19, 17, 28, 0.5);
            border-radius: inherit;
        }
        
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(132, 94, 247, 0.3);
            border-top: 3px solid var(--primary-purple);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        .error-text {
            color: var(--error-color, #ff4757);
            font-size: 0.875rem;
            text-align: center;
            padding: 1rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Ensure parent containers have relative positioning */
        .about-image,
        .project-image {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
};

// Add CSS immediately
addLazyLoadingCSS();