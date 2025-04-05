document.addEventListener('DOMContentLoaded', function() {
    const outputText = document.getElementById('outputText');
    const generateButton = document.getElementById('generateButton');
    const copyButton = document.getElementById('copyButton');
    const clearButton = document.getElementById('clearButton');
    const generationType = document.getElementById('generationType');
    const amount = document.getElementById('amount');
    const startWithLorem = document.getElementById('startWithLorem');
    const format = document.getElementById('format');
    const addLineBreaks = document.getElementById('addLineBreaks');

    // Lorem Ipsum word bank
    const words = [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
        'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
        'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
        'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat',
        'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse',
        'cillum', 'dolore', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
        'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
        'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
    ];

    // Generate button click handler
    generateButton.addEventListener('click', generateLoremIpsum);

    // Clear button functionality
    clearButton.addEventListener('click', () => {
        outputText.value = '';
        outputText.focus();
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

    // Generate Lorem Ipsum text
    function generateLoremIpsum() {
        const type = generationType.value;
        const count = parseInt(amount.value);
        let result = '';

        switch (type) {
            case 'words':
                result = generateWords(count);
                break;
            case 'sentences':
                result = generateSentences(count);
                break;
            case 'paragraphs':
                result = generateParagraphs(count);
                break;
        }

        // Apply HTML formatting if selected
        result = applyFormatting(result);
        
        outputText.value = result;
    }

    // Generate random words
    function generateWords(count) {
        let result = [];
        
        if (startWithLorem.checked && count > 1) {
            result.push('Lorem', 'ipsum');
            count -= 2;
        }

        for (let i = 0; i < count; i++) {
            result.push(words[Math.floor(Math.random() * words.length)]);
        }

        return result.join(' ');
    }

    // Generate random sentences
    function generateSentences(count) {
        let result = [];
        
        for (let i = 0; i < count; i++) {
            let sentence = '';
            const wordCount = Math.floor(Math.random() * 10) + 10; // 10-20 words per sentence
            
            if (i === 0 && startWithLorem.checked) {
                sentence = 'Lorem ipsum dolor sit amet, ';
                sentence += generateWords(wordCount - 5);
            } else {
                sentence = generateWords(wordCount);
            }
            
            // Capitalize first letter
            sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
            
            // Add period at the end
            if (!sentence.endsWith('.')) {
                sentence += '.';
            }
            
            result.push(sentence);
        }

        return result.join(' ');
    }

    // Generate paragraphs
    function generateParagraphs(count) {
        let result = [];
        
        for (let i = 0; i < count; i++) {
            let paragraph = '';
            const sentenceCount = Math.floor(Math.random() * 3) + 3; // 3-6 sentences per paragraph
            
            if (i === 0 && startWithLorem.checked) {
                paragraph = generateSentences(sentenceCount).replace(/^[^,]+,/, 'Lorem ipsum dolor sit amet,');
            } else {
                paragraph = generateSentences(sentenceCount);
            }
            
            result.push(paragraph);
        }

        return result.join(addLineBreaks.checked ? '\n\n' : '\n');
    }

    // Apply HTML formatting
    function applyFormatting(text) {
        if (format.value === 'plain') {
            return text;
        }

        const tag = format.value === 'html-p' ? 'p' : 'div';
        return text
            .split(addLineBreaks.checked ? '\n\n' : '\n')
            .map(paragraph => `<${tag}>${paragraph}</${tag}>`)
            .join('\n');
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

    // Initialize with some text
    generateLoremIpsum();
}); 