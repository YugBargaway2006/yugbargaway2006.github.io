// Load demo data
let demoData = [];

// Calculate accuracy between two strings (simple character-level comparison)
function calculateAccuracy(original, predicted) {
    if (!original || !predicted) return 0;
    const origWords = original.toLowerCase().split(' ');
    const predWords = predicted.toLowerCase().split(' ');
    const maxLen = Math.max(origWords.length, predWords.length);
    let matches = 0;

    for (let i = 0; i < Math.min(origWords.length, predWords.length); i++) {
        if (origWords[i] === predWords[i]) {
            matches++;
        }
    }

    return Math.round((matches / maxLen) * 100);
}

// Initialize the demo
async function init() {
    try {
        const response = await fetch('data.json');
        demoData = await response.json();

        // Populate video selector
        const select = document.getElementById('video-select');
        demoData.forEach((item, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `Video ${index + 1}: ${item.file_id}`;
            select.appendChild(option);
        });

        // Add event listener to video selector
        select.addEventListener('change', handleVideoSelection);

        // Add event listener to process button
        document.getElementById('process-btn').addEventListener('click', handleProcess);

    } catch (error) {
        console.error('Error loading demo data:', error);
    }
}

// Handle video selection
function handleVideoSelection(event) {
    const index = event.target.value;

    if (index === '') {
        // Hide all sections if no video selected
        document.getElementById('video-preview-container').style.display = 'none';
        document.getElementById('processing-container').style.display = 'none';
        document.getElementById('demo-container').style.display = 'none';
        return;
    }

    const selectedVideo = demoData[index];

    // Show original video section
    const videoPreview = document.getElementById('video-preview-container');
    const originalVideo = document.getElementById('original-video');
    const videoSource = originalVideo.querySelector('source');

    // Set video source and play
    videoSource.src = `original_video/${selectedVideo.file_id}.mp4`;
    originalVideo.load();
    originalVideo.play();

    // Show the preview container
    videoPreview.style.display = 'flex';

    // Hide processing and results sections
    document.getElementById('processing-container').style.display = 'none';
    document.getElementById('demo-container').style.display = 'none';
}

// Handle process button click
async function handleProcess() {
    const selectedIndex = document.getElementById('video-select').value;
    const selectedVideo = demoData[selectedIndex];

    // Hide video preview
    document.getElementById('video-preview-container').style.display = 'none';

    // Show processing animation
    const processingContainer = document.getElementById('processing-container');
    processingContainer.style.display = 'flex';

    // Animate processing steps
    animateProcessingSteps();

    // Simulate processing time (2.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Hide processing animation
    processingContainer.style.display = 'none';

    // Show results
    displayResults(selectedVideo);
}

// Animate processing steps
function animateProcessingSteps() {
    const steps = document.querySelectorAll('.processing-steps .step');
    steps.forEach((step, index) => {
        step.style.opacity = '0.3';
        setTimeout(() => {
            step.style.opacity = '1';
            step.style.transform = 'scale(1.1)';
            setTimeout(() => {
                step.style.transform = 'scale(1)';
            }, 300);
        }, index * 800);
    });
}

// Display results
function displayResults(videoData) {
    // Set processed GIF
    document.getElementById('video-display').src = `assets/${videoData.file_id}.gif`;

    // Set original text
    document.getElementById('original-text').textContent = videoData.original;

    // Set predicted text
    document.getElementById('predicted-text').textContent = videoData.prediction;

    // Calculate and set accuracy
    const accuracy = calculateAccuracy(videoData.original, videoData.prediction);
    const accuracyValue = document.getElementById('accuracy-value');
    accuracyValue.textContent = `${accuracy}%`;

    // Color code accuracy
    const accuracyBadge = document.getElementById('accuracy-badge');

    if (accuracy >= 80) {
        accuracyBadge.className = 'accuracy-badge high';
    } else if (accuracy >= 60) {
        accuracyBadge.className = 'accuracy-badge medium';
    } else {
        accuracyBadge.className = 'accuracy-badge low';
    }

    // Show results container with animation
    const demoContainer = document.getElementById('demo-container');
    demoContainer.style.display = 'grid';
    demoContainer.style.opacity = '0';

    setTimeout(() => {
        demoContainer.style.opacity = '1';
    }, 50);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
