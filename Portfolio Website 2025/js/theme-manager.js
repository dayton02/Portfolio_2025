// Dark/Light theme toggle functionality
class ThemeManager {
    constructor() {
        this.currentTheme = 'dark';
        this.themes = {
            dark: {
                '--bg-primary': '#13111c',
                '--bg-secondary': '#1a1a2e',
                '--text-primary': '#ffffff',
                '--text-secondary': '#b8b8b8',
                '--primary-purple': '#845EF7',
                '--secondary-purple': '#B197FC',
                '--gradient-primary': 'linear-gradient(135deg, #845EF7, #B197FC)',
                '--gradient-secondary': 'linear-gradient(135deg, #B197FC, #845EF7)',
                '--shadow-primary': '0 4px 20px rgba(132, 94, 247, 0.3)',
                '--shadow-secondary': '0 8px 40px rgba(132, 94, 247, 0.4)',
                '--glass-bg': 'rgba(19, 17, 28, 0.6)',
                '--glass-border': 'rgba(132, 94, 247, 0.2)',
                '--terminal-bg': '#1a1a2e',
                '--terminal-border': '#333',
                '--form-bg': 'rgba(19, 17, 28, 0.6)',
                '--form-border': 'rgba(132, 94, 247, 0.2)',
                '--card-bg': 'rgba(19, 17, 28, 0.6)',
                '--card-border': 'rgba(132, 94, 247, 0.2)'
            },
            light: {
                '--bg-primary': '#ffffff',
                '--bg-secondary': '#f8f9fa',
                '--text-primary': '#1a1a1a',
                '--text-secondary': '#6c757d',
                '--primary-purple': '#6f42c1',
                '--secondary-purple': '#8e44ad',
                '--gradient-primary': 'linear-gradient(135deg, #6f42c1, #8e44ad)',
                '--gradient-secondary': 'linear-gradient(135deg, #8e44ad, #6f42c1)',
                '--shadow-primary': '0 4px 20px rgba(111, 66, 193, 0.15)',
                '--shadow-secondary': '0 8px 40px rgba(111, 66, 193, 0.2)',
                '--glass-bg': 'rgba(255, 255, 255, 0.8)',
                '--glass-border': 'rgba(111, 66, 193, 0.15)',
                '--terminal-bg': '#f8f9fa',
                '--terminal-border': '#dee2e6',
                '--form-bg': 'rgba(255, 255, 255, 0.9)',
                '--form-border': 'rgba(111, 66, 193, 0.2)',
                '--card-bg': 'rgba(255, 255, 255, 0.9)',
                '--card-border': 'rgba(111, 66, 193, 0.15)'
            },
            neon: {
                '--bg-primary': '#0a0a0a',
                '--bg-secondary': '#1a0a1a',
                '--text-primary': '#00ff41',
                '--text-secondary': '#00cc33',
                '--primary-purple': '#ff00ff',
                '--secondary-purple': '#00ffff',
                '--gradient-primary': 'linear-gradient(135deg, #ff00ff, #00ffff)',
                '--gradient-secondary': 'linear-gradient(135deg, #00ffff, #ff00ff)',
                '--shadow-primary': '0 4px 20px rgba(255, 0, 255, 0.5)',
                '--shadow-secondary': '0 8px 40px rgba(0, 255, 255, 0.4)',
                '--glass-bg': 'rgba(10, 10, 10, 0.8)',
                '--glass-border': 'rgba(255, 0, 255, 0.3)',
                '--terminal-bg': '#0a0a0a',
                '--terminal-border': '#ff00ff',
                '--form-bg': 'rgba(10, 10, 10, 0.9)',
                '--form-border': 'rgba(0, 255, 255, 0.3)',
                '--card-bg': 'rgba(10, 10, 10, 0.8)',
                '--card-border': 'rgba(255, 0, 255, 0.3)'
            }
        };
        
        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.createThemeToggle();
        this.bindEvents();
        this.applyTheme(this.currentTheme);
        this.setupAutoTheme();
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme && this.themes[savedTheme]) {
            this.currentTheme = savedTheme;
        } else {
            // Auto-detect based on system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.currentTheme = prefersDark ? 'dark' : 'light';
        }
    }

    createThemeToggle() {
        // Create theme toggle button
        const themeToggle = document.createElement('div');
        themeToggle.className = 'theme-toggle-container';
        themeToggle.innerHTML = `
            <button class="theme-toggle-btn" id="theme-toggle" aria-label="Toggle theme">
                <span class="theme-icon">
                    <i class="fas fa-sun light-icon"></i>
                    <i class="fas fa-moon dark-icon"></i>
                    <i class="fas fa-bolt neon-icon"></i>
                </span>
            </button>
            <div class="theme-dropdown" id="theme-dropdown">
                <button class="theme-option" data-theme="light">
                    <i class="fas fa-sun"></i>
                    <span>Light</span>
                </button>
                <button class="theme-option" data-theme="dark">
                    <i class="fas fa-moon"></i>
                    <span>Dark</span>
                </button>
                <button class="theme-option" data-theme="neon">
                    <i class="fas fa-bolt"></i>
                    <span>Neon</span>
                </button>
                <div class="theme-separator"></div>
                <button class="theme-option auto-theme" data-theme="auto">
                    <i class="fas fa-desktop"></i>
                    <span>Auto</span>
                </button>
            </div>
        `;
        
        // Add to navigation
        const navContainer = document.querySelector('.nav-container') || document.querySelector('nav');
        if (navContainer) {
            navContainer.appendChild(themeToggle);
        }
        
        // Create theme transition overlay
        const transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'theme-transition-overlay';
        document.body.appendChild(transitionOverlay);
    }

    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeDropdown = document.getElementById('theme-dropdown');
        
        // Toggle dropdown
        themeToggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            themeDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            themeDropdown.classList.remove('active');
        });
        
        // Theme selection
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const theme = option.dataset.theme;
                if (theme === 'auto') {
                    this.setAutoTheme();
                } else {
                    this.setTheme(theme);
                }
                themeDropdown.classList.remove('active');
            });
        });
        
        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.cycleTheme();
            }
        });
        
        // System theme change listener
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (localStorage.getItem('portfolio-theme') === 'auto' || !localStorage.getItem('portfolio-theme')) {
                this.setTheme(e.matches ? 'dark' : 'light', false);
            }
        });
    }

    setTheme(theme, save = true) {
        if (!this.themes[theme]) return;
        
        this.currentTheme = theme;
        this.applyTheme(theme);
        
        if (save) {
            localStorage.setItem('portfolio-theme', theme);
        }
        
        this.updateToggleIcon(theme);
        this.dispatchThemeChange(theme);
    }

    applyTheme(theme) {
        const root = document.documentElement;
        const themeColors = this.themes[theme];
        
        // Apply CSS custom properties
        Object.entries(themeColors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
        
        // Update body class for theme-specific styles
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${theme}`);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(themeColors['--primary-purple']);
    }

    updateMetaThemeColor(color) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = color;
    }

    updateToggleIcon(theme) {
        const toggle = document.getElementById('theme-toggle');
        if (!toggle) return;
        
        toggle.className = `theme-toggle-btn theme-${theme}`;
        
        // Update ARIA label
        toggle.setAttribute('aria-label', `Current theme: ${theme}. Click to change.`);
    }

    cycleTheme() {
        const themes = ['light', 'dark', 'neon'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.setTheme(themes[nextIndex]);
    }

    setAutoTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const autoTheme = prefersDark ? 'dark' : 'light';
        this.setTheme(autoTheme, false);
        localStorage.setItem('portfolio-theme', 'auto');
    }

    setupAutoTheme() {
        // Check if auto theme should be applied
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme === 'auto' || !savedTheme) {
            this.setAutoTheme();
        }
    }

    dispatchThemeChange(theme) {
        // Dispatch custom event for other components to listen to
        const event = new CustomEvent('themeChanged', {
            detail: { theme, colors: this.themes[theme] }
        });
        document.dispatchEvent(event);
    }

    // Add smooth theme transition
    transitionTheme(newTheme, duration = 500) {
        const overlay = document.querySelector('.theme-transition-overlay');
        if (!overlay) return;
        
        overlay.style.transition = `opacity ${duration}ms ease`;
        overlay.style.opacity = '1';
        
        setTimeout(() => {
            this.setTheme(newTheme);
            overlay.style.opacity = '0';
        }, duration / 2);
    }

    // Get current theme colors
    getCurrentThemeColors() {
        return this.themes[this.currentTheme];
    }

    // Check if current theme is dark
    isDarkTheme() {
        return this.currentTheme === 'dark' || this.currentTheme === 'neon';
    }

    // Export theme configuration
    exportThemeConfig() {
        return {
            current: this.currentTheme,
            themes: this.themes,
            systemPreference: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        };
    }
}

// CSS for theme toggle
const addThemeStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .theme-toggle-container {
            position: relative;
            margin-left: auto;
            display: flex;
            align-items: center;
        }

        .theme-toggle-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--glass-bg);
            border: 2px solid var(--glass-border);
            color: var(--text-primary);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            position: relative;
            overflow: hidden;
        }

        .theme-toggle-btn:hover {
            transform: scale(1.1);
            box-shadow: var(--shadow-primary);
            border-color: var(--primary-purple);
        }

        .theme-toggle-btn.theme-light .light-icon,
        .theme-toggle-btn.theme-dark .dark-icon,
        .theme-toggle-btn.theme-neon .neon-icon {
            opacity: 1;
            transform: scale(1);
        }

        .theme-icon {
            position: relative;
            width: 24px;
            height: 24px;
        }

        .theme-icon i {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: all 0.3s ease;
        }

        .theme-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 0.5rem;
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 2px solid var(--glass-border);
            border-radius: 12px;
            padding: 0.5rem;
            min-width: 180px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: var(--shadow-secondary);
        }

        .theme-dropdown.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        .theme-option {
            width: 100%;
            padding: 0.75rem 1rem;
            background: none;
            border: none;
            color: var(--text-primary);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            border-radius: 8px;
            transition: all 0.2s ease;
            font-size: 0.9rem;
        }

        .theme-option:hover {
            background: rgba(132, 94, 247, 0.1);
            transform: translateX(5px);
        }

        .theme-option i {
            width: 16px;
            text-align: center;
        }

        .theme-separator {
            height: 1px;
            background: var(--glass-border);
            margin: 0.5rem 0;
        }

        .auto-theme {
            border-top: 1px solid var(--glass-border);
            margin-top: 0.5rem;
            padding-top: 0.75rem;
        }

        .theme-transition-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-primary);
            opacity: 0;
            pointer-events: none;
            z-index: 9999;
        }

        /* Theme-specific styles */
        .theme-light {
            --text-glow: 0 0 10px rgba(111, 66, 193, 0.3);
        }

        .theme-dark {
            --text-glow: 0 0 15px rgba(132, 94, 247, 0.4);
        }

        .theme-neon {
            --text-glow: 0 0 20px rgba(255, 0, 255, 0.6);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .theme-toggle-container {
                margin-left: 0;
                order: -1;
            }
            
            .theme-dropdown {
                right: auto;
                left: 0;
                min-width: 160px;
            }
            
            .theme-option {
                padding: 0.6rem 0.8rem;
                font-size: 0.85rem;
            }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
            .theme-toggle-btn {
                border-width: 3px;
            }
            
            .theme-option:hover {
                background: rgba(132, 94, 247, 0.2);
            }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            .theme-toggle-btn,
            .theme-option,
            .theme-dropdown {
                transition: none;
            }
        }
    `;
    document.head.appendChild(style);
};

// Initialize theme manager
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        addThemeStyles();
        window.themeManager = new ThemeManager();
    });
} else {
    addThemeStyles();
    window.themeManager = new ThemeManager();
}