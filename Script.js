// Initialize variables
let totalDeductions = 0;
const taxTips = [
    "Keep all your receipts organized throughout the year! 📸",
    "Consider contributing to your IRA before the tax deadline! 🎯",
    "Working from home? Don't forget about home office deductions! 🏠",
    "Track your charitable contributions throughout the year! ❤️",
    "Stay updated with tax law changes! 📚",
    "Consider bunching deductions to maximize benefits! 🤝",
    "Keep business and personal expenses separate! 💼",
    "Document business mileage - every mile counts! 🚗",
    "Save for estimated tax payments if self-employed! 💰",
    "Review your withholding annually! ✅"
];

// Initialize when document loads
document.addEventListener('DOMContentLoaded', function() {
    getNewTip();
    updateTaxDeadline();
    setInterval(getNewTip, 10000); // Change tip every 10 seconds
    setInterval(updateTaxDeadline, 1000); // Update countdown every second
    setupContactForm();
});

function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;

            if (validateForm(name, email, service, message)) {
                const submitButton = contactForm.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';

                emailjs.send(
                    process.env.EMAILJS_SERVICE_ID,
                    process.env.EMAILJS_TEMPLATE_ID,
                    {
                        from_name: name,
                        from_email: email,
                        phone: phone,
                        service: service,
                        message: message,
                        to_email: process.env.TO_EMAIL
                    }
                ).then(
                    function() {
                        submitButton.disabled = false;
                        submitButton.textContent = 'Send Message';
                        showSuccessMessage(name);
                        contactForm.reset();
                    },
                    function(error) {
                        submitButton.disabled = false;
                        submitButton.textContent = 'Send Message';
                        alert('Failed to send message. Please try again.');
                        console.error('Send email failed:', error);
                    }
                );
            }
        });
    }
}

function showSuccessMessage(name) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = 'Sent!';
    successDiv.style.cssText = `
        background: #d4edda;
        color: #155724;
        padding: 15px;
        border-radius: 5px;
        margin-top: 20px;
        text-align: center;
        font-weight: bold;
    `;

    const form = document.getElementById('contact-form');
    form.parentNode.insertBefore(successDiv, form.nextSibling);

    setTimeout(() => {
        successDiv.remove();
    }, 2000);
}

function validateForm(name, email, subject, message) {
    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields.');
        return false;
    }
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    return true;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function updateTaxDeadline() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const taxDay = new Date(currentYear, 3, 15); // April 15th

    // If we're past tax day this year, look at next year
    if (today > taxDay) {
        taxDay.setFullYear(currentYear + 1);
    }

    const timeLeft = taxDay - today;
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);

    const countdownElement = document.getElementById('tax-countdown');
    if (countdownElement) {
        countdownElement.textContent = `${daysLeft} days, ${hoursLeft} hours, ${minutesLeft} minutes, and ${secondsLeft} seconds until Tax Day (April 15th)`;
    }
}

function getNewTip() {
    const tipElement = document.getElementById('daily-tip');
    if (tipElement) {
        const randomTip = taxTips[Math.floor(Math.random() * taxTips.length)];
        tipElement.style.opacity = '0';
        setTimeout(() => {
            tipElement.textContent = randomTip;
            tipElement.style.opacity = '1';
        }, 200);
    }
}

function calculateTax() {
    const income = parseFloat(document.getElementById('income').value);
    if (!income || income < 0) {
        alert('Please enter a valid income amount');
        return;
    }

    let tax = 0;
    if (income <= 10000) {
        tax = income * 0.10;
    } else if (income <= 50000) {
        tax = 10000 * 0.10 + (income - 10000) * 0.15;
    } else {
        tax = 10000 * 0.10 + 40000 * 0.15 + (income - 50000) * 0.25;
    }

    document.getElementById('tax-result').textContent = '$' + tax.toFixed(2);
}

function calculateSavings() {
    const monthly = parseFloat(document.getElementById('monthly-savings').value);
    const rate = parseFloat(document.getElementById('interest-rate').value);
    if (!monthly || !rate) {
        alert('Please enter valid numbers');
        return;
    }
    const annual = monthly * 12;
    const interest = annual * (rate / 100);
    const total = annual + interest;
    document.getElementById('savings-result').textContent = '$' + total.toFixed(2);
}

function findTaxBracket() {
    const income = parseFloat(document.getElementById('annual-income').value);
    const status = document.getElementById('filing-status').value;
    let bracket = '';

    if (status === 'single') {
        if (income <= 9950) bracket = '10%';
        else if (income <= 40525) bracket = '12%';
        else if (income <= 86375) bracket = '22%';
        else if (income <= 164925) bracket = '24%';
        else bracket = '32% or higher';
    } else {
        if (income <= 19900) bracket = '10%';
        else if (income <= 81050) bracket = '12%';
        else if (income <= 172750) bracket = '22%';
        else if (income <= 329850) bracket = '24%';
        else bracket = '32% or higher';
    }

    document.getElementById('bracket-result').textContent = bracket;
}

function addExpense() {
    const name = document.getElementById('expense-name').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);

    if (!name || !amount) {
        alert('Please enter both name and amount');
        return;
    }

    totalDeductions += amount;

    const list = document.getElementById('expense-list');
    const expenseItem = document.createElement('div');
    expenseItem.className = 'expense-item';
    expenseItem.textContent = `${name}: $${amount.toFixed(2)}`;
    list.appendChild(expenseItem);

    document.getElementById('total-deductions').textContent = '$' + totalDeductions.toFixed(2);

    // Clear inputs
    document.getElementById('expense-name').value = '';
    document.getElementById('expense-amount').value = '';
}

// Counter Animation (from original code, kept unchanged)
function animateCounter() {
    const counters = document.querySelectorAll('.count');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        updateCounter();
    });
}

// Team Info Display (from original code, kept unchanged)
function showTeamInfo(member) {
    const teamMember = document.querySelector(`[onclick="showTeamInfo('${member}')"]`);
    teamMember.classList.add('highlight');
    setTimeout(() => teamMember.classList.remove('highlight'), 300);
}

// Initialize animations when page loads (from original code, kept unchanged)
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.milestone-counter')) {
        animateCounter();
    }
});
