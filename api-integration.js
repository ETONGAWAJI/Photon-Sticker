// API Integration for MakeMeASticker Frontend
// Add this to your gen.js or create a new file and include it in generate.html

// ============== CONFIGURATION ==============
const API_BASE_URL = window.location.origin; // Uses same domain as frontend
// If backend is on different port, use: const API_BASE_URL = "http://localhost:8000";

// ============== STATE MANAGEMENT ==============
let currentStickerId = null;
let processingInterval = null;

// ============== API FUNCTIONS ==============

/**
 * Upload image to backend
 */
async function uploadImage(imageFile) {
    try {
        // Validate file
        if (!imageFile) {
            throw new Error("No file selected");
        }

        if (!imageFile.type.startsWith('image/')) {
            throw new Error("File must be an image");
        }

        // Show loading state
        showUploadingState();

        // Create form data
        const formData = new FormData();
        formData.append('image', imageFile);

        // Upload to backend
        const response = await fetch(`${API_BASE_URL}/api/upload-image`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Upload failed');
        }

        const result = await response.json();
        
        if (result.success && result.sticker_id) {
            currentStickerId = result.sticker_id;
            
            // Start monitoring processing
            startProcessingMonitor();
            
            return result;
        } else {
            throw new Error('Upload failed - no sticker ID received');
        }

    } catch (error) {
        console.error('Upload error:', error);
        showUploadError(error.message);
        throw error;
    }
}

/**
 * Monitor processing status (polls every 2 seconds)
 */
function startProcessingMonitor() {
    // Show processing UI
    showProcessingState();

    processingInterval = setInterval(async () => {
        try {
            const status = await checkStickerStatus(currentStickerId);
            
            // Update progress
            updateProgressBar(status.progress_percentage);

            // Check if processing is complete
            if (status.status === 'ready_preview') {
                clearInterval(processingInterval);
                
                // Redirect to payment page with sticker ID
                redirectToPayment(currentStickerId, status.preview_url);
            } else if (status.status === 'failed') {
                clearInterval(processingInterval);
                showProcessingError('Processing failed. Please try again.');
            }

        } catch (error) {
            console.error('Status check error:', error);
        }
    }, 2000); // Check every 2 seconds
}

/**
 * Check sticker processing status
 */
async function checkStickerStatus(stickerId) {
    const response = await fetch(`${API_BASE_URL}/api/sticker-status/${stickerId}`);
    
    if (!response.ok) {
        throw new Error('Failed to check status');
    }

    return await response.json();
}

/**
 * Redirect to payment page
 */
function redirectToPayment(stickerId, previewUrl) {
    // Store sticker info in sessionStorage for payment page
    sessionStorage.setItem('sticker_id', stickerId);
    sessionStorage.setItem('preview_url', previewUrl);
    
    // Redirect to payment page
    window.location.href = '/payment';
}

/**
 * Create payment intent (call from payment page)
 */
async function createPayment(stickerId, email) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/create-payment-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sticker_id: stickerId,
                email: email
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Payment creation failed');
        }

        return await response.json();

    } catch (error) {
        console.error('Payment error:', error);
        throw error;
    }
}

/**
 * Unlock sticker after successful payment
 */
async function unlockSticker(stickerId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/unlock-sticker/${stickerId}`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error('Failed to unlock sticker');
        }

        return await response.json();

    } catch (error) {
        console.error('Unlock error:', error);
        throw error;
    }
}

/**
 * Download sticker
 */
function downloadSticker(stickerId) {
    const downloadUrl = `${API_BASE_URL}/api/download/${stickerId}`;
    window.open(downloadUrl, '_blank');
}

// ============== UI HELPER FUNCTIONS ==============
// These should be adapted to match your actual HTML structure

function showUploadingState() {
    // Update your UI to show "Uploading..."
    console.log('Uploading...');
    
    // Example - adapt to your HTML:
    // const uploadBtn = document.getElementById('uploadBtn');
    // uploadBtn.disabled = true;
    // uploadBtn.textContent = 'Uploading...';
}

function showProcessingState() {
    // Update your UI to show processing
    console.log('Processing sticker...');
    
    // Example:
    // document.getElementById('uploadSection').style.display = 'none';
    // document.getElementById('processingSection').style.display = 'block';
}

function updateProgressBar(percentage) {
    console.log(`Processing: ${percentage}%`);
    
    // Example:
    // const progressBar = document.getElementById('progressBar');
    // progressBar.style.width = percentage + '%';
    // progressBar.textContent = percentage + '%';
}

function showUploadError(message) {
    console.error('Upload error:', message);
    alert('Upload failed: ' + message);
    
    // Reset button state
    // const uploadBtn = document.getElementById('uploadBtn');
    // uploadBtn.disabled = false;
    // uploadBtn.textContent = 'Upload';
}

function showProcessingError(message) {
    console.error('Processing error:', message);
    alert('Processing failed: ' + message);
}

// ============== EVENT HANDLERS ==============

/**
 * Handle file upload form submission
 * Connect this to your upload button click
 */
function handleUploadSubmit(event) {
    event.preventDefault();
    
    const fileInput = document.getElementById('imageInput'); // Adapt to your input ID
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select an image first');
        return;
    }

    uploadImage(file);
}

/**
 * Handle payment form submission
 * Call this from your payment page
 */
async function handlePaymentSubmit(email) {
    try {
        const stickerId = sessionStorage.getItem('sticker_id');
        
        if (!stickerId) {
            throw new Error('No sticker ID found');
        }

        // Create payment intent
        const paymentResult = await createPayment(stickerId, email);
        
        // TODO: Integrate with Stripe Elements here
        // For now, simulate successful payment
        console.log('Payment intent created:', paymentResult);
        
        // Simulate payment success after 2 seconds (for demo)
        setTimeout(async () => {
            const unlockResult = await unlockSticker(stickerId);
            
            if (unlockResult.success) {
                // Show success and download button
                showPaymentSuccess(stickerId);
            }
        }, 2000);

    } catch (error) {
        console.error('Payment error:', error);
        alert('Payment failed: ' + error.message);
    }
}

function showPaymentSuccess(stickerId) {
    console.log('Payment successful!');
    
    // Update UI to show download button
    // const downloadBtn = document.getElementById('downloadBtn');
    // downloadBtn.style.display = 'block';
    // downloadBtn.onclick = () => downloadSticker(stickerId);
}

// ============== INITIALIZE ON PAYMENT PAGE ==============
function initPaymentPage() {
    const stickerId = sessionStorage.getItem('sticker_id');
    const previewUrl = sessionStorage.getItem('preview_url');
    
    if (!stickerId) {
        alert('No sticker found. Please upload an image first.');
        window.location.href = '/';
        return;
    }

    // Display preview image
    const previewImg = document.getElementById('previewImage'); // Adapt to your HTML
    if (previewImg) {
        previewImg.src = previewUrl;
    }
}

// ============== EXPORT FUNCTIONS ==============
// If using modules, export these functions
// Otherwise, they're available globally

window.uploadImage = uploadImage;
window.handleUploadSubmit = handleUploadSubmit;
window.handlePaymentSubmit = handlePaymentSubmit;
window.initPaymentPage = initPaymentPage;
window.downloadSticker = downloadSticker;