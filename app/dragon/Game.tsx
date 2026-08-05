"use client";

import { useEffect, useRef, useState } from "react";
import {
  CITIES,
  HENGQIN,
  cityColor,
  titleFor,
} from "@/lib/cities";
import { addRank, rankPosition, RankEntry } from "@/lib/ranks";
import Leaderboard from "../components/Leaderboard";

const W = 960;
const H = 540;
const GAME_SECONDS = 10;
const BASE_SPEED = 165;
const CITY_SCORE = 150;
const DOT_SCORE = 10;

interface Dot {
  x: number;
  y: number;
}

interface World {
  dots: Dot[];
  gotDots: Set<number>;
  unlocked: Set<string>;
  score: number;
  time: number;
  boat: { x: number; y: number; angle: number };
  keys: Set<string>;
  touch: { x: number; y: number } | null;
  wind: number;
  windT: number;
  popups: { x: number; y: number; text: string; t: number }[];
}

function makeDots(): Dot[] {
  const dots: Dot[] = [];
  while (dots.length < 44) {
    const x = 40 + Math.random() * (W - 80);
    const y = 40 + Math.random() * (H - 80);
    const nearCity = CITIES.some(
      (c) => Math.hypot(c.x - x, c.y - y) < 55
    );
    if (!nearCity) dots.push({ x, y });
  }
  return dots;
}

function newWorld(): World {
  return {
    dots: makeDots(),
    gotDots: new Set(),
    unlocked: new Set(),
    score: 0,
    time: GAME_SECONDS,
    boat: { x: 160, y: 420, angle: 0 },
    keys: new Set(),
    touch: null,
    wind: 0,
    windT: 0,
    popups: [],
  };
}

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<World>(newWorld());
  const phaseRef = useRef<"idle" | "playing" | "over">("idle");
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [hud, setHud] = useState({ time: GAME_SECONDS, score: 0, cities: 0, wind: 0 });
  const [result, setResult] = useState<{ score: number; cities: string[] } | null>(null);
  const [nick, setNick] = useState("");
  const [saved, setSaved] = useState<RankEntry | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);

  const start = () => {
    worldRef.current = newWorld();
    setResult(null);
    setSaved(null);
    setShareUrl(null);
    setNick("");
    phaseRef.current = "playing";
    setPhase("playing");
  };

  const finish = () => {
    const w = worldRef.current;
    phaseRef.current = "over";
    setPhase("over");
    setResult({
      score: w.score,
      cities: [...w.unlocked],
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tick = (ctx: CanvasRenderingContext2D, dt: number) => {
      const w = worldRef.current;
      const phase = phaseRef.current;

      if (phase === "playing") {
        w.time -= dt;
        w.windT += dt;
        if (w.windT > 4) {
          w.windT = 0;
          const r = Math.random();
          w.wind = r < 0.6 ? 0 : r < 0.8 ? 0.45 : -0.35;
        }

        const speed = BASE_SPEED * (1 + w.wind);
        let dx = 0;
        let dy = 0;
        const k = w.keys;
        if (k.has("arrowup") || k.has("w")) dy -= 1;
        if (k.has("arrowdown") || k.has("s")) dy += 1;
        if (k.has("arrowleft") || k.has("a")) dx -= 1;
        if (k.has("arrowright") || k.has("d")) dx += 1;
        if (w.touch) {
          const tx = w.touch.x - w.boat.x;
          const ty = w.touch.y - w.boat.y;
          const d = Math.hypot(tx, ty);
          if (d > 12) {
            dx = tx / d;
            dy = ty / d;
          } else {
            dx = 0;
            dy = 0;
          }
        }
        if (dx !== 0 || dy !== 0) {
          const len = Math.hypot(dx, dy);
          w.boat.x += (dx / len) * speed * dt;
          w.boat.y += (dy / len) * speed * dt;
          w.boat.x = Math.max(20, Math.min(W - 20, w.boat.x));
          w.boat.y = Math.max(20, Math.min(H - 20, w.boat.y));
          const target = Math.atan2(dy, dx);
          let diff = target - w.boat.angle;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          w.boat.angle += diff * Math.min(1, dt * 10);
        }

        for (let i = 0; i < w.dots.length; i++) {
          if (w.gotDots.has(i)) continue;
          if (Math.hypot(w.dots[i].x - w.boat.x, w.dots[i].y - w.boat.y) < 20) {
            w.gotDots.add(i);
            w.score += DOT_SCORE;
            w.popups.push({ x: w.dots[i].x, y: w.dots[i].y - 10, text: "+10", t: 1 });
          }
        }
        for (const c of CITIES) {
          if (w.unlocked.has(c.id)) continue;
          if (Math.hypot(c.x - w.boat.x, c.y - w.boat.y) < 32) {
            w.unlocked.add(c.id);
            w.score += CITY_SCORE;
            w.popups.push({ x: c.x, y: c.y - 34, text: `解锁 ${c.name} +${CITY_SCORE}`, t: 1.4 });
          }
        }
        w.popups.forEach((p) => (p.t -= dt));
        w.popups = w.popups.filter((p) => p.t > 0);

        if (w.time <= 0) {
          w.time = 0;
          finish();
        }
      }

      draw(ctx, w, phase);
      const next = { time: w.time, score: w.score, cities: w.unlocked.size, wind: w.wind };
      setHud((h) =>
        h.time !== next.time || h.score !== next.score || h.cities !== next.cities || h.wind !== next.wind
          ? next
          : h
      );
    };

    const onKey = (down: boolean) => (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", " "].includes(k)) {
        e.preventDefault();
      }
      if (k === " ") {
        if (phaseRef.current === "idle") start();
        return;
      }
      if (down) worldRef.current.keys.add(k);
      else worldRef.current.keys.delete(k);
    };
    const kd = onKey(true);
    const ku = onKey(false);
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);

    const loop = (t: number) => {
      const dt = Math.min((t - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = t;
      tick(ctx, dt);
      rafRef.current = requestAnimationFrame(loop);
    };
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
    };
  }, []);

  const onTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const t = e.touches[0];
    const x = (t.clientX - rect.left) * scaleX;
    const y = (t.clientY - rect.top) * scaleY;
    worldRef.current.touch = { x, y };
  };

  const submitScore = () => {
    if (!result) return;
    const title = titleFor(result.score);
    const entry = addRank({
      nick: nick.trim() || "无名桨手",
      score: result.score,
      cities: result.cities,
      title: title.name,
    });
    setSaved(entry);
  };

  const generateShare = () => {
    if (!result || !saved) return;
    const url = drawShareCard(result, saved);
    setShareUrl(url);
  };

  const title = titleFor(result?.score ?? 0);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="pixel-border-pac relative bg-arcade-2 p-3 sm:p-4">
        <div className="mb-3 flex items-center justify-between px-1">
          <div className="flex items-center gap-4">
            <span className="pixel-font text-[10px] text-ghost-cyan">
              TIME {Math.ceil(hud.time).toString().padStart(2, "0")}
            </span>
            <span className="pixel-font text-[10px] text-pac">
              WAVE {String(hud.score).padStart(4, "0")}
            </span>
            <span className="pixel-font text-[10px] text-ghost-pink">
              CITIES {hud.cities}/{CITIES.length}
            </span>
          </div>
          {phase === "playing" && hud.wind !== 0 && (
            <span className="pixel-font text-[10px] text-ghost-cyan">
              {hud.wind > 0 ? "顺风 ▶▶ +45%" : "逆风 ◀◀ -35%"}
            </span>
          )}
          {phase !== "playing" && (
            <span className="pixel-font text-[10px] text-slate-600">
              WASD / 方向键 · 触屏拖动
            </span>
          )}
        </div>
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            onTouchStart={onTouch}
            onTouchMove={onTouch}
            onTouchEnd={() => (worldRef.current.touch = null)}
            onTouchCancel={() => (worldRef.current.touch = null)}
            className="block w-full touch-none select-none"
            style={{ aspectRatio: `${W}/${H}` }}
          />
          {phase === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-arcade/70 backdrop-blur-[2px]">
              <p className="pixel-font text-lg text-pac blink">READY?</p>
              <p className="max-w-md px-6 text-center text-sm text-slate-300">
                驾驶小龙舟漫游大湾区：收集浪花点，点亮 11 座城市，10 秒极限冲刺尽力得分！
              </p>
              <button
                onClick={start}
                className="pixel-border-pac bg-pac px-10 py-3.5 text-lg font-bold text-black transition-transform hover:-translate-y-0.5"
              >
                ▶ 开始漫游
              </button>
            </div>
          )}
          {phase === "over" && result && (
            <div className="absolute inset-0 flex items-center justify-center overflow-y-auto bg-arcade/85 p-4 backdrop-blur-[2px]">
              <div className="pixel-border-pac w-full max-w-md bg-arcade-2 p-6 sm:p-8">
                <p className="pixel-font text-center text-lg text-pac">TIME UP!</p>
                <div className="mt-6 text-center">
                  <p className="text-5xl">{title.emoji}</p>
                  <h3 className="mt-2 text-xl font-bold text-white">{title.name}</h3>
                  <p className="pixel-font mt-3 text-[10px] text-slate-500">
                    YUNNKI RANK · 9+2+1
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                  <div className="border-2 border-arcade-line bg-arcade-3/60 py-3">
                    <p className="text-2xl font-bold text-pac">{result.score}</p>
                    <p className="mt-1 text-xs text-slate-400">浪花值</p>
                  </div>
                  <div className="border-2 border-arcade-line bg-arcade-3/60 py-3">
                    <p className="text-2xl font-bold text-ghost-cyan">
                      {result.cities}/{CITIES.length}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">解锁城市</p>
                  </div>
                  <div className="border-2 border-arcade-line bg-arcade-3/60 py-3">
                    <p className="text-2xl font-bold text-ghost-pink">#{rankPosition(result.score)}</p>
                    <p className="mt-1 text-xs text-slate-400">本地排名</p>
                  </div>
                </div>
                {!saved ? (
                  <div className="mt-6">
                    <input
                      value={nick}
                      onChange={(e) => setNick(e.target.value)}
                      placeholder="输入你的昵称（如：珠江小桨手）"
                      className="w-full border-2 border-arcade-line bg-arcade-3/60 px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-pac"
                    />
                    <button
                      onClick={submitScore}
                      className="mt-3 w-full bg-pac py-3 font-bold text-black transition-transform hover:-translate-y-0.5"
                    >
                      保存我的龙舟身份 ▶ 上榜
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 space-y-3">
                    <p className="pixel-font text-center text-[10px] text-ghost-cyan">
                      SAVED · RANK #{rankPosition(saved.score)}
                    </p>
                    <button
                      onClick={generateShare}
                      className="w-full border-2 border-pac bg-pac py-3 font-bold text-black transition-transform hover:-translate-y-0.5"
                    >
                      📤 生成分享图
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={start}
                        className="border-2 border-arcade-line py-2.5 text-sm text-slate-200 hover:border-pac hover:text-pac"
                      >
                        再来一局
                      </button>
                      <a
                        href="/demo/"
                        className="border-2 border-arcade-line py-2.5 text-center text-sm text-slate-200 hover:border-pac hover:text-pac"
                      >
                        加入桨刻 →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {shareUrl && (
        <div className="mt-6 flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shareUrl}
            alt="我的大湾区龙舟身份卡"
            className="w-full max-w-[300px] border-2 border-pac/40"
          />
          <p className="pixel-font text-[9px] text-slate-500">
            LONG PRESS TO SAVE · 长按保存分享
          </p>
        </div>
      )}

      <Leaderboard />
    </div>
  );
}

/* ---------------- 绘制 ---------------- */

function draw(ctx: CanvasRenderingContext2D, w: World, phase: string) {
  ctx.clearRect(0, 0, W, H);

  // 底色
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0a1438");
  bg.addColorStop(1, "#060b22");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 点阵
  ctx.fillStyle = "rgba(120,140,220,0.10)";
  for (let x = 8; x < W; x += 24) {
    for (let y = 8; y < H; y += 24) {
      ctx.fillRect(x, y, 2, 2);
    }
  }

  // 水系（珠江水系感觉）
  ctx.lineCap = "round";
  const rivers: number[][] = [
    // 西江：肇庆 → 江门 → 珠海
    [175, 150, 250, 240, 315, 370, 505, 440],
    // 北江：广州 → 河口
    [470, 170, 470, 280, 505, 380, 560, 460],
    // 东江：惠州 → 深圳
    [680, 150, 660, 240, 660, 320, 630, 400],
    // 珠江口
    [560, 460, 615, 490, 700, 460, 760, 420],
    // 东江下游到香港
    [630, 400, 700, 430, 760, 420],
  ];
  for (const r of rivers) {
    ctx.beginPath();
    ctx.moveTo(r[0], r[1]);
    if (r.length === 8) {
      ctx.bezierCurveTo(r[2], r[3], r[4], r[5], r[6], r[7]);
    } else {
      ctx.quadraticCurveTo(r[2], r[3], r[4], r[5]);
    }
    ctx.strokeStyle = "rgba(70,160,255,0.30)";
    ctx.lineWidth = 14;
    ctx.stroke();
    ctx.strokeStyle = "rgba(120,200,255,0.22)";
    ctx.lineWidth = 6;
    ctx.stroke();
  }

  // 城市节点
  for (const c of CITIES) {
    const unlocked = w.unlocked.has(c.id);
    ctx.beginPath();
    ctx.arc(c.x, c.y, unlocked ? 24 : 20, 0, Math.PI * 2);
    ctx.fillStyle = unlocked ? cityColor(c.id) : "rgba(90,106,200,0.35)";
    ctx.fill();
    if (unlocked) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 32, 0, Math.PI * 2);
      ctx.strokeStyle = cityColor(c.id);
      ctx.globalAlpha = 0.4 + 0.3 * Math.sin(performance.now() / 200);
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.beginPath();
    ctx.arc(c.x, c.y, 20, 0, Math.PI * 2);
    ctx.strokeStyle = unlocked ? "#fff" : "rgba(160,175,230,0.5)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = unlocked ? "#fff" : "rgba(160,175,230,0.85)";
    ctx.font = "bold 15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(c.name, c.x, c.y + 4);
  }

  // 横琴重点节点
  ctx.save();
  ctx.translate(HENGQIN.x, HENGQIN.y);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = "#fee100";
  ctx.fillRect(-10, -10, 20, 20);
  ctx.restore();
  ctx.fillStyle = "#fee100";
  ctx.font = "bold 11px sans-serif";
  ctx.fillText("HENGQIN 横琴", HENGQIN.x + 20, HENGQIN.y - 8);

  // 浪花点（能量豆）
  if (phase !== "idle") {
    w.dots.forEach((d, i) => {
      if (w.gotDots.has(i)) return;
      const blink = 0.5 + 0.5 * Math.sin(performance.now() / 220 + i);
      ctx.beginPath();
      ctx.arc(d.x, d.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(254,225,0,${0.5 + 0.5 * blink})`;
      ctx.fill();
    });
  }

  // 风向提示
  if (phase === "playing" && w.wind !== 0) {
    ctx.fillStyle = w.wind > 0 ? "rgba(0,229,255,0.8)" : "rgba(255,45,85,0.8)";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText(w.wind > 0 ? "▶▶ 顺风" : "◀◀ 逆风", 20, H - 16);
  }

  // 分数飘字
  w.popups.forEach((p) => {
    ctx.globalAlpha = Math.max(0, p.t / 1.4);
    ctx.fillStyle = "#fee100";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(p.text, p.x, p.y);
    ctx.globalAlpha = 1;
  });

  // 龙舟
  drawBoat(ctx, w.boat.x, w.boat.y, w.boat.angle, phase === "playing");
}

function drawBoat(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  moving: boolean
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  // 船体
  ctx.fillStyle = "#ff2d55";
  ctx.beginPath();
  ctx.moveTo(18, 0);
  ctx.lineTo(-14, -8);
  ctx.lineTo(-10, 8);
  ctx.closePath();
  ctx.fill();
  // 龙头（金色）
  ctx.fillStyle = "#fee100";
  ctx.beginPath();
  ctx.moveTo(26, 0);
  ctx.lineTo(16, -6);
  ctx.lineTo(20, 0);
  ctx.lineTo(16, 6);
  ctx.closePath();
  ctx.fill();
  // 桨手小点
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(4, 0, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2436ff";
  ctx.beginPath();
  ctx.arc(-7, -3, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-7, 3, 3.5, 0, Math.PI * 2);
  ctx.fill();
  // 尾旗
  ctx.strokeStyle = "#ff9ad5";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(-22, 0);
  ctx.stroke();
  if (moving) {
    ctx.fillStyle = "#00e5ff";
    ctx.beginPath();
    ctx.moveTo(-22, 0);
    ctx.lineTo(-30, -5);
    ctx.lineTo(-30, 5);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  // 尾部浪花（移动时）
  if (moving) {
    ctx.fillStyle = "rgba(120,200,255,0.5)";
    const bx = x - Math.cos(angle) * 24;
    const by = y - Math.sin(angle) * 24;
    for (let i = 0; i < 4; i++) {
      const a = angle + Math.PI + (i - 1.5) * 0.4;
      ctx.beginPath();
      ctx.arc(bx + Math.cos(a) * (14 + i * 5), by + Math.sin(a) * (14 + i * 5), 3 - i * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/* ---------------- 分享图 ---------------- */

function drawShareCard(
  result: { score: number; cities: string[] },
  entry: RankEntry
): string {
  const cw = 750;
  const ch = 1334;
  const cv = document.createElement("canvas");
  cv.width = cw;
  cv.height = ch;
  const ctx = cv.getContext("2d")!;

  ctx.fillStyle = "#070b1e";
  ctx.fillRect(0, 0, cw, ch);
  ctx.fillStyle = "rgba(120,140,220,0.10)";
  for (let x = 10; x < cw; x += 26) {
    for (let y = 10; y < ch; y += 26) {
      ctx.fillRect(x, y, 3, 3);
    }
  }

  const title = titleFor(result.score);

  // 顶部
  ctx.fillStyle = "#fee100";
  ctx.fillRect(60, 70, 630, 8);
  ctx.fillStyle = "#00e5ff";
  ctx.font = "bold 30px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("9+2+1 · 大湾区龙舟漫游", cw / 2, 150);
  ctx.fillStyle = "rgba(160,175,230,0.8)";
  ctx.font = "24px sans-serif";
  ctx.fillText("大湾区不只是 9+2 个城市，还有 +1 个你", cw / 2, 196);

  // 头像 + 昵称
  ctx.fillStyle = "#0d1433";
  ctx.fillRect(cw / 2 - 70, 250, 140, 140);
  ctx.strokeStyle = "#fee100";
  ctx.lineWidth = 4;
  ctx.strokeRect(cw / 2 - 70, 250, 140, 140);
  ctx.fillStyle = "#fee100";
  ctx.font = "bold 72px sans-serif";
  ctx.fillText((entry.nick || "无").slice(0, 1), cw / 2, 350);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 36px sans-serif";
  ctx.fillText(entry.nick, cw / 2, 440);

  // 称号
  ctx.font = "44px sans-serif";
  ctx.fillText(title.emoji, cw / 2, 530);
  ctx.fillStyle = "#fee100";
  ctx.font = "bold 40px sans-serif";
  ctx.fillText(title.name, cw / 2, 590);

  // 数据卡
  const rows: [string, string][] = [
    ["浪花值", String(entry.score)],
    ["解锁城市", `${entry.cities.length}/11`],
    ["湾区排名", `#${rankPosition(entry.score)}`],
  ];
  rows.forEach(([k, v], i) => {
    const y = 670 + i * 110;
    ctx.fillStyle = "#0d1433";
    ctx.fillRect(90, y, 570, 86);
    ctx.strokeStyle = "#232c55";
    ctx.lineWidth = 3;
    ctx.strokeRect(90, y, 570, 86);
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(160,175,230,0.8)";
    ctx.font = "26px sans-serif";
    ctx.fillText(k, 130, y + 52);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fee100";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText(v, 620, y + 54);
  });

  // 解锁城市点阵
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(160,175,230,0.7)";
  ctx.font = "24px sans-serif";
  ctx.fillText("我的湾区足迹", cw / 2, 1030);
  CITIES.forEach((c, i) => {
    const cx = 120 + i * 46.5;
    const cy = 1080;
    ctx.fillStyle = entry.cities.includes(c.name) ? cityColor(c.id) : "rgba(90,106,200,0.3)";
    ctx.fillRect(cx - 14, cy - 14, 28, 28);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText(c.short, cx, cy + 6);
  });

  // 二维码占位
  ctx.fillStyle = "#0d1433";
  ctx.fillRect(cw / 2 - 55, 1150, 110, 110);
  ctx.strokeStyle = "#232c55";
  ctx.strokeRect(cw / 2 - 55, 1150, 110, 110);
  ctx.fillStyle = "#fff";
  ctx.font = "20px sans-serif";
  ctx.fillText("桨刻", cw / 2, 1195);
  ctx.fillText("小程序", cw / 2, 1225);
  ctx.fillStyle = "rgba(160,175,230,0.8)";
  ctx.font = "22px sans-serif";
  ctx.fillText("扫码加入 · 保存我的龙舟身份", cw / 2, 1300);

  return cv.toDataURL("image/png");
}
