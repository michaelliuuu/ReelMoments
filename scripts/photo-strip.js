const canvas = document.getElementById("strip");
const ctx = canvas.getContext("2d");

const imageCount = 4;
const images = [];
let loadedCount = 0;

// Load all images from localStorage
for (let i = 0; i < imageCount; i++) {
    const dataUrl = localStorage.getItem(`photo${i}`);
    console.log(`photo${i} loaded from localStorage:`, dataUrl);

    if (!dataUrl) {
        console.warn(`Missing photo${i} in localStorage`);
        continue;
    }
    
    if (dataUrl) {
        const img = new Image();
        img.src = dataUrl;

        img.onload = () => {
            images[i] = img;
            loadedCount++;

            // Once all images are loaded, draw on canvas
            if (loadedCount === imageCount) {
                    drawStrip(images);
            }
        };
    }
}

// Draws the photo strip
function drawStrip(images, backgroundColor = "white") {
    const scale = 0.5;
    const photoWidth = images[0].width * scale;
    const photoHeight = images[0].height * scale;

    const gap = 20;
    const paddingTop = 20;
    const paddingBottom = 60;
    const paddingSide = 20;

    const canvasWidth = photoWidth + paddingSide * 2;
    const canvasHeight =
        paddingTop + images.length * photoHeight + (images.length - 1) * gap + paddingBottom;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Fill with chosen background color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < images.length; i++) {
        const x = paddingSide;
        const y = paddingTop + i * (photoHeight + gap);
        ctx.drawImage(images[i], x, y, photoWidth, photoHeight);
    }

    ctx.fillStyle = "black";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ReelMoments", canvas.width / 2, canvas.height - 20);
}

// Handle SAVE button click
const saveButton = document.querySelector(".photo-strip-options button");
saveButton.addEventListener("click", () => {
    const dataURL = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "photo-strip.png";
    link.click();
});

// Change colour of photo strip
custom_colours = {
    pink: "#edc4f5",
    blue: "#869fd9",
    yellow: "#e6ed7e",
    red: "#e85035",
    green: "#7be364",
    white: "white"
};

Object.entries(custom_colours).forEach(([name, hex]) => {
    const button = document.getElementById(name);
    if (button) {
        button.addEventListener("click", () => {
            ctx.fillStyle = hex;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawStrip(images, hex);
        });
    }
});



