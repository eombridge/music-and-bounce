/* filepath: /c:/Users/eombr/OneDrive/Desktop/circle.bounce/app.js */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
const startButton = document.getElementById('startButton');
const audio = document.getElementById("bounceSound");
let particles = [];

// 볼륨 알림창 닫기 기능
document.querySelector('.close-notice').addEventListener('click', function() {
    document.getElementById('volumeNotice').style.display = 'none';
});

// 시작 버튼 클릭 시 알림창 자동 닫기 추가
startButton.addEventListener('click', () => {
    document.getElementById('volumeNotice').style.display = 'none';
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

// 화면 크기 변경 시 캔버스 크기 조정
window.addEventListener('resize', () => {
    const newSize = Math.min(window.innerWidth, window.innerHeight) * 1.5;
    canvas.width = newSize;
    canvas.height = newSize;
});

// 초기 캔버스 크기 설정
canvas.width = SIZE;
canvas.height = SIZE;

function createExplosion(x, y, color) {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        // 공의 표면에서 파티클 시작
        const startX = x + Math.cos(angle) * ball.radius;
        const startY = y + Math.sin(angle) * ball.radius;
        particles.push(new Particle(startX, startY, color));
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
        
        // 클릭 이펙트가 활성화되어 있지 않을 때만 노래 초기화
        if (!ball.rainbowEffect) {
            if (audio.paused) {
                audio.play().catch(() => console.log("Audio play blocked"));
                ball.color = getRandomColor();
                createExplosion(ball.x, ball.y, ball.color);
            } else if (timeSinceLastBounce > ball.minBounceInterval) {
                audio.currentTime = 0;
                ball.color = getRandomColor();
                createExplosion(ball.x, ball.y, ball.color);
            }
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

// 클릭 이벤트 수정 - 이벤트 버블링 방지
document.addEventListener("click", (event) => {
    if (event.target !== startButton && canvas.style.display !== 'none') {
        event.preventDefault();
        event.stopPropagation();
        
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