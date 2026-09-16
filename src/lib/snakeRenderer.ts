import { Snake } from "./gameEngine";

export function drawSnake(
  ctx: CanvasRenderingContext2D,
  snake: Snake,
  _timestamp: number,
  isMagnetActive: boolean = false,
  isMultiplierActive: boolean = false,
  emojiGlyph?: string
) {
  if (!snake.isAlive || snake.segments.length === 0) return;
  const { segments, skin, radius, isBoosting, angle, isPlayer } = snake;
  ctx.save();
  if (isBoosting) { ctx.shadowColor = isPlayer ? "#38bdf8" : "#f97316"; ctx.shadowBlur = 15; }
  else if (isPlayer && isMagnetActive) { ctx.shadowColor = "#3b82f6"; ctx.shadowBlur = 20; }
  else if (isPlayer && isMultiplierActive) { ctx.shadowColor = "#eab308"; ctx.shadowBlur = 20; }
  const len = segments.length;
  for (let i = len - 1; i >= 1; i--) {
    const seg = segments[i];
    const taper = Math.max(0.4, Math.min(1.0, (len - i) / 8 + 0.3));
    const r = radius * taper;
    let segColor = skin.bodyColor;
    if (skin.bodyPattern === "striped" && i % 4 < 2) segColor = skin.secondaryColor;
    else if (skin.bodyPattern === "spotted" && i % 5 === 0) segColor = skin.secondaryColor;
    ctx.fillStyle = segColor;
    ctx.beginPath(); ctx.arc(seg.x, seg.y, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.beginPath(); ctx.arc(seg.x - r * 0.25, seg.y - r * 0.25, r * 0.45, 0, Math.PI * 2); ctx.fill();
  }
  const head = segments[0];
  ctx.save(); ctx.translate(head.x, head.y); ctx.rotate(angle);
  ctx.fillStyle = skin.headColor; ctx.beginPath(); ctx.arc(0, 0, radius * 1.1, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath(); ctx.ellipse(-radius * 0.2, -radius * 0.3, radius * 0.6, radius * 0.3, -Math.PI / 6, 0, Math.PI * 2); ctx.fill();
  const eyeOffsetX = radius * 0.45, eyeOffsetY = radius * 0.48, eyeRadius = radius * 0.42, pupilRadius = radius * 0.22;
  ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(eyeOffsetX, eyeOffsetY, eyeRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(eyeOffsetX, -eyeOffsetY, eyeRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#0f172a";
  const pupilLookX = eyeOffsetX + eyeRadius * 0.35;
  ctx.beginPath(); ctx.arc(pupilLookX, eyeOffsetY, pupilRadius, 0, Math.PI * 2); ctx.arc(pupilLookX, -eyeOffsetY, pupilRadius, 0, Math.PI * 2); ctx.fill();
  const r2 = radius;
  if (skin.hatType === "cap_red") {
    ctx.fillStyle = "#dc2626"; ctx.beginPath();
    ctx.arc(-r2 * 0.25, 0, r2 * 0.55, -Math.PI / 2, Math.PI / 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.ellipse(-r2 * 0.1, 0, r2 * 0.65, r2 * 0.28, 0, 0, Math.PI * 2); ctx.fill();
  } else if (skin.hatType === "crown") {
    ctx.fillStyle = "#fbbf24"; ctx.beginPath();
    ctx.moveTo(-r2 * 0.7, -r2 * 0.5); ctx.lineTo(-r2 * 0.5, -r2 * 0.8); ctx.lineTo(-r2 * 0.25, -r2 * 0.5); ctx.lineTo(-r2 * 0.1, -r2 * 0.8); ctx.lineTo(r2 * 0.05, -r2 * 0.5); ctx.closePath(); ctx.fill();
  } else if (skin.hatType === "party") {
    ctx.fillStyle = "#ec4899"; ctx.beginPath(); ctx.moveTo(-r2 * 0.8, 0); ctx.lineTo(-r2 * 0.3, -r2 * 0.35); ctx.lineTo(-r2 * 0.3, r2 * 0.35); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  ctx.font = "bold 13px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
  ctx.fillStyle = isPlayer ? "#fef08a" : "#ffffff";
  ctx.shadowColor = "rgba(0,0,0,0.8)"; ctx.shadowBlur = 4;
  ctx.fillText(snake.name, head.x, head.y - radius * 1.4);
  if (isPlayer && emojiGlyph && emojiGlyph !== "✖") {
    const bx = head.x + 28, by = head.y - radius * 2.1;
    ctx.shadowBlur = 0; ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(bx - 18, by - 18, 36, 30, 8);
    else ctx.rect(bx - 18, by - 18, 36, 30);
    ctx.fill(); ctx.font = "20px sans-serif"; ctx.fillText(emojiGlyph, bx, by - 1);
  }
  ctx.restore();
}
