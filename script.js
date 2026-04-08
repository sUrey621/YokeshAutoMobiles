// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const successModal = document.getElementById('successModal');
const adminLoginModal = document.getElementById('adminLoginModal');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminLoginMessage = document.getElementById('adminLoginMessage');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        navbar.style.padding = '10px 0';
    } else {
        navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        navbar.style.padding = '15px 0';
    }

    lastScroll = currentScroll;
});

// Set minimum appointment date to today
const appointmentDateInput = document.getElementById('appointment-date');
if (appointmentDateInput) {
    const today = new Date().toISOString().split('T')[0];
    appointmentDateInput.setAttribute('min', today);
}

// Form Submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        vehicle: formData.get('vehicle'),
        service: formData.get('service'),
        message: formData.get('message'),
        appointment_date: formData.get('appointment_date'),
        newsletter: formData.get('newsletter') === 'on',
        contact_consent: formData.get('contact_consent') === 'on'
    };

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.vehicle || !data.service) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }

    // Validate contact consent
    if (!data.contact_consent) {
        showMessage('You must agree to be contacted regarding your inquiry.', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(data.phone)) {
        showMessage('Please enter a valid phone number.', 'error');
        return;
    }

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    // Simulate API call (replace with actual endpoint)
    try {
        await simulateFormSubmission(data);

        // Success
        showMessage('', 'clear');
        contactForm.reset();
        showSuccessModal();
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

    } catch (error) {
        showMessage('An error occurred. Please try again or call us directly.', 'error');
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

// Simulate form submission (replace with actual API)
function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        console.log('Form submitted:', data);

        // Simulate server delay
        setTimeout(() => {
            // Log to local storage for demo purposes
            const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
            submissions.push({
                ...data,
                timestamp: new Date().toISOString(),
                id: Date.now()
            });
            localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

            resolve({ success: true });
        }, 2000);
    });
}

// Show form message
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = 'form-message ' + type;

    if (type !== 'clear') {
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 5000);
    }
}

// Show success modal
function showSuccessModal() {
    successModal.classList.add('active');
}

// Close modal
function closeModal() {
    successModal.classList.remove('active');
}

// Close modal on outside click
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.classList.contains('active')) {
        closeModal();
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .wash-card, .package-card, .testimonial-card').forEach(el => {
    observer.observe(el);
});

// Service selection update
const serviceSelect = document.getElementById('service');
if (serviceSelect) {
    serviceSelect.addEventListener('change', function() {
        // Could update pricing or show additional fields based on selection
        const selectedService = this.value;
        console.log('Selected service:', selectedService);
    });
}

// Phone number formatting
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) {
            value = value.substring(0, 10);
        }
        // Format as (XXX) XXX-XXXX
        if (value.length >= 6) {
            value = `(${value.substring(0,3)}) ${value.substring(3,6)}-${value.substring(6)}`;
        } else if (value.length >= 3) {
            value = `(${value.substring(0,3)}) ${value.substring(3)}`;
        }
        e.target.value = value;
    });
}

// Dynamic year in footer
const currentYear = new Date().getFullYear();
document.querySelectorAll('.copyright').forEach(el => {
    el.textContent = currentYear;
});

// Fix footer year if it exists
const footerText = document.querySelector('.footer-bottom p');
if (footerText) {
    footerText.innerHTML = footerText.innerHTML.replace('2024', currentYear);
}

// Lazy load images simulation (if we had real images)
function loadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
loadImages();

// Service worker registration (for PWA capability if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW registration failed:', err));
    });
}

// Analytics tracking (Google Analytics placeholder)
function trackEvent(category, action, label, value) {
    // Replace with your analytics code
    console.log('Track:', { category, action, label, value });

    // Google Analytics example:
    // gtag('event', action, {
    //     event_category: category,
    //     event_label: label,
    //     value: value
    // });
}

// Track form submission
if (contactForm) {
    contactForm.addEventListener('submit', () => {
        trackEvent('Form', 'Submit', 'Contact Form');
    });
}

// Track CTA clicks
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const text = this.textContent.trim();
        trackEvent('CTA', 'Click', text);
    });
});

// Performance monitoring
window.addEventListener('load', () => {
    if ('performance' in window) {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Page load time:', loadTime + 'ms');

            // Send to analytics
            // trackEvent('Performance', 'Load Time', 'Page Load', loadTime);
        }, 0);
    }
});

// Easter egg: Toggle dark mode (pressing 'D' key)
let darkMode = false;
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'd' && e.ctrlKey) {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode', darkMode);
    }
});

// Add dark mode styles dynamically
const darkModeStyles = document.createElement('style');
darkModeStyles.textContent = `
    body.dark-mode {
        background: #1a1a2e;
        color: #ffffff;
    }
    body.dark-mode .navbar,
    body.dark-mode .service-card,
    body.dark-mode .contact-form-wrapper,
    body.dark-mode .wash-card,
    body.dark-mode .package-card,
    body.dark-mode .about,
    body.dark-mode .testimonials {
        background: #16213e;
        color: #ffffff;
    }
    body.dark-mode .form-group input,
    body.dark-mode .form-group select,
    body.dark-mode .form-group textarea {
        background: #0f3460;
        color: #ffffff;
        border-color: #0f3460;
    }
    body.dark-mode p,
    body.dark-mode .contact-item p,
    body.dark-mode .footer-col p {
        color: #bdc3c7;
    }
    body.dark-mode .nav-menu a {
        color: #ffffff;
    }
`;
document.head.appendChild(darkModeStyles);

// ============================================
// Admin Authentication
// ============================================

// Admin credentials (in production, this would be server-side)
const ADMIN_CREDENTIALS = {
    username: 'yokesh_admin',
    password: 'Yokesh@2024'
};

// Open admin login modal
function openAdminModal() {
    if (adminLoginModal) {
        adminLoginMessage.textContent = '';
        adminLoginMessage.className = 'form-message';
        document.getElementById('admin-username').value = '';
        document.getElementById('admin-password').value = '';
        adminLoginModal.classList.add('active');
    }
}

// Close admin modal
function closeAdminModal() {
    if (adminLoginModal) {
        adminLoginModal.classList.remove('active');
    }
}

// Close admin modal on outside click
if (adminLoginModal) {
    adminLoginModal.addEventListener('click', (e) => {
        if (e.target === adminLoginModal) {
            closeAdminModal();
        }
    });
}

// Close admin modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && adminLoginModal && adminLoginModal.classList.contains('active')) {
        closeAdminModal();
    }
});

// Admin login form submission
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('admin-username').value.trim();
        const password = document.getElementById('admin-password').value;

        // Validate inputs
        if (!username || !password) {
            adminLoginMessage.textContent = 'Please enter both username and password.';
            adminLoginMessage.className = 'form-message error';
            return;
        }

        // Check credentials (simple client-side check)
        // In production, this would be a server API call
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            // Set session
            sessionStorage.setItem('adminAuthenticated', 'true');
            sessionStorage.setItem('adminLoginTime', Date.now());

            // Close modal
            closeAdminModal();

            // Redirect to admin page
            window.location.href = '/admin.html';
        } else {
            adminLoginMessage.textContent = 'Invalid username or password.';
            adminLoginMessage.className = 'form-message error';
        }
    });
}

// Check if user is already authenticated (for any admin pages)
function checkAdminAuth() {
    const isAuth = sessionStorage.getItem('adminAuthenticated') === 'true';
    const loginTime = sessionStorage.getItem('adminLoginTime');

    // Optional: Auto logout after 24 hours
    if (isAuth && loginTime) {
        const hoursSinceLogin = (Date.now() - parseInt(loginTime)) / (1000 * 60 * 60);
        if (hoursSinceLogin > 24) {
            sessionStorage.removeItem('adminAuthenticated');
            sessionStorage.removeItem('adminLoginTime');
            return false;
        }
    }

    return isAuth;
}

// Enforce auth on admin pages
if (window.location.pathname.includes('admin.html')) {
    if (!checkAdminAuth()) {
        // Redirect to home if not authenticated
        window.location.href = '/index.html';
    }
}

// Override admin nav link behavior to open modal instead
document.querySelectorAll('a[href="/admin.html"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        if (checkAdminAuth()) {
            // Already logged in, go straight to admin
            window.location.href = '/admin.html';
        } else {
            openAdminModal();
        }
    });
});

console.log('AutoCare Pro website initialized successfully!');
console.log('Tip: Press Ctrl+D to toggle dark mode.');
