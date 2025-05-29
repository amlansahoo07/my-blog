// Sample blog posts data
const blogPosts = [
    {
        id: 1,
        title: "What are the differences between Visual Odometry, Visual-SLAM, and Structure-from-Motion (SfM)?",
        excerpt: "Understanding the key distinctions and applications of these computer vision techniques in robotics and 3D reconstruction.",
        category: "SLAM",
        date: "2025-05-29",
        readTime: "12 min read",
        url: "post.html"
    },
    {
        id: 2,
        title: "Getting Started with Web Development",
        excerpt: "A comprehensive guide to begin your journey in web development, covering the basics of HTML, CSS, and JavaScript.",
        category: "Web Dev",
        date: "2025-05-25",
        readTime: "5 min read"
    },
    {
        id: 2,
        title: "The Future of Artificial Intelligence",
        excerpt: "Exploring the latest trends and developments in AI technology and its impact on various industries.",
        category: "AI",
        date: "2025-05-20",
        readTime: "8 min read"
    },
    {
        id: 3,
        title: "Building Responsive Layouts",
        excerpt: "Learn how to create beautiful, responsive layouts that work perfectly across all devices and screen sizes.",
        category: "CSS",
        date: "2025-05-15",
        readTime: "6 min read"
    },
    {
        id: 4,
        title: "JavaScript ES6+ Features",
        excerpt: "A deep dive into modern JavaScript features that every developer should know and use in their projects.",
        category: "JavaScript",
        date: "2025-05-10",
        readTime: "7 min read"
    },
    {
        id: 5,
        title: "Design Principles for Developers",
        excerpt: "Understanding fundamental design principles that can help developers create more intuitive user interfaces.",
        category: "Design",
        date: "2025-05-05",
        readTime: "4 min read"
    },
    {
        id: 6,
        title: "Version Control with Git",
        excerpt: "Master Git and GitHub to manage your code effectively and collaborate with other developers.",
        category: "Tools",
        date: "2025-05-01",
        readTime: "9 min read"
    }
];

// State management
let displayedPosts = 0;
const postsPerLoad = 3;

// DOM elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const blogGrid = document.getElementById('blog-grid');
const loadMoreBtn = document.getElementById('load-more-btn');
const contactForm = document.getElementById('contact-form');

// Mobile navigation toggle
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

// Smooth scrolling for navigation links
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

// Create blog card HTML
function createBlogCard(post) {
    const readMoreUrl = post.url || '#';
    return `
        <article class="blog-card" data-post-id="${post.id}">
            <div class="blog-image">
                <i class="fas fa-newspaper"></i>
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-category">${post.category}</span>
                    <span class="blog-date">${formatDate(post.date)} • ${post.readTime}</span>
                </div>
                <h3>${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <a href="${readMoreUrl}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
    `;
}

// Format date to readable format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Load blog posts
function loadBlogPosts() {
    const postsToShow = blogPosts.slice(displayedPosts, displayedPosts + postsPerLoad);
    
    postsToShow.forEach(post => {
        blogGrid.innerHTML += createBlogCard(post);
    });
    
    displayedPosts += postsToShow.length;
    
    // Hide load more button if all posts are displayed
    if (displayedPosts >= blogPosts.length) {
        loadMoreBtn.style.display = 'none';
    }
    
    // Add animation to new cards
    const newCards = blogGrid.querySelectorAll('.blog-card:nth-last-child(-n+' + postsToShow.length + ')');
    newCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Load more posts button
loadMoreBtn.addEventListener('click', loadBlogPosts);

// Blog card click handler
blogGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.blog-card');
    if (card) {
        const postId = card.dataset.postId;
        const post = blogPosts.find(p => p.id == postId);
        if (post) {
            // Navigate to the post page if URL is available
            if (post.url) {
                window.location.href = post.url;
            } else {
                // Fallback for posts without dedicated pages
                alert(`Opening post: "${post.title}"\n\nIn a real blog, this would navigate to the full article page.`);
            }
        }
    }
});

// Contact form handler
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const message = contactForm.querySelector('textarea').value;
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('button');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert(`Thank you, ${name}! Your message has been received. We'll get back to you at ${email} soon.`);
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    // Initial load of blog posts
    loadBlogPosts();
    
    // Add scroll animations to sections
    const sections = document.querySelectorAll('.about, .blog, .contact');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add typing effect to hero text
    const heroTitle = document.querySelector('.hero-content h1');
    const heroText = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < heroText.length) {
            heroTitle.textContent += heroText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 1000);
    
    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    });
});
