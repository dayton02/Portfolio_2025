// Project filtering and search functionality
class ProjectFilter {
    constructor() {
        this.projects = [];
        this.filteredProjects = []
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.sortBy = 'date';
        this.init();
    }

    init() {
        this.setupProjectData();
        this.createFilterUI();
        this.bindEvents();
        this.renderProjects();
    }

    setupProjectData() {
        // Extract project data from existing HTML
        this.projects = [];
        
        // Get all project cards from the page
        document.querySelectorAll('.project-card').forEach((card, index) => {
            const title = card.querySelector('h3')?.textContent || '';
            const description = card.querySelector('p')?.textContent || '';
            const tech = Array.from(card.querySelectorAll('.project-card-tech span')).map(span => span.textContent);
            const category = this.determineCategory(title, tech);
            const image = card.querySelector('img')?.src || '';
            const link = card.href || '#';
            
            this.projects.push({
                id: index,
                title,
                description,
                tech,
                category,
                image,
                link,
                date: this.generateDate(index),
                featured: index < 3 // First 3 projects are featured
            });
        });
        
        this.filteredProjects = [...this.projects];
    }

    determineCategory(title, tech) {
        const titleLower = title.toLowerCase();
        const techLower = tech.map(t => t.toLowerCase());
        
        if (titleLower.includes('game') || techLower.some(t => ['unity', 'c++', 'c#', 'cprocessing'].includes(t))) {
            return 'games';
        } else if (techLower.some(t => ['blender'].includes(t))) {
            return '3d-models';
        } else if (techLower.some(t => ['krita', 'gimp', 'photoshop', 'procreate', 'aseprite'].includes(t))) {
            return '2d-art';
        }
        
        return 'other';
    }

    generateDate(index) {
        // Generate realistic dates for sorting
        const dates = [
            '2024-01-15', '2024-02-20', '2024-03-10', '2024-04-05', '2024-05-12',
            '2024-06-08', '2024-07-22', '2024-08-15', '2024-09-03', '2024-10-18',
            '2024-11-07', '2024-12-01'
        ];
        return dates[index % dates.length];
    }

    createFilterUI() {
        // Create filter container if it doesn't exist
        if (document.querySelector('.project-filter-container')) return;
        
        const projectsSection = document.querySelector('#projects-grid') || document.querySelector('.projects-grid-container');
        if (!projectsSection) return;
        
        const filterContainer = document.createElement('div');
        filterContainer.className = 'project-filter-container';
        filterContainer.innerHTML = `
            <div class="filter-header">
                <div class="search-container">
                    <input type="text" id="project-search" placeholder="Search projects..." autocomplete="off">
                    <i class="fas fa-search search-icon"></i>
                    <button class="clear-search" id="clear-search" style="display: none;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="filter-controls">
                    <div class="filter-buttons">
                        <button class="filter-btn active" data-filter="all">All Projects</button>
                        <button class="filter-btn" data-filter="games">Games</button>
                        <button class="filter-btn" data-filter="3d-models">3D Models</button>
                        <button class="filter-btn" data-filter="2d-art">2D Art</button>
                    </div>
                    <div class="sort-container">
                        <select id="sort-select">
                            <option value="date">Sort by Date</option>
                            <option value="title">Sort by Title</option>
                            <option value="tech">Sort by Technology</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="filter-stats">
                <span id="project-count">Showing ${this.projects.length} projects</span>
                <span id="filter-status"></span>
            </div>
        `;
        
        projectsSection.insertBefore(filterContainer, projectsSection.firstChild);
    }

    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('project-search');
        const clearSearchBtn = document.getElementById('clear-search');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                clearSearchBtn.style.display = this.searchTerm ? 'block' : 'none';
                this.filterAndRender();
            });
        }
        
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                this.searchTerm = '';
                searchInput.value = '';
                clearSearchBtn.style.display = 'none';
                this.filterAndRender();
            });
        }
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.filterAndRender();
            });
        });
        
        // Sort functionality
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.filterAndRender();
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                searchInput?.focus();
            }
        });
    }

    filterProjects() {
        this.filteredProjects = this.projects.filter(project => {
            const matchesCategory = this.currentFilter === 'all' || project.category === this.currentFilter;
            const matchesSearch = !this.searchTerm || 
                project.title.toLowerCase().includes(this.searchTerm) ||
                project.description.toLowerCase().includes(this.searchTerm) ||
                project.tech.some(tech => tech.toLowerCase().includes(this.searchTerm));
            
            return matchesCategory && matchesSearch;
        });
        
        // Sort projects
        this.sortProjects();
    }

    sortProjects() {
        switch (this.sortBy) {
            case 'title':
                this.filteredProjects.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'tech':
                this.filteredProjects.sort((a, b) => a.tech[0]?.localeCompare(b.tech[0] || '') || 0);
                break;
            case 'date':
            default:
                this.filteredProjects.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
        }
    }

    filterAndRender() {
        this.filterProjects();
        this.renderProjects();
        this.updateStats();
        this.animateProjectCards();
    }

    renderProjects() {
        // Create or update project grid container
        let gridContainer = document.querySelector('.filtered-projects-grid');
        if (!gridContainer) {
            gridContainer = document.createElement('div');
            gridContainer.className = 'filtered-projects-grid';
            
            // Insert after filter container
            const filterContainer = document.querySelector('.project-filter-container');
            filterContainer.parentNode.insertBefore(gridContainer, filterContainer.nextSibling);
        }
        
        // Clear existing content
        gridContainer.innerHTML = '';
        
        if (this.filteredProjects.length === 0) {
            gridContainer.innerHTML = `
                <div class="no-projects-found">
                    <i class="fas fa-search"></i>
                    <h3>No projects found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }
        
        // Render project cards
        this.filteredProjects.forEach((project, index) => {
            const card = this.createProjectCard(project, index);
            gridContainer.appendChild(card);
        });
    }

    createProjectCard(project, index) {
        const card = document.createElement('a');
        card.href = project.link;
        card.className = 'project-card filtered-card';
        card.dataset.category = project.category;
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="project-card-content">
                <div class="project-image-container">
                    <img data-lazy="${project.image}" alt="${project.title}" class="lazy-project-image">
                    <div class="project-overlay">
                        <span class="project-category-badge">${this.formatCategory(project.category)}</span>
                        <span class="project-date">${this.formatDate(project.date)}</span>
                    </div>
                </div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-card-tech">
                        ${project.tech.map(tech => `<span>${tech}</span>`).join('')}
                    </div>
                </div>
                <div class="project-card-footer">
                    <span class="view-project">View Project <i class="fas fa-arrow-right"></i></span>
                </div>
            </div>
        `;
        
        // Add featured badge if featured
        if (project.featured) {
            card.classList.add('featured');
            card.innerHTML = card.innerHTML.replace(
                '<div class="project-card-content">',
                '<div class="project-card-content"><div class="featured-badge"><i class="fas fa-star"></i> Featured</div>'
            );
        }
        
        return card;
    }

    animateProjectCards() {
        // Animate cards appearing
        const cards = document.querySelectorAll('.filtered-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    updateStats() {
        const projectCount = document.getElementById('project-count');
        const filterStatus = document.getElementById('filter-status');
        
        if (projectCount) {
            projectCount.textContent = `Showing ${this.filteredProjects.length} of ${this.projects.length} projects`;
        }
        
        if (filterStatus) {
            let status = '';
            if (this.searchTerm) {
                status += `Searching: "${this.searchTerm}"`;
            }
            if (this.currentFilter !== 'all') {
                status += (status ? ' • ' : '') + `Category: ${this.formatCategory(this.currentFilter)}`;
            }
            filterStatus.textContent = status;
        }
    }

    formatCategory(category) {
        return category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short' 
        });
    }

    // Utility method to add new projects dynamically
    addProject(projectData) {
        this.projects.push({
            ...projectData,
            id: this.projects.length,
            date: projectData.date || new Date().toISOString().split('T')[0],
            featured: projectData.featured || false
        });
        this.filterAndRender();
    }

    // Method to export filtered results
    exportResults(format = 'json') {
        const data = this.filteredProjects.map(project => ({
            title: project.title,
            description: project.description,
            technology: project.tech,
            category: project.category,
            date: project.date
        }));

        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        } else if (format === 'csv') {
            const headers = ['Title', 'Description', 'Technology', 'Category', 'Date'];
            const rows = data.map(p => [
                p.title, p.description, p.technology.join(', '), p.category, p.date
            ]);
            return [headers, ...rows].map(row => row.join(',')).join('\n');
        }
    }
}

// CSS for the filter interface
const addFilterStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .project-filter-container {
            margin-bottom: 3rem;
            padding: 2rem;
            background: rgba(19, 17, 28, 0.6);
            border-radius: 16px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(132, 94, 247, 0.2);
        }

        .filter-header {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .search-container {
            position: relative;
            max-width: 400px;
        }

        #project-search {
            width: 100%;
            padding: 1rem 3rem 1rem 1rem;
            background: rgba(19, 17, 28, 0.8);
            border: 2px solid rgba(132, 94, 247, 0.3);
            border-radius: 12px;
            color: var(--text-primary);
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        #project-search:focus {
            outline: none;
            border-color: var(--primary-purple);
            box-shadow: 0 0 0 4px rgba(132, 94, 247, 0.1);
        }

        .search-icon {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.6);
            pointer-events: none;
        }

        .clear-search {
            position: absolute;
            right: 3rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            transition: all 0.3s ease;
        }

        .clear-search:hover {
            color: var(--text-primary);
            background: rgba(132, 94, 247, 0.1);
        }

        .filter-controls {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            align-items: center;
        }

        .filter-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .filter-btn {
            padding: 0.75rem 1.5rem;
            background: rgba(19, 17, 28, 0.8);
            border: 2px solid rgba(132, 94, 247, 0.3);
            border-radius: 25px;
            color: var(--text-primary);
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            font-weight: 500;
        }

        .filter-btn:hover {
            border-color: var(--primary-purple);
            transform: translateY(-2px);
        }

        .filter-btn.active {
            background: var(--gradient-primary);
            border-color: var(--primary-purple);
            box-shadow: var(--shadow-primary);
        }

        #sort-select {
            padding: 0.75rem 1rem;
            background: rgba(19, 17, 28, 0.8);
            border: 2px solid rgba(132, 94, 247, 0.3);
            border-radius: 8px;
            color: var(--text-primary);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        #sort-select:focus {
            outline: none;
            border-color: var(--primary-purple);
        }

        .filter-stats {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1rem;
            border-top: 1px solid rgba(132, 94, 247, 0.2);
            font-size: 0.9rem;
            color: var(--text-secondary);
        }

        .filtered-projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .filtered-card {
            background: rgba(19, 17, 28, 0.6);
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.3s ease;
            border: 1px solid rgba(132, 94, 247, 0.2);
            text-decoration: none;
            color: inherit;
        }

        .filtered-card:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-secondary);
            border-color: var(--primary-purple);
        }

        .filtered-card.featured {
            border: 2px solid var(--primary-purple);
            box-shadow: 0 0 20px rgba(132, 94, 247, 0.3);
        }

        .featured-badge {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: var(--gradient-primary);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 2;
        }

        .project-image-container {
            position: relative;
            overflow: hidden;
        }

        .lazy-project-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            transition: transform 0.3s ease;
        }

        .filtered-card:hover .lazy-project-image {
            transform: scale(1.05);
        }

        .project-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(132, 94, 247, 0.1), rgba(177, 151, 252, 0.1));
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 1rem;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .filtered-card:hover .project-overlay {
            opacity: 1;
        }

        .project-category-badge {
            background: rgba(19, 17, 28, 0.9);
            color: var(--text-primary);
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 500;
            backdrop-filter: blur(10px);
        }

        .project-date {
            background: rgba(19, 17, 28, 0.9);
            color: var(--text-secondary);
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.75rem;
            backdrop-filter: blur(10px);
        }

        .no-projects-found {
            grid-column: 1 / -1;
            text-align: center;
            padding: 4rem 2rem;
            background: rgba(19, 17, 28, 0.4);
            border-radius: 16px;
            border: 2px dashed rgba(132, 94, 247, 0.3);
        }

        .no-projects-found i {
            font-size: 3rem;
            color: var(--primary-purple);
            margin-bottom: 1rem;
            opacity: 0.7;
        }

        .no-projects-found h3 {
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }

        .no-projects-found p {
            color: var(--text-secondary);
        }

        @media (max-width: 768px) {
            .filter-header {
                gap: 1rem;
            }
            
            .filter-controls {
                flex-direction: column;
                align-items: stretch;
            }
            
            .filter-buttons {
                justify-content: center;
            }
            
            .search-container {
                max-width: none;
            }
            
            .filtered-projects-grid {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }
            
            .filter-stats {
                flex-direction: column;
                gap: 0.5rem;
                text-align: center;
            }
        }
    `;
    document.head.appendChild(style);
};

// Initialize the project filter
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        addFilterStyles();
        window.projectFilter = new ProjectFilter();
    });
} else {
    addFilterStyles();
    window.projectFilter = new ProjectFilter();
}