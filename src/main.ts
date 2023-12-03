import "./style.css";

const colors = {
  black: "#000000",
  blue: "#40ccd0",
  green: "#3cdb4e	",
  red: "#d04242	",
  yellow: "#ecdb33	",
};

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
// TODO: responsive
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let x = canvas.width / 2;
let y = canvas.height / 2;

let stroke = "black";
// Needed because we're in a requestAnimationFrame loop and thus it would trigger for every frame
let hasDownloadTimeout = false;
window.addEventListener("gamepadconnected", () => {
  const update = () => {
    let newX = x;
    let newY = y;
    let lineWidth = 2;

    navigator.getGamepads().forEach((gamepad) => {
      if (!gamepad) return;

      gamepad.buttons.forEach((button, i) => {
        if (!button.pressed) return;

        switch (i) {
          // A
          case 0:
            stroke = colors.green;
            break;
          // B
          case 1:
            stroke = colors.red;
            break;
          // X
          case 2:
            stroke = colors.blue;
            break;
          // Y
          case 3:
            stroke = colors.yellow;
            break;
          // L2
          case 6:
          // R2
          case 7:
            lineWidth = Math.min(20, Math.max(2, button.value * 20));
            break;
          // Select
          case 8:
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            break;
          // Start
          case 9:
            if (hasDownloadTimeout) return;
            hasDownloadTimeout = true;
            setTimeout(() => {
              hasDownloadTimeout = false;
            }, 1000);
            const a = document.createElement("a");
            a.href = canvas.toDataURL("image/png");
            a.download = `canvas-${new Date().toISOString()}.png`;
            document.body.appendChild(a);
            a.click();
        }
      });

      gamepad.axes.forEach((axis, i) => {
        if (
          // Axis didn't move
          axis === 0 ||
          // Axis is left stick
          i < 2
        ) {
          return;
        }

        if (i === 2) {
          // Right stick X
          newX += Math.min(10, Math.max(-10, axis * 10));
        }
        if (i === 3) {
          // Right stick Y
          newY += Math.min(10, Math.max(-10, axis * 10));
        }
      });
    });

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(newX, newY);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.closePath();
    x = newX;
    y = newY;

    requestAnimationFrame(update);
  };
  update();
});
