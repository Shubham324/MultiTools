document.addEventListener('DOMContentLoaded', function() {
    const passwordOutput = document.getElementById('passwordOutput');
    const generateButton = document.getElementById('generateButton');
    const copyButton = document.getElementById('copyButton');
    const passwordLength = document.getElementById('passwordLength');
    const lengthDisplay = document.getElementById('lengthDisplay');
    const includeUppercase = document.getElementById('includeUppercase');
    const includeLowercase = document.getElementById('includeLowercase');
    const includeNumbers = document.getElementById('includeNumbers');
    const includeSymbols = document.getElementById('includeSymbols');
    const excludeSimilar = document.getElementById('excludeSimilar');
    const excludeAmbiguous = document.getElementById('excludeAmbiguous');
    const requireAll = document.getElementById('requireAll');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    // Character sets
    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*',
        similar: 'iIlL1oO0',
        ambiguous: '{}[]()\/\'"~,;:.<>'
    };

    // Update length display when slider changes
    passwordLength.addEventListener('input', () => {
        lengthDisplay.textContent = passwordLength.value;
    });

    // Generate button click handler
    generateButton.addEventListener('click', generatePassword);

    // Copy button functionality
    copyButton.addEventListener('click', () => {
        if (!passwordOutput.value) return;
        
        passwordOutput.select();
        passwordOutput.setSelectionRange(0, 99999); // For mobile devices
        
        try {
            navigator.clipboard.writeText(passwordOutput.value);
            showCopyFeedback(copyButton);
        } catch (err) {
            document.execCommand('copy');
            showCopyFeedback(copyButton);
        }
    });

    // Generate password
    function generatePassword() {
        // Get selected options
        const options = {
            length: parseInt(passwordLength.value),
            uppercase: includeUppercase.checked,
            lowercase: includeLowercase.checked,
            numbers: includeNumbers.checked,
            symbols: includeSymbols.checked,
            excludeSimilar: excludeSimilar.checked,
            excludeAmbiguous: excludeAmbiguous.checked,
            requireAll: requireAll.checked
        };

        // Validate at least one character set is selected
        if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
            alert('Please select at least one character set');
            return;
        }

        // Generate character pool
        let pool = '';
        const requiredChars = [];

        if (options.uppercase) {
            pool += charSets.uppercase;
            if (options.requireAll) {
                requiredChars.push(getRandomChar(charSets.uppercase));
            }
        }
        if (options.lowercase) {
            pool += charSets.lowercase;
            if (options.requireAll) {
                requiredChars.push(getRandomChar(charSets.lowercase));
            }
        }
        if (options.numbers) {
            pool += charSets.numbers;
            if (options.requireAll) {
                requiredChars.push(getRandomChar(charSets.numbers));
            }
        }
        if (options.symbols) {
            pool += charSets.symbols;
            if (options.requireAll) {
                requiredChars.push(getRandomChar(charSets.symbols));
            }
        }

        // Remove excluded characters
        if (options.excludeSimilar) {
            pool = removeChars(pool, charSets.similar);
        }
        if (options.excludeAmbiguous) {
            pool = removeChars(pool, charSets.ambiguous);
        }

        // Generate password
        let password = '';
        
        // Add required characters first
        if (options.requireAll) {
            password = requiredChars.join('');
            for (let i = password.length; i < options.length; i++) {
                password += getRandomChar(pool);
            }
            // Shuffle the password to mix required characters
            password = shuffleString(password);
        } else {
            for (let i = 0; i < options.length; i++) {
                password += getRandomChar(pool);
            }
        }

        // Update output
        passwordOutput.value = password;
        updateStrength(password);
    }

    // Get random character from string
    function getRandomChar(str) {
        return str.charAt(Math.floor(Math.random() * str.length));
    }

    // Remove characters from string
    function removeChars(str, chars) {
        return str.split('').filter(char => !chars.includes(char)).join('');
    }

    // Shuffle string
    function shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    // Update password strength indicator
    function updateStrength(password) {
        let score = 0;
        const length = password.length;

        // Length score (up to 40 points)
        score += Math.min(length * 2, 40);

        // Character variety score (up to 60 points)
        if (/[A-Z]/.test(password)) score += 15;
        if (/[a-z]/.test(password)) score += 15;
        if (/[0-9]/.test(password)) score += 15;
        if (/[^A-Za-z0-9]/.test(password)) score += 15;

        // Update strength bar
        strengthBar.style.width = score + '%';
        strengthBar.className = 'progress-bar';

        if (score >= 80) {
            strengthBar.classList.add('bg-success');
            strengthText.textContent = 'Very Strong';
        } else if (score >= 60) {
            strengthBar.classList.add('bg-info');
            strengthText.textContent = 'Strong';
        } else if (score >= 40) {
            strengthBar.classList.add('bg-warning');
            strengthText.textContent = 'Moderate';
        } else {
            strengthBar.classList.add('bg-danger');
            strengthText.textContent = 'Weak';
        }
    }

    // Show copy feedback
    function showCopyFeedback(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.classList.add('btn-outline-success');
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('btn-outline-success');
            button.disabled = false;
        }, 2000);
    }

    // Generate initial password
    generatePassword();
}); 