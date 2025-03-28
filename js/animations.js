// Animation Utilities
const animationUtils = {
    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Add animation class with delay
    animateWithDelay: (element, className, delay) => {
        setTimeout(() => {
            element.classList.add(className);
        }, delay);
    },

    // Remove animation class
    removeAnimation: (element, className) => {
        element.classList.remove(className);
    }
};

// Scroll-based Animations
class ScrollAnimator {
    constructor() {
        this.elements = document.querySelectorAll('[data-animation]');
        this.init();
    }

    init() {
        if (this.elements.length === 0) return;

        // Initial check for elements in viewport
        this.checkElementsInViewport();

        // Bind scroll event
        window.addEventListener('scroll', () => {
            this.checkElementsInViewport();
        });

        // Bind resize event
        window.addEventListener('resize', () => {
            this.checkElementsInViewport();
        });
    }

    checkElementsInViewport() {
        this.elements.forEach(element => {
            if (animationUtils.isInViewport(element)) {
                const animation = element.dataset.animation;
                const delay = element.dataset.delay || 0;
                animationUtils.animateWithDelay(element, animation, delay);
            }
        });
    }
}

// Parallax Effect
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.init();
    }

    init() {
        if (this.elements.length === 0) return;

        window.addEventListener('scroll', () => {
            this.elements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(window.scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// Smooth Scroll Animation
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    this.scrollToElement(targetElement);
                }
            });
        });
    }

    scrollToElement(element) {
        const startPosition = window.scrollY;
        const targetPosition = element.getBoundingClientRect().top + window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            
            window.scrollTo(0, startPosition + distance * this.easeInOutCubic(progress));

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}

// Button Hover Effect
class ButtonEffect {
    constructor() {
        this.buttons = document.querySelectorAll('.btn');
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                button.style.setProperty('--x', `${x}px`);
                button.style.setProperty('--y', `${y}px`);
            });
        });
    }
}

// Loading Animation
class LoadingAnimation {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.init();
    }

    init() {
        if (!this.element) return;

        this.show();
        window.addEventListener('load', () => {
            this.hide();
        });
    }

    show() {
        this.element.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    hide() {
        this.element.style.opacity = '0';
        setTimeout(() => {
            this.element.style.display = 'none';
            document.body.style.overflow = '';
        }, 500);
    }
}

// Initialize Animations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll-based animations
    new ScrollAnimator();

    // Initialize parallax effects
    new ParallaxEffect();

    // Initialize smooth scroll
    new SmoothScroll();

    // Initialize button effects
    new ButtonEffect();

    // Initialize loading animation
    new LoadingAnimation('loading-screen');

    // Add page transition effect
    document.body.classList.add('page-enter-active');
});

// Page Transition
window.addEventListener('beforeunload', () => {
    document.body.classList.add('page-exit-active');
}); 