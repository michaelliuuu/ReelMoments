// Ask permission for webcam access, then activates webcam
var video = document.querySelector("#video-element");
if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
        video.srcObject = stream;
    })
    .catch(function (error) {
        console.log("Something went wrong! Error statement: " + error);
    });
}

// Add filter to webcam
function applyFilter(filterName) {
    video.className = filterName;
}

document.getElementById("noir").addEventListener("click", () => applyFilter("noir"));
document.getElementById("sepia").addEventListener("click", () => applyFilter("sepia"));
document.getElementById("no_filter").addEventListener("click", () => applyFilter("no_filter"));
document.getElementById("blur").addEventListener("click", () => applyFilter("blur"));

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

// Recursive photo-taking function
function takeNextPhoto() {
    if (photoIndex < photoElements.length) {
        showCountdown(3, () => {
            captureAndSavePhoto(photoIndex);
            photoIndex++;

            // Wait 1 second after taking the photo, then take the next
            setTimeout(() => {
                takeNextPhoto();
            }, 1000);
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

    const imageDataUrl = canvas.toDataURL('image/jpeg');
    photoElements[index].src = imageDataUrl;
    localStorage.setItem(`photo${index}`, imageDataUrl);
    console.log(`Saved photo${index} to localStorage`);
}

function showCountdown(seconds, callback) {
    timerEl.style.display = 'block';
    let timeLeft = seconds;
    timerEl.textContent = timeLeft;

    const countdown = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            timerEl.style.display = 'none';
            callback(); // Take the photo
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