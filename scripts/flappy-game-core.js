import { enviarPontuacao } from './api.js';

// Variáveis de controle do jogo
let gameStarted = false;
let gamePaused = false;
let showCoordinates = false;

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

// Cria o menu de pause
const pauseMenu = document.createElement('div');
pauseMenu.id = 'pauseMenu';
pauseMenu.style.position = 'absolute';
pauseMenu.style.top = '50%';
pauseMenu.style.left = '50%';
pauseMenu.style.transform = 'translate(-50%, -50%)';
pauseMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
pauseMenu.style.color = 'white';
pauseMenu.style.padding = '30px';
pauseMenu.style.borderRadius = '10px';
pauseMenu.style.textAlign = 'center';
pauseMenu.style.zIndex = '20';
pauseMenu.style.display = 'none';
pauseMenu.style.fontFamily = 'Arial, sans-serif';

pauseMenu.innerHTML = `
    <h2 style="margin-top: 0; margin-bottom: 20px;">JOGO PAUSADO</h2>
    <div style="margin-bottom: 15px;">
        <label style="display: flex; align-items: center; justify-content: center; gap: 10px;">
            <input type="checkbox" id="showCoordsCheckbox" ${showCoordinates ? 'checked' : ''}>
            <span>Mostrar Coordenadas</span>
        </label>
    </div>
    <button id="resumeButton" style="
        background: #4CAF50;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        margin-right: 10px;
    ">Continuar</button>
    <button id="loseButton" style="
        background: #f44336;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    ">Perder</button>
`;

// Adiciona ao body
document.body.appendChild(playButton);
document.body.appendChild(pauseMenu);

// Event listeners para o menu de pause (após a criação do HTML)
document.getElementById('resumeButton').addEventListener('click', () => {
    gamePaused = false;
    pauseMenu.style.display = 'none';
});

document.getElementById('loseButton').addEventListener('click', () => {
    gamePaused = false;
    pauseMenu.style.display = 'none';
    gameOver = true;
});

document.getElementById('showCoordsCheckbox').addEventListener('change', (e) => {
    showCoordinates = e.target.checked;
});

playButton.addEventListener('click', () => {
    playButton.style.display = 'none'; // esconde o botão
    gameStarted = true;
    gameOver = false; // Garantir que gameOver está false
    startGame(); // função que você vai definir para resetar o estado e começar
});

// Event listeners para o menu de pause (serão adicionados após a criação do HTML)

function startGame() {
    gameOver = false;
    score = 0;
    ballHeight = 0;
    ball.x = canvasWidth / 2;
    ball.y = canvasHeight / 2; // Começar no centro
    ball.vx = 0;
    ball.vy = 0;
    platforms = [
        {x: canvasWidth/2 - platformWidth/2, y: canvasHeight/2 + 40, width: platformWidth, height: platformHeight},
        {x: canvasWidth/4 - platformWidth/2, y: canvasHeight/2 - 120, width: platformWidth, height: platformHeight}
    ];
    // Não chama loop() aqui - o loop principal já está rodando
}

const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');

// Configurar resolução do canvas IMEDIATAMENTE
const canvasWidth = 600;
const canvasHeight = 400;

// Configurar dimensões do canvas
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Configurar para telas de alta resolução
const devicePixelRatio = window.devicePixelRatio || 1;

// Ajustar tamanho do canvas para a tela
canvas.style.width = canvasWidth + 'px';
canvas.style.height = canvasHeight + 'px';

// Escalar o canvas para telas de alta resolução
canvas.width = canvasWidth * devicePixelRatio;
canvas.height = canvasHeight * devicePixelRatio;

// Escalar o contexto para corresponder ao devicePixelRatio
ctx.scale(devicePixelRatio, devicePixelRatio);

const gravity = 0.35;

const platformWidth = 120;
const platformHeight = 34;

let bounce = -14;
let ballHeight = 0;
let gameOver = false;

const ballImage = new Image();
const platformImage = new Image();
platformImage.src = 'assets/plataforma.png';

let sun = {
    x: canvasWidth * 0.2,
    y: canvasHeight * 0.8,
    radius: 40,
}

let ball = {
    x: canvasWidth / 2,
    y: canvasHeight / 2, // Começar no centro do canvas
    radius: 1,
    vx: 0,
    vy: 0,
    color: 'blue',
};

let platforms = [
    {x: canvasWidth/2, y: canvasHeight - 200, width: platformWidth, height: platformHeight},
    {x: canvasWidth/4, y: canvasHeight - 320, width: platformWidth, height: platformHeight}
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
    const imgWidth = 90;
    const imgHeight = imgWidth / (673 / 528); // maintain aspect ratio

    ctx.save(); // Save current state
    if (falling) {
        ballImage.src = 'assets/pintinho_caindo_gpt.png'
    } else {
        ballImage.src = 'assets/pintinho_subindo.png'
    }

    if (facingRight) {
        // Move the origin to the ball's position and flip horizontally
        ctx.translate(ball.x + imgWidth / 2, ball.y - imgHeight);
        ctx.scale(-1, 1);
        ctx.drawImage(ballImage, 0, 0, imgWidth, imgHeight);
    } else {
        ctx.drawImage(ballImage, ball.x - imgWidth / 2, ball.y - imgHeight, imgWidth, imgHeight);
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
    if (ball.x < 0) ball.x = canvasWidth;
    if (ball.x > canvasWidth) ball.x = 0;

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
    if (ball.y + ball.radius > canvasHeight) {
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

    // Manter o personagem sempre no centro do canvas
    const centerY = canvasHeight / 2; // 200
    
    // Se o personagem não estiver no centro, mover as plataformas
    if (ball.y !== centerY) {
        const dy = ball.y - centerY;
        ball.y = centerY; // fixar a bolinha no centro da tela
        
        // Mover todas as plataformas na direção oposta
        for (let p of platforms) {
            p.y -= dy;
        }
        
        // Atualizar maxY
        maxY -= dy;
    }

    // Adiciona nova plataforma se necessário
    if (ball.y - platforms[platforms.length - 1].y >= 0 && ball.y - platforms[platforms.length - 1].y < 5) {
        platforms.push({
            x: Math.random() * (canvasWidth - platformWidth),
            y: -15,
            width: platformWidth,
            height: platformHeight
        });
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
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawSun();
    falling = ball.vy > 0.5
    drawBall(facingRight, falling);
    drawPlatforms();
    
    // Desenha o score com estilo melhorado
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 150, 35);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${score}`, 20, 32);
    
    // Debug: Coordenadas do personagem (apenas se ativado)
    if (showCoordinates) {
        ctx.fillStyle = 'red';
        ctx.font = '12px Arial';
        ctx.fillText(`Ball: (${Math.round(ball.x)}, ${Math.round(ball.y)})`, ball.x + 10, ball.y - 10);
        
        // Debug: Coordenadas das plataformas
        ctx.fillStyle = 'blue';
        platforms.forEach((p, index) => {
            ctx.fillText(`P${index}: (${Math.round(p.x)}, ${Math.round(p.y)})`, p.x + 5, p.y - 5);
        });
    }
}

function loop() {
        if (!gameStarted) {
            requestAnimationFrame(loop);
            return; // Não executa o loop se o jogo não foi iniciado
        }
        
        if (gamePaused) {
            requestAnimationFrame(loop);
            return; // Pausa o jogo mas mantém o loop rodando
        }
        
        if (gameOver) { 
             (async () => {
                let jogador = window.prompt("Digite seu nome: ")
                await enviarPontuacao(jogador, score); // substitua "Jogador" por nome real, se quiser
                setTimeout(() => {
                    playButton.textContent = 'Play Again';
                    playButton.style.display = 'block';
                    gameStarted = false;
                    gameOver = false; // Reset gameOver para permitir novo jogo
                }, 100);
            })();
            requestAnimationFrame(loop);
            return
        };
        update();
        draw();
        requestAnimationFrame(loop);
}

document.addEventListener('keydown', e => {
    // Controle de pause
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        if (gameStarted && !gameOver) {
            gamePaused = !gamePaused;
            pauseMenu.style.display = gamePaused ? 'block' : 'none';
        }
        return;
    }
    
    if (e.key === 'ArrowLeft') {
        ball.vx = -4
        facingRight = false; // Set facing left when moving left
    };
    if (e.key === 'ArrowRight') {
        ball.vx = 4
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
        bounce = -14; 
    }
})
loop()