document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const encodeButton = document.getElementById('encodeButton');
    const decodeButton = document.getElementById('decodeButton');
    const copyButton = document.getElementById('copyButton');
    const clearButton = document.getElementById('clearButton');
    const swapButton = document.getElementById('swapButton');
    const downloadButton = document.getElementById('downloadButton');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const encodeText = document.getElementById('encodeText');
    const encodeFile = document.getElementById('encodeFile');
    const urlSafe = document.getElementById('urlSafe');
    const inputLength = document.getElementById('inputLength');
    const outputLength = document.getElementById('outputLength');
    const fileType = document.getElementById('fileType');
    const fileSize = document.getElementById('fileSize');

    let currentFile = null;

    // File input change handler
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) {
            resetFileInfo();
            return;
        }

        currentFile = file;
        updateFileInfo(file);
        encodeFile.checked = true;

        if (file.type.startsWith('text/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                inputText.value = e.target.result;
                updateLengths();
            };
            reader.readAsText(file);
        } else {
            inputText.value = '';
            inputText.placeholder = 'Binary file loaded. Click Encode to convert to Base64...';
        }
    });

    // Encode button click handler
    encodeButton.addEventListener('click', () => {
        if (encodeFile.checked && currentFile) {
            encodeFileToBase64();
        } else {
            encodeTextToBase64();
        }
    });

    // Decode button click handler
    decodeButton.addEventListener('click', () => {
        try {
            const input = inputText.value.trim();
            if (!input) return;

            // Replace URL-safe characters back if needed
            let base64Str = input;
            if (urlSafe.checked) {
                base64Str = base64Str.replace(/-/g, '+').replace(/_/g, '/');
            }

            // Try to decode as text first
            const decoded = atob(base64Str);
            
            // Check if the decoded content might be binary
            const isBinary = /[\x00-\x08\x0E-\x1F]/.test(decoded);
            
            if (isBinary) {
                // Convert to Uint8Array for binary data
                const bytes = new Uint8Array(decoded.length);
                for (let i = 0; i < decoded.length; i++) {
                    bytes[i] = decoded.charCodeAt(i);
                }
                
                // Create blob and download link
                const blob = new Blob([bytes]);
                outputText.value = 'Binary data detected. Click Download to save the file.';
                downloadButton.disabled = false;
                downloadButton.onclick = () => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'decoded_file';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                };
            } else {
                outputText.value = decoded;
                downloadButton.disabled = true;
            }
            
            updateLengths();
        } catch (e) {
            outputText.value = 'Error: Invalid Base64 string';
            downloadButton.disabled = true;
        }
    });

    // Encode file to Base64
    function encodeFileToBase64() {
        if (!currentFile) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            let base64Str = e.target.result.split(',')[1];
            
            if (urlSafe.checked) {
                base64Str = base64Str.replace(/\+/g, '-').replace(/\//g, '_');
            }
            
            outputText.value = base64Str;
            updateLengths();
        };
        reader.readAsDataURL(currentFile);
    }

    // Encode text to Base64
    function encodeTextToBase64() {
        const input = inputText.value;
        if (!input) return;

        try {
            let base64Str = btoa(input);
            
            if (urlSafe.checked) {
                base64Str = base64Str.replace(/\+/g, '-').replace(/\//g, '_');
            }
            
            outputText.value = base64Str;
            downloadButton.disabled = true;
            updateLengths();
        } catch (e) {
            outputText.value = 'Error: Invalid input for Base64 encoding';
        }
    }

    // Clear button functionality
    clearButton.addEventListener('click', () => {
        inputText.value = '';
        outputText.value = '';
        resetFileInfo();
        downloadButton.disabled = true;
        inputText.placeholder = 'Enter text to encode or decode...';
        inputText.focus();
        updateLengths();
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
        resetFileInfo();
        updateLengths();
    });

    // Update file info
    function updateFileInfo(file) {
        fileInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
        fileType.textContent = file.type || 'application/octet-stream';
        fileSize.textContent = formatFileSize(file.size);
    }

    // Reset file info
    function resetFileInfo() {
        currentFile = null;
        fileInput.value = '';
        fileInfo.textContent = 'No file selected';
        fileType.textContent = '-';
        fileSize.textContent = '-';
        encodeText.checked = true;
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Update length counters
    function updateLengths() {
        inputLength.textContent = `${inputText.value.length} characters`;
        outputLength.textContent = `${outputText.value.length} characters`;
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

    // Input change handler
    inputText.addEventListener('input', updateLengths);

    // Initialize length counters
    updateLengths();
}); 