document.addEventListener('DOMContentLoaded', () => {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    const timelineSection = document.querySelector('#experience-timeline');
    let currentNodeIndex = 0;
    let autoScrollInterval;

    function updateActiveNode(index) {
        timelineNodes.forEach(node => {
            node.classList.remove('active');
            node.style.opacity = '0.3';
        });
        timelineNodes[index].classList.add('active');
        timelineNodes[index].style.opacity = '1';
    }

    function startAutoScroll() {
        if (!autoScrollInterval) {
            autoScrollInterval = setInterval(() => {
                currentNodeIndex = (currentNodeIndex + 1) % timelineNodes.length;
                updateActiveNode(currentNodeIndex);
            }, 5000);
        }
    }

    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    }

    // Create intersection observer for timeline section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateActiveNode(currentNodeIndex);
                startAutoScroll();
            } else {
                stopAutoScroll();
            }
        });
    }, { threshold: 0.2 }); // Start when 20% of the section is visible

    observer.observe(timelineSection);

    // Pause auto-scroll on hover
    timelineNodes.forEach(node => {
        node.addEventListener('mouseenter', stopAutoScroll);
        node.addEventListener('mouseleave', () => {
            if (timelineSection.getBoundingClientRect().top < window.innerHeight) {
                startAutoScroll();
            }
        });
        
        node.addEventListener('click', () => {
            currentNodeIndex = Array.from(timelineNodes).indexOf(node);
            updateActiveNode(currentNodeIndex);
        });
    });

    // Achievement cards animation
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('.achievement-icon i').style.transform = 'scale(1.2) rotate(10deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.querySelector('.achievement-icon i').style.transform = 'scale(1) rotate(0)';
        });
    });
});