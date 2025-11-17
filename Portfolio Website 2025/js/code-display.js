document.addEventListener('DOMContentLoaded', () => {
    const codeElement = document.getElementById('typing-code');
    if (!codeElement) return;

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

    codeElement.textContent = code;
    if (typeof Prism !== 'undefined') {
        Prism.highlightElement(codeElement);
    }

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
});