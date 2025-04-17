const COLORS = [
  { r: 69, g: 49, b: 234 }, // #4531ea
  { r: 204, g: 234, b: 113 }, // #ccea71
  { r: 157, g: 0, b: 229 }, // #9d00e5
];

class GlowParticle {
  constructor(radius, color) {
    this.color = color;

    console.log(this.color);

    this.x = 0;
    this.y = 0;

    this.radius = radius;

    this.sin = Math.random();
    this.speed = 0.01;

    this.vx = Math.random() * 4;
    this.vy = Math.random() * 4;
  }

  resize(stageWidth, stageHeight) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;

    this.x = Math.random() * this.stageWidth;
    this.y = Math.random() * this.stageHeight;
  }

  animate(ctx) {
    this.sin += this.speed;
    this.radius += Math.sin(this.sin);

    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0) {
      this.vx *= -1;
      this.x += 10;
    } else if (this.x > this.stageWidth) {
      this.vx *= -1;
      this.x -= 10;
    }

    if (this.y < 0) {
      this.vy *= -1;
      this.y += 10;
    } else if (this.y > this.stageHeight) {
      this.vy *= -1;
      this.y -= 10;
    }

    const g = ctx.createRadialGradient(
      this.x,
      this.y,
      this.radius * 0.01,
      this.x,
      this.y,
      this.radius
    );
    g.addColorStop(
      0,
      `rgba(${this.color.r},${this.color.g},${this.color.b}, 1)`
    );
    g.addColorStop(
      1,
      `rgba(${this.color.r},${this.color.g},${this.color.b}, 0)`
    );

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
  }
}

class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");

    this.totalParticles = 15;
    this.particles = [];
    this.maxRadius = 900;
    this.minRadius = 500;

    for (let i = 0; i < this.totalParticles; i++) {
      const particle = new GlowParticle(
        Math.random() * (this.maxRadius - this.minRadius) + this.minRadius,
        COLORS[i % COLORS.length]
      );

      this.particles[i] = particle;
    }

    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    window.requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;

    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    this.ctx.globalCompositeOperation = "saturation";
    for (let i = 0; i < this.totalParticles; i++) {
      this.particles[i].resize(this.stageWidth, this.stageHeight);
    }
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    for (let i = 0; i < this.totalParticles; i++) {
      this.particles[i].animate(this.ctx);
    }
  }
}

window.onload = () => {
  new App();
};
