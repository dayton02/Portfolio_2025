const artGalleryModal = document.getElementById('artGalleryModal');
const artGalleryGrid = document.getElementById('artGalleryGrid');
const galleryTitle = document.getElementById('galleryTitle');

// Art collections
const artCollections = {
    digital: {
        title: 'Digital Art Collection',
        images: [
            { src: 'images/DigitalArt/BG_sprite.png', title: '"Climb" game menu' },
            { src: 'images/DigitalArt/Bird_sprite.png', title: 'Bird Sprite' },
            { src: 'images/DigitalArt/Coin_sprite.png', title: 'Coin Sprite' },
            { src: 'images/DigitalArt/Freeze_sprite.png', title: 'Freeze Sprite' },
            { src: 'images/DigitalArt/Invin_powerup.png', title: 'Invincible Power Up' },
            { src: 'images/DigitalArt/Slow_sprite.png', title: 'Slow time power up' },
            { src: 'images/DigitalArt/Stone_sprite.png', title: 'Stone Sprite' },
            { src: 'images/DigitalArt/Art_Showcase.png', title: 'Poly work' },
            { src: 'images/DigitalArt/Art_Showcase2.jpeg', title: 'Poly work' },
            { src: 'images/DigitalArt/Art_Showcase3.png', title: 'Poly work' },
            { src: 'images/DigitalArt/Art_Showcase4.png', title: 'Poly work' },
            { src: 'images/DigitalArt/Art_Showcase5.png', title: 'Poly work' },
            { src: 'images/DigitalArt/Art_Showcase6.png', title: 'Poly work' },
            { src: 'images/DigitalArt/Art_Showcase7.png', title: 'Poly work' },
            { src: 'images/DigitalArt/Art_Showcase8.png', title: 'Poly work' },
        ]
    },
    pixelart: {
        title: 'Pixel Art Collection',
        images: [
            { src: 'images/PixelArt/InFull.png', title: 'Game Menu' },
            { src: 'images/PixelArt/acorn_pixelart.png', title: 'Acorn Pixelart' },
            { src: 'images/PixelArt/boo_pixelart.png', title: 'Boo Pixelart' },
            { src: 'images/PixelArt/candle_pixelart.png', title: 'Candle Pixelart' },
            { src: 'images/PixelArt/cottoncandy_pixelart.png', title: 'Cotton Candy Pixelart' },
            { src: 'images/PixelArt/eyeball_pixelart.png', title: 'Eyeball Pixelart' },
            { src: 'images/PixelArt/ghost_pixelart.png', title: 'Ghost Pixelart' },
            { src: 'images/PixelArt/invitationcard_pixelart.png', title: 'Invitation Card Pixelart' },
            { src: 'images/PixelArt/lantern_pixelart.png', title: 'Lantern Pixelart' },
            { src: 'images/PixelArt/mask_pixelart.png', title: 'Mask Pixelart' },
            { src: 'images/PixelArt/monster_pixelart.png', title: 'Monster Pixelart' },
            { src: 'images/PixelArt/owl_pixelart.png', title: 'Owl Pixelart' },
            { src: 'images/PixelArt/potion_pixelart.png', title: 'Potion Pixelart' },
            { src: 'images/PixelArt/sunflower_pixelart.png', title: 'Sunflower Pixelart' },
            { src: 'images/PixelArt/tree_pixelart.png', title: 'Tree Pixelart' },
            { src: 'images/PixelArt/Items.png', title: 'Items Pixelart' },
            { src: 'images/PixelArt/MiniBoss.png', title: 'Miniboss Pixelart' },
            { src: 'images/PixelArt/Parachute.png', title: 'Supply drop Pixelart' },
            { src: 'images/PixelArt/Player.png', title: 'Player Pixelart' },
            { src: 'images/PixelArt/Player1_Dead.png', title: 'Player death Pixelart' },
            { src: 'images/PixelArt/Player2_Dead.png', title: 'Player 2 death Pixelart' },
            { src: 'images/PixelArt/SpriteSheet.png', title: 'SpriteSheet Pixelart' },
        ]
    }
};

function openArtGallery(type) {
    const collection = artCollections[type];
    galleryTitle.textContent = collection.title;
    let currentImageIndex = 0;

    // Clear existing thumbnails
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    thumbnailContainer.innerHTML = '';

    // Add navigation arrows to main-image-container
    const mainImageContainer = document.querySelector('.main-image-container');
    mainImageContainer.innerHTML = `
        <button class="nav-arrow prev-arrow">&lt;</button>
        <img id="mainImage" src="" alt="Main Image">
        <button class="nav-arrow next-arrow">&gt;</button>
        <div class="image-caption" id="mainImageCaption"></div>
    `;

    const mainImage = document.getElementById('mainImage');
    const mainImageCaption = document.getElementById('mainImageCaption');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');

    function updateImage(index) {
        currentImageIndex = index;
        const img = collection.images[index];
        mainImage.src = img.src;
        mainImage.alt = img.title;
        mainImageCaption.textContent = img.title;

        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
            if (i === index) {
                thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    // Add thumbnails
    collection.images.forEach((img, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        thumbnail.innerHTML = `<img src="${img.src}" alt="${img.title}">`;

        if (index === 0) thumbnail.classList.add('active');

        thumbnail.addEventListener('click', () => updateImage(index));
        thumbnailContainer.appendChild(thumbnail);
    });

    // Set initial image
    updateImage(0);

    // Navigation arrow handlers
    prevArrow.addEventListener('click', () => {
        const newIndex = (currentImageIndex - 1 + collection.images.length) % collection.images.length;
        updateImage(newIndex);
    });

    nextArrow.addEventListener('click', () => {
        const newIndex = (currentImageIndex + 1) % collection.images.length;
        updateImage(newIndex);
    });

    // Keyboard navigation
    const handleKeydown = function (e) {
        if (!artGalleryModal.classList.contains('active')) return;

        switch (e.key) {
            case 'ArrowLeft':
                prevArrow.click();
                break;
            case 'ArrowRight':
                nextArrow.click();
                break;
            case 'Escape':
                closeModal();
                break;
        }
    };
    
    // Remove existing event listener if any to prevent duplicates (though here we are creating fresh)
    document.removeEventListener('keydown', handleKeydown);
    document.addEventListener('keydown', handleKeydown);

    artGalleryModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Store the handler so we can remove it later if needed (optional optimization)
    artGalleryModal.dataset.keydownHandler = 'active';
}

function closeModal() {
    artGalleryModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', closeModal);
});

// Close on outside click
window.addEventListener('click', (e) => {
    if (e.target === artGalleryModal) {
        closeModal();
    }
});
