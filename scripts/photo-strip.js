// Changes colour of the strip
// function change_colour(colour) {
//     document.getElementById("strip").style.backgroundColor = colour;
// }

// document.getElementById("pink").addEventListener("click", () => change_colour("pink"));
// document.getElementById("blue").addEventListener("click", () => change_colour("blue"));
// document.getElementById("red").addEventListener("click", () => change_colour("red"));
// document.getElementById("green").addEventListener("click", () => change_colour("green"));
// document.getElementById("yellow").addEventListener("click", () => change_colour("yellow"));


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

function drawStrip(images) {
    const width = images[0].width;
    const height = images[0].height;

    canvas.width = width;
    canvas.height = height * images.length;

    for (let i = 0; i < images.length; i++) {
        ctx.drawImage(images[i], 0, i * height, width, height);
    }
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

const stripContainer = document.getElementById("stripCanvas");
["pink", "blue", "yellow", "red", "green"].forEach(color => {
    document.getElementById(color).addEventListener("click", () => {
        stripContainer.style.backgroundColor = color;
    });
});



