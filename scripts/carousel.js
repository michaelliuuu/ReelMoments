const track = document.getElementById('stripTrack');
const speed = 0.5;
let offset = 0;

track.innerHTML += track.innerHTML;

const totalScrollWidth = track.scrollWidth / 2;

function scrollLoop() {
    offset -= speed;

    if (Math.abs(offset) >= track.scrollWidth / 2) {
        offset = 0;
    }

    track.style.transform = `translateX(${offset}px)`;

    requestAnimationFrame(scrollLoop);
}

scrollLoop();
