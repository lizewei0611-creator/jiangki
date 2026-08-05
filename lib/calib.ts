import { useSyncExternalStore } from "react";

const CALIB_KEY = "jiangki.calib.v1";
const UNLOCK_KEY = "jiangki.songstars.v1";

/* ---------- 延迟校准偏移（毫秒，正数 = 玩家反应偏慢） ---------- */

export function getCalibOffset(): number {
  if (typeof window === "undefined") return 0;
  try {
    return Number(localStorage.getItem(CALIB_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function setCalibOffset(ms: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CALIB_KEY, String(ms));
}

/* ---------- 曲目星级解锁 ---------- */

export function getStars(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(UNLOCK_KEY) || "{}");
  } catch {
    return {};
  }
}

let starsCache: Record<string, number> | null = null;
const listeners = new Set<() => void>();

function snapshot(): Record<string, number> {
  if (starsCache === null) starsCache = getStars();
  return starsCache;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useStars(): Record<string, number> {
  return useSyncExternalStore(subscribe, snapshot, () => ({}));
}

export function saveStars(next: Record<string, number>): void {
  starsCache = next;
  localStorage.setItem(UNLOCK_KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

export function recordStars(songId: string, stars: number): void {
  const cur = snapshot();
  if ((cur[songId] ?? 0) >= stars) return;
  saveStars({ ...cur, [songId]: stars });
}
