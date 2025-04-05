// Tool data structure
const tools = {
    pdfTools: [
        { name: 'PDF to JPG', description: 'Convert PDF pages to JPG images', icon: 'fa-file-pdf', url: 'tools/pdf-to-jpg.html' },
        { name: 'JPG to PDF', description: 'Convert JPG images to PDF document', icon: 'fa-file-pdf', url: 'tools/jpg-to-pdf.html' },
        { name: 'Word to PDF', description: 'Convert Word documents to PDF', icon: 'fa-file-word', url: 'tools/word-to-pdf.html' },
        { name: 'PDF to Word', description: 'Convert PDF to Word document', icon: 'fa-file-word', url: 'tools/pdf-to-word.html' }
    ],
    imageTools: [
        { name: 'Image to PNG', description: 'Convert any image to PNG format', icon: 'fa-image', url: 'tools/image-to-png.html' },
        { name: 'Image to JPG', description: 'Convert any image to JPG format', icon: 'fa-file-image', url: 'tools/image-to-jpg.html' },
        { name: 'Image Resizer', description: 'Resize images to any dimension', icon: 'fa-expand', url: 'tools/image-resizer.html' },
        { name: 'Image Compressor', description: 'Compress images without losing quality', icon: 'fa-compress', url: 'tools/image-compressor.html' },
        { name: 'Image Cropper', description: 'Crop images to any size', icon: 'fa-crop', url: 'tools/image-cropper.html' },
        { name: 'Base64 Image', description: 'Convert images to Base64 format', icon: 'fa-code', url: 'tools/base64-image.html' }
    ],
    textTools: [
        { name: 'Word Counter', description: 'Count words, characters and more', icon: 'fa-calculator', url: 'tools/word-counter.html' },
        { name: 'Case Converter', description: 'Convert text case', icon: 'fa-font', url: 'tools/case-converter.html' },
        { name: 'Text to Speech', description: 'Convert text to speech', icon: 'fa-volume-up', url: 'tools/text-to-speech.html' },
        { name: 'Speech to Text', description: 'Convert speech to text', icon: 'fa-microphone', url: 'tools/speech-to-text.html' },
        { name: 'URL Encoder', description: 'Encode and decode URLs', icon: 'fa-link', url: 'tools/url-encoder.html' },
        { name: 'Fancy Text', description: 'Generate fancy text styles', icon: 'fa-text-height', url: 'tools/fancy-text.html' }
    ],
    devTools: [
        { name: 'JSON Formatter', description: 'Format and validate JSON', icon: 'fa-code', url: 'tools/json-formatter.html' },
        { name: 'CSS Minifier', description: 'Minify CSS code', icon: 'fa-file-code', url: 'tools/css-minifier.html' },
        { name: 'Color Picker', description: 'Pick and convert colors', icon: 'fa-palette', url: 'tools/color-picker.html' },
        { name: 'HTML to Markdown', description: 'Convert HTML to Markdown', icon: 'fa-file-code', url: 'tools/html-to-markdown.html' },
        { name: 'Base64 Encoder', description: 'Encode and decode Base64', icon: 'fa-exchange-alt', url: 'tools/base64-encoder.html' },
        { name: 'SQL Formatter', description: 'Format SQL queries', icon: 'fa-database', url: 'tools/sql-formatter.html' }
    ],
    calculators: [
        { name: 'Percentage Calculator', description: 'Calculate percentages easily', icon: 'fa-percent', url: 'tools/percentage-calculator.html' },
        { name: 'Age Calculator', description: 'Calculate age between dates', icon: 'fa-calendar', url: 'tools/age-calculator.html' },
        { name: 'BMI Calculator', description: 'Calculate Body Mass Index', icon: 'fa-weight', url: 'tools/bmi-calculator.html' },
        { name: 'Loan EMI Calculator', description: 'Calculate loan EMI', icon: 'fa-money-bill', url: 'tools/loan-calculator.html' },
        { name: 'Scientific Calculator', description: 'Advanced scientific calculations', icon: 'fa-calculator', url: 'tools/scientific-calculator.html' },
        { name: 'Discount Calculator', description: 'Calculate discounts and savings', icon: 'fa-tags', url: 'tools/discount-calculator.html' }
    ],
    converters: [
        { name: 'Length Converter', description: 'Convert between length units', icon: 'fa-ruler', url: 'tools/length-converter.html' },
        { name: 'Weight Converter', description: 'Convert between weight units', icon: 'fa-weight-hanging', url: 'tools/weight-converter.html' },
        { name: 'Temperature Converter', description: 'Convert between temperature scales', icon: 'fa-thermometer-half', url: 'tools/temperature-converter.html' },
        { name: 'Speed Converter', description: 'Convert between speed units', icon: 'fa-tachometer-alt', url: 'tools/speed-converter.html' },
        { name: 'Time Converter', description: 'Convert between time zones', icon: 'fa-clock', url: 'tools/time-converter.html' },
        { name: 'Currency Converter', description: 'Convert between currencies', icon: 'fa-money-bill-wave', url: 'tools/currency-converter.html' }
    ],
    securityTools: [
        { name: 'Password Generator', description: 'Generate secure passwords', icon: 'fa-key', url: 'tools/password-generator.html' },
        { name: 'MD5 Generator', description: 'Generate MD5 hashes', icon: 'fa-lock', url: 'tools/md5-generator.html' },
        { name: 'SHA256 Generator', description: 'Generate SHA256 hashes', icon: 'fa-shield-alt', url: 'tools/sha256-generator.html' },
        { name: 'URL Shortener', description: 'Shorten long URLs', icon: 'fa-link', url: 'tools/url-shortener.html' },
        { name: 'SSL Checker', description: 'Check SSL certificates', icon: 'fa-certificate', url: 'tools/ssl-checker.html' },
        { name: 'Whois Lookup', description: 'Domain WHOIS lookup', icon: 'fa-search', url: 'tools/whois-lookup.html' }
    ]
};

// Create tool card HTML
function createToolCard(tool) {
    return `
        <div class="col">
            <div class="card h-100 tool-card">
                <div class="card-body">
                    <div class="tool-icon mb-3">
                        <i class="fas ${tool.icon} fa-2x"></i>
                    </div>
                    <h5 class="card-title">${tool.name}</h5>
                    <p class="card-text">${tool.description}</p>
                    <a href="${tool.url}" class="btn btn-primary">Use Tool</a>
                </div>
            </div>
        </div>
    `;
}

// Populate tool sections
function populateTools() {
    for (const [category, categoryTools] of Object.entries(tools)) {
        const container = document.getElementById(category);
        if (container) {
            const toolsContainer = container.querySelector('.row');
            if (toolsContainer) {
                toolsContainer.innerHTML = categoryTools.map(tool => createToolCard(tool)).join('');
            }
        }
    }
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('toolSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            // Flatten all tools into a single array
            const allTools = Object.values(tools).flat();
            
            // Filter tools based on search term
            const filteredTools = allTools.filter(tool => 
                tool.name.toLowerCase().includes(searchTerm) || 
                tool.description.toLowerCase().includes(searchTerm)
            );
            
            // Hide all category sections if searching
            const categorySections = document.querySelectorAll('.category-section');
            categorySections.forEach(section => {
                section.style.display = searchTerm ? 'none' : 'block';
            });
            
            // Show search results if there's a search term
            const searchResults = document.getElementById('searchResults');
            if (searchTerm) {
                if (!searchResults) {
                    const resultsSection = document.createElement('div');
                    resultsSection.id = 'searchResults';
                    resultsSection.className = 'category-section mb-5';
                    resultsSection.innerHTML = `
                        <h2 class="category-title">Search Results</h2>
                        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            ${filteredTools.map(tool => createToolCard(tool)).join('')}
                        </div>
                    `;
                    document.querySelector('.tools-grid').prepend(resultsSection);
                } else {
                    const toolsContainer = searchResults.querySelector('.row');
                    if (toolsContainer) {
                        toolsContainer.innerHTML = filteredTools.map(tool => createToolCard(tool)).join('');
                    }
                }
            } else if (searchResults) {
                searchResults.remove();
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    populateTools();
    setupSearch();
}); 