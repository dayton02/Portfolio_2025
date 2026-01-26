document.addEventListener('DOMContentLoaded', () => {
    // Video Modal Logic
    const videoModal = document.getElementById('videoModal');
    if (videoModal) {
        const video = document.getElementById('gameplayVideo');
        const closeBtn = videoModal.querySelector('.close-modal');

        window.playVideo = function(event) {
            if (event) event.preventDefault();
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (video) video.play();
        };

        function closeVideoModal() {
            videoModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            if (video) video.pause();
        }

        if (closeBtn) closeBtn.addEventListener('click', closeVideoModal);

        window.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                closeVideoModal();
            }
        });
    }

    // Screenshots Gallery Logic
    const screenshotsModal = document.getElementById('screenshotsModal');
    if (screenshotsModal) {
        const gallerySlides = document.querySelector('.gallery-slides');
        const prevBtn = document.querySelector('.gallery-nav.prev');
        const nextBtn = document.querySelector('.gallery-nav.next');
        const closeBtn = screenshotsModal.querySelector('.close-modal');
        let currentIndex = 0;

        window.showScreenshots = function(event) {
            if (event) event.preventDefault();
            screenshotsModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            currentIndex = 0;
            updateGallery();
        };

        function updateGallery() {
            if (!gallerySlides) return;
            const offset = -currentIndex * 100;
            gallerySlides.style.transform = `translateX(${offset}%)`;

            // Update navigation button states
            if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
            if (nextBtn) nextBtn.style.opacity = currentIndex === gallerySlides.children.length - 1 ? '0.5' : '1';
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateGallery();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (gallerySlides && currentIndex < gallerySlides.children.length - 1) {
                    currentIndex++;
                    updateGallery();
                }
            });
        }

        // Keyboard navigation for gallery
        document.addEventListener('keydown', (e) => {
            if (screenshotsModal.classList.contains('active')) {
                if (e.key === 'ArrowLeft' && currentIndex > 0) {
                    currentIndex--;
                    updateGallery();
                } else if (e.key === 'ArrowRight' && gallerySlides && currentIndex < gallerySlides.children.length - 1) {
                    currentIndex++;
                    updateGallery();
                } else if (e.key === 'Escape') {
                    screenshotsModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                screenshotsModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === screenshotsModal) {
                screenshotsModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});
