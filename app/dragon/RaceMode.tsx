"use client";

import { useEffect, useRef, useState } from "react";
import { addRank, rankPosition, RankEntry } from "@/lib/ranks";
import {
  getCalibOffset,
  setCalibOffset,
  useStars,
  recordStars,
} from "@/lib/calib";
import {
  ensureAudio,
  playDrum,
  playGong,
  playJudge,
  playFinish,
} from "@/lib/audio";

const W = 960;
const H = 540;
const PERFECT_MS = 50;
const GOOD_MS = 100;
const OK_MS = 150;

interface Song {
  id: string;
  name: string;
  sub: string;
  spms: [number, number, number];
  dur: number;
  color: string;
}

const SONGS: Song[] = [
  {
    id: "haozi",
    name: "起桨号子",
    sub: "入门 · 90 BPM",
    spms: [80, 90, 100],
    dur: 22,
    color: "#00e5ff",
  },
  {
    id: "jiliu",
    name: "珠江激流",
    sub: "进阶 · 105 BPM",
    spms: [95, 105, 120],
    dur: 26,
    color: "#ff9ad5",
  },
  {
    id: "zhan",
    name: "端午战鼓",
    sub: "高手 · 125 BPM",
    spms: [110, 125, 140],
    dur: 30,
    color: "#ff2d55",
  },
];

const CALIB_BEATS = [0, 0.6, 1.2, 1.8, 2.4, 3.0];

interface BeatPhase {
  dur: number;
  spm: number;
  label: string;
}

interface Opponent {
  lane: number;
  spm: number;
  jitter: number;
  progress: number;
}

interface Judge {
  label: "PERFECT" | "GOOD" | "OK" | "MISS" | "乱桨!";
  t: number;
}

interface RaceState {
  t: number;
  phaseIdx: number;
  phaseStart: number;
  phases: BeatPhase[];
  beats: number[];
  beatIdx: number;
  hitTimes: number[];
  progress: number;
  hearts: number;
  jankT: number;
  perfect: number;
  good: number;
  ok: number;
  miss: number;
  combo: number;
  missStreak: number;
  judges: Judge[];
  opponents: Opponent[];
  done: boolean;
  calib: {
    startWall: number;
    idx: number;
    samples: number[];
  };
  lastBeatPlayed: number;
}

type Phase = "idle" | "playing" | "over" | "calib";

function spmTitle(spm: number, rank: number): { name: string; emoji: string } {
  if (rank === 1) return { name: "冲线冠军", emoji: "🏆" };
  if (spm >= 120) return { name: "冲刺大师", emoji: "⚡" };
  if (spm >= 105) return { name: "快桨高手", emoji: "🚣" };
  if (spm >= 90) return { name: "稳定桨手", emoji: "🌊" };
  return { name: "新手划水", emoji: "🐢" };
}

function starsFor(accuracy: number): number {
  if (accuracy >= 0.9) return 3;
  if (accuracy >= 0.7) return 2;
  if (accuracy >= 0.45) return 1;
  return 0;
}

export default function RaceMode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useStars();
  const [songIdx, setSongIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [hud, setHud] = useState({
    spm: 0,
    target: SONGS[0].spms[0],
    progress: 0,
    rank: 0,
    hearts: 3,
    sprint: false,
    combo: 0,
  });
  const [result, setResult] = useState<{
    spm: number;
    accuracy: number;
    perfect: number;
    good: number;
    ok: number;
    miss: number;
    rank: number;
    progress: number;
    stars: number;
    score: number;
  } | null>(null);
  const [nick, setNick] = useState("");
  const [saved, setSaved] = useState<RankEntry | null>(null);
  const [calibMsg, setCalibMsg] = useState<string | null>(null);
  const [calibOffset, setCalibOffsetUi] = useState<number>(getCalibOffset());
  const [calibProgress, setCalibProgress] = useState(0);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const phaseRef = useRef<Phase>("idle");
  const songRef = useRef(0);

  const stateRef = useRef<RaceState>({
    t: 0,
    phaseIdx: 0,
    phaseStart: 0,
    phases: [],
    beats: [],
    beatIdx: 0,
    hitTimes: [],
    progress: 0,
    hearts: 3,
    jankT: 0,
    perfect: 0,
    good: 0,
    ok: 0,
    miss: 0,
    combo: 0,
    missStreak: 0,
    judges: [],
    opponents: [],
    done: false,
    calib: { startWall: 0, idx: 0, samples: [] },
    lastBeatPlayed: -1,
  });

  const buildPhases = (song: Song): BeatPhase[] => {
    const [a, b, c] = song.spms;
    return [
      { dur: song.dur * 0.2, spm: a, label: "READY 起划" },
      { dur: song.dur * 0.56, spm: b, label: "STEADY 中段" },
      { dur: song.dur * 0.24, spm: c, label: "SPRINT 冲刺!" },
    ];
  };

  const start = () => {
    const song = SONGS[songRef.current];
    const phases = buildPhases(song);
    const beats: number[] = [];
    let t = 0;
    for (const p of phases) {
      const interval = 60 / p.spm;
      const end = t + p.dur;
      while (t < end) {
        beats.push(t);
        t += interval;
      }
    }
    const s = stateRef.current;
    s.phases = phases;
    s.beats = beats;
    s.beatIdx = 0;
    s.t = 0;
    s.phaseStart = 0;
    s.phaseIdx = 0;
    s.hitTimes = [];
    s.progress = 0;
    s.hearts = 3;
    s.jankT = 0;
    s.perfect = 0;
    s.good = 0;
    s.ok = 0;
    s.miss = 0;
    s.combo = 0;
    s.missStreak = 0;
    s.judges = [];
    s.done = false;
    s.lastBeatPlayed = -1;
    const base = song.spms[1];
    s.opponents = [0, 1, 3, 4].map((lane) => ({
      lane,
      spm: base - 6 + Math.random() * 12,
      jitter: Math.random() * 0.4,
      progress: 0,
    }));
    setResult(null);
    setSaved(null);
    phaseRef.current = "playing";
    setPhase("playing");
    ensureAudio();
  };

  const startCalib = () => {
    const s = stateRef.current;
    s.calib = { startWall: performance.now(), idx: 0, samples: [] };
    s.t = 0;
    setCalibMsg(null);
    setCalibProgress(0);
    phaseRef.current = "calib";
    setPhase("calib");
    ensureAudio();
  };

  const hit = () => {
    const s = stateRef.current;
    if (phaseRef.current !== "playing" || s.done) return;
    const offset = getCalibOffset() / 1000;
    const now = s.t;
    const nextBeat = s.beats[s.beatIdx];
    if (nextBeat === undefined) return;
    const diff = (now - offset - nextBeat) * 1000;
    const prevBeat = s.beatIdx > 0 ? s.beats[s.beatIdx - 1] : -Infinity;
    if (now - prevBeat < 0.4) {
      s.miss++;
      s.missStreak++;
      s.combo = 0;
      s.hearts = Math.max(0, s.hearts - 1);
      s.judges.push({ label: "乱桨!", t: 1.2 });
      playJudge("miss");
      if (s.hearts === 0) s.jankT = 2;
      return;
    }
    if (diff > OK_MS) {
      s.miss++;
      s.missStreak++;
      s.combo = 0;
      s.hearts = Math.max(0, s.hearts - 1);
      s.judges.push({ label: "MISS", t: 1 });
      playJudge("miss");
      if (s.hearts === 0) s.jankT = 2;
      return;
    }
    s.missStreak = 0;
    s.hitTimes.push(now);
    if (s.hitTimes.length > 8) s.hitTimes.shift();
    s.beatIdx++;
    if (Math.abs(diff) <= PERFECT_MS) {
      s.perfect++;
      s.hearts = Math.min(5, s.hearts + 1);
      s.combo++;
      s.judges.push({ label: "PERFECT", t: 0.8 });
      playJudge("perfect");
    } else if (Math.abs(diff) <= GOOD_MS) {
      s.good++;
      s.combo++;
      s.judges.push({ label: "GOOD", t: 0.7 });
      playJudge("good");
    } else {
      s.ok++;
      s.combo++;
      s.judges.push({ label: "OK", t: 0.7 });
      playJudge("ok");
    }
  };

  const calibClick = () => {
    const s = stateRef.current;
    if (phaseRef.current !== "calib") return;
    const idx = s.calib.idx;
    if (idx >= CALIB_BEATS.length) return;
    const beatWall = s.calib.startWall + CALIB_BEATS[idx] * 1000;
    s.calib.samples.push(performance.now() - beatWall);
    s.calib.idx++;
    setCalibProgress(s.calib.idx);
    if (s.calib.idx >= CALIB_BEATS.length) {
      const samples = s.calib.samples.slice().sort((a, b) => a - b);
      const median = samples[Math.floor(samples.length / 2)];
      const offset = Math.round(median);
      setCalibOffset(offset);
      setCalibOffsetUi(offset);
      setCalibMsg(offset >= 0 ? `校准完成 · 偏移 +${offset}ms` : `校准完成 · 偏移 ${offset}ms`);
      phaseRef.current = "idle";
      setPhase("idle");
    }
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
      const hits = s.perfect + s.good + s.ok;
      const accuracy = hits > 0 ? (s.perfect + s.good * 0.7 + s.ok * 0.4) / (hits * 1) : 0;
      const score = Math.round(accuracy * 100);
      const st = starsFor(accuracy);
      recordStars(SONGS[songRef.current].id, st);
      playFinish(rank === 1);
      phaseRef.current = "over";
      setPhase("over");
      setResult({
        spm: avgSpm,
        accuracy,
        perfect: s.perfect,
        good: s.good,
        ok: s.ok,
        miss: s.miss,
        rank,
        progress: Math.round(s.progress),
        stars: st,
        score,
      });
    };

    const tick = (ctx: CanvasRenderingContext2D, dt: number) => {
      const s = stateRef.current;
      const ph = phaseRef.current;

      if (ph === "calib") {
        s.t += dt;
        const idx = s.calib.idx;
        const beatNow = s.t;
        for (let i = 0; i < CALIB_BEATS.length; i++) {
          if (i !== s.lastBeatPlayed && CALIB_BEATS[i] - beatNow < 0.01) {
            playDrum();
            s.lastBeatPlayed = i;
          }
        }
        void idx;
        draw(ctx, s, ph);
        return;
      }

      if (ph === "playing" && !s.done) {
        s.t += dt;
        while (s.phaseIdx < s.phases.length - 1 && s.t >= s.phaseStart + s.phases[s.phaseIdx].dur) {
          s.phaseStart += s.phases[s.phaseIdx].dur;
          s.phaseIdx++;
        }
        const cur = s.phases[s.phaseIdx];

        // 节拍鼓声
        if (s.lastBeatPlayed < s.beatIdx && s.beatIdx > 0) {
          if (s.beatIdx % 4 === 0) playGong();
          else playDrum(s.phaseIdx === 2);
          s.lastBeatPlayed = s.beatIdx;
        }

        // 实际桨频
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
          v *= 0.4;
          s.jankT -= dt;
        } else {
          v *= 1 + s.hearts * 0.02;
        }
        if (s.combo >= 5) v *= 1.1;
        if (s.missStreak >= 3) v *= 0.55;
        s.progress += (v / 100) * dt * 100;
        s.progress = Math.min(100, s.progress);

        for (const o of s.opponents) {
          const oSpeed = 0.05 + o.spm / 2300 + Math.sin(s.t * 0.7 + o.jitter * 6) * 0.005;
          o.progress += oSpeed * dt * 100;
          if (s.phaseIdx === 2) o.progress += 0.1 * dt;
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
          h.sprint !== (s.phaseIdx === 2) ||
          h.combo !== s.combo
            ? { spm, target: targetSpm, progress: Math.round(s.progress), rank, hearts: s.hearts, sprint: s.phaseIdx === 2, combo: s.combo }
            : h
        );

        if (s.progress >= 100 || s.t >= SONGS[songRef.current].dur) {
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
        const p = phaseRef.current;
        if (p === "idle") start();
        else if (p === "playing") hit();
        else if (p === "calib") calibClick();
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
    // start/hit/calibClick 均为稳定闭包（只读写 ref 与 state setter），无需加入依赖
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitScore = () => {
    if (!result) return;
    const entry = addRank({
      nick: nick.trim() || "无名桨手",
      score: result.score + (result.rank === 1 ? 500 : result.rank === 2 ? 300 : result.rank === 3 ? 200 : 0),
      cities: [],
      title: spmTitle(result.spm, result.rank).name,
      spm: result.spm,
      perfect: result.accuracy >= 0.9 ? 90 + Math.round((result.accuracy - 0.9) * 100) : Math.round(result.accuracy * 100),
    });
    setSaved(entry);
  };

  const nextSong = songIdx < SONGS.length - 1 ? SONGS[songIdx + 1] : null;

  return (
    <div>
      <div className="pixel-border-pac bg-arcade-2 p-3 sm:p-4">
        <div className="mb-3 grid grid-cols-3 items-center gap-2 px-1 sm:grid-cols-5">
          <span className="pixel-font text-[9px] text-ghost-cyan sm:text-[10px]">
            TARGET {hud.target}SPM
          </span>
          <span className="pixel-font text-[9px] text-pac sm:text-[10px]">
            实际 {hud.spm}SPM
          </span>
          <span className="pixel-font text-[9px] text-ghost-pink sm:text-[10px]">
            {hud.rank || "--"}ND
          </span>
          <span className="hidden pixel-font text-[9px] text-ghost-orange sm:block sm:text-[10px]">
            {hud.combo >= 2 ? `COMBO ${hud.combo}` : "100M"}
          </span>
          <span className="hidden pixel-font text-[9px] text-ghost-red sm:block sm:text-[10px]">
            {"❤".repeat(hud.hearts) || "乱桨!"}
          </span>
        </div>
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            onTouchStart={(e) => {
              e.preventDefault();
              const p = phaseRef.current;
              if (p === "idle") return;
              if (p === "calib") calibClick();
              else hit();
            }}
            className="block w-full touch-none select-none"
            style={{ aspectRatio: `${W}/${H}` }}
          />
          {phase === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-y-auto bg-arcade/85 p-4 backdrop-blur-[2px]">
              <p className="pixel-font text-lg text-pac blink">龙舟好声音</p>
              <div className="grid w-full max-w-lg gap-3">
                {SONGS.map((s2, i) => {
                  const locked = i > 0 && (stars[SONGS[i - 1].id] ?? 0) < 1;
                  const got = stars[s2.id] ?? 0;
                  return (
                    <button
                      key={s2.id}
                      disabled={locked}
                      onClick={() => {
                        setSongIdx(i);
                        songRef.current = i;
                      }}
                      className={`flex items-center justify-between border-2 px-5 py-3.5 text-left transition-colors ${
                        songIdx === i && !locked
                          ? "border-pac bg-pac/10"
                          : locked
                            ? "border-arcade-line bg-arcade-3/40 opacity-50"
                            : "border-arcade-line bg-arcade-3/60 hover:border-pac/60"
                      }`}
                    >
                      <div>
                        <p className="font-bold text-white">
                          {locked ? "🔒 " : ""}
                          {s2.name}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {s2.sub} · {s2.dur}s
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="pixel-font text-[10px]" style={{ color: s2.color }}>
                          {"★".repeat(got)}
                          <span className="text-slate-600">{"★".repeat(3 - got)}</span>
                        </span>
                        {songIdx === i && !locked && (
                          <span className="pixel-font text-[9px] text-pac">▶</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={start}
                  className="pixel-border-pac bg-pac px-10 py-3.5 text-lg font-bold text-black transition-transform hover:-translate-y-0.5"
                >
                  ▶ 开始演唱
                </button>
                <button
                  onClick={startCalib}
                  className="text-xs text-slate-500 underline-offset-2 hover:text-pac hover:underline"
                >
                  延迟校准{calibOffset !== 0 ? `（当前偏移 ${calibOffset > 0 ? "+" : ""}${calibOffset}ms）` : ""}
                </button>
                <p className="max-w-md text-center text-xs leading-6 text-slate-500">
                  鼓点即节拍：跟着鼓圈收缩踩点划桨。PERFECT +100% · GOOD +70% · OK +40% · MISS 断连击
                </p>
              </div>
            </div>
          )}
          {phase === "calib" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-arcade/80 backdrop-blur-[2px]">
              <p className="pixel-font text-sm text-ghost-cyan">CALIBRATION</p>
              <p className="text-lg font-bold text-white">
                跟着鼓点点击 {calibProgress}/{CALIB_BEATS.length}
              </p>
              <p className="text-sm text-slate-400">
                听到鼓声的瞬间点击屏幕（或按空格），无需精确，6 次即可
              </p>
              <div className="flex gap-2">
                {CALIB_BEATS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-3 w-3 ${i < calibProgress ? "bg-pac" : "border border-arcade-line"}`}
                  />
                ))}
              </div>
            </div>
          )}
          {phase === "over" && result && (
            <div className="absolute inset-0 flex items-center justify-center overflow-y-auto bg-arcade/85 p-4 backdrop-blur-[2px]">
              <div className="pixel-border-pac max-h-full w-full max-w-md overflow-y-auto bg-arcade-2 p-6 sm:p-8">
                <p className="pixel-font text-center text-lg text-pac">
                  {result.rank === 1 ? "RACE CLEAR!" : "RACE OVER"}
                </p>
                <div className="mt-4 text-center">
                  <p className="pixel-font text-sm text-pac">
                    {["★", "★", "★"].map((s2, i) => (
                      <span key={i} className={i < result.stars ? "" : "text-slate-600"}>
                        {s2}
                      </span>
                    ))}
                  </p>
                  <h3 className="mt-3 text-xl font-bold text-white">
                    {spmTitle(result.spm, result.rank).emoji} {spmTitle(result.spm, result.rank).name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {result.rank === 1 ? "第一名冲线" : `第 ${result.rank} 名 · 完成 ${result.progress}%`}
                  </p>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  <div className="border-2 border-arcade-line bg-arcade-3/60 py-3">
                    <p className="text-2xl font-bold text-pac">{result.score}</p>
                    <p className="mt-1 text-xs text-slate-400">综合得分</p>
                  </div>
                  <div className="border-2 border-arcade-line bg-arcade-3/60 py-3">
                    <p className="text-2xl font-bold text-ghost-cyan">{result.spm} SPM</p>
                    <p className="mt-1 text-xs text-slate-400">平均桨频</p>
                  </div>
                  <div className="border-2 border-arcade-line bg-arcade-3/60 py-3">
                    <p className="text-2xl font-bold text-ghost-pink">{result.accuracy * 100}%</p>
                    <p className="mt-1 text-xs text-slate-400">合拍准确率</p>
                  </div>
                </div>
                <p className="mt-4 text-center text-xs text-slate-500">
                  PERFECT {result.perfect} · GOOD {result.good} · OK {result.ok} · MISS {result.miss}
                </p>
                {nextSong && result.stars >= 1 && (stars[nextSong.id] ?? 0) === 0 && (
                  <p className="mt-3 rounded-lg border border-pac/30 bg-pac/10 px-4 py-2.5 text-center text-sm text-pac">
                    🎉 已解锁下一曲「{nextSong.name}」
                  </p>
                )}
                {!saved ? (
                  <div className="mt-5">
                    <input
                      value={nick}
                      onChange={(e) => setNick(e.target.value)}
                      placeholder="输入你的昵称（如：珠江鼓手）"
                      className="w-full border-2 border-arcade-line bg-arcade-3/60 px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-pac"
                    />
                    <button
                      onClick={submitScore}
                      className="mt-3 w-full bg-pac py-3 font-bold text-black transition-transform hover:-translate-y-0.5"
                    >
                      保存我的成绩 ▶ 上榜
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 space-y-3">
                    <p className="pixel-font text-center text-[10px] text-ghost-cyan">
                      SAVED · #{rankPosition(saved.score)}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={start}
                        className="border-2 border-arcade-line py-2.5 text-sm text-slate-200 hover:border-pac hover:text-pac"
                      >
                        再唱一遍
                      </button>
                      <button
                        onClick={() => {
                          setPhase("idle");
                          phaseRef.current = "idle";
                        }}
                        className="border-2 border-arcade-line py-2.5 text-sm text-slate-200 hover:border-pac hover:text-pac"
                      >
                        {nextSong && result.stars >= 1 ? `下一曲 ${nextSong.name} →` : "选择曲目"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {calibMsg && (
          <p className="mt-3 text-center pixel-font text-[9px] text-ghost-cyan">{calibMsg}</p>
        )}
      </div>
    </div>
  );
}

/* ---------------- 绘制 ---------------- */

function draw(ctx: CanvasRenderingContext2D, s: RaceState, phase: string) {
  ctx.clearRect(0, 0, W, H);

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0a1438");
  bg.addColorStop(1, "#060b22");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "rgba(120,140,220,0.10)";
  for (let x = 8; x < W; x += 24) {
    for (let y = 8; y < H; y += 24) {
      ctx.fillRect(x, y, 2, 2);
    }
  }

  const TRACK_TOP = 92;
  const TRACK_BOTTOM = 470;
  const FINISH_Y = 70;

  // 赛道
  ctx.fillStyle = "rgba(60,140,255,0.25)";
  ctx.fillRect(60, TRACK_TOP - 22, 840, TRACK_BOTTOM - TRACK_TOP + 40);
  ctx.strokeStyle = "rgba(160,220,255,0.25)";
  ctx.lineWidth = 2;
  for (const laneX of [220, 380, 540, 700]) {
    ctx.beginPath();
    ctx.moveTo(laneX, TRACK_TOP - 18);
    ctx.lineTo(laneX, TRACK_BOTTOM + 14);
    ctx.stroke();
  }

  // 终点线
  for (let x = 60; x < 900; x += 24) {
    for (let i = 0; i < 2; i++) {
      ctx.fillStyle = (Math.floor(x / 24) + i) % 2 === 0 ? "#fff" : "#000";
      ctx.fillRect(x, FINISH_Y - 8 + i * 8, 24, 8);
    }
  }
  ctx.fillStyle = "#fee100";
  ctx.font = "bold 18px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("100M FINISH", 620, FINISH_Y - 16);

  // 冲刺红色氛围
  if (phase === "playing" && s.phaseIdx === 2) {
    ctx.fillStyle = "rgba(255,45,85,0.08)";
    ctx.fillRect(0, 0, W, H);
  }

  const boatY = (progress: number) => TRACK_BOTTOM - (progress / 100) * (TRACK_BOTTOM - TRACK_TOP);
  const laneX = (i: number) => 150 + i * 165;
  for (const o of s.opponents) {
    drawBoat(ctx, laneX(o.lane), boatY(o.progress), o.spm);
  }
  const spmNow =
    s.hitTimes.length >= 2
      ? 60 / ((s.hitTimes[s.hitTimes.length - 1] - s.hitTimes[0]) / (s.hitTimes.length - 1)) || 90
      : 90;
  drawBoat(ctx, laneX(2), boatY(s.progress), spmNow, true);

  // 鼓圈
  const cur = s.phases[s.phaseIdx] ?? { spm: 90, label: "READY" };
  const interval = 60 / cur.spm;
  const sinceBeat = s.t - (s.beats[s.beatIdx] ?? s.t);
  const beatP = Math.max(0, Math.min(1, 1 - sinceBeat / interval));
  const cx = W / 2;
  const cy = H - 34;
  ctx.fillStyle = "#0d1433";
  ctx.beginPath();
  ctx.arc(cx, cy, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = s.combo >= 5 ? "#ffd700" : "#fee100";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 40 - beatP * 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = beatP > 0.9 ? "#fee100" : "#5a6ac8";
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("🥁", cx, cy + 6);

  // 齐心协力提示
  if (phase === "playing" && s.combo >= 5) {
    ctx.fillStyle = "rgba(255,215,0,0.75)";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText(`齐心协力！×${1 + Math.floor((s.combo - 5) / 8)}`, cx, cy - 82);
  }

  // 判定飘字
  s.judges.forEach((j) => {
    const alpha = Math.max(0, j.t);
    ctx.globalAlpha = alpha;
    ctx.fillStyle =
      j.label === "PERFECT"
        ? "#fee100"
        : j.label === "GOOD"
          ? "#00e5ff"
          : j.label === "OK"
            ? "#ff9ad5"
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
    ctx.fillText(cur.label, 68, TRACK_TOP - 28);
  }

  // 教学
  if (phase === "idle") {
    ctx.fillStyle = "rgba(160,175,230,0.6)";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("跟着鼓圈收缩踩节拍 · 四人同心，其利断金", W / 2, H - 60);
  }
}

function drawBoat(ctx: CanvasRenderingContext2D, x: number, y: number, spm: number, isPlayer = false) {
  const bob = Math.sin(performance.now() / 120) * 1.5;
  const yy = y + bob;
  ctx.save();
  ctx.translate(x, yy);
  ctx.rotate(spm >= 120 ? 0.06 : -0.03);
  ctx.fillStyle = isPlayer ? "#ff2d55" : "#5a6ac8";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(30, -8);
  ctx.lineTo(30, 8);
  ctx.lineTo(0, 20);
  ctx.lineTo(-6, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = isPlayer ? "#fee100" : "#8fa0d8";
  ctx.beginPath();
  ctx.moveTo(-10, -2);
  ctx.lineTo(-24, -8);
  ctx.lineTo(-20, 0);
  ctx.lineTo(-24, 8);
  ctx.lineTo(-10, 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff";
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(4 + i * 6, -6, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(4 + i * 6, 6, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  if (isPlayer) {
    ctx.strokeStyle = "rgba(254,225,0,0.8)";
    ctx.lineWidth = 2;
    ctx.strokeRect(-28, -24, 62, 48);
  }
  ctx.restore();
  ctx.fillStyle = "rgba(120,200,255,0.4)";
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(x + 34 + i * 6, yy + (i % 2 === 0 ? -6 : 6), 4 - i, 0, Math.PI * 2);
    ctx.fill();
  }
}
