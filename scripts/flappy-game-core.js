const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');

// // canvas.style.backgroundColor = 'rgb(86, 38, 173)';

// let play = true; // Variable to control the game loop

const gravity = 0.3;
let bounce = -8;
const platformWidth = 60;
const platformHeight = 17;

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
}

function loop() {
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

document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        if (play) {      
            play = false;
    } else {
            play = true; 
    }
}
})
loop()