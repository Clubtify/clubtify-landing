/* File: js/main.js */
document.addEventListener('DOMContentLoaded', () => {
    console.log("Clubtify Main Loaded");

    // Waitlist form validation
    const waitlistForm = document.querySelector('form[name="waitlist"]');
    
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            const emailInput = waitlistForm.querySelector('input[name="email"]');
            const emailValue = emailInput.value.trim();

            // Regex check email @domain
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(emailValue)) {
                // if wrong
                e.preventDefault(); // stop
                alert("Please enter a valid email address (e.g., name@domain.com).");
                emailInput.focus();
                emailInput.style.borderColor = "#ef4444"; 
                emailInput.style.boxShadow = "0 0 0 2px rgba(239, 68, 68, 0.2)";
            } else {
                // if right --> send
                emailInput.style.borderColor = "#e5e7eb";
                emailInput.style.boxShadow = "none";
            }
        });
        
        // retype
        const emailInput = waitlistForm.querySelector('input[name="email"]');
        emailInput.addEventListener('input', () => {
            emailInput.style.borderColor = "#e5e7eb";
            emailInput.style.boxShadow = "none";
        });
    }

    // Feedback form validation
    const feedbackForm = document.querySelector('form[name="feedback"]');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            const ideaInput = feedbackForm.querySelector('textarea[name="idea"]');
            if (ideaInput && ideaInput.value.trim().length < 10) {
                e.preventDefault();
                alert("Please elaborate a bit more on your idea (at least 10 characters).");
                ideaInput.focus();
                ideaInput.style.borderColor = "#ef4444";
                ideaInput.style.boxShadow = "0 0 0 2px rgba(239, 68, 68, 0.2)";
                return false;
            }
            
            const anonymousCheckbox = feedbackForm.querySelector('#anonymous');
            if (anonymousCheckbox && anonymousCheckbox.checked) {
                // Clear optional fields if submitting anonymously
                const nameInput = feedbackForm.querySelector('input[name="name"]');
                const emailInput = feedbackForm.querySelector('input[name="email"]');
                if (nameInput) nameInput.value = '';
                if (emailInput) emailInput.value = '';
            }
        });
        
        // Reset border color when user starts typing
        const ideaInput = feedbackForm.querySelector('textarea[name="idea"]');
        if (ideaInput) {
            ideaInput.addEventListener('input', () => {
                ideaInput.style.borderColor = "#e5e7eb";
                ideaInput.style.boxShadow = "none";
            });
        }
        
        // Handle anonymous checkbox
        const anonymousCheckbox = document.getElementById('anonymous');
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        
        if (anonymousCheckbox && nameField && emailField) {
            anonymousCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    nameField.disabled = true;
                    emailField.disabled = true;
                    nameField.placeholder = 'Submitted anonymously';
                    emailField.placeholder = 'Submitted anonymously';
                    nameField.classList.add('disabled-field');
                    emailField.classList.add('disabled-field');
                } else {
                    nameField.disabled = false;
                    emailField.disabled = false;
                    nameField.placeholder = 'Your name';
                    emailField.placeholder = 'If you want us to reply';
                    nameField.classList.remove('disabled-field');
                    emailField.classList.remove('disabled-field');
                }
            });
        }
    }
});