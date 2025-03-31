// Function to initialize navigation
function initNavigation() {
    console.log('Initializing navigation...');
    
    // Get the mobile menu button and menu elements
    const menuButton = document.getElementById('mobileMenuBtn');
    const closeButton = document.getElementById('closeMenuBtn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');

    console.log('Menu Button:', menuButton);
    console.log('Close Button:', closeButton);
    console.log('Mobile Menu:', mobileMenu);
    console.log('Overlay:', overlay);

    // Function to toggle the mobile menu
    function toggleMenu() {
        console.log('Toggle menu called');
        if (mobileMenu && overlay) {
            mobileMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        }
    }

    // Add click event to the menu button
    if (menuButton) {
        console.log('Adding click handler to menu button');
        menuButton.onclick = function(e) {
            console.log('Menu button clicked');
            e.preventDefault();
            toggleMenu();
        };
    } else {
        console.log('Menu button not found!');
    }

    // Add click event to close button
    if (closeButton) {
        console.log('Adding click handler to close button');
        closeButton.onclick = function(e) {
            console.log('Close button clicked');
            e.preventDefault();
            toggleMenu();
        };
    }

    // Close menu when clicking overlay
    if (overlay) {
        console.log('Adding click handler to overlay');
        overlay.onclick = function() {
            console.log('Overlay clicked');
            toggleMenu();
        };
    }

    // Close menu when clicking any link in mobile menu
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    console.log('Mobile Links:', mobileLinks);
    mobileLinks.forEach(link => {
        link.onclick = function() {
            console.log('Mobile link clicked');
            toggleMenu();
        };
    });

    // Close menu on window resize
    window.onresize = function() {
        if (window.innerWidth > 992 && mobileMenu && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    };
}

// Initialize navigation when the script is loaded
console.log('Navigation script loaded');
initNavigation(); 