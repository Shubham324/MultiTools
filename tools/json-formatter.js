document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const formatButton = document.getElementById('formatButton');
    const minifyButton = document.getElementById('minifyButton');
    const copyButton = document.getElementById('copyButton');
    const clearButton = document.getElementById('clearButton');
    const indentSize = document.getElementById('indentSize');
    const sortKeys = document.getElementById('sortKeys');
    const colorize = document.getElementById('colorize');
    const validationStatus = document.getElementById('validationStatus');

    // Format button click handler
    formatButton.addEventListener('click', () => {
        formatJSON();
    });

    // Minify button click handler
    minifyButton.addEventListener('click', () => {
        minifyJSON();
    });

    // Clear button functionality
    clearButton.addEventListener('click', () => {
        inputText.value = '';
        outputText.innerHTML = '';
        copyButton.disabled = true;
        updateValidationStatus('No input', 'secondary');
        inputText.focus();
    });

    // Copy button functionality
    copyButton.addEventListener('click', () => {
        const textToCopy = colorize.checked ? outputText.textContent : outputText.innerHTML;
        
        try {
            navigator.clipboard.writeText(textToCopy);
            showCopyFeedback(copyButton);
        } catch (err) {
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showCopyFeedback(copyButton);
        }
    });

    // Format JSON function
    function formatJSON() {
        const input = inputText.value.trim();
        if (!input) {
            updateValidationStatus('No input', 'secondary');
            outputText.innerHTML = '';
            copyButton.disabled = true;
            return;
        }

        try {
            // Parse JSON to validate it
            let parsed = JSON.parse(input);
            
            // Sort keys if option is checked
            if (sortKeys.checked) {
                parsed = sortObjectKeys(parsed);
            }
            
            // Format with proper indentation
            const indent = indentSize.value === 'tab' ? '\t' : ' '.repeat(parseInt(indentSize.value));
            const formatted = JSON.stringify(parsed, null, indent);
            
            // Display formatted JSON
            if (colorize.checked) {
                outputText.innerHTML = syntaxHighlight(formatted);
            } else {
                outputText.innerHTML = formatted;
            }
            
            updateValidationStatus('Valid JSON', 'success');
            copyButton.disabled = false;
        } catch (e) {
            outputText.innerHTML = 'Invalid JSON: ' + e.message;
            updateValidationStatus('Invalid JSON', 'danger');
            copyButton.disabled = true;
        }
    }

    // Minify JSON function
    function minifyJSON() {
        const input = inputText.value.trim();
        if (!input) {
            updateValidationStatus('No input', 'secondary');
            outputText.innerHTML = '';
            copyButton.disabled = true;
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            outputText.innerHTML = minified;
            updateValidationStatus('Valid JSON', 'success');
            copyButton.disabled = false;
        } catch (e) {
            outputText.innerHTML = 'Invalid JSON: ' + e.message;
            updateValidationStatus('Invalid JSON', 'danger');
            copyButton.disabled = true;
        }
    }

    // Sort object keys recursively
    function sortObjectKeys(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(sortObjectKeys);
        }

        return Object.keys(obj)
            .sort()
            .reduce((acc, key) => {
                acc[key] = sortObjectKeys(obj[key]);
                return acc;
            }, {});
    }

    // Syntax highlighting function
    function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
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

    // Update validation status
    function updateValidationStatus(message, type) {
        validationStatus.textContent = message;
        validationStatus.className = `badge bg-${type}`;
    }

    // Auto-format on paste
    inputText.addEventListener('paste', () => {
        setTimeout(formatJSON, 0);
    });

    // Format on option change
    indentSize.addEventListener('change', formatJSON);
    sortKeys.addEventListener('change', formatJSON);
    colorize.addEventListener('change', formatJSON);
}); 