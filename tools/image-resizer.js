document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const resizeButton = document.getElementById('resizeButton');
    const downloadButton = document.getElementById('downloadButton');
    const previewArea = document.getElementById('previewArea');
    const resizeOptions = document.getElementById('resizeOptions');
    const originalImage = document.getElementById('originalImage');
    const resizedPreview = document.getElementById('resizedPreview');
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    const maintainAspectRatio = document.getElementById('maintainAspectRatio');
    const qualityRange = document.getElementById('qualityRange');
    const qualityValue = document.getElementById('qualityValue');
    const originalDimensions = document.getElementById('originalDimensions');
    const newDimensions = document.getElementById('newDimensions');

    let originalWidth = 0;
    let originalHeight = 0;
    let aspectRatio = 0;

    // Update quality value display
    qualityRange.addEventListener('input', function() {
        qualityValue.textContent = this.value;
    });

    // Handle width/height input changes
    widthInput.addEventListener('input', function() {
        if (maintainAspectRatio.checked && aspectRatio > 0) {
            heightInput.value = Math.round(this.value / aspectRatio);
        }
        updateDimensionsDisplay();
    });

    heightInput.addEventListener('input', function() {
        if (maintainAspectRatio.checked && aspectRatio > 0) {
            widthInput.value = Math.round(this.value * aspectRatio);
        }
        updateDimensionsDisplay();
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

    // Resize button click handler
    resizeButton.addEventListener('click', resizeImage, false);

    // Download button click handler
    downloadButton.addEventListener('click', downloadImage, false);

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
            originalImage.onload = function() {
                originalWidth = this.naturalWidth;
                originalHeight = this.naturalHeight;
                aspectRatio = originalWidth / originalHeight;

                // Set initial resize values
                widthInput.value = originalWidth;
                heightInput.value = originalHeight;
                
                // Show resize options and preview
                resizeOptions.classList.remove('d-none');
                previewArea.classList.remove('d-none');
                resizeButton.disabled = false;
                
                // Update dimensions display
                originalDimensions.textContent = `${originalWidth}px × ${originalHeight}px`;
                updateDimensionsDisplay();
            }
        }
        reader.readAsDataURL(file);
    }

    function updateDimensionsDisplay() {
        const width = parseInt(widthInput.value) || 0;
        const height = parseInt(heightInput.value) || 0;
        newDimensions.textContent = `${width}px × ${height}px`;
    }

    function resizeImage() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to target size
        canvas.width = parseInt(widthInput.value);
        canvas.height = parseInt(heightInput.value);
        
        // Draw the image at the new size
        ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
        
        // Convert to image with specified quality
        const quality = qualityRange.value / 100;
        resizedPreview.src = canvas.toDataURL('image/jpeg', quality);
        downloadButton.disabled = false;
    }

    function downloadImage() {
        const link = document.createElement('a');
        link.download = 'resized-image.jpg';
        link.href = resizedPreview.src;
        link.click();
    }
}); 