document.addEventListener('DOMContentLoaded', function() {
    // Simple mobile menu implementation that works reliably on all devices
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const hamburger = document.querySelector('.hamburger');
    const body = document.body;

    // Simple function to open the menu
    function openMenu() {
        mobileMenu.style.right = '0';
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';
        body.style.overflow = 'hidden';
        hamburger.classList.add('active');
    }

    // Simple function to close the menu
    function closeMenu() {
        mobileMenu.style.right = '-100%';
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        body.style.overflow = '';
        hamburger.classList.remove('active');
    }

    // Mobile menu button - simple click handler
    if (mobileMenuBtn) {
        mobileMenuBtn.onclick = function(e) {
            e.preventDefault();
            openMenu();
        };
    }

    // Close button - simple click handler
    if (closeMenuBtn) {
        closeMenuBtn.onclick = function(e) {
            e.preventDefault();
            closeMenu();
        };
    }

    // Overlay click handler
    if (overlay) {
        overlay.onclick = function() {
            closeMenu();
        };
    }

    // Mobile menu links - close menu when clicked
    mobileNavLinks.forEach(function(link) {
        link.onclick = function() {
            closeMenu();
        };
    });

    // Handle scroll effects - simple throttling
    let scrollTimeout;

    function handleScroll() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                if (window.pageYOffset > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                scrollTimeout = null;
            }, 100);
        }
    }

    window.addEventListener('scroll', handleScroll);

    // Set active link based on current page
    const currentPath = window.location.pathname;
    const allLinks = [...navLinks, ...mobileNavLinks];
    
    allLinks.forEach(function(link) {
        const linkPath = link.getAttribute('href');
        if (currentPath === linkPath || 
            (currentPath === '/' && linkPath === '/index.html') ||
            (currentPath.includes(linkPath) && linkPath !== '/index.html' && linkPath !== '/')) {
            link.classList.add('active');
        }
    });

    // Initial scroll check
    handleScroll();
}); 
