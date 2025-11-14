// Enhanced Form Validation and UX
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('#contact form');
    if (!contactForm) return;

    const formGroups = contactForm.querySelectorAll('.form-group');
    const submitBtn = contactForm.querySelector('.submit-btn');
    
    // Add real-time validation
    const validators = {
        name: {
            element: contactForm.querySelector('input[name="name"]'),
            validate: (value) => value.trim().length >= 2,
            message: 'Name must be at least 2 characters long'
        },
        email: {
            element: contactForm.querySelector('input[name="email"]'),
            validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Please enter a valid email address'
        },
        message: {
            element: contactForm.querySelector('textarea[name="message"]'),
            validate: (value) => value.trim().length >= 10,
            message: 'Message must be at least 10 characters long'
        }
    };

    // Create error message elements
    Object.keys(validators).forEach(fieldName => {
        const validator = validators[fieldName];
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.cssText = `
            color: #ff6b6b;
            font-size: 0.85rem;
            margin-top: 0.5rem;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        `;
        validator.element.parentNode.appendChild(errorElement);
        validator.errorElement = errorElement;
    });

    // Real-time validation
    Object.keys(validators).forEach(fieldName => {
        const validator = validators[fieldName];
        
        validator.element.addEventListener('input', () => {
            validateField(fieldName);
            updateFormStatus();
        });

        validator.element.addEventListener('blur', () => {
            validateField(fieldName, true);
        });

        validator.element.addEventListener('focus', () => {
            validator.element.parentNode.classList.add('focused');
        });

        validator.element.addEventListener('blur', () => {
            validator.element.parentNode.classList.remove('focused');
        });
    });

    function validateField(fieldName, showError = false) {
        const validator = validators[fieldName];
        const value = validator.element.value;
        const isValid = validator.validate(value);
        
        if (showError && !isValid && value.length > 0) {
            showErrorMessage(fieldName);
        } else if (isValid) {
            hideErrorMessage(fieldName);
            validator.element.parentNode.classList.add('valid');
            validator.element.parentNode.classList.remove('invalid');
        } else if (value.length === 0) {
            hideErrorMessage(fieldName);
            validator.element.parentNode.classList.remove('valid', 'invalid');
        } else if (showError) {
            showErrorMessage(fieldName);
        }
        
        return isValid;
    }

    function showErrorMessage(fieldName) {
        const validator = validators[fieldName];
        validator.errorElement.textContent = validator.message;
        validator.errorElement.style.opacity = '1';
        validator.errorElement.style.transform = 'translateY(0)';
        validator.element.parentNode.classList.add('invalid');
        validator.element.parentNode.classList.remove('valid');
    }

    function hideErrorMessage(fieldName) {
        const validator = validators[fieldName];
        validator.errorElement.style.opacity = '0';
        validator.errorElement.style.transform = 'translateY(-10px)';
    }

    function updateFormStatus() {
        const allFieldsValid = Object.keys(validators).every(fieldName => {
            return validators[fieldName].element.value.length === 0 || 
                   validateField(fieldName);
        });
        
        const hasContent = Object.keys(validators).some(fieldName => {
            return validators[fieldName].element.value.length > 0;
        });

        if (hasContent) {
            submitBtn.style.opacity = allFieldsValid ? '1' : '0.6';
            submitBtn.style.cursor = allFieldsValid ? 'pointer' : 'not-allowed';
        }
    }

    // Form submission with loading state
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all fields
        let isFormValid = true;
        Object.keys(validators).forEach(fieldName => {
            if (!validateField(fieldName, true)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            // Scroll to first error
            const firstError = contactForm.querySelector('.invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.querySelector('input, textarea').focus();
            }
            return;
        }

        // Show loading state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual submission)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            showSuccessMessage();
            contactForm.reset();
            
            // Reset validation states
            Object.keys(validators).forEach(fieldName => {
                validators[fieldName].element.parentNode.classList.remove('valid', 'invalid');
                hideErrorMessage(fieldName);
            });
            
        } catch (error) {
            showErrorMessage('Failed to send message. Please try again.');
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #27ae60, #2ecc71);
                color: white;
                padding: 1rem 2rem;
                border-radius: 12px;
                margin-bottom: 2rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                animation: slideDown 0.5s ease;
            ">
                <i class="fas fa-check-circle"></i>
                <span>Message sent successfully! I'll get back to you soon.</span>
            </div>
        `;
        
        contactForm.parentNode.insertBefore(successDiv, contactForm);
        
        setTimeout(() => {
            successDiv.style.opacity = '0';
            successDiv.style.transform = 'translateY(-20px)';
            setTimeout(() => successDiv.remove(), 300);
        }, 5000);
    }

    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                color: white;
                padding: 1rem 2rem;
                border-radius: 12px;
                margin-bottom: 2rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                animation: slideDown 0.5s ease;
            ">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        contactForm.parentNode.insertBefore(errorDiv, contactForm);
        
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            errorDiv.style.transform = 'translateY(-20px)';
            setTimeout(() => errorDiv.remove(), 300);
        }, 5000);
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .form-group.focused {
            transform: scale(1.02);
        }
        
        .form-group.valid input,
        .form-group.valid textarea {
            border-color: #27ae60;
            background: rgba(39, 174, 96, 0.1);
        }
        
        .form-group.invalid input,
        .form-group.invalid textarea {
            border-color: #e74c3c;
            background: rgba(231, 76, 60, 0.1);
            animation: shake 0.5s ease;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        .form-group {
            transition: transform 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});

// Add floating labels effect
document.addEventListener('DOMContentLoaded', () => {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const placeholder = input.getAttribute('placeholder');
        
        if (placeholder) {
            const label = document.createElement('label');
            label.textContent = placeholder;
            label.className = 'floating-label';
            label.style.cssText = `
                position: absolute;
                left: 1.5rem;
                top: 1.2rem;
                color: var(--text-muted);
                pointer-events: none;
                transition: all 0.3s ease;
                font-size: 1rem;
                background: transparent;
                padding: 0 0.5rem;
            `;
            
            group.appendChild(label);
            input.removeAttribute('placeholder');
            
            input.addEventListener('input', () => {
                if (input.value) {
                    label.style.top = '-0.5rem';
                    label.style.left = '1rem';
                    label.style.fontSize = '0.8rem';
                    label.style.color = 'var(--primary-purple)';
                    label.style.background = 'var(--dark-bg)';
                } else {
                    label.style.top = '1.2rem';
                    label.style.left = '1.5rem';
                    label.style.fontSize = '1rem';
                    label.style.color = 'var(--text-muted)';
                    label.style.background = 'transparent';
                }
            });
            
            // Initialize label position
            if (input.value) {
                input.dispatchEvent(new Event('input'));
            }
        }
    });
});