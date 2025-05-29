// Blog Post JavaScript

// Mobile navigation toggle (reused from main site)
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Reading progress indicator
    createReadingProgress();
    
    // Table of contents
    createTableOfContents();
    
    // Share functionality
    setupShareButtons();
    
    // Copy code blocks
    setupCodeCopyButtons();
    
    // Image zoom functionality
    setupImageZoom();
});

// Reading progress indicator
function createReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
    document.body.appendChild(progressBar);

    const progressFill = progressBar.querySelector('.reading-progress-fill');
    
    window.addEventListener('scroll', () => {
        const article = document.querySelector('.post-article');
        if (!article) return;

        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;

        const start = articleTop - windowHeight / 2;
        const end = articleTop + articleHeight - windowHeight / 2;
        const progress = Math.max(0, Math.min(1, (scrollTop - start) / (end - start)));

        progressFill.style.width = `${progress * 100}%`;
    });

    // Add CSS for reading progress
    const style = document.createElement('style');
    style.textContent = `
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(59, 130, 246, 0.2);
            z-index: 1001;
        }
        .reading-progress-fill {
            height: 100%;
            background: #3b82f6;
            width: 0%;
            transition: width 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Table of contents
function createTableOfContents() {
    const headings = document.querySelectorAll('.post-article h2, .post-article h3');
    if (headings.length < 3) return; // Only create TOC if there are enough headings

    const toc = document.createElement('div');
    toc.className = 'table-of-contents';
    toc.innerHTML = '<h4>Table of Contents</h4><ul class="toc-list"></ul>';
    
    const tocList = toc.querySelector('.toc-list');
    
    headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        
        const li = document.createElement('li');
        li.className = heading.tagName.toLowerCase() === 'h2' ? 'toc-h2' : 'toc-h3';
        
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = heading.textContent;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth' });
        });
        
        li.appendChild(a);
        tocList.appendChild(li);
    });

    // Insert TOC after the lead paragraph
    const leadParagraph = document.querySelector('.lead');
    if (leadParagraph) {
        leadParagraph.parentNode.insertBefore(toc, leadParagraph.nextSibling);
    }

    // Add CSS for TOC
    const style = document.createElement('style');
    style.textContent = `
        .table-of-contents {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 1.5rem;
            margin: 2rem 0;
            max-width: 400px;
        }
        .table-of-contents h4 {
            margin: 0 0 1rem 0 !important;
            color: #1e293b !important;
            font-size: 1.1rem !important;
        }
        .toc-list {
            list-style: none;
            padding: 0 !important;
            margin: 0 !important;
        }
        .toc-list li {
            margin: 0.5rem 0 !important;
        }
        .toc-h3 {
            padding-left: 1rem;
        }
        .toc-list a {
            color: #3b82f6;
            text-decoration: none;
            font-size: 0.95rem;
            transition: color 0.3s ease;
        }
        .toc-list a:hover {
            color: #2563eb;
            text-decoration: underline;
        }
        @media (max-width: 768px) {
            .table-of-contents {
                max-width: 100%;
            }
        }
    `;
    document.head.appendChild(style);
}

// Share functionality
function setupShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    const pageUrl = window.location.href;
    const pageTitle = document.querySelector('.post-title').textContent;
    
    shareButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            let shareUrl = '';
            if (btn.classList.contains('twitter')) {
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle)}&url=${encodeURIComponent(pageUrl)}`;
            } else if (btn.classList.contains('linkedin')) {
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
            } else if (btn.classList.contains('facebook')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// Copy code blocks
function setupCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('.code-block pre');
    
    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.innerHTML = '<i class="fas fa-copy"></i>';
        button.title = 'Copy code';
        
        button.addEventListener('click', async () => {
            const code = block.textContent;
            try {
                await navigator.clipboard.writeText(code);
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.style.background = '#10b981';
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-copy"></i>';
                    button.style.background = '#6b7280';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy code:', err);
            }
        });
        
        block.parentElement.style.position = 'relative';
        block.parentElement.appendChild(button);
    });

    // Add CSS for copy buttons
    const style = document.createElement('style');
    style.textContent = `
        .copy-code-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: #6b7280;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: background 0.3s ease;
        }
        .copy-code-btn:hover {
            background: #4b5563;
        }
    `;
    document.head.appendChild(style);
}

// Image zoom functionality
function setupImageZoom() {
    const images = document.querySelectorAll('.post-article img');
    
    images.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            createImageModal(img);
        });
    });
}

function createImageModal(img) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-backdrop">
            <div class="image-modal-content">
                <button class="image-modal-close">&times;</button>
                <img src="${img.src}" alt="${img.alt || ''}" />
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    const closeModal = () => {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    };
    
    modal.querySelector('.image-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.image-modal-backdrop').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
    });
    
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    });

    // Add CSS for image modal
    if (!document.querySelector('#image-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'image-modal-styles';
        style.textContent = `
            .image-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
                animation: fadeIn 0.3s ease;
            }
            .image-modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }
            .image-modal-content {
                position: relative;
                max-width: 90vw;
                max-height: 90vh;
            }
            .image-modal-content img {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 8px;
            }
            .image-modal-close {
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Scroll to top button
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.title = 'Scroll to top';
    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add CSS for scroll to top button
    const style = document.createElement('style');
    style.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            transition: all 0.3s ease;
            opacity: 0;
            visibility: hidden;
            z-index: 1000;
        }
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        .scroll-to-top:hover {
            background: #2563eb;
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
});
