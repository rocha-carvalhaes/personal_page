import { enviarPontuacao } from './api.js';

// Cria o botão
const playButton = document.createElement('button');
playButton.textContent = 'Play';
playButton.id = 'playButton';

// Estiliza o botão no centro da tela
playButton.style.position = 'absolute';
playButton.style.top = '50%';
playButton.style.left = '50%';
playButton.style.transform = 'translate(-50%, -50%)';
playButton.style.fontSize = '24px';
playButton.style.padding = '12px 24px';
playButton.style.cursor = 'pointer';
playButton.style.zIndex = '10';

// Adiciona ao body
document.body.appendChild(playButton);

let gameStarted = false;

playButton.addEventListener('click', () => {
    playButton.style.display = 'none'; // esconde o botão
    gameStarted = true;
    startGame(); // função que você vai definir para resetar o estado e começar
});

function startGame() {
    gameOver = false;
    score = 0;
    ballHeight = 0;
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 60;
    ball.vx = 0;
    ball.vy = 0;
    platforms = [
        {x: canvas.width/2 - platformWidth/2, y: canvas.height + 60, width: platformWidth, height: platformHeight},
        {x: canvas.width/4 - platformWidth/2, y: canvas.height, width: platformWidth, height: platformHeight}
    ];
    loop(); // recomeça o jogo
}

const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');

const gravity = 0.3;

const platformWidth = 60;
const platformHeight = 17;

let bounce = -8;
let ballHeight = 0;
let gameOver = false;

const ballImage = new Image();
const platformImage = new Image();
platformImage.src = 'assets/plataforma.png';

let sun = {
    x: canvas.width * 0.2,
    y: canvas.height * 0.8,
    radius: 10,
}

let ball = {
    x: canvas.width / 2,
    y: canvas.height - 60,
    radius: 5,
    vx: 0,
    vy: 0,
    color: 'blue',
};

let platforms = [
    {x: canvas.width/2 - platformWidth/2, y: canvas.height + 60, width: platformWidth, height: platformHeight},
    {x: canvas.width/4 - platformWidth/2, y: canvas.height, width: platformWidth, height: platformHeight}
];
let score = 0;
let maxY = ball.y;

function drawSun() {
    ctx.fillStyle ='rgb(217, 240, 244)';
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function drawBall(facingRight = false, falling = false) {
    const imgWidth = 60;
    const imgHeight = imgWidth / (673 / 528); // maintain aspect ratio

    ctx.save(); // Save current state
    if (falling) {
        ballImage.src = 'assets/pintinho_caindo_gpt.png'
    } else {
        ballImage.src = 'assets/pintinho_subindo.png'
    }

    if (facingRight) {
        // Move the origin to the ball's position and flip horizontally
        ctx.translate(ball.x + imgWidth / 2, ball.y - imgHeight * 0.7);
        ctx.scale(-1, 1);
        ctx.drawImage(ballImage, 0, 0, imgWidth, imgHeight);
    } else {
        ctx.drawImage(ballImage, ball.x - imgWidth / 2, ball.y - imgHeight * 0.7, imgWidth, imgHeight);
    }

    ctx.restore(); // Restore original state
}


function drawPlatforms() {
    ctx.fillStyle = 'rgb(150, 86, 27)';
    for (let p of platforms) {
    // ctx.fillRect(p.x, p.y, p.width, p.height);
    ctx.drawImage(platformImage, p.x, p.y, p.width, p.height);
    }
}

function update() {
    ball.vy += gravity;
    ball.y += ball.vy;
    ball.x += ball.vx;
    ballHeight -= ball.vy;
    if (ballHeight < -250) { gameOver = true; }

    // Wrap horizontally
    if (ball.x < 0) ball.x = canvas.width;
    if (ball.x > canvas.width) ball.x = 0;

    // Bounce on platform
    for (let p of platforms) {
    if (
        ball.vy > 0 &&
        ball.x + ball.radius > p.x &&
        ball.x - ball.radius < p.x + p.width &&
        ball.y + ball.radius > p.y &&
        ball.y + ball.radius < p.y + p.height
    )   {
        ball.vy = bounce;
        }
    }

    // Bounce on floor
    if (ball.y + ball.radius > canvas.height) {
        ball.vy = bounce;
    }

    // Scroll platforms when ball goes high or low
    // if (ball.y > maxY) {
    //     const dy = ball.y - maxY;
    //     maxY = ball.y;
    //     // ball.y = maxY;
    //     for (let p of platforms) p.y -= dy;
    //     // console.log("sobe",maxY, ball.y);
    // }

    const scrollThresholdUp = canvas.height / 2;
    const scrollThresholdDown = canvas.height / 2;

    if (ball.y < scrollThresholdUp) {
        const dy = scrollThresholdUp - ball.y;
        ball.y = scrollThresholdUp; // fixar a bolinha no meio da tela
        maxY -= dy;

        for (let p of platforms) p.y += dy;

        // Adiciona nova plataforma se necessário
        if (ball.y - platforms[platforms.length - 1].y >= 0 && ball.y - platforms[platforms.length - 1].y < 5) {
            platforms.push({
                x: Math.random() * (canvas.width - platformWidth),
                y: -15,
                width: platformWidth,
                height: platformHeight
            });
        }
    } else if (ball.y > scrollThresholdDown) {
        const dy = ball.y - scrollThresholdDown;
        ball.y = scrollThresholdDown; // fixar a bolinha no meio da tela
        maxY += dy;

        for (let p of platforms) p.y -= dy;

        // Remove plataformas que saíram da tela
        // if (platforms[platforms.length - 1].y > canvas.height) {
        //     platforms.pop();
        // }
    }
    // Game over
//   if (ball.y > canvas.height) {
//     alert(`Game Over! Score: ${score}`);
//     document.location.reload();
//   }
    score = platforms.length - 2; // Update score based on the number of platforms
}

let facingRight = ball.vx > 0; // or some other logic
// drawBall(facingRight);

let falling = ball.vy > 0.5;


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSun();
    falling = ball.vy > 0.5
    drawBall(facingRight, falling);
    drawPlatforms();
    
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
    ctx.fillText('Ball Height: ' + Math.round(ballHeight), 10, 60);
}

function loop() {
        if (gameOver) { 
             (async () => {
                let jogador = window.prompt("Digite seu nome: ")
                await enviarPontuacao(jogador, score); // substitua "Jogador" por nome real, se quiser
                setTimeout(() => {
                    playButton.textContent = 'Play Again';
                    playButton.style.display = 'block';
                    gameStarted = false;
                }, 100);
            })();
            return
        };
        update();
        draw();
        requestAnimationFrame(loop);
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
        ball.vx = -3
        facingRight = false; // Set facing left when moving left
    };
    if (e.key === 'ArrowRight') {
        ball.vx = 3
        facingRight = true; // Set facing right when moving right
    }
});
document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') ball.vx = 0;
});
document.addEventListener('keydown', e => {
    if (e.key === ' ') {
        ball.color = 'red';
        bounce = -0.5; 
    }
});
document.addEventListener('keyup', e => {
    if (e.key === ' ') {
        ball.color = 'blue'
        bounce = -8; 
    }
})
loop()