document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const clearButton = document.getElementById('clearButton');
    const copyButton = document.getElementById('copyButton');
    const caseButtons = document.querySelectorAll('[data-case]');

    // Add event listeners to all case conversion buttons
    caseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const caseType = button.getAttribute('data-case');
            const input = inputText.value;
            outputText.value = convertCase(input, caseType);
        });
    });

    // Clear button functionality
    clearButton.addEventListener('click', () => {
        inputText.value = '';
        outputText.value = '';
        inputText.focus();
    });

    // Copy button functionality
    copyButton.addEventListener('click', () => {
        if (!outputText.value) return;
        
        outputText.select();
        outputText.setSelectionRange(0, 99999); // For mobile devices
        
        try {
            navigator.clipboard.writeText(outputText.value);
            showCopyFeedback(copyButton);
        } catch (err) {
            document.execCommand('copy');
            showCopyFeedback(copyButton);
        }
    });

    // Case conversion function
    function convertCase(text, type) {
        if (!text) return '';

        switch (type) {
            case 'upper':
                return text.toUpperCase();
            
            case 'lower':
                return text.toLowerCase();
            
            case 'title':
                return text.toLowerCase().split(' ').map(word => {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }).join(' ');
            
            case 'sentence':
                return text.toLowerCase().replace(/(^\w|\.\s+\w)/g, letter => letter.toUpperCase());
            
            case 'alternating':
                return text.split('').map((char, i) => 
                    i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
                ).join('');
            
            case 'inverse':
                return text.split('').map(char => {
                    if (char === char.toUpperCase()) {
                        return char.toLowerCase();
                    }
                    return char.toUpperCase();
                }).join('');
            
            default:
                return text;
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

    // Handle paste event
    inputText.addEventListener('paste', (e) => {
        // Small delay to ensure the pasted content is in the input
        setTimeout(() => {
            // Auto-convert if a case type was previously selected
            const activeButton = document.querySelector('[data-case].active');
            if (activeButton) {
                const caseType = activeButton.getAttribute('data-case');
                outputText.value = convertCase(inputText.value, caseType);
            }
        }, 0);
    });

    // Add active state to buttons
    caseButtons.forEach(button => {
        button.addEventListener('click', () => {
            caseButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}); 