// Navigation Toggle for Mobile
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
});

// Enhanced Carousel Functionality with Touch Support
class AdvancedCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.wrapper = document.querySelector('.carousel-wrapper');
        this.isTransitioning = false;
        
        this.init();
    }

    init() {
        this.updateCarousel();
        this.bindEvents();
        this.startAutoplay();
        this.addTouchSupport();
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Pause autoplay on hover
        const carouselContainer = document.querySelector('.carousel-container');
        carouselContainer.addEventListener('mouseenter', () => this.stopAutoplay());
        carouselContainer.addEventListener('mouseleave', () => this.startAutoplay());
    }

    addTouchSupport() {
        const carouselContainer = document.querySelector('.carousel-container');
        let startX = 0;
        let endX = 0;

        carouselContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        carouselContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
    }

    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    updateCarousel() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });

        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });

        const translateX = -this.currentSlide * 100;
        this.wrapper.style.transform = `translateX(${translateX}%)`;
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 300);
    }

    nextSlide() {
        if (this.isTransitioning) return;
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateCarousel();
    }

    prevSlide() {
        if (this.isTransitioning) return;
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateCarousel();
    }

    goToSlide(index) {
        if (this.isTransitioning) return;
        this.currentSlide = index;
        this.updateCarousel();
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, 4000);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new AdvancedCarousel();
});

// User Behavior Tracking
function trackClick(action) {
    const userId = getUserId();
    const sessionId = getSessionId();
    const timestamp = new Date().toISOString();
    const site = 'pop_singer';
    
    const activity = {
        userId: userId,
        sessionId: sessionId,
        action: action,
        timestamp: timestamp,
        site: site,
        page: window.location.pathname
    };
    
    // Store in localStorage
    const activities = JSON.parse(localStorage.getItem('user_activities') || '[]');
    activities.push(activity);
    localStorage.setItem('user_activities', JSON.stringify(activities));
    
    console.log('Activity tracked:', activity);
}

function getUserId() {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('user_id', userId);
    }
    return userId;
}

function getSessionId() {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
}

// Track page view
document.addEventListener('DOMContentLoaded', function() {
    trackClick('page_view');
});

// Track carousel interactions
document.addEventListener('DOMContentLoaded', function() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('indicator') || 
                e.target.closest('.carousel-btn')) {
                trackClick('carousel_interaction');
            }
        });
    }
});