document.addEventListener('DOMContentLoaded', () => {
    // Role Switching Animation
    const roles = document.querySelectorAll('.role');
    if (roles.length > 0) {
        let currentRole = 0;

        function switchRole() {
            roles[currentRole].classList.remove('current');
            currentRole = (currentRole + 1) % roles.length;
            roles[currentRole].classList.add('current');
        }

        setInterval(switchRole, 3000);
    }

    // Floating Elements Animation
    const floatingElements = document.querySelectorAll('.float-item');
    
    floatingElements.forEach(element => {
        element.style.animationDelay = `${Math.random() * 2}s`;
    });

    const statusEl = document.querySelector('.availability-status');
    if (statusEl) {
        const noteEl = document.querySelector('.availability-note');
        const cur = statusEl.getAttribute('data-status') || 'open';
        statusEl.textContent = cur === 'open' ? 'Open' : 'Busy';
        if (noteEl) noteEl.textContent = cur === 'open' ? 'Open for interview' : 'Currently unavailable';
    }
});