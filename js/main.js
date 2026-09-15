document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    
    // Initialize theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    document.body.className = savedTheme;
    
    // Theme toggle click handler
    themeToggle.addEventListener('click', function() {
        if (document.body.classList.contains('light-mode')) {
            document.body.classList.replace('light-mode', 'dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            document.body.classList.replace('dark-mode', 'light-mode');
            localStorage.setItem('theme', 'light-mode');
        }
    });
    
    // Navigation click handler
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));
            
            // Show the corresponding section
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
            
            // Close mobile menu if open
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
            }
            
            // Smooth scroll to section
            window.scrollTo({
                top: document.getElementById(targetId).offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
    
    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', function() {
        navLinksContainer.classList.toggle('active');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('nav') && navLinksContainer.classList.contains('active')) {
            navLinksContainer.classList.remove('active');
        }
    });
    
    // Resume download handler
    document.getElementById('download-resume').addEventListener('click', function(e) {
        // Check if the file exists before attempting download
        const resumePath = 'assets/resume.pdf';
        
        // Optional: Add analytics tracking
        console.log('Resume download initiated');
        
        // The download attribute in HTML will handle the actual download
        // This event listener can be used for tracking or additional functionality
    });
    
    // Handle window resize to fix navigation issues
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinksContainer.classList.contains('active')) {
            navLinksContainer.classList.remove('active');
        }
    });
    
    // Blog functionality
    initializeBlogFunctionality();
    
    // Projects functionality
    initializeProjectsFunctionality();

    // Papers functionality
    loadPapers();

    // Updates functionality
    loadUpdates();
    
    // Initialize the page by activating the first navigation link
    navLinks[0].click();
});

// Blog functionality
function initializeBlogFunctionality() {
    // Load LinkedIn posts automatically
    loadLinkedInPosts();
}

async function loadLinkedInPosts() {
    try {
        const response = await fetch('./assets/linkedin-posts.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const linkedInPosts = await response.json();
        const blogPostsContainer = document.getElementById('blog-posts');
        
        linkedInPosts.forEach((post, index) => {
            const postElement = document.createElement('article');
            postElement.className = 'blog-post';
            postElement.dataset.postType = 'linkedin';
            postElement.dataset.linkedinIndex = index;
            
            postElement.innerHTML = `
                <h3 class="post-title">${post.name}</h3>
                <div class="post-meta">
                    <span class="post-date">${post.date}</span>
                    <span class="post-type">LinkedIn Post</span>
                </div>
                <div class="post-content">
                    <p>${post.description}</p>
                    <div class="linkedin-link-container">
                        <a href="${post.link}" target="_blank" class="linkedin-link">
                            <i class="fab fa-linkedin"></i>
                            View on LinkedIn
                        </a>
                    </div>
                </div>
            `;
            
            blogPostsContainer.appendChild(postElement);
        });
        console.log(`Loaded ${linkedInPosts.length} LinkedIn posts successfully`);
    } catch (error) {
        console.error('Error loading LinkedIn posts:', error);
        // Fallback: show a message that posts couldn't be loaded
        const blogPostsContainer = document.getElementById('blog-posts');
        blogPostsContainer.innerHTML = '<p>LinkedIn posts are being loaded. Please refresh the page if this persists.</p>';
    }
}

// Updates functionality
async function loadUpdates() {
    const updatesList = document.getElementById('updates-list');

    try {
        const response = await fetch('./assets/updates.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const updates = await response.json();

        updates.forEach(update => {
            const updateElement = document.createElement('div');
            updateElement.className = 'update-item';

            // Date and link are both optional
            const dateMarkup = update.date && update.date.trim() !== ''
                ? `<span class="update-date">${update.date}</span>`
                : '';
            const linkMarkup = update.link && update.link.trim() !== ''
                ? ` <a href="${update.link}" target="_blank" rel="noopener" class="update-link">${update.linkText && update.linkText.trim() !== '' ? update.linkText : 'Read more'}</a>`
                : '';

            updateElement.innerHTML = `
                <div class="update-header">
                    <h4 class="update-title">${update.title}</h4>
                    ${dateMarkup}
                </div>
                <p class="update-description">${update.description}${linkMarkup}</p>
            `;

            updatesList.appendChild(updateElement);
        });
        console.log(`Loaded ${updates.length} updates successfully`);
    } catch (error) {
        console.error('Error loading updates:', error);
        updatesList.innerHTML = '<p>Updates are being loaded. Please refresh the page if this persists.</p>';
    }
}

// Papers functionality
async function loadPapers() {
    const papersList = document.getElementById('papers-list');

    try {
        const response = await fetch('./assets/papers.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const papers = await response.json();

        papers.forEach(paper => {
            const paperElement = document.createElement('article');
            paperElement.className = 'paper-item';

            // Authors and venue are optional; only render the line if we have one of them
            const metaParts = [paper.authors, paper.venue].filter(part => part && part.trim() !== '');
            const metaMarkup = metaParts.length
                ? `<div class="paper-meta">${metaParts.map(part => `<span>${part}</span>`).join('')}</div>`
                : '';
            const takeawayMarkup = paper.takeaway && paper.takeaway.trim() !== ''
                ? `<p class="paper-takeaway">${paper.takeaway}</p>`
                : '';
            const linkMarkup = paper.link && paper.link.trim() !== ''
                ? `<a href="${paper.link}" target="_blank" rel="noopener" class="paper-link">
                       Read the paper <i class="fas fa-arrow-up-right-from-square"></i>
                   </a>`
                : '';

            paperElement.innerHTML = `
                <div class="paper-icon">
                    <i class="fas fa-file-lines"></i>
                </div>
                <div class="paper-info">
                    <h3>${paper.title}</h3>
                    ${metaMarkup}
                    ${takeawayMarkup}
                    ${linkMarkup}
                </div>
            `;

            papersList.appendChild(paperElement);
        });
        console.log(`Loaded ${papers.length} papers successfully`);
    } catch (error) {
        console.error('Error loading papers:', error);
        papersList.innerHTML = '<p>Papers are being loaded. Please refresh the page if this persists.</p>';
    }
}

// Projects functionality
async function initializeProjectsFunctionality() {
    await loadProjects();
}

async function loadProjects() {
    try {
        const response = await fetch('./assets/projects.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const projects = await response.json();
        const projectsList = document.getElementById('projects-list');
        
        projects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project-item';
            projectElement.dataset.link = project.link;
            
            projectElement.innerHTML = `
                <div class="project-icon">
                    <i class="fas fa-cog"></i>
                </div>
                <div class="project-info">
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                </div>
            `;
            
            // Add click functionality if link exists
            if (project.link && project.link.trim() !== '') {
                projectElement.style.cursor = 'pointer';
                projectElement.addEventListener('click', function() {
                    window.open(project.link, '_blank');
                });
            }
            
            projectsList.appendChild(projectElement);
        });
        console.log(`Loaded ${projects.length} projects successfully`);
    } catch (error) {
        console.error('Error loading projects:', error);
        // Fallback: show a message that projects couldn't be loaded
        const projectsList = document.getElementById('projects-list');
        projectsList.innerHTML = '<p>Projects are being loaded. Please refresh the page if this persists.</p>';
    }
}
