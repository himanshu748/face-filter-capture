const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photo = document.getElementById('photo');
const captureButton = document.getElementById('capture');
const filterSelect = document.getElementById('filter');

// Start the video stream
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Error accessing the camera", err);
    });

// Capture the image and apply the filter
captureButton.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    // Draw the image from the live camera feed onto the canvas
    context.drawImage(video, 0, 0, 640, 480);
    
    // Convert the canvas content (captured image) into a base64 image data URL
    const imageDataUrl = canvas.toDataURL('image/png');
    
    // Send the captured image and the selected filter to the Flask backend
    fetch('/capture', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            image: imageDataUrl,
            filter: filterSelect.value
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Show the captured image with the applied filter in the <img> tag
            photo.src = `/static/images/${data.filename}`;
        } else {
            console.error('Error in response:', data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
