const canvas = document.createElement("canvas");
canvas.id = "snow";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
let snowflakes = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createSnowflakes(count) {
  snowflakes = [];
  for (let i = 0; i < count; i++) {
    snowflakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      speed: Math.random() * 1 + 0.5,
      drift: Math.random() * 0.5 - 0.25
    });
  }
}

function drawSnowflakes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.beginPath();
  for (let flake of snowflakes) {
    ctx.moveTo(flake.x, flake.y);
    ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
  }
  ctx.fill();
  updateSnowflakes();
}

function updateSnowflakes() {
  for (let flake of snowflakes) {
    flake.y += flake.speed;
    flake.x += flake.drift;
    if (flake.y > canvas.height) {
      flake.y = 0;
      flake.x = Math.random() * canvas.width;
    }
  }
}

function animateSnow() {
  drawSnowflakes();
  requestAnimationFrame(animateSnow);
}

createSnowflakes(150);
animateSnow();