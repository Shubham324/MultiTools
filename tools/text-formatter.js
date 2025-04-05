document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const clearButton = document.getElementById('clearButton');
    const copyButton = document.getElementById('copyButton');
    const formatButtons = document.querySelectorAll('[data-format]');
    const charCount = document.getElementById('charCount');
    const wordCount = document.getElementById('wordCount');
    const lineCount = document.getElementById('lineCount');
    const paragraphCount = document.getElementById('paragraphCount');
    const findText = document.getElementById('findText');
    const replaceText = document.getElementById('replaceText');
    const caseSensitive = document.getElementById('caseSensitive');

    // Add event listeners to all format buttons
    formatButtons.forEach(button => {
        button.addEventListener('click', () => {
            const formatType = button.getAttribute('data-format');
            inputText.value = formatText(inputText.value, formatType);
            updateStatistics();
        });
    });

    // Clear button functionality
    clearButton.addEventListener('click', () => {
        inputText.value = '';
        updateStatistics();
        inputText.focus();
    });

    // Copy button functionality
    copyButton.addEventListener('click', () => {
        if (!inputText.value) return;
        
        inputText.select();
        inputText.setSelectionRange(0, 99999); // For mobile devices
        
        try {
            navigator.clipboard.writeText(inputText.value);
            showCopyFeedback(copyButton);
        } catch (err) {
            document.execCommand('copy');
            showCopyFeedback(copyButton);
        }
    });

    // Update statistics on input
    inputText.addEventListener('input', updateStatistics);

    // Text formatting function
    function formatText(text, type) {
        if (!text) return '';

        switch (type) {
            case 'trim':
                return text.split('\n')
                    .map(line => line.trim())
                    .join('\n');
            
            case 'spaces':
                return text.replace(/\s+/g, ' ')
                    .split('\n')
                    .map(line => line.trim())
                    .join('\n');
            
            case 'lines':
                return text.split('\n')
                    .filter(line => line.trim().length > 0)
                    .join('\n');
            
            case 'duplicate':
                return [...new Set(text.split('\n'))]
                    .filter(line => line.trim().length > 0)
                    .join('\n');
            
            case 'sort':
                return text.split('\n')
                    .filter(line => line.trim().length > 0)
                    .sort((a, b) => a.localeCompare(b))
                    .join('\n');
            
            case 'sortReverse':
                return text.split('\n')
                    .filter(line => line.trim().length > 0)
                    .sort((a, b) => b.localeCompare(a))
                    .join('\n');
            
            case 'join':
                return text.split('\n')
                    .filter(line => line.trim().length > 0)
                    .join(' ');
            
            case 'numbers':
                return text.split('\n')
                    .filter(line => line.trim().length > 0)
                    .map((line, index) => `${index + 1}. ${line}`)
                    .join('\n');

            case 'reverse':
                return text.split('').reverse().join('');

            case 'shuffle':
                return text.split('\n')
                    .filter(line => line.trim().length > 0)
                    .sort(() => Math.random() - 0.5)
                    .join('\n');

            case 'indent':
                return text.split('\n')
                    .map(line => '    ' + line)
                    .join('\n');

            case 'unindent':
                return text.split('\n')
                    .map(line => line.replace(/^[\s\t]+/, ''))
                    .join('\n');

            case 'camelCase':
                return text.split(/[\s\-_]+/)
                    .map((word, index) => {
                        if (index === 0) return word.toLowerCase();
                        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                    })
                    .join('');

            case 'snakeCase':
                return text.split(/[\s\-]+/)
                    .map(word => word.toLowerCase())
                    .join('_');

            case 'kebabCase':
                return text.split(/[\s_]+/)
                    .map(word => word.toLowerCase())
                    .join('-');

            case 'pascalCase':
                return text.split(/[\s\-_]+/)
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join('');

            case 'replace':
                const find = findText.value;
                const replace = replaceText.value;
                if (!find) return text;
                
                const flags = caseSensitive.checked ? 'g' : 'gi';
                return text.replace(new RegExp(escapeRegExp(find), flags), replace);
            
            default:
                return text;
        }
    }

    // Helper function to escape special characters in regex
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

    // Update statistics
    function updateStatistics() {
        const text = inputText.value;
        
        // Character count
        charCount.textContent = text.length;
        
        // Word count
        wordCount.textContent = text.trim() ? 
            text.trim().split(/\s+/).length : 0;
        
        // Line count
        lineCount.textContent = text.trim() ? 
            text.split('\n').filter(line => line.trim().length > 0).length : 0;
        
        // Paragraph count
        paragraphCount.textContent = text.trim() ? 
            text.split(/\n\s*\n/).filter(para => para.trim().length > 0).length : 0;
    }

    // Handle paste event
    inputText.addEventListener('paste', () => {
        // Small delay to ensure the pasted content is in the input
        setTimeout(updateStatistics, 0);
    });

    // Add active state to buttons
    formatButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.add('active');
            setTimeout(() => {
                button.classList.remove('active');
            }, 200);
        });
    });

    // Initialize statistics
    updateStatistics();
}); 