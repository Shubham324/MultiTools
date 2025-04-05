document.addEventListener('DOMContentLoaded', () => {
    // Initialize jsPDF
    const { jsPDF } = window.jspdf;

    // DOM Elements
    const uploadArea = document.querySelector('.upload-area');
    const fileInput = document.getElementById('imageFiles');
    const imageList = document.getElementById('imageList');
    const clearButton = document.getElementById('clearButton');
    const convertButton = document.getElementById('convertButton');
    const progressBar = document.querySelector('.progress');
    const progressBarInner = progressBar.querySelector('.progress-bar');
    const pageSizeSelect = document.getElementById('pageSize');
    const pageOrientationSelect = document.getElementById('pageOrientation');
    const imageQualitySelect = document.getElementById('imageQuality');
    const fitToPageCheckbox = document.getElementById('fitToPage');

    // Constants
    const MAX_FILES = 10;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

    // State
    let uploadedImages = [];

    // Initialize Sortable
    new Sortable(imageList, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: () => {
            // Update uploadedImages array order based on DOM order
            const newOrder = Array.from(imageList.children)
                .map(item => item.dataset.index)
                .filter(index => index !== undefined)
                .map(index => uploadedImages[parseInt(index)]);
            uploadedImages = newOrder;
        }
    });

    // Drag and Drop Events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults);
        document.body.addEventListener(eventName, preventDefaults);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight);
    });

    uploadArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFiles);
    clearButton.addEventListener('click', clearAll);
    convertButton.addEventListener('click', convertToPDF);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        uploadArea.classList.add('border-primary');
    }

    function unhighlight() {
        uploadArea.classList.remove('border-primary');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }

    async function handleFiles(e) {
        const files = Array.from(e.target.files);
        
        // Validate number of files
        if (files.length + uploadedImages.length > MAX_FILES) {
            alert(`Maximum ${MAX_FILES} files allowed`);
            return;
        }

        // Filter and validate files
        const validFiles = files.filter(file => {
            if (!ACCEPTED_TYPES.includes(file.type)) {
                alert(`${file.name} is not a supported image type`);
                return false;
            }
            if (file.size > MAX_FILE_SIZE) {
                alert(`${file.name} is too large (max 5MB)`);
                return false;
            }
            return true;
        });

        // Process valid files
        for (const file of validFiles) {
            try {
                const imageData = await loadImage(file);
                uploadedImages.push({
                    file,
                    dataUrl: imageData.dataUrl,
                    width: imageData.width,
                    height: imageData.height
                });
            } catch (error) {
                console.error(`Error loading ${file.name}:`, error);
                alert(`Error loading ${file.name}`);
            }
        }

        updateImageList();
        updateButtons();
    }

    function loadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    resolve({
                        dataUrl: e.target.result,
                        width: img.width,
                        height: img.height
                    });
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function updateImageList() {
        imageList.innerHTML = '';
        uploadedImages.forEach((image, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex align-items-center';
            li.dataset.index = index;
            li.innerHTML = `
                <img src="${image.dataUrl}" class="me-3" style="height: 40px; width: 40px; object-fit: cover;">
                <div class="flex-grow-1">
                    <div class="fw-bold">${image.file.name}</div>
                    <small class="text-muted">${formatSize(image.file.size)} - ${image.width}×${image.height}px</small>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="removeImage(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            imageList.appendChild(li);
        });
    }

    function updateButtons() {
        clearButton.disabled = uploadedImages.length === 0;
        convertButton.disabled = uploadedImages.length === 0;
    }

    function formatSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    window.removeImage = function(index) {
        uploadedImages.splice(index, 1);
        updateImageList();
        updateButtons();
    };

    function clearAll() {
        uploadedImages = [];
        updateImageList();
        updateButtons();
        fileInput.value = '';
    }

    async function convertToPDF() {
        if (uploadedImages.length === 0) return;

        try {
            progressBar.style.display = 'block';
            convertButton.disabled = true;

            const pageSize = pageSizeSelect.value;
            const orientation = pageOrientationSelect.value;
            const quality = imageQualitySelect.value;
            const fitToPage = fitToPageCheckbox.checked;

            // Create PDF document
            const pdf = new jsPDF({
                orientation: orientation === 'auto' ? 'portrait' : orientation,
                unit: 'mm',
                format: pageSize === 'auto' ? [210, 297] : pageSize // Default to A4 if auto
            });

            // Process each image
            for (let i = 0; i < uploadedImages.length; i++) {
                const image = uploadedImages[i];
                
                // Update progress
                const progress = ((i + 1) / uploadedImages.length) * 100;
                progressBarInner.style.width = `${progress}%`;

                // Add new page if not first image
                if (i > 0) pdf.addPage();

                // Calculate dimensions
                let imgWidth = image.width;
                let imgHeight = image.height;
                let pageWidth = pdf.internal.pageSize.getWidth();
                let pageHeight = pdf.internal.pageSize.getHeight();

                // Auto-orientation for individual pages
                if (orientation === 'auto' && imgWidth > imgHeight !== pageWidth > pageHeight) {
                    pdf.deletePage(pdf.internal.pages.length);
                    pdf.addPage('', 'landscape');
                    pageWidth = pdf.internal.pageSize.getWidth();
                    pageHeight = pdf.internal.pageSize.getHeight();
                }

                // Calculate scaling
                let scale = 1;
                if (fitToPage) {
                    const widthScale = pageWidth / imgWidth;
                    const heightScale = pageHeight / imgHeight;
                    scale = Math.min(widthScale, heightScale) * 0.95; // 95% of page size
                }

                // Quality settings
                const imageQuality = quality === 'high' ? 1 : quality === 'medium' ? 0.8 : 0.6;

                // Add image to PDF
                pdf.addImage(
                    image.dataUrl,
                    'JPEG',
                    (pageWidth - imgWidth * scale) / 2,
                    (pageHeight - imgHeight * scale) / 2,
                    imgWidth * scale,
                    imgHeight * scale,
                    '',
                    'FAST',
                    0,
                    imageQuality
                );
            }

            // Save PDF
            const filename = uploadedImages.length === 1 
                ? uploadedImages[0].file.name.replace(/\.[^/.]+$/, '.pdf')
                : 'converted_images.pdf';
            pdf.save(filename);

        } catch (error) {
            console.error('Error converting to PDF:', error);
            alert('Error converting images to PDF. Please try again.');
        } finally {
            progressBar.style.display = 'none';
            convertButton.disabled = false;
            progressBarInner.style.width = '0%';
        }
    }
}); 