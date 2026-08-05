import { useSyncExternalStore } from "react";

export interface RankEntry {
  id: string;
  nick: string;
  score: number;
  cities: string[];
  title: string;
  ts: number;
}

const KEY = "jiangki.ranks.v1";
const MAX = 100;

export function loadRanks(): RankEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as RankEntry[]) : [];
  } catch {
    return [];
  }
}

let cache: RankEntry[] | null = null;
const listeners = new Set<() => void>();

function snapshot(): RankEntry[] {
  if (cache === null) cache = loadRanks();
  return cache;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useRanks(): RankEntry[] {
  return useSyncExternalStore(subscribe, snapshot, () => []);
}

function mutate(next: RankEntry[]): void {
  cache = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

export function addRank(entry: Omit<RankEntry, "id" | "ts">): RankEntry {
  const full: RankEntry = { ...entry, id: Math.random().toString(36).slice(2, 10), ts: Date.now() };
  const next = [...snapshot(), full]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX);
  mutate(next);
  return full;
}

export function rankPosition(score: number): number {
  const list = snapshot();
  const better = list.filter((r) => r.score >= score).length;
  return list.length === 0 ? 1 : better + (list.some((r) => r.score === score) ? 0 : 1);
}
