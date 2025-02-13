/* filepath: /c:/Users/eombr/OneDrive/Desktop/circle.bounce/ball.js */
const SIZE = 400;
const centerX = SIZE / 2;
const centerY = SIZE / 2;
const radius = SIZE / 2 - 10;

let ball = {
    x: centerX,
    y: centerY - 50,
    radius: 25,
    dx: (Math.random() * 2), 
    dy: -3,
    gravity: 0.07, 
    growthRate: 0.03, 
    color: "red",
    bounceFactor: 1,
    lastBounceTime: 0,
    minBounceInterval: 500,
    rainbowEffect: false,
    glowIntensity: 0
};

function drawBall(ctx) {
    ctx.save();
    if (ball.rainbowEffect) {
        const gradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.radius);
        const hue = (performance.now() / 20) % 360;
        gradient.addColorStop(0, `hsl(${hue}, 100%, 70%)`);
        gradient.addColorStop(0.5, `hsl(${(hue + 120) % 360}, 100%, 60%)`);
        gradient.addColorStop(1, `hsl(${(hue + 240) % 360}, 100%, 50%)`);
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = ball.color;
    }
    
    if (ball.glowIntensity > 0) {
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 20 * ball.glowIntensity;
    }
    
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawCircle(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    if (ball.glowIntensity > 0) {
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 15 * ball.glowIntensity;
    }
    ctx.stroke();
    ctx.restore();
}

function getRandomColor() {
    return `hsl(${Math.random() * 360}, 100%, 50%)`;
}