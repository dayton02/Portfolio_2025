// Polyfill for smooth scrolling
if (!('scrollBehavior' in document.documentElement.style)) {
    // Fallback for browsers that don't support smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'instant'
                });
            }
        });
    });
} else {
    // Modern browsers with smooth scrolling support
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
});

// Loading Screen Animation with Status Messages
window.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingStatus = document.querySelector('.loading-status');
    
    // Check if loading elements exist
    if (!loadingScreen || !loadingStatus) return;
    
    const statusMessages = [
        'Status: Initializing systems...',
        'Status: Loading assets...',
        'Status: Compiling shaders...',
        'Status: Building world...',
        'Status: Ready!'
    ];
    
    let currentIndex = 0;
    const statusInterval = setInterval(() => {
        if (currentIndex < statusMessages.length) {
            loadingStatus.textContent = statusMessages[currentIndex];
            currentIndex++;
        } else {
            clearInterval(statusInterval);
        }
    }, 400); // Change message every 400ms

    // Hide loading screen after all messages complete
    // Total time: 5 messages × 400ms = 2000ms + 300ms delay
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500); // Fade out duration
    }, 2300); // Slightly longer to show "Ready!" message
});