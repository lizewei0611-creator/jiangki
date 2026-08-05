"use client";

import { useEffect, useRef, useState } from "react";
import { addRank, rankPosition, RankEntry } from "@/lib/ranks";

const W = 960;
const H = 540;
const RACE_SECONDS = 25;
const TRACK_TOP = 92;
const TRACK_BOTTOM = 470;
const FINISH_Y = 70;

interface BeatPhase {
  dur: number;
  spm: number;
  label: string;
}

const PHASES: BeatPhase[] = [
  { dur: 5, spm: 90, label: "READY 起划" },
  { dur: 14, spm: 105, label: "STEADY 中段" },
  { dur: 6, spm: 125, label: "SPRINT 冲刺!" },
];

const PERFECT_MS = 70;
const GOOD_MS = 150;

interface Opponent {
  lane: number;
  spm: number;
  jitter: number;
  progress: number;
}

interface Judge {
  label: "PERFECT" | "GOOD" | "MISS" | "乱桨!";
  t: number;
}

interface RaceState {
  t: number;
  phaseIdx: number;
  phaseStart: number;
  beats: number[];
  beatIdx: number;
  lastHit: number;
  hitTimes: number[];
  progress: number;
  hearts: number;
  jankT: number;
  perfect: number;
  good: number;
  miss: number;
  judges: Judge[];
  opponents: Opponent[];
  done: boolean;
}

export default function RaceMode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [hud, setHud] = useState({
    spm: 0,
    target: 90,
    progress: 0,
    rank: 0,
    hearts: 3,
    sprint: false,
  });
  const [result, setResult] = useState<{
    spm: number;
    perfect: number;
    good: number;
    miss: number;
    rank: number;
    progress: number;
  } | null>(null);
  const [nick, setNick] = useState("");
  const [saved, setSaved] = useState<RankEntry | null>(null);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const phaseRef = useRef<"idle" | "playing" | "over">("idle");

  const stateRef = useRef<RaceState>({
    t: 0,
    phaseIdx: 0,
    phaseStart: 0,
    beats: [] as number[],
    beatIdx: 0,
    lastHit: 0,
    hitTimes: [] as number[],
    progress: 0,
    hearts: 3,
    jankT: 0,
    perfect: 0,
    good: 0,
    miss: 0,
    judges: [] as Judge[],
    opponents: [] as Opponent[],
    done: false,
  });

  const start = () => {
    const s = stateRef.current;
    const beats: number[] = [];
    let t = 0;
    for (const p of PHASES) {
      const interval = 60 / p.spm;
      const end = t + p.dur;
      while (t < end) {
        beats.push(t);
        t += interval;
      }
    }
    s.beats = beats;
    s.beatIdx = 0;
    s.t = 0;
    s.phaseStart = 0;
    s.phaseIdx = 0;
    s.lastHit = -1;
    s.hitTimes = [];
    s.progress = 0;
    s.hearts = 3;
    s.jankT = 0;
    s.perfect = 0;
    s.good = 0;
    s.miss = 0;
    s.judges = [];
    s.done = false;
    s.opponents = [0, 1, 3, 4].map((lane) => ({
      lane,
      spm: 88 + Math.random() * 14,
      jitter: Math.random() * 0.4,
      progress: 0,
    }));
    setResult(null);
    setSaved(null);
    setNick("");
    phaseRef.current = "playing";
    setPhase("playing");
  };

  const hit = () => {
    const s = stateRef.current;
    if (phaseRef.current !== "playing" || s.done) return;
    const now = s.t;
    const nextBeat = s.beats[s.beatIdx];
    if (nextBeat === undefined) return;
    const diff = (now - nextBeat) * 1000;
    const prevBeat = s.beatIdx > 0 ? s.beats[s.beatIdx - 1] : -Infinity;
    if (now - prevBeat < 0.4) {
      s.miss++;
      s.hearts = Math.max(0, s.hearts - 1);
      s.judges.push({ label: "乱桨!", t: 1.2 });
      if (s.hearts === 0) s.jankT = 2;
      return;
    }
    if (diff > GOOD_MS) {
      s.miss++;
      s.hearts = Math.max(0, s.hearts - 1);
      s.judges.push({ label: "MISS", t: 1 });
      if (s.hearts === 0) s.jankT = 2;
      return;
    }
    const isPerfect = diff > -PERFECT_MS;
    if (isPerfect) {
      s.perfect++;
      s.hearts = Math.min(5, s.hearts + 1);
    } else {
      s.good++;
    }
    s.hitTimes.push(now);
    if (s.hitTimes.length > 8) s.hitTimes.shift();
    s.beatIdx++;
    s.lastHit = now;
    s.judges.push({ label: isPerfect ? "PERFECT" : "GOOD", t: 0.8 });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const finish = (s: RaceState) => {
      const rank = 1 + s.opponents.filter((o) => o.progress > s.progress).length;
      let avgSpm = 0;
      if (s.hitTimes.length >= 2) {
        const total = s.hitTimes[s.hitTimes.length - 1] - s.hitTimes[0];
        avgSpm = total > 0 ? Math.round((60 * (s.hitTimes.length - 1)) / total) : 0;
      }
      const hits = s.perfect + s.good;
      const perfectRate = hits > 0 ? Math.round((s.perfect / hits) * 100) : 0;
      phaseRef.current = "over";
      setPhase("over");
      setResult({
        spm: avgSpm,
        perfect: perfectRate,
        good: s.good,
        miss: s.miss,
        rank,
        progress: Math.round(s.progress),
      });
    };

    const tick = (ctx: CanvasRenderingContext2D, dt: number) => {
      const s = stateRef.current;
      const ph = phaseRef.current;

      if (ph === "playing" && !s.done) {
        s.t += dt;
        while (s.phaseIdx < PHASES.length - 1 && s.t >= s.phaseStart + PHASES[s.phaseIdx].dur) {
          s.phaseStart += PHASES[s.phaseIdx].dur;
          s.phaseIdx++;
        }
        const cur = PHASES[s.phaseIdx];

        // 实际桨频：最近命中间隔滑动窗口
        let spm = 0;
        if (s.hitTimes.length >= 2) {
          const win = s.hitTimes.slice(-4);
          if (win.length >= 2) {
            const avg = (win[win.length - 1] - win[0]) / (win.length - 1);
            spm = avg > 0 ? Math.round(60 / avg) : 0;
          }
        }
        const targetSpm = cur.spm;
        let v = 4.4 * (Math.max(spm, 40) / 100);
        if (s.jankT > 0) {
          v *= 0.35;
          s.jankT -= dt;
        } else {
          v *= 1 + s.hearts * 0.02;
        }
        s.progress += (v / 100) * dt * 100;
        s.progress = Math.min(100, s.progress);

        for (const o of s.opponents) {
          const oSpeed = 0.055 + o.spm / 1900 + Math.sin(s.t * 0.7 + o.jitter * 6) * 0.006;
          o.progress += oSpeed * dt * 100;
          if (cur.label.includes("SPRINT")) o.progress += 0.09 * dt;
        }

        s.judges.forEach((j) => (j.t -= dt));
        s.judges = s.judges.filter((j) => j.t > 0);

        const rank = 1 + s.opponents.filter((o) => o.progress > s.progress).length;
        setHud((h) =>
          h.spm !== spm ||
          h.target !== targetSpm ||
          h.progress !== Math.round(s.progress) ||
          h.rank !== rank ||
          h.hearts !== s.hearts ||
          h.sprint !== (s.phaseIdx === 2)
            ? { spm, target: targetSpm, progress: Math.round(s.progress), rank, hearts: s.hearts, sprint: s.phaseIdx === 2 }
            : h
        );

        const timeUp = s.t >= RACE_SECONDS;
        if (s.progress >= 100 || timeUp) {
          s.done = true;
          finish(s);
        }
      }

      draw(ctx, s, ph);
    };

    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ([" ", "enter", "j"].includes(k)) {
        e.preventDefault();
        if (phaseRef.current === "idle") start();
        else hit();
      }
    };
    window.addEventListener("keydown", onKey);

    const loop = (time: number) => {
      const dt = Math.min((time - lastRef.current) / 1000, 0.05);
      lastRef.current = time;
      tick(ctx, dt);
      rafRef.current = requestAnimationFrame(loop);
    };
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const submitScore = () => {
    if (!result) return;
    const entry = addRank({
      nick: nick.trim() || "无名桨手",
      score: result.spm * 10 + result.perfect * 2 + (result.rank === 1 ? 500 : result.rank === 2 ? 300 : result.rank === 3 ? 200 : 0),
      cities: [],
      title: spmTitle(result.spm, result.rank).name,
      spm: result.spm,
      perfect: result.perfect,
    });
    setSaved(entry);
  };

  const title = result ? spmTitle(result.spm, result.rank) : null;

  return (
    <div>
      <div className="pixel-border-pac bg-arcade-2 p-3 sm:p-4">
        <div className="mb-3 grid grid-cols-4 items-center gap-2 px-1 sm:grid-cols-5">
          <span className="pixel-font text-[9px] text-ghost-cyan sm:text-[10px]">
            TARGET {hud.target}SPM
          </span>
          <span className="pixel-font text-[9px] text-pac sm:text-[10px]">
            实际 {hud.spm}SPM
          </span>
          <span className="pixel-font text-[9px] text-ghost-pink sm:text-[10px]">
            {hud.rank || "--"}ND
          </span>
          <span className="pixel-font text-[9px] text-ghost-orange sm:text-[10px]">
            100M {hud.progress}%
          </span>
          <span className="hidden pixel-font text-[9px] text-ghost-red sm:block sm:text-[10px]">
            {"❤".repeat(hud.hearts) || "乱桨!"}
          </span>
          {phase !== "playing" && (
            <span className="pixel-font text-[9px] text-slate-600 sm:text-[10px]">
              空格 / 点击
            </span>
          )}
        </div>
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            onTouchStart={(e) => {
              e.preventDefault();
              if (phaseRef.current === "idle") start();
              else hit();
            }}
            className="block w-full touch-none select-none"
            style={{ aspectRatio: `${W}/${H}` }}
          />
          {phase === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-arcade/75 backdrop-blur-[2px]">
              <p className="pixel-font text-lg text-pac blink">READY?</p>
              <div className="max-w-lg px-6 text-center text-sm leading-7 text-slate-300">
                <p>
                  100 米冲刺，25 秒。听鼓点，踩节拍划桨——拍得越准船越快。
                </p>
                <p className="mt-3 text-slate-400">
                  <span className="text-ghost-cyan">桨频 SPM</span> = 每分钟划桨次数。
                  冲刺阶段桨频 125，职业选手就是这样炼成的。
                </p>
              </div>
              <button
                onClick={start}
                className="pixel-border-pac bg-pac px-10 py-3.5 text-lg font-bold text-black transition-transform hover:-translate-y-0.5"
              >
                ▶ 开始冲刺
              </button>
            </div>
          )}
          {phase === "over" && result && (
            <div className="absolute inset-0 flex items-center justify-center overflow-y-auto bg-arcade/85 p-4 backdrop-blur-[2px]">
              <div className="pixel-border-pac max-h-full w-full max-w-md overflow-y-auto bg-arcade-2 p-6 sm:p-8">
                <p className="pixel-font text-center text-lg text-pac">
                  {result.rank === 1 ? "RACE CLEAR!" : "RACE OVER"}
                </p>
                {title && (
                  <div className="mt-5 text-center">
                    <p className="text-5xl">{title.emoji}</p>
                    <h3 className="mt-2 text-xl font-bold text-white">{title.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {result.rank === 1 ? "第一名冲线" : `第 ${result.rank} 名 · 完成 ${result.progress}%`}
                    </p>
                  </div>
                )}
                <div className="mt-6 grid grid-cols-2 gap-3 text-center">
                  <div className="border-2 border-arcade-line bg-arcade-3/60 py-3">
                    <p className="text-2xl font-bold text-pac">{result.spm} SPM</p>
                    <p className="mt-1 text-xs text-slate-400">平均桨频</p>
                  </div>
                  <div className="border-2 border-arcade-line bg-arcade-3/60 py-3">
                    <p className="text-2xl font-bold text-ghost-cyan">{result.perfect}%</p>
                    <p className="mt-1 text-xs text-slate-400">完美率</p>
                  </div>
                  <div className="border-2 border-arcade-line bg-arcade-3/60 py-3">
                    <p className="text-2xl font-bold text-ghost-pink">#{rankPosition(result.spm * 10 + result.perfect * 2 + (result.rank === 1 ? 500 : result.rank === 2 ? 300 : result.rank === 3 ? 200 : 0))}</p>
                    <p className="mt-1 text-xs text-slate-400">本地排名</p>
                  </div>
                  <div className="border-2 border-arcade-line bg-arcade-3/60 py-3">
                    <p className="text-2xl font-bold text-ghost-orange">{result.miss}</p>
                    <p className="mt-1 text-xs text-slate-400">失误次数</p>
                  </div>
                </div>
                {!saved ? (
                  <div className="mt-6">
                    <input
                      value={nick}
                      onChange={(e) => setNick(e.target.value)}
                      placeholder="输入你的昵称（如：冲刺桨手）"
                      className="w-full border-2 border-arcade-line bg-arcade-3/60 px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-pac"
                    />
                    <button
                      onClick={submitScore}
                      className="mt-3 w-full bg-pac py-3 font-bold text-black transition-transform hover:-translate-y-0.5"
                    >
                      保存我的桨频数据 ▶ 上榜
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 space-y-3">
                    <p className="pixel-font text-center text-[10px] text-ghost-cyan">
                      SAVED · #{rankPosition(saved.score)}
                    </p>
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
    </div>
  );
}

export function spmTitle(spm: number, rank: number): { name: string; emoji: string } {
  if (rank === 1) return { name: "冲线冠军", emoji: "🏆" };
  if (spm >= 120) return { name: "冲刺大师", emoji: "⚡" };
  if (spm >= 105) return { name: "快桨高手", emoji: "🚣" };
  if (spm >= 90) return { name: "稳定桨手", emoji: "🌊" };
  return { name: "新手划水", emoji: "🐢" };
}

/* ---------------- 绘制 ---------------- */

function draw(ctx: CanvasRenderingContext2D, s: RaceState, phase: string) {
  ctx.clearRect(0, 0, W, H);

  // 背景
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

  // 赛道
  ctx.fillStyle = "rgba(60,140,255,0.25)";
  ctx.fillRect(60, TRACK_TOP - 22, 840, TRACK_BOTTOM - TRACK_TOP + 40);
  // 道线
  ctx.strokeStyle = "rgba(160,220,255,0.25)";
  ctx.lineWidth = 2;
  for (const laneX of [220, 380, 540, 700]) {
    ctx.beginPath();
    ctx.moveTo(laneX, TRACK_TOP - 18);
    ctx.lineTo(laneX, TRACK_BOTTOM + 14);
    ctx.stroke();
  }

  // 终点线（像素格）
  const lineY = FINISH_Y;
  for (let x = 60; x < 900; x += 24) {
    for (let i = 0; i < 2; i++) {
      ctx.fillStyle = (Math.floor(x / 24) + i) % 2 === 0 ? "#fff" : "#000";
      ctx.fillRect(x, lineY - 8 + i * 8, 24, 8);
    }
  }
  ctx.fillStyle = "#fee100";
  ctx.font = "bold 18px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("100M FINISH", 620, lineY - 16);

  // 冲刺阶段红色氛围
  if (phase === "playing" && s.phaseIdx === 2) {
    ctx.fillStyle = "rgba(255,45,85,0.08)";
    ctx.fillRect(0, 0, W, H);
  }

  // 船（玩家 + 对手）
  const boatY = (progress: number) => TRACK_BOTTOM - (progress / 100) * (TRACK_BOTTOM - TRACK_TOP);
  const laneX = (i: number) => 150 + i * 165;
  for (const o of s.opponents) {
    drawBoat(ctx, laneX(o.lane), boatY(o.progress), o.spm);
  }
  drawBoat(ctx, laneX(2), boatY(s.progress), s.hitTimes.length >= 2 ? 60 / ((s.hitTimes[s.hitTimes.length - 1] - s.hitTimes[0]) / (s.hitTimes.length - 1)) || 90 : 90, true);

  // 鼓点指示器（底部）
  const curPhase = PHASES[s.phaseIdx];
  const interval = 60 / curPhase.spm;
  const sinceBeat = s.t - (s.beats[s.beatIdx] ?? s.t);
  const beatP = Math.max(0, Math.min(1, 1 - sinceBeat / interval));
  const cx = W / 2;
  const cy = H - 34;
  // 鼓
  ctx.fillStyle = "#0d1433";
  ctx.beginPath();
  ctx.arc(cx, cy, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#fee100";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 40 - beatP * 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = beatP > 0.9 ? "#fee100" : "#5a6ac8";
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("🥁", cx, cy + 6);

  // 判定飘字
  s.judges.forEach((j) => {
    const alpha = Math.max(0, j.t);
    ctx.globalAlpha = alpha;
    ctx.fillStyle =
      j.label === "PERFECT"
        ? "#fee100"
        : j.label === "GOOD"
          ? "#00e5ff"
          : "#ff2d55";
    ctx.font = `bold ${24 + (1 - j.t) * 10}px sans-serif`;
    ctx.fillText(j.label, cx, cy - 70 + (1 - j.t) * 14);
    ctx.globalAlpha = 1;
  });

  // 阶段标签
  if (phase === "playing") {
    ctx.fillStyle = s.phaseIdx === 2 ? "#ff2d55" : "rgba(160,175,230,0.7)";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(curPhase.label, 68, TRACK_TOP - 28);
  }

  // 桨频教学
  if (phase === "idle") {
    ctx.fillStyle = "rgba(160,175,230,0.6)";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SPM 桨频 = 每分钟划桨次数 · 跟着鼓圈收缩踩节拍", W / 2, H - 60);
  }
}

function drawBoat(ctx: CanvasRenderingContext2D, x: number, y: number, spm: number, isPlayer = false) {
  const bob = Math.sin(performance.now() / 120) * 1.5;
  const yy = y + bob;
  ctx.save();
  ctx.translate(x, yy);
  ctx.rotate(spm >= 120 ? 0.06 : -0.03);
  // 船体
  ctx.fillStyle = isPlayer ? "#ff2d55" : "#5a6ac8";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(30, -8);
  ctx.lineTo(30, 8);
  ctx.lineTo(0, 20);
  ctx.lineTo(-6, 0);
  ctx.closePath();
  ctx.fill();
  // 龙头
  ctx.fillStyle = isPlayer ? "#fee100" : "#8fa0d8";
  ctx.beginPath();
  ctx.moveTo(-10, -2);
  ctx.lineTo(-24, -8);
  ctx.lineTo(-20, 0);
  ctx.lineTo(-24, 8);
  ctx.lineTo(-10, 2);
  ctx.closePath();
  ctx.fill();
  // 桨手
  ctx.fillStyle = "#fff";
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(4 + i * 6, -6, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(4 + i * 6, 6, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  // 玩家高亮框
  if (isPlayer) {
    ctx.strokeStyle = "rgba(254,225,0,0.8)";
    ctx.lineWidth = 2;
    ctx.strokeRect(-28, -24, 62, 48);
  }
  ctx.restore();
  // 尾浪
  ctx.fillStyle = "rgba(120,200,255,0.4)";
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(x + 34 + i * 6, yy + (i % 2 === 0 ? -6 : 6), 4 - i, 0, Math.PI * 2);
    ctx.fill();
  }
}
