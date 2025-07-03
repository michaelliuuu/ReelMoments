// Ask permission for webcam access, then activates webcam
var video = document.querySelector("#video-element");
if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
        video.srcObject = stream;
    })
    .catch(function (error) {
        console.log("Something went wrong! Error statement: " + error);
        alert("Something went wrong! Error statement: " + error);
    });
}

// Add filter to webcam
let currentFilter = 'no_filter'; // Default filter

function applyFilter(filterName) {
    video.className = filterName;
    currentFilter = filterName; // Store the current filter
}

function applyCanvasFilter(ctx, width, height, filterName) {
    // Reset any previous filters
    ctx.filter = 'none';
    
    switch(filterName) {
        case 'noir':
            ctx.filter = 'grayscale(100%) contrast(150%)';
            break;
        case 'sepia':
            ctx.filter = 'sepia(100%)';
            break;
        case 'blur':
            ctx.filter = 'blur(5px)';
            break;
        case 'no_filter':
        default:
            ctx.filter = 'none';
    }
    
    // Reapply the filter by drawing the image again
    const imageData = ctx.getImageData(0, 0, width, height);
    ctx.putImageData(imageData, 0, 0);
}

// Takes photos
const canvas = document.getElementById('canvas');
const photoElements = [
    document.getElementById('photo1'),
    document.getElementById('photo2'),
    document.getElementById('photo3'),
    document.getElementById('photo4')
];
const capture_button = document.getElementById('capture-button');
let photoIndex = 0;
const timerEl = document.getElementById("timer");

function flashWebcam(callback) {
    video.style.transition = "filter 0.3s";
    video.style.filter = "brightness(3)";
    
    setTimeout(() => {
        video.style.filter = "brightness(1)";
        setTimeout(callback, 300);
    }, 300);
}

// Recursive photo-taking function
function takeNextPhoto() {
    if (photoIndex < photoElements.length) {
        showCountdown(3, () => {
            // Flash effect right before capturing
            flashWebcam(() => {
                captureAndSavePhoto(photoIndex);
                photoIndex++;

                // Wait 1 second after taking the photo, then take the next
                setTimeout(() => {
                    takeNextPhoto();
                }, 1000);
            });
        });
    } else {
        // Done taking all photos, redirect
        setTimeout(() => {
            window.location.href = "photo-strip.html";
        }, 1000);
    }
}

function captureAndSavePhoto(index) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    applyCanvasFilter(ctx, canvas.width, canvas.height, currentFilter);

    const imageDataUrl = canvas.toDataURL('image/jpeg');
    photoElements[index].src = imageDataUrl;
    localStorage.setItem(`photo${index}`, imageDataUrl);
    localStorage.setItem(`photo${index}_filter`, currentFilter);
    console.log(`Saved photo${index} with ${currentFilter} filter`);
}

function displaySavedPhotos() {
    for (let i = 0; i < 4; i++) {
        const photo = document.getElementById(`photo${i+1}`);
        const savedPhoto = localStorage.getItem(`photo${i}`);
        const savedFilter = localStorage.getItem(`photo${i}_filter`);
        
        if (savedPhoto) {
            photo.src = savedPhoto;
            photo.className = savedFilter || 'no_filter';
        }
    }
}

function showCountdown(seconds, callback) {
    timerEl.style.display = 'block';
    let timeLeft = seconds;
    timerEl.textContent = timeLeft;

    flashWebcam(() => {});

    const countdown = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;

        if (timeLeft > 0) {
            flashWebcam(() => {});
        }

        if (timeLeft <= 0) {
            clearInterval(countdown);
            timerEl.style.display = 'none';
            callback(); // Trigger photo capture after final flash
        }
    }, 1000);
}

// Start taking photos when button is clicked
capture_button.addEventListener('click', () => {
    // Wait 1 second before starting the first countdown
    setTimeout(() => {
        takeNextPhoto();
    }, 1000);
});