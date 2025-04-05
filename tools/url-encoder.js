document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const encodeButton = document.getElementById('encodeButton');
    const decodeButton = document.getElementById('decodeButton');
    const copyButton = document.getElementById('copyButton');
    const clearButton = document.getElementById('clearButton');
    const swapButton = document.getElementById('swapButton');
    const encodeStandard = document.getElementById('encodeStandard');
    const encodeComponent = document.getElementById('encodeComponent');
    const encodeSpaces = document.getElementById('encodeSpaces');
    const urlProtocol = document.getElementById('urlProtocol');
    const urlDomain = document.getElementById('urlDomain');
    const urlPath = document.getElementById('urlPath');
    const urlQuery = document.getElementById('urlQuery');

    // Encode button click handler
    encodeButton.addEventListener('click', () => {
        const input = inputText.value;
        if (!input) return;

        let encoded = '';
        if (encodeComponent.checked) {
            encoded = encodeURIComponent(input);
        } else {
            encoded = encodeURI(input);
        }

        if (encodeSpaces.checked) {
            encoded = encoded.replace(/%20/g, '+');
        }

        outputText.value = encoded;
        analyzeURL(encoded);
    });

    // Decode button click handler
    decodeButton.addEventListener('click', () => {
        const input = inputText.value;
        if (!input) return;

        let decoded = input;
        // First replace + with %20 if present
        if (decoded.includes('+')) {
            decoded = decoded.replace(/\+/g, '%20');
        }

        try {
            if (encodeComponent.checked) {
                decoded = decodeURIComponent(decoded);
            } else {
                decoded = decodeURI(decoded);
            }
            outputText.value = decoded;
            analyzeURL(input); // Analyze the original URL
        } catch (e) {
            outputText.value = 'Error: Invalid URL encoding';
        }
    });

    // Clear button functionality
    clearButton.addEventListener('click', () => {
        inputText.value = '';
        outputText.value = '';
        resetAnalysis();
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

    // Swap button functionality
    swapButton.addEventListener('click', () => {
        const temp = inputText.value;
        inputText.value = outputText.value;
        outputText.value = temp;
        if (inputText.value) {
            analyzeURL(inputText.value);
        } else {
            resetAnalysis();
        }
    });

    // Input change handler for URL analysis
    inputText.addEventListener('input', () => {
        if (inputText.value) {
            analyzeURL(inputText.value);
        } else {
            resetAnalysis();
        }
    });

    // Analyze URL components
    function analyzeURL(url) {
        try {
            const urlObj = new URL(url);
            
            // Update protocol
            urlProtocol.textContent = urlObj.protocol || '-';
            
            // Update domain
            urlDomain.textContent = urlObj.hostname || '-';
            
            // Update path
            urlPath.textContent = urlObj.pathname || '-';
            
            // Update query parameters
            const params = urlObj.searchParams;
            if (params.toString()) {
                const paramsList = [];
                params.forEach((value, key) => {
                    paramsList.push(`${key}=${value}`);
                });
                urlQuery.innerHTML = paramsList.map(p => `<div class="text-break">${p}</div>`).join('');
            } else {
                urlQuery.textContent = '-';
            }
        } catch (e) {
            // If not a valid URL, try to extract components manually
            resetAnalysis();
            
            // Check for protocol
            const protocolMatch = url.match(/^[a-zA-Z]+:\/\//);
            if (protocolMatch) {
                urlProtocol.textContent = protocolMatch[0];
            }
            
            // Check for domain-like pattern
            const domainMatch = url.match(/^(?:[a-zA-Z]+:\/\/)?([^\/\?]+)/);
            if (domainMatch) {
                urlDomain.textContent = domainMatch[1];
            }
            
            // Check for path-like pattern
            const pathMatch = url.match(/^(?:[a-zA-Z]+:\/\/)?[^\/\?]+(\/[^\?]*)/);
            if (pathMatch) {
                urlPath.textContent = pathMatch[1];
            }
            
            // Check for query parameters
            const queryMatch = url.match(/\?([^#]*)/);
            if (queryMatch) {
                const params = queryMatch[1].split('&').filter(p => p);
                if (params.length > 0) {
                    urlQuery.innerHTML = params.map(p => `<div class="text-break">${p}</div>`).join('');
                }
            }
        }
    }

    // Reset URL analysis
    function resetAnalysis() {
        urlProtocol.textContent = '-';
        urlDomain.textContent = '-';
        urlPath.textContent = '-';
        urlQuery.textContent = '-';
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
}); 