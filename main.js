// Access the video element and other DOM elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photo = document.getElementById('photo');
const captureButton = document.getElementById('capture');
const filterSelect = document.getElementById('filter');

// Request camera access
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.play();
    })
    .catch(err => {
        console.error('Error accessing the camera:', err);
    });

// Capture the image from the video when the button is clicked
captureButton.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    // Draw the current video frame on the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Apply the selected filter
    const filter = filterSelect.value;
    canvas.style.filter = filter;

    // Show the image in the img tag
    const dataUrl = canvas.toDataURL('image/png');
    photo.src = dataUrl;
    photo.style.display = 'block'; // Display the captured photo
});

// Apply filter change in real-time as selected from the dropdown
filterSelect.addEventListener('change', () => {
    const filter = filterSelect.value;
    video.style.filter = filter;
});

    
    
