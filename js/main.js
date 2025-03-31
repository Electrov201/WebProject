// DOM Elements
const scrollIndicator = document.querySelector('.scroll-indicator');
const servicesGrid = document.querySelector('.services-grid');

// Services Data
const services = [
    {
        title: 'Society Management',
        description: 'Comprehensive society management services including maintenance, security, and administration.',
        icon: 'fa-building',
        image: 'images/society-management.jpg'
    },
    {
        title: 'Accounting & Financial Services',
        description: 'Professional accounting and financial management for housing societies.',
        icon: 'fa-calculator',
        image: 'images/accounting.jpg'
    },
    {
        title: 'Legal Services',
        description: 'Expert legal assistance for housing society matters and compliance.',
        icon: 'fa-scale-balanced',
        image: 'images/legal.jpg'
    },
    {
        title: 'Facility Management',
        description: 'Complete facility management services for residential complexes.',
        icon: 'fa-gear',
        image: 'images/facility.jpg'
    },
    {
        title: 'Security Services',
        description: '24/7 security services with trained personnel and modern equipment.',
        icon: 'fa-shield',
        image: 'images/security.jpg'
    },
    {
        title: 'Maintenance Services',
        description: 'Regular maintenance and repair services for all society facilities.',
        icon: 'fa-screwdriver-wrench',
        image: 'images/maintenance.jpg'
    }
];

// Scroll Progress Indicator
function updateScrollProgress() {
    if (!scrollIndicator) return;
    
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollIndicator.style.width = `${scrolled}%`;
}

window.addEventListener('scroll', updateScrollProgress);

// Intersection Observer for Animations
const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-fade-left, .animate-fade-right');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

animatedElements.forEach(element => observer.observe(element));

// Load Services
function loadServices() {
    // Remove dynamic service card creation since we're using static HTML
    return;
}

// Initialize scroll to top functionality
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        // Smooth scroll to top when button is clicked
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Load Components
document.addEventListener('DOMContentLoaded', () => {
    loadServices();
    updateScrollProgress();

    // Load other components
    $("#navbar-placeholder").load("/components/navbar.html", function() {
        $.getScript("/js/navigation.js");
    });
    $("#footer-placeholder").load("/components/footer.html");
});

// Smooth Scroll for Anchor Links
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

// Form Validation
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic form validation
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        if (isValid) {
            // Here you would typically send the form data to a server
            alert('Form submitted successfully!');
            form.reset();
        }
    });
});

// Dynamic Copyright Year
const copyrightYear = document.querySelector('.footer-bottom p');
if (copyrightYear) {
    copyrightYear.innerHTML = copyrightYear.innerHTML.replace('2024', new Date().getFullYear());
}

// Lazy Loading Images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Handle Network Status
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
});

// Service Navigation Tabs
document.addEventListener('DOMContentLoaded', function() {
    const serviceNavBtns = document.querySelectorAll('.service-nav-btn');
    const servicePanels = document.querySelectorAll('.service-panel');

    serviceNavBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetPanel = document.getElementById(targetId);

            // Remove active class from all buttons and panels
            serviceNavBtns.forEach(b => b.classList.remove('active'));
            servicePanels.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button and corresponding panel
            this.classList.add('active');
            targetPanel.classList.add('active');
        });
    });
}); 