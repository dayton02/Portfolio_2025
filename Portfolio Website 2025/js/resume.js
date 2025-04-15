document.addEventListener('DOMContentLoaded', () => {
    // Initialize timeline navigation
    const timelineNodes = document.querySelectorAll('.timeline-node');
    let currentNodeIndex = 0;

    function updateActiveNode(index) {
        timelineNodes.forEach(node => node.classList.remove('active'));
        timelineNodes[index].classList.add('active');
        timelineNodes[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    document.querySelector('.timeline-nav.prev').addEventListener('click', () => {
        currentNodeIndex = Math.max(0, currentNodeIndex - 1);
        updateActiveNode(currentNodeIndex);
    });

    document.querySelector('.timeline-nav.next').addEventListener('click', () => {
        currentNodeIndex = Math.min(timelineNodes.length - 1, currentNodeIndex + 1);
        updateActiveNode(currentNodeIndex);
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