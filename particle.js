/* filepath: /c:/Users/eombr/OneDrive/Desktop/circle.bounce/particle.js */
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = 2;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.dx = Math.cos(angle) * speed;
        this.dy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.life = 1;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.life -= 0.02;
        this.alpha = this.life;
        this.radius *= 0.99;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}