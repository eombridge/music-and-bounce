/* filepath: /c:/Users/eombr/OneDrive/Desktop/circle.bounce/app.js */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
const startButton = document.getElementById('startButton');
const audio = document.getElementById("bounceSound");
let particles = [];

canvas.width = SIZE;
canvas.height = SIZE;

function createExplosion(x, y, color) {
    for (let i = 0; i < 20; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCircle(ctx);
    drawBall(ctx);

    particles = particles.filter(particle => particle.life > 0);
    particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
    });

    ball.dy += ball.gravity;
    ball.x += ball.dx;
    ball.y += ball.dy;
    ball.radius += ball.growthRate;

    const distFromCenter = Math.sqrt((ball.x - centerX) ** 2 + (ball.y - centerY) ** 2);
    if (distFromCenter + ball.radius >= radius) {
        const normalX = (ball.x - centerX) / distFromCenter;
        const normalY = (ball.y - centerY) / distFromCenter;
        const dotProduct = ball.dx * normalX + ball.dy * normalY;

        ball.dx -= 2 * dotProduct * normalX;
        ball.dy -= 2 * dotProduct * normalY;

        const overlap = (distFromCenter + ball.radius) - radius;
        ball.x -= normalX * overlap;
        ball.y -= normalY * overlap;

        ball.dy *= ball.bounceFactor;
        ball.dx *= ball.bounceFactor;
        
        const currentTime = performance.now();
        const timeSinceLastBounce = currentTime - ball.lastBounceTime;
        
        if (audio.paused) {
            audio.play().catch(() => console.log("Audio play blocked"));
            ball.color = getRandomColor();
            createExplosion(ball.x, ball.y, ball.color);
        } else if (timeSinceLastBounce > ball.minBounceInterval) {
            audio.currentTime = 0;
            ball.color = getRandomColor();
            createExplosion(ball.x, ball.y, ball.color);
            
            ball.rainbowEffect = false;
            ball.glowIntensity = 0;
            canvas.style.animation = '';
        }
        
        ball.lastBounceTime = currentTime;

        const maxSpeed = 10;
        const speed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
        if (speed > maxSpeed) {
            const ratio = maxSpeed / speed;
            ball.dx *= ratio;
            ball.dy *= ratio;
        }
    }

    requestAnimationFrame(update);
}

startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    document.querySelector('.glow-text').style.display = 'none';
    canvas.style.display = 'block';
    audio.play().then(() => {
        console.log("오디오 재생 시작!");
        update();
    }).catch(error => {
        console.error("오디오 재생 실패:", error);
    });
});

document.addEventListener("click", (event) => {
    if (event.target !== startButton && canvas.style.display !== 'none') {
        if (audio.paused) {
            audio.play().catch(error => console.error("오디오 재생 실패:", error));
        }
        
        ball.rainbowEffect = true;
        ball.glowIntensity = 1;
        createExplosion(ball.x, ball.y, getRandomColor());
        
        canvas.style.animation = 'glow 1s infinite';
    }
});

audio.volume = 0.5;