const bird = document.getElementById("bird");
const playButton = document.getElementById("play-button");
const pipe = document.getElementById("pipe");
const scoreDisplay = document.getElementById("score");

let birdY = 200;
let velocity = 0;
let gravity = 0.4;
let isGameOver = false;
let score = 0;

document.addEventListener("keydown", jump);
document.addEventListener("click", jump);

function jump() {
    if (!isGameOver) {
        velocity = -10;
    }
}

function gameLoop() {
    if (isGameOver) return;

    velocity += gravity;
    birdY += velocity;
    bird.style.top = birdY + "px";

    const pipeX = parseInt(getComputedStyle(pipe).right) + 2;
    pipe.style.right = pipeX + "px";

    if (pipeX > 320) {
        pipe.style.right = "-50px";
        pipe.style.height = Math.floor(Math.random() * 200 + 100) + "px";
        score++;
        scoreDisplay.textContent = score;
    }

    // Colisão com chão ou teto
    if (birdY > 450 || birdY < 0) {
        gameOver();
    }

    // Colisão com cano
    const pipeTop = parseInt(pipe.style.height);
    if (320 - pipeX < 80 && 320 - pipeX > 0) {
        if (birdY < pipeTop) {
            gameOver();
        }
    }

    requestAnimationFrame(gameLoop);
}

function gameOver() {
    isGameOver = true;
    alert("Game Over! Pontuação: " + score);
    location.reload(); // Reinicia o jogo
}

pipe.style.right = "-50px";
gameLoop();
