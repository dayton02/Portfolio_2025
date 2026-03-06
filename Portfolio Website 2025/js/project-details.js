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
        const closeBtn = screenshotsModal.querySelector('.close-modal');
        let currentIndex = 0;
        let screenshots = [];

        window.showScreenshots = function(event) {
            if (event) event.preventDefault();
            screenshotsModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            currentIndex = 0;
            initializeGallery();
        };

        function initializeGallery() {
            // Read screenshots from existing HTML structure
            const gallerySlides = screenshotsModal.querySelector('.gallery-slides');
            
            if (gallerySlides) {
                // Extract screenshots from the existing img tags
                const existingImages = gallerySlides.querySelectorAll('img');
                screenshots = Array.from(existingImages).map(img => ({
                    src: img.src,
                    alt: img.alt || 'Screenshot'
                }));

                // Transform the gallery into thumbnail-based system
                setupThumbnailGallery(gallerySlides);
            } else {
                console.warn('No gallery-slides found in screenshots modal');
            }
        }

        function setupThumbnailGallery(gallerySlides) {
            // Get or create the gallery container
            let galleryContainer = screenshotsModal.querySelector('.gallery-container');
            
            // Clear and rebuild the structure
            galleryContainer.innerHTML = `
                <div class="main-image-container">
                    <button class="nav-arrow prev-arrow">&lt;</button>
                    <img id="mainScreenshot" src="${screenshots[0].src}" alt="${screenshots[0].alt}">
                    <button class="nav-arrow next-arrow">&gt;</button>
                </div>
                <div class="thumbnail-strip">
                    <div class="thumbnail-container" id="screenshotThumbnails">
                        <!-- Thumbnails will be generated here -->
                    </div>
                </div>
            `;

            const mainImage = galleryContainer.querySelector('#mainScreenshot');
            const thumbnailContainer = galleryContainer.querySelector('#screenshotThumbnails');
            const prevArrow = galleryContainer.querySelector('.prev-arrow');
            const nextArrow = galleryContainer.querySelector('.next-arrow');

            // Create thumbnails
            screenshots.forEach((screenshot, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'thumbnail';
                if (index === 0) thumbnail.classList.add('active');
                
                thumbnail.innerHTML = `<img src="${screenshot.src}" alt="${screenshot.alt}">`;
                thumbnail.addEventListener('click', () => updateImage(index));
                thumbnailContainer.appendChild(thumbnail);
            });

            function updateImage(index) {
                currentIndex = index;
                mainImage.src = screenshots[index].src;
                mainImage.alt = screenshots[index].alt;

                // Update thumbnail active state
                thumbnailContainer.querySelectorAll('.thumbnail').forEach((thumb, i) => {
                    thumb.classList.toggle('active', i === index);
                    if (i === index) {
                        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }
                });
            }

            // Navigation handlers
            if (prevArrow) {
                prevArrow.onclick = () => {
                    const newIndex = (currentIndex - 1 + screenshots.length) % screenshots.length;
                    updateImage(newIndex);
                };
            }

            if (nextArrow) {
                nextArrow.onclick = () => {
                    const newIndex = (currentIndex + 1) % screenshots.length;
                    updateImage(newIndex);
                };
            }

            // Initialize first image
            updateImage(0);
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (screenshotsModal.classList.contains('active')) {
                if (e.key === 'ArrowLeft') {
                    screenshotsModal.querySelector('.prev-arrow')?.click();
                } else if (e.key === 'ArrowRight') {
                    screenshotsModal.querySelector('.next-arrow')?.click();
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
