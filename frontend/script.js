// ========================================
// TRADE GPT LANDING PAGE - FULLY FUNCTIONAL
// ========================================
// 
// INTERACTIVE FEATURES:
// ✅ Navigation Menu - Smooth scrolling to sections
// ✅ Mobile Menu - Hamburger toggle on mobile devices
// ✅ CTA Buttons - Scroll to signup form
// ✅ Live Trading Chart - Animated canvas with 24h reset
// ✅ Form Submission - Posts to backend API with validation
// ✅ Success Modal - Shows after successful registration
// ✅ Notification System - Error/success/warning alerts
// ✅ Form Validation - Real-time field validation
// ✅ Button Hover Effects - Visual feedback on all buttons
// ✅ Ripple Effects - Material design ripple on click
// ✅ Scroll Animations - Fade-in animations on scroll
// ✅ Navbar Effects - Background change on scroll
//
// BACKEND INTEGRATION:
// - POST /api/leads - Submit registration form
// - Backend must be running on http://localhost:5000
//
// ========================================

// ========================================
// GLOBAL HELPER FUNCTIONS (Available immediately)
// ========================================
window.scrollToSection = function(sectionId) {
    console.log('📍 Scrolling to:', sectionId);
    const target = document.querySelector(sectionId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        return true;
    } else {
        console.error('❌ Section not found:', sectionId);
        return false;
    }
};

// ========================================
// LIVE TRADING CHART WITH 24H RESET
// ========================================
class LiveTradingChart {
    constructor() {
        this.profitKey = 'tradeGPT_dailyProfit';
        this.dateKey = 'tradeGPT_lastUpdate';
        this.startProfit = 289.98; // Starting profit for the day
        this.targetProfit = 1800; // Target daily profit
        this.currentProfit = this.loadProfit();
        this.canvas = document.getElementById('liveChart');
        this.ctx = null;
        this.dataPoints = [];
        this.maxDataPoints = 30;
        this.init();
    }

    loadProfit() {
        const savedDate = localStorage.getItem(this.dateKey);
        const today = new Date().toDateString();
        
        // Reset if it's a new day
        if (savedDate !== today) {
            localStorage.setItem(this.dateKey, today);
            localStorage.setItem(this.profitKey, this.startProfit.toString());
            return this.startProfit;
        }
        
        const savedProfit = parseFloat(localStorage.getItem(this.profitKey));
        return savedProfit || this.startProfit;
    }

    saveProfit(profit) {
        localStorage.setItem(this.profitKey, profit.toString());
    }

    init() {
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        
        // Initialize data points with upward trend
        for (let i = 0; i < this.maxDataPoints; i++) {
            const baseValue = 20 + (i * 2);
            const variation = Math.random() * 10 - 3;
            this.dataPoints.push(Math.max(15, Math.min(85, baseValue + variation)));
        }
        
        this.drawChart();
        this.updateDisplay();
        
        // Update profit every 5-15 seconds
        setInterval(() => {
            this.incrementProfit();
        }, Math.random() * 10000 + 5000);
        
        // Update chart animation every 3 seconds
        setInterval(() => {
            this.updateChart();
        }, 3000);
    }

    drawChart() {
        if (!this.ctx) return;
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);
        
        // Draw grid lines
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < 5; i++) {
            const y = (height / 4) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }
        
        // Draw gradient area under line
        const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, height);
        
        this.dataPoints.forEach((point, index) => {
            const x = (width / (this.maxDataPoints - 1)) * index;
            const y = height - (point / 100) * height;
            
            if (index === 0) {
                this.ctx.lineTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        
        this.ctx.lineTo(width, height);
        this.ctx.closePath();
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Draw line
        this.ctx.strokeStyle = '#10b981';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.ctx.beginPath();
        this.dataPoints.forEach((point, index) => {
            const x = (width / (this.maxDataPoints - 1)) * index;
            const y = height - (point / 100) * height;
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        this.ctx.stroke();
        
        // Draw points
        this.dataPoints.forEach((point, index) => {
            const x = (width / (this.maxDataPoints - 1)) * index;
            const y = height - (point / 100) * height;
            
            // Draw outer glow
            this.ctx.beginPath();
            this.ctx.arc(x, y, 6, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
            this.ctx.fill();
            
            // Draw point
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = '#10b981';
            this.ctx.fill();
        });
    }

    updateChart() {
        // Remove first point and add new one
        this.dataPoints.shift();
        
        // New point trends upward with some variation
        const lastPoint = this.dataPoints[this.dataPoints.length - 1];
        const trend = 2 + Math.random() * 3; // Upward trend
        const variation = Math.random() * 8 - 3;
        const newPoint = Math.max(20, Math.min(85, lastPoint + trend + variation));
        
        this.dataPoints.push(newPoint);
        this.drawChart();
    }

    incrementProfit() {
        // Increment by £0.50 to £5.00 randomly
        const increment = (Math.random() * 4.5 + 0.5);
        this.currentProfit = Math.min(this.currentProfit + increment, this.targetProfit);
        this.saveProfit(this.currentProfit);
        this.updateDisplay();
    }

    updateDisplay() {
        const profitElement = document.querySelector('.trade-profit');
        const tradeCount = Math.floor(this.currentProfit / 80) + Math.floor(Math.random() * 5);
        
        if (profitElement) {
            profitElement.textContent = `+£${this.currentProfit.toFixed(2)}`;
            profitElement.style.animation = 'none';
            setTimeout(() => {
                profitElement.style.animation = 'profitPulse 0.5s ease';
            }, 10);
        }
        
        const tradeLabelElement = document.querySelector('.trade-label');
        if (tradeLabelElement) {
            tradeLabelElement.textContent = `Today's Profit • ${tradeCount} Trades`;
        }
        
        // Update trading stats with realistic percentages
        this.updateTradingStats();
    }

    updateTradingStats() {
        const stats = document.querySelectorAll('.trading-stat .stat-value');
        stats.forEach((stat, index) => {
            const basePercent = [1.34, 0.87, 2.15][index] || 1.0;
            const variation = (Math.random() * 0.4 - 0.2); // ±0.2%
            const newPercent = (basePercent + variation).toFixed(2);
            stat.textContent = `+${newPercent}%`;
        });
    }
}

// Initialize live chart
const liveChart = new LiveTradingChart();
console.log('✅ Live chart initialized');

// ========================================
// FORM SUBMISSION HANDLER
// ========================================
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    console.log('✅ Signup form found and handler attached');
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('📝 Form submitted!');
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<span class="loading-spinner"></span> Processing...';
        submitButton.disabled = true;
        
        // Get form data with enhanced tracking
        const urlParams = new URLSearchParams(window.location.search);
        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            investment: document.getElementById('investment').value,
            source: 'website',
            // Enhanced tracking
            utm_source: urlParams.get('utm_source') || 'direct',
            utm_medium: urlParams.get('utm_medium') || 'none',
            utm_campaign: urlParams.get('utm_campaign') || 'none',
            utm_term: urlParams.get('utm_term') || '',
            utm_content: urlParams.get('utm_content') || '',
            referrer: document.referrer || 'direct',
            landing_page: window.location.pathname,
            user_agent: navigator.userAgent,
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            browser_language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            device_type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
            timestamp: new Date().toISOString()
        };
        
        try {
            // Use local API in development, production API in production
            const apiURL = window.location.hostname === 'localhost' 
                ? 'http://localhost:5000/api/leads'
                : 'https://trade-gpt-ay57.onrender.com/api/leads';
            
            const response = await fetch(apiURL, {
                method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Show success modal
            showSuccessModal();
            
            // Reset form
            this.reset();
            
            // Track conversion (if you have analytics)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {
                    'send_to': 'AW-CONVERSION_ID',
                    'value': 1.0,
                    'currency': 'USD'
                });
            }
            
        } else {
            // Show error notification
            if (response.status === 409) {
                showNotification('This email is already registered. Please use a different email.', 'warning');
            } else {
                showNotification(result.error || 'There was an error. Please try again.', 'error');
            }
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Connection error. Please ensure the backend server is running on port 5000.', 'error');
    } finally {
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
    });
} else {
    console.error('❌ Signup form not found!');
}

// ========================================
// SUCCESS MODAL
// ========================================
function showSuccessModal() {
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="38" stroke="#10b981" stroke-width="4"/>
                    <path d="M25 40L35 50L55 30" stroke="#10b981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h2>Thank You!</h2>
            <p>Your registration has been received successfully.</p>
            <p class="highlight-text">You will be contacted shortly by our agents.</p>
            <p class="sub-text">Our team typically responds within 2-4 hours during business hours.</p>
            <button onclick="closeSuccessModal()" class="modal-close-btn">Got it!</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Auto-close after 10 seconds
    setTimeout(() => {
        closeSuccessModal();
    }, 10000);
}

function closeSuccessModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 8000);
}

// ========================================
// FORM VALIDATION
// ========================================
const formFields = document.querySelectorAll('#signupForm input, #signupForm select');
if (formFields.length > 0) {
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            validateField(this);
        }
    });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous error styling
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Required field check
    if (field.hasAttribute('required') && value === '') {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value !== '') {
        const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
        const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Text field length
    if (field.type === 'text' && value !== '' && value.length < 2) {
        isValid = false;
        errorMessage = 'Must be at least 2 characters';
    }
    
    // Show error if invalid
    if (!isValid && errorMessage) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = errorMessage;
        field.parentNode.appendChild(errorDiv);
    }
    
    return isValid;
}

// ========================================
// SMOOTH SCROLLING & BUTTON HANDLERS
// ========================================
const scrollLinks = document.querySelectorAll('a[href^="#"]');
console.log(`✅ Found ${scrollLinks.length} scroll links`);

scrollLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('🖱️ Link clicked:', this.getAttribute('href'));
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            console.log('📍 Scrolled to:', this.getAttribute('href'));
            
            // Close mobile menu if open
            const nav = document.querySelector('.nav-links');
            const menuButton = document.querySelector('.mobile-menu-button');
            if (nav && nav.classList.contains('mobile-active')) {
                nav.classList.remove('mobile-active');
                if (menuButton) menuButton.innerHTML = '☰';
            }
        }
    });
});

// Add hover effects for all buttons
const interactiveButtons = document.querySelectorAll('.cta-button, .hero-cta, .submit-button, .modal-close-btn');
console.log(`✅ Found ${interactiveButtons.length} interactive buttons`);

interactiveButtons.forEach(button => {
    button.style.cursor = 'pointer';
    button.style.transition = 'all 0.3s ease';
    
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.4)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '';
    });
});

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.boxShadow = 'none';
    }
});

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            entry.target.style.animationDelay = '0.1s';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .testimonial-card, .platform-card, .stat-card, .step').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ========================================
// MOBILE MENU
// ========================================
const createMobileMenu = () => {
    const nav = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar .container');
    
    if (!nav || !navbar) {
        console.error('❌ Mobile menu elements not found');
        return;
    }
    
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-button';
    menuButton.innerHTML = '☰';
    menuButton.setAttribute('aria-label', 'Toggle menu');
    menuButton.style.cursor = 'pointer';
    
    menuButton.addEventListener('click', () => {
        console.log('🍔 Mobile menu toggled');
        nav.classList.toggle('mobile-active');
        menuButton.innerHTML = nav.classList.contains('mobile-active') ? '✕' : '☰';
    });
    
    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('mobile-active');
            menuButton.innerHTML = '☰';
        });
    });
    
    navbar.appendChild(menuButton);
    console.log('✅ Mobile menu button created');
};

createMobileMenu();

// ========================================
// STATS COUNTER ANIMATION
// ========================================
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                stat.style.animation = 'slideUp 0.8s ease-out';
            });
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

console.log('✅ Trade GPT initialized successfully!');
console.log('📊 Live chart updating with 24-hour reset');
console.log('📧 Form submissions sending to: https://trade-gpt-ay57.onrender.com/api/leads');

// ========================================
// BUTTON CLICK TRACKING & DEBUGGING
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Track all button clicks
    document.querySelectorAll('a, button').forEach(element => {
        element.addEventListener('click', function(e) {
            const elementType = this.tagName;
            const elementClass = this.className;
            const elementHref = this.getAttribute('href');
            const elementText = this.textContent.trim().substring(0, 30);
            
            console.log(`🖱️ Click detected:`, {
                type: elementType,
                class: elementClass,
                href: elementHref,
                text: elementText
            });
        });
    });
    
    // Verify all critical buttons exist
    const criticalElements = [
        '.cta-button',
        '.hero-cta',
        '.submit-button',
        '#signupForm',
        '.mobile-menu-button'
    ];
    
    criticalElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            console.log(`✅ Found ${elements.length} element(s) with selector: ${selector}`);
        } else {
            console.warn(`⚠️ No elements found with selector: ${selector}`);
        }
    });
    
    console.log('🎯 All interactive elements are ready!');
});

// ========================================
// BUTTON FUNCTIONALITY TEST
// ========================================
window.testAllButtons = function() {
    console.log('🧪 Testing all buttons...');
    
    const tests = [
        {
            name: 'Navigation CTA Button',
            selector: '.nav-links .cta-button',
            test: (el) => el !== null && el.getAttribute('href') === '#signup'
        },
        {
            name: 'Hero CTA Button',
            selector: '.hero-cta',
            test: (el) => el !== null && el.getAttribute('href') === '#signup'
        },
        {
            name: 'Form Submit Button',
            selector: '.submit-button',
            test: (el) => el !== null && el.type === 'submit'
        },
        {
            name: 'Mobile Menu Button',
            selector: '.mobile-menu-button',
            test: (el) => el !== null
        },
        {
            name: 'Signup Form',
            selector: '#signupForm',
            test: (el) => el !== null && el.tagName === 'FORM'
        }
    ];
    
    let passed = 0;
    let failed = 0;
    
    tests.forEach(test => {
        const element = document.querySelector(test.selector);
        const result = test.test(element);
        
        if (result) {
            console.log(`✅ ${test.name} - PASSED`);
            passed++;
        } else {
            console.error(`❌ ${test.name} - FAILED`);
            failed++;
        }
    });
    
    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
    
    if (failed === 0) {
        console.log('🎉 All buttons are functional!');
    } else {
        console.warn('⚠️ Some buttons may not be working correctly');
    }
    
    return { passed, failed };
};

// Run test automatically
setTimeout(() => {
    window.testAllButtons();
}, 1000);

// ========================================
// RIPPLE EFFECT FOR BUTTONS
// ========================================
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple effect to all buttons
document.querySelectorAll('.cta-button, .hero-cta, .submit-button, .modal-close-btn').forEach(button => {
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.addEventListener('click', createRipple);
});

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================
// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        const modal = document.querySelector('.success-modal');
        if (modal && modal.classList.contains('show')) {
            closeSuccessModal();
        }
        
        // Close mobile menu
        const nav = document.querySelector('.nav-links');
        const menuButton = document.querySelector('.mobile-menu-button');
        if (nav && nav.classList.contains('mobile-active')) {
            nav.classList.remove('mobile-active');
            if (menuButton) menuButton.innerHTML = '☰';
        }
    }
    
    // Submit form with Ctrl+Enter
    if (e.ctrlKey && e.key === 'Enter') {
        const form = document.getElementById('signupForm');
        if (form) {
            form.dispatchEvent(new Event('submit', { cancelable: true }));
        }
    }
});

// Add focus visible styles programmatically
document.querySelectorAll('button, a, input, select').forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid var(--primary-color)';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = '';
        this.style.outlineOffset = '';
    });
});

// ========================================
// BUTTON STATUS INDICATOR (DEVELOPMENT)
// ========================================
// Add visual indicator that buttons are clickable
document.querySelectorAll('.cta-button, .hero-cta, .submit-button').forEach(button => {
    button.setAttribute('title', '✓ Clickable - ' + (button.textContent || button.getAttribute('aria-label')));
    
    // Add active state
    button.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('mouseup', function() {
        this.style.transform = '';
    });
});

// ========================================
// INITIALIZATION COMPLETE
// ========================================
console.log('🎉 ========================================');
console.log('🎉 Trade GPT Landing Page READY!');
console.log('🎉 All buttons are initialized and clickable');
console.log('🎉 ========================================');
console.log('💡 Try clicking any button - check console for feedback');
console.log('💡 Run testAllButtons() to verify functionality');

