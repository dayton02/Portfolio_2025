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

    // Terminal Typing Animation - Only if code-display exists and code-display.js hasn't run
    const codeDisplay = document.querySelector('.code-display');
    const codeDisplayJs = document.querySelector('#typing-code');
    
    if (codeDisplay && !codeDisplayJs) {
        const code = `class DaytonNg {
    private:
        string name = "Dayton Ng";
        string title = "Game Developer | Software Engineer";
        vector<string> skills = {
            "Unity", "Unreal", "C++", "C#"
        };
        bool hardWorker = true;
        bool eagerLearner = true;
        bool problemSolver = true;
        bool adaptable = true;
        bool isStudent = true;
        string currentJob = "Studying at Digipen SIT";
    public:
        bool isHireable() {
            if(isStudent) {
                return false;
            }
            return true;
        }
};`;

        let i = 0;
        function typeCode() {
            if (i < code.length) {
                codeDisplay.textContent += code.charAt(i);
                i++;
                setTimeout(typeCode, 20);
            } else if (typeof Prism !== 'undefined') {
                Prism.highlightElement(codeDisplay);
            }
        }

        // Start typing after initial commands
        setTimeout(typeCode, 1000);
    }

    // Floating Elements Animation
    const floatingElements = document.querySelectorAll('.float-item');
    
    floatingElements.forEach(element => {
        element.style.animationDelay = `${Math.random() * 2}s`;
    });
});