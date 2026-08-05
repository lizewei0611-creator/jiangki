let audioCtx: AudioContext | null = null;

export function ensureAudio(): AudioContext {
  if (!audioCtx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AC();
  }
  if (audioCtx.state === "suspended") {
    // 必须在用户手势回调中同步调用，浏览器才允许恢复
    void audioCtx.resume();
  }
  return audioCtx;
}

/** 在用户手势（点击开始/校准）时调用，解锁音频通道并播放提示鼓声 */
export function unlockAudio(): void {
  const ctx = ensureAudio();
  if (ctx.state === "suspended") {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.frequency.value = 0;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.01);
  }
}

/** 低音鼓（每拍） */
export function playDrum(bright = false): void {
  const ctx = ensureAudio();
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(bright ? 190 : 150, t);
  osc.frequency.exponentialRampToValueAtTime(46, t + 0.1);
  const g = ctx.createGain();
  g.gain.setValueAtTime(bright ? 0.65 : 0.55, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  osc.connect(g).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.2);
  if (bright) {
    const hi = ctx.createOscillator();
    hi.type = "square";
    hi.frequency.value = 620;
    const hg = ctx.createGain();
    hg.gain.setValueAtTime(0.08, t);
    hg.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    hi.connect(hg).connect(ctx.destination);
    hi.start(t);
    hi.stop(t + 0.06);
  }
}

/** 锣（每 4 拍） */
export function playGong(): void {
  const ctx = ensureAudio();
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.value = 940;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.28, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
  osc.connect(g).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.6);
  const shimmer = ctx.createOscillator();
  shimmer.type = "sine";
  shimmer.frequency.value = 1880;
  const sg = ctx.createGain();
  sg.gain.setValueAtTime(0.1, t);
  sg.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
  shimmer.connect(sg).connect(ctx.destination);
  shimmer.start(t);
  shimmer.stop(t + 0.45);
}

/** 判定反馈音 */
export function playJudge(kind: "perfect" | "good" | "ok" | "miss"): void {
  const ctx = ensureAudio();
  const t = ctx.currentTime;
  const freqs: Record<string, number> = {
    perfect: 1250,
    good: 830,
    ok: 520,
    miss: 140,
  };
  const osc = ctx.createOscillator();
  osc.type = kind === "miss" ? "sawtooth" : "sine";
  osc.frequency.value = freqs[kind];
  const g = ctx.createGain();
  g.gain.setValueAtTime(kind === "perfect" ? 0.22 : 0.14, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + (kind === "perfect" ? 0.12 : 0.08));
  osc.connect(g).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.15);
}

/** 结算音 */
export function playFinish(win: boolean): void {
  const ctx = ensureAudio();
  const notes = win ? [523, 659, 784, 1047] : [392, 330, 262];
  notes.forEach((f, i) => {
    const t = ctx.currentTime + i * 0.12;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.16, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.25);
  });
}
