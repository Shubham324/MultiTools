document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const convertButton = document.getElementById('convertButton');
    const downloadButton = document.getElementById('downloadButton');
    const previewArea = document.getElementById('previewArea');
    const originalImage = document.getElementById('originalImage');
    const jpgPreview = document.getElementById('jpgPreview');
    const qualityRange = document.getElementById('qualityRange');
    const qualityValue = document.getElementById('qualityValue');

    // Update quality value display
    qualityRange.addEventListener('input', function() {
        qualityValue.textContent = this.value;
    });

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);
    
    // Handle file input change
    fileInput.addEventListener('change', handleFiles, false);

    // Convert button click handler
    convertButton.addEventListener('click', convertToJPG, false);

    // Download button click handler
    downloadButton.addEventListener('click', downloadJPG, false);

    function preventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropZone.classList.add('border-primary');
    }

    function unhighlight(e) {
        dropZone.classList.remove('border-primary');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files: files } });
    }

    function handleFiles(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('Please upload an image smaller than 10MB.');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = function(e) {
            originalImage.src = e.target.result;
            jpgPreview.src = e.target.result;
            previewArea.classList.remove('d-none');
            convertButton.disabled = false;
        }
        reader.readAsDataURL(file);
    }

    function convertToJPG() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match the image
        canvas.width = originalImage.naturalWidth;
        canvas.height = originalImage.naturalHeight;
        
        // Draw the image onto the canvas
        ctx.drawImage(originalImage, 0, 0);
        
        // Convert to JPG with specified quality
        const quality = qualityRange.value / 100;
        jpgPreview.src = canvas.toDataURL('image/jpeg', quality);
        downloadButton.disabled = false;
    }

    function downloadJPG() {
        const link = document.createElement('a');
        link.download = 'converted-image.jpg';
        link.href = jpgPreview.src;
        link.click();
    }
}); 