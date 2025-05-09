const canvas = document.getElementById("flappyCanvas");
const ctx = canvas.getContext("2d");

const box = {
    x: 50,
    y: 50,
    width: 20,
    heigth: 20,
    color: 'blue'
}

function drawBox() {
    ctx.fillStyle = box.color;
    ctx.fillRect(box.x, box.y, box.width, box.heigth);
}

drawBox();
// Add event listener for keydown event
document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        // Move the box up
        box.y -= 10;
    }
    if (event.code === "ArrowDown") {
        // Move the box down
        box.y += 10;
    }
    if (event.code === "ArrowLeft") {
        // Move the box left
        box.x -= 10;
    }
    if (event.code === "ArrowRight") {
        // Move the box right
        box.x += 10;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBox();
});