document.addEventListener('DOMContentLoaded', () => {
    const codeDisplay = document.querySelector('.code-display');
    const codeElement = document.getElementById('typing-code');

    if (!codeDisplay && !codeElement) return;

    // Define the code content with proper formatting
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

    // Use the appropriate element
    const targetElement = codeElement || codeDisplay;
    if (targetElement) {
        // Set initial code and highlight with preserved formatting
        targetElement.textContent = code;
        if (typeof Prism !== 'undefined') {
            Prism.highlightElement(targetElement);
        }

        // Add line highlighting on hover
        setTimeout(() => {
            const codeLines = document.querySelectorAll('.line-numbers-rows > span');
            codeLines.forEach(line => {
                line.addEventListener('mouseover', () => {
                    line.style.backgroundColor = 'rgba(177, 151, 252, 0.1)';
                });
                line.addEventListener('mouseout', () => {
                    line.style.backgroundColor = 'transparent';
                });
            });
        }, 100);
    }
});