// Authentic blog and skills showcase functionality - keeping content real
class AuthenticBlogSkillsShowcase {
    constructor() {
        this.skills = this.loadRealSkillsData();
        this.init();
    }

    loadRealSkillsData() {
        // Using only the skills from your actual skills.html page
        return [
            {
                category: 'Programming Languages',
                skills: [
                    { name: 'C++', icon: 'devicon-cplusplus-plain', description: 'Primary language for game development and performance-critical applications' },
                    { name: 'C#', icon: 'devicon-csharp-plain', description: 'Used for Unity game development and .NET applications' }
                ]
            },
            {
                category: 'Game Development',
                skills: [
                    { name: 'Unity', icon: 'devicon-unity-original', description: 'Game engine for 2D/3D game development' },
                    { name: 'Unreal Engine', icon: 'devicon-unrealengine-original', description: 'Game engine for high-fidelity 3D games' }
                ]
            },
            {
                category: 'Tools & Technologies',
                skills: [
                    { name: 'Git Repo', icon: 'devicon-git-plain', description: 'Version control and collaboration' },
                    { name: 'Visual Studio', icon: 'devicon-visualstudio-plain', description: 'Integrated development environment' },
                    { name: 'Atom', icon: 'devicon-atom-original', description: 'Text editor for coding' }
                ]
            },
            {
                category: 'Design & Creative',
                skills: [
                    { name: 'Procreate', icon: 'fas fa-pencil-alt', description: 'Digital illustration and concept art' },
                    { name: 'Aseprite', icon: 'fas fa-paint-brush', description: 'Pixel art and animation creation' },
                    { name: 'Figma', icon: 'devicon-figma-plain', description: 'UI/UX design and prototyping' },
                    { name: 'Photoshop', icon: 'devicon-photoshop-plain', description: 'Digital art and photo editing' },
                    { name: 'GIMP', icon: 'devicon-gimp-plain', description: 'Open-source image editing' }
                ]
            },
            {
                category: 'Soft Skills',
                skills: [
                    { name: 'Team Leader', icon: 'fas fa-users', description: 'Leading and collaborating with development teams' },
                    { name: 'Problem Solver', icon: 'fas fa-lightbulb', description: 'Analyzing and solving complex technical challenges' },
                    { name: 'Critical Thinking', icon: 'fas fa-brain', description: 'Evaluating solutions and making informed decisions' },
                    { name: 'Adaptability', icon: 'fas fa-sync-alt', description: 'Adapting to new technologies and changing requirements' },
                    { name: 'Project Management', icon: 'fas fa-tasks', description: 'Planning and executing development projects' }
                ]
            }
        ];
    }

    init() {
        this.createAuthenticSkillsSection();
        this.createSimpleBlogSection();
        this.bindEvents();
        this.animateOnScroll();
    }

    createAuthenticSkillsSection() {
        const skillsSection = document.createElement('section');
        skillsSection.id = 'skills-showcase';
        skillsSection.className = 'skills-section';
        skillsSection.innerHTML = `
            <div class="skills-container">
                <div class="skills-header">
                    <h2>Technical Skills & Expertise</h2>
                    <p>The tools and technologies I work with in game development and creative projects</p>
                </div>
                
                <div class="skill-categories">
                    ${this.skills.map(category => `
                        <div class="skill-category" data-category="${category.category.toLowerCase().replace(/\s+/g, '-')}">
                            <h3>${category.category}</h3>
                            <div class="skills-grid">
                                ${category.skills.map(skill => this.createAuthenticSkillCard(skill)).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Insert after projects section or at the end of main content
        const insertPoint = document.querySelector('#projects-featured') || document.querySelector('#contact');
        if (insertPoint) {
            insertPoint.parentNode.insertBefore(skillsSection, insertPoint.nextSibling);
        } else {
            document.body.appendChild(skillsSection);
        }
    }

    createAuthenticSkillCard(skill) {
        return `
            <div class="skill-card" data-skill="${skill.name.toLowerCase().replace(/\s+/g, '-')}">
                <div class="skill-icon">
                    <i class="${skill.icon}"></i>
                </div>
                <div class="skill-info">
                    <h4>${skill.name}</h4>
                    <p class="skill-description">${skill.description}</p>
                </div>
            </div>
        `;
    }

    createSimpleBlogSection() {
        const blogSection = document.createElement('section');
        blogSection.id = 'blog-showcase';
        blogSection.className = 'blog-section';
        blogSection.innerHTML = `
            <div class="blog-container">
                <div class="blog-header">
                    <h2>Development Insights</h2>
                    <p>Thoughts on game development, creative process, and technology</p>
                </div>
                
                <div class="blog-content">
                    <div class="blog-intro">
                        <p>I occasionally write about my experiences in game development, sharing insights from projects and exploring new technologies. While I focus primarily on creating games, I'm always learning and documenting my journey.</p>
                    </div>
                    
                    <div class="blog-coming-soon">
                        <div class="coming-soon-content">
                            <i class="fas fa-pen-fancy"></i>
                            <h3>Writing in Progress</h3>
                            <p>I'm currently working on sharing my development experiences and insights. Check back soon for articles about game development, creative process, and lessons learned from my projects.</p>
                            <div class="blog-topics">
                                <span class="topic-tag">Game Development Process</span>
                                <span class="topic-tag">Unity Tips & Tricks</span>
                                <span class="topic-tag">2D Game Mechanics</span>
                                <span class="topic-tag">Creative Workflow</span>
                                <span class="topic-tag">Project Retrospectives</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="blog-contact">
                        <p>Interested in collaborating or discussing game development? Feel free to reach out!</p>
                        <a href="#contact" class="blog-contact-btn">Get in Touch</a>
                    </div>
                </div>
            </div>
        `;
        
        // Insert after skills section
        const skillsSection = document.querySelector('#skills-showcase');
        if (skillsSection) {
            skillsSection.parentNode.insertBefore(blogSection, skillsSection.nextSibling);
        } else {
            document.body.appendChild(blogSection);
        }
    }

    bindEvents() {
        // Simple hover effects for skill cards
        document.querySelectorAll('.skill-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('skill-hovered');
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('skill-hovered');
            });
        });

        // Smooth scroll to contact from blog section
        const contactBtn = document.querySelector('.blog-contact-btn');
        if (contactBtn) {
            contactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const contactSection = document.querySelector('#contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    animateOnScroll() {
        // Add intersection observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        // Observe skill cards and blog content
        document.querySelectorAll('.skill-card, .blog-content').forEach(el => {
            observer.observe(el);
        });
    }
}

// CSS for the authentic blog/skills showcase
const addAuthenticBlogSkillsStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .skills-section, .blog-section {
            padding: 5rem 0;
            background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
        }

        .skills-container, .blog-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        .skills-header, .blog-header {
            text-align: center;
            margin-bottom: 4rem;
        }

        .skills-header h2, .blog-header h2 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .skills-header p, .blog-header p {
            font-size: 1.1rem;
            color: var(--text-secondary);
            max-width: 600px;
            margin: 0 auto;
        }

        .skill-categories {
            display: flex;
            flex-direction: column;
            gap: 3rem;
        }

        .skill-category h3 {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            color: var(--text-primary);
            position: relative;
            padding-bottom: 0.5rem;
        }

        .skill-category h3::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 50px;
            height: 3px;
            background: var(--gradient-primary);
            border-radius: 2px;
        }

        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1.5rem;
        }

        .skill-card {
            background: var(--glass-bg);
            border-radius: 16px;
            padding: 1.5rem;
            backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border);
            transition: all 0.3s ease;
            cursor: pointer;
            text-align: center;
        }

        .skill-card:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-secondary);
            border-color: var(--primary-purple);
        }

        .skill-card.skill-hovered {
            transform: translateY(-5px);
            box-shadow: var(--shadow-primary);
        }

        .skill-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: var(--primary-purple);
            transition: transform 0.3s ease;
        }

        .skill-card:hover .skill-icon {
            transform: scale(1.1);
        }

        .skill-info h4 {
            font-size: 1.2rem;
            margin-bottom: 0.75rem;
            color: var(--text-primary);
        }

        .skill-description {
            font-size: 0.9rem;
            color: var(--text-secondary);
            line-height: 1.5;
            margin: 0;
        }

        .blog-content {
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
        }

        .blog-intro {
            font-size: 1.1rem;
            color: var(--text-secondary);
            line-height: 1.7;
            margin-bottom: 3rem;
            padding: 0 1rem;
        }

        .blog-coming-soon {
            background: var(--glass-bg);
            border-radius: 20px;
            padding: 3rem 2rem;
            backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border);
            margin-bottom: 3rem;
        }

        .coming-soon-content {
            text-align: center;
        }

        .coming-soon-content i {
            font-size: 4rem;
            color: var(--primary-purple);
            margin-bottom: 1.5rem;
            opacity: 0.8;
        }

        .coming-soon-content h3 {
            font-size: 1.8rem;
            margin-bottom: 1rem;
            color: var(--text-primary);
        }

        .coming-soon-content p {
            font-size: 1.1rem;
            color: var(--text-secondary);
            margin-bottom: 2rem;
            line-height: 1.6;
        }

        .blog-topics {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            justify-content: center;
            margin-top: 2rem;
        }

        .topic-tag {
            background: rgba(132, 94, 247, 0.1);
            color: var(--primary-purple);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .topic-tag:hover {
            background: var(--primary-purple);
            color: white;
            transform: translateY(-2px);
        }

        .blog-contact {
            background: rgba(132, 94, 247, 0.05);
            border-radius: 16px;
            padding: 2rem;
            border: 1px solid rgba(132, 94, 247, 0.2);
        }

        .blog-contact p {
            font-size: 1.1rem;
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
        }

        .blog-contact-btn {
            display: inline-block;
            background: var(--gradient-primary);
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: var(--shadow-primary);
        }

        .blog-contact-btn:hover {
            transform: translateY(-3px);
            box-shadow: var(--shadow-secondary);
        }

        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 768px) {
            .skills-grid {
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            }
            
            .skill-card {
                padding: 1.25rem;
            }
            
            .skill-icon {
                font-size: 2.5rem;
            }
            
            .blog-coming-soon {
                padding: 2rem 1.5rem;
            }
            
            .coming-soon-content i {
                font-size: 3rem;
            }
            
            .coming-soon-content h3 {
                font-size: 1.5rem;
            }
            
            .blog-topics {
                gap: 0.5rem;
            }
            
            .topic-tag {
                font-size: 0.8rem;
                padding: 0.4rem 0.8rem;
            }
        }

        @media (max-width: 480px) {
            .skills-grid {
                grid-template-columns: 1fr;
            }
            
            .skills-container, .blog-container {
                padding: 0 1rem;
            }
        }
    `;
    document.head.appendChild(style);
};

// Initialize the authentic blog/skills showcase
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        addAuthenticBlogSkillsStyles();
        window.authenticBlogSkillsShowcase = new AuthenticBlogSkillsShowcase();
    });
} else {
    addAuthenticBlogSkillsStyles();
    window.authenticBlogSkillsShowcase = new AuthenticBlogSkillsShowcase();
}