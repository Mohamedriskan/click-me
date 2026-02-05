// Contact page JavaScript

// Initialize contact page
document.addEventListener('DOMContentLoaded', function() {
    setupContactForm();
    setupFormValidation();
});

// Setup contact form
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('is-invalid')) {
                validateField(input);
            }
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing validation classes
    field.classList.remove('is-valid', 'is-invalid');
    
    // Remove existing error message
    const existingFeedback = field.parentNode.querySelector('.invalid-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation (optional field)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    // Name validation
    if ((field.id === 'firstName' || field.id === 'lastName') && value) {
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(value)) {
            isValid = false;
            errorMessage = 'Name can only contain letters and spaces';
        }
    }

    // Message validation
    if (field.id === 'message' && value) {
        if (value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long';
        }
        if (value.length > 1000) {
            isValid = false;
            errorMessage = 'Message must be less than 1000 characters';
        }
    }

    // Add validation classes and error message
    if (!isValid) {
        field.classList.add('is-invalid');
        
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = errorMessage;
        field.parentNode.appendChild(feedback);
    } else if (value) {
        field.classList.add('is-valid');
    }

    return isValid;
}

// Validate entire form
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

// Handle contact form submission
function handleContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    
    // Validate form
    if (!validateForm(form)) {
        ClickMe.showToast('Please fix the errors in the form', 'error');
        return;
    }

    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        newsletter: document.getElementById('newsletter').checked,
        submittedAt: new Date().toISOString()
    };

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
    submitButton.disabled = true;

    // Simulate form submission (in a real app, this would be an API call)
    setTimeout(() => {
        // Store submission in localStorage for demo purposes
        const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions.push(formData);
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

        // Show success message
        showSuccessMessage(formData);
        
        // Reset form
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
            feedback.remove();
        });

        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;

        // Show toast notification
        ClickMe.showToast('Message sent successfully! We\'ll get back to you soon.');
    }, 1500);
}

// Show success message
function showSuccessMessage(formData) {
    const successMessage = document.createElement('div');
    successMessage.className = 'alert alert-success alert-dismissible fade show';
    successMessage.innerHTML = `
        <h5 class="alert-heading">Thank you, ${formData.firstName}!</h5>
        <p class="mb-0">Your message has been sent successfully. We'll respond to your inquiry about <strong>${formData.subject}</strong> within 24 hours.</p>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Insert after the form
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(successMessage, form.nextSibling);

    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (successMessage.parentNode) {
            successMessage.remove();
        }
    }, 10000);
}

// Phone number formatting
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Format as (XXX) XXX-XXXX
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
            
            e.target.value = value;
        });
    }
});

// Character counter for message field
document.addEventListener('DOMContentLoaded', function() {
    const messageField = document.getElementById('message');
    if (messageField) {
        const counter = document.createElement('div');
        counter.className = 'form-text text-end';
        counter.textContent = '0 / 1000 characters';
        messageField.parentNode.appendChild(counter);

        messageField.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = `${length} / 1000 characters`;
            
            if (length > 1000) {
                counter.classList.add('text-danger');
            } else if (length > 800) {
                counter.classList.add('text-warning');
            } else {
                counter.classList.remove('text-danger', 'text-warning');
            }
        });
    }
});

// Auto-save draft (optional feature)
let autoSaveTimer;
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (form) {
        // Load draft if exists
        loadDraft();

        // Auto-save on input
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                clearTimeout(autoSaveTimer);
                autoSaveTimer = setTimeout(saveDraft, 1000);
            });
        });
    }
});

// Save draft to localStorage
function saveDraft() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const draft = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        newsletter: document.getElementById('newsletter').checked,
        savedAt: new Date().toISOString()
    };

    localStorage.setItem('contactDraft', JSON.stringify(draft));
}

// Load draft from localStorage
function loadDraft() {
    const draft = JSON.parse(localStorage.getItem('contactDraft') || '{}');
    if (!draft.savedAt) return;

    // Check if draft is recent (less than 24 hours)
    const savedTime = new Date(draft.savedAt);
    const now = new Date();
    const hoursDiff = (now - savedTime) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
        localStorage.removeItem('contactDraft');
        return;
    }

    // Populate form with draft data
    if (draft.firstName) document.getElementById('firstName').value = draft.firstName;
    if (draft.lastName) document.getElementById('lastName').value = draft.lastName;
    if (draft.email) document.getElementById('email').value = draft.email;
    if (draft.phone) document.getElementById('phone').value = draft.phone;
    if (draft.subject) document.getElementById('subject').value = draft.subject;
    if (draft.message) document.getElementById('message').value = draft.message;
    if (draft.newsletter) document.getElementById('newsletter').checked = draft.newsletter;

    // Show draft notification
    const draftNotification = document.createElement('div');
    draftNotification.className = 'alert alert-info alert-dismissible fade show';
    draftNotification.innerHTML = `
        <i class="fas fa-info-circle me-2"></i>
        We found a draft of your message from ${new Date(savedTime).toLocaleString()}. 
        <button type="button" class="btn btn-sm btn-outline-primary ms-2" onclick="clearDraft()">Clear Draft</button>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(draftNotification, form);
}

// Clear draft
function clearDraft() {
    localStorage.removeItem('contactDraft');
    const form = document.getElementById('contactForm');
    form.reset();
    ClickMe.showToast('Draft cleared');
}
