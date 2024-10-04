// Access the necessary DOM elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photo = document.getElementById('photo');
const captureButton = document.getElementById('capture');
const filterSelect = document.getElementById('filter');

// Request access to the camera and stream the video to the video element
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.play();
    })
    .catch(err => {
        console.error('Error accessing the camera:', err);
        alert('Error accessing the camera. Please allow camera access.');
    });

// Capture the image when the 'Capture' button is clicked
captureButton.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    // Set the canvas dimensions to match the video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Apply the selected filter to the canvas
    const filter = filterSelect.value;
    canvas.style.filter = filter;

    // Convert the canvas to a data URL (base64 image) and display it in the <img> tag
    const dataUrl = canvas.toDataURL('image/png');
    photo.src = dataUrl;
    photo.style.display = 'block'; // Display the captured photo
});

// Apply filter in real-time to the video as per selection
filterSelect.addEventListener('change', () => {
    const filter = filterSelect.value;
    video.style.filter = filter;  // Apply filter to the video feed
});
