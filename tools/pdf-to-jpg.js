document.addEventListener('DOMContentLoaded', function() {
    const pdfFile = document.getElementById('pdfFile');
    const fileInfo = document.getElementById('fileInfo');
    const pageRange = document.getElementById('pageRange');
    const customRangeInputs = document.getElementById('customRangeInputs');
    const startPage = document.getElementById('startPage');
    const endPage = document.getElementById('endPage');
    const imageQuality = document.getElementById('imageQuality');
    const combineImages = document.getElementById('combineImages');
    const previewArea = document.getElementById('previewArea');
    const progressBar = document.querySelector('.progress');
    const progressBarInner = document.querySelector('.progress-bar');
    const clearButton = document.getElementById('clearButton');
    const convertButton = document.getElementById('convertButton');
    const resultsSection = document.getElementById('resultsSection');
    const imageResults = document.getElementById('imageResults');
    const downloadAllButton = document.getElementById('downloadAllButton');

    let currentPdf = null;
    let pdfDocument = null;
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    // Setup drag and drop
    const uploadArea = document.querySelector('.upload-area');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        uploadArea.classList.add('border-primary');
    }

    function unhighlight() {
        uploadArea.classList.remove('border-primary');
    }

    uploadArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        if (file && file.type === 'application/pdf') {
            pdfFile.files = dt.files;
            handleFileSelect(file);
        } else {
            alert('Please drop a PDF file');
        }
    }

    // File input change handler
    pdfFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });

    // Handle file selection
    function handleFileSelect(file) {
        if (file.size > maxFileSize) {
            alert('File is too large. Maximum size is 10MB.');
            return;
        }

        if (file.type !== 'application/pdf') {
            alert('Please select a PDF file.');
            return;
        }

        currentPdf = file;
        fileInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
        clearButton.disabled = false;
        convertButton.disabled = false;

        // Load PDF for preview
        loadPdfPreview(file);
    }

    // Load PDF preview
    async function loadPdfPreview(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            // Update page range inputs
            startPage.max = pdfDocument.numPages;
            endPage.max = pdfDocument.numPages;
            endPage.value = pdfDocument.numPages;

            // Show first page preview
            const page = await pdfDocument.getPage(1);
            const viewport = page.getViewport({ scale: 0.5 });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.classList.add('img-fluid', 'border');

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            previewArea.innerHTML = '';
            previewArea.appendChild(canvas);
        } catch (error) {
            console.error('Error loading PDF:', error);
            previewArea.innerHTML = '<p class="text-danger">Error loading PDF preview</p>';
        }
    }

    // Page range selection handler
    pageRange.addEventListener('change', () => {
        customRangeInputs.style.display = pageRange.value === 'custom' ? 'block' : 'none';
    });

    // Convert button click handler
    convertButton.addEventListener('click', async () => {
        if (!currentPdf || !pdfDocument) return;

        // Get page range
        let startPageNum = 1;
        let endPageNum = pdfDocument.numPages;
        
        if (pageRange.value === 'custom') {
            startPageNum = parseInt(startPage.value);
            endPageNum = parseInt(endPage.value);
            
            if (startPageNum > endPageNum) {
                [startPageNum, endPageNum] = [endPageNum, startPageNum];
            }
        }

        // Show progress bar
        progressBar.style.display = 'block';
        progressBarInner.style.width = '0%';
        resultsSection.style.display = 'none';
        imageResults.innerHTML = '';
        convertButton.disabled = true;

        try {
            const images = [];
            const scale = getScaleFromQuality(imageQuality.value);
            
            for (let i = startPageNum; i <= endPageNum; i++) {
                const page = await pdfDocument.getPage(i);
                const viewport = page.getViewport({ scale });
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;

                if (combineImages.checked) {
                    images.push(canvas);
                } else {
                    const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
                    displayResult(imageUrl, i);
                }

                // Update progress
                const progress = ((i - startPageNum + 1) / (endPageNum - startPageNum + 1)) * 100;
                progressBarInner.style.width = `${progress}%`;
            }

            if (combineImages.checked && images.length > 0) {
                const combinedCanvas = combineCanvases(images);
                const imageUrl = combinedCanvas.toDataURL('image/jpeg', 0.9);
                displayResult(imageUrl, 'combined');
            }

            resultsSection.style.display = 'block';
        } catch (error) {
            console.error('Error converting PDF:', error);
            alert('Error converting PDF to JPG');
        } finally {
            progressBar.style.display = 'none';
            convertButton.disabled = false;
        }
    });

    // Combine multiple canvases vertically
    function combineCanvases(canvases) {
        const totalHeight = canvases.reduce((sum, canvas) => sum + canvas.height, 0);
        const maxWidth = Math.max(...canvases.map(canvas => canvas.width));

        const combinedCanvas = document.createElement('canvas');
        combinedCanvas.width = maxWidth;
        combinedCanvas.height = totalHeight;

        const ctx = combinedCanvas.getContext('2d');
        let y = 0;

        canvases.forEach(canvas => {
            const x = (maxWidth - canvas.width) / 2;
            ctx.drawImage(canvas, x, y);
            y += canvas.height;
        });

        return combinedCanvas;
    }

    // Display converted image
    function displayResult(imageUrl, pageNum) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';

        const card = document.createElement('div');
        card.className = 'card h-100';

        const img = document.createElement('img');
        img.src = imageUrl;
        img.className = 'card-img-top';
        img.alt = `Page ${pageNum}`;

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const title = document.createElement('h6');
        title.className = 'card-title';
        title.textContent = pageNum === 'combined' ? 'Combined Pages' : `Page ${pageNum}`;

        const downloadBtn = document.createElement('a');
        downloadBtn.href = imageUrl;
        downloadBtn.download = pageNum === 'combined' ? 'combined.jpg' : `page-${pageNum}.jpg`;
        downloadBtn.className = 'btn btn-primary btn-sm';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';

        cardBody.appendChild(title);
        cardBody.appendChild(downloadBtn);
        card.appendChild(img);
        card.appendChild(cardBody);
        col.appendChild(card);
        imageResults.appendChild(col);
    }

    // Download all images
    downloadAllButton.addEventListener('click', async () => {
        const zip = new JSZip();
        const images = imageResults.querySelectorAll('img');
        
        images.forEach((img, index) => {
            const filename = img.alt === 'Combined Pages' ? 'combined.jpg' : `page-${index + 1}.jpg`;
            const imageData = img.src.split(',')[1];
            zip.file(filename, imageData, { base64: true });
        });

        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted_images.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Clear button handler
    clearButton.addEventListener('click', () => {
        currentPdf = null;
        pdfDocument = null;
        pdfFile.value = '';
        fileInfo.textContent = '';
        previewArea.innerHTML = '<p class="text-muted">PDF preview will appear here</p>';
        progressBar.style.display = 'none';
        resultsSection.style.display = 'none';
        imageResults.innerHTML = '';
        clearButton.disabled = true;
        convertButton.disabled = true;
        pageRange.value = 'all';
        customRangeInputs.style.display = 'none';
        startPage.value = '1';
        endPage.value = '1';
    });

    // Get scale based on quality setting
    function getScaleFromQuality(quality) {
        switch (quality) {
            case 'high':
                return 3;
            case 'medium':
                return 1.5;
            case 'low':
                return 0.72;
            default:
                return 1.5;
        }
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 