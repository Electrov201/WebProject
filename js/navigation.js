document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    const body = document.body;

    // Toggle mobile menu with animation
    function toggleMobileMenu(forceClose = false) {
        if (forceClose && !mobileMenu.classList.contains('active')) {
            return;
        }

        const isOpening = !mobileMenu.classList.contains('active');
        
        mobileMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        body.style.overflow = isOpening ? 'hidden' : '';

        // Animate menu items
        const links = mobileMenu.querySelectorAll('.mobile-nav-links a');
        links.forEach((link, index) => {
            if (isOpening) {
                link.style.transform = 'translateX(50px)';
                link.style.opacity = '0';
                setTimeout(() => {
                    link.style.transform = 'translateX(0)';
                    link.style.opacity = '1';
                }, 100 + (index * 50));
            }
        });
    }

    // Event listeners for mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    // Close menu when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            toggleMobileMenu(true);
        });
    }

    // Close menu when clicking mobile nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            toggleMobileMenu(true);
        });
    });

    // Handle scroll effects with throttling
    let lastScroll = 0;
    let scrollTimeout;

    function handleScroll() {
        if (scrollTimeout) {
            return;
        }

        scrollTimeout = setTimeout(() => {
        const currentScroll = window.pageYOffset;
        
            // Add/remove scrolled class for navbar background
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
            scrollTimeout = null;
        }, 10);
    }

    window.addEventListener('scroll', handleScroll);

    // Update active nav link based on current page
    function updateActiveNavLink() {
        const currentPath = window.location.pathname;
        const links = [...navLinks, ...mobileNavLinks];

        links.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (currentPath === linkPath || 
                (currentPath === '/' && linkPath === '/index.html') ||
                (currentPath.includes(linkPath) && linkPath !== '/index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Handle touch events for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }, { passive: true });

    function handleSwipeGesture() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance < 0 && !mobileMenu.classList.contains('active')) {
                // Swipe left to open menu
                toggleMobileMenu();
            } else if (swipeDistance > 0 && mobileMenu.classList.contains('active')) {
                // Swipe right to close menu
                toggleMobileMenu();
            }
        }
    }

    // Close mobile menu on window resize if open
    let resizeTimeout;
    window.addEventListener('resize', function() {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }

        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 992 && mobileMenu.classList.contains('active')) {
                toggleMobileMenu(true);
            }
        }, 100);
    });

    // Prevent scrolling when mobile menu is open
    document.addEventListener('touchmove', function(e) {
        if (mobileMenu.classList.contains('active')) {
            e.preventDefault();
        }
    }, { passive: false });

    // Initialize
    updateActiveNavLink();
    handleScroll();
}); 