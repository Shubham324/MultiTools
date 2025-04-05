document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const wordCount = document.getElementById('wordCount');
    const charCount = document.getElementById('charCount');
    const charNoSpaceCount = document.getElementById('charNoSpaceCount');
    const sentenceCount = document.getElementById('sentenceCount');
    const paragraphCount = document.getElementById('paragraphCount');
    const readingTime = document.getElementById('readingTime');
    const clearButton = document.getElementById('clearButton');
    const copyButton = document.getElementById('copyButton');

    // Function to count words
    function countWords(text) {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    // Function to count characters (with spaces)
    function countChars(text) {
        return text.length;
    }

    // Function to count characters (without spaces)
    function countCharsNoSpace(text) {
        return text.replace(/\s+/g, '').length;
    }

    // Function to count sentences
    function countSentences(text) {
        return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
    }

    // Function to count paragraphs
    function countParagraphs(text) {
        return text.split(/\n\s*\n/).filter(para => para.trim().length > 0).length || 1;
    }

    // Function to calculate reading time (assuming average reading speed of 200 words per minute)
    function calculateReadingTime(wordCount) {
        const wordsPerMinute = 200;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min`;
    }

    // Function to update all counts
    function updateCounts() {
        const text = textInput.value;
        const words = countWords(text);
        
        wordCount.textContent = words;
        charCount.textContent = countChars(text);
        charNoSpaceCount.textContent = countCharsNoSpace(text);
        sentenceCount.textContent = countSentences(text);
        paragraphCount.textContent = countParagraphs(text);
        readingTime.textContent = calculateReadingTime(words);
    }

    // Event listeners
    textInput.addEventListener('input', updateCounts);

    clearButton.addEventListener('click', () => {
        textInput.value = '';
        updateCounts();
        textInput.focus();
    });

    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(textInput.value);
            
            // Visual feedback
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyButton.classList.add('btn-success');
            copyButton.classList.remove('btn-primary');
            
            setTimeout(() => {
                copyButton.innerHTML = originalText;
                copyButton.classList.remove('btn-success');
                copyButton.classList.add('btn-primary');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
            
            // Error feedback
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-times"></i> Failed to copy';
            copyButton.classList.add('btn-danger');
            copyButton.classList.remove('btn-primary');
            
            setTimeout(() => {
                copyButton.innerHTML = originalText;
                copyButton.classList.remove('btn-danger');
                copyButton.classList.add('btn-primary');
            }, 2000);
        }
    });

    // Initialize counts
    updateCounts();

    // Handle paste events to clean up text
    textInput.addEventListener('paste', (e) => {
        // Let the paste happen normally
        setTimeout(() => {
            // Clean up extra whitespace
            textInput.value = textInput.value
                .replace(/\r\n/g, '\n') // Convert Windows line endings
                .replace(/\r/g, '\n') // Convert Mac line endings
                .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines
                .trim();
            updateCounts();
        }, 0);
    });
}); 