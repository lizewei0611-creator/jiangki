export interface Athlete {
  id: string;
  name: string;
  number: string;
  seat: string;
}

export interface Team {
  id: string;
  name: string;
  captain: string;
  athletes: Athlete[];
}

export interface RaceResult {
  id: string;
  distance: string;
  group: string;
  teamId: string;
  time: string;
}

export interface RaceEvent {
  id: string;
  name: string;
  location: string;
  date: string;
  groups: string[];
  fee: number;
  teamLimit: number;
  teams: Team[];
  results: RaceResult[];
  createdAt: number;
}

export function rankResults(results: RaceResult[]): Map<string, number> {
  const order = results
    .slice()
    .sort(
      (a, b) =>
        a.distance.localeCompare(b.distance) ||
        a.group.localeCompare(b.group) ||
        timeToMs(a.time) - timeToMs(b.time)
    );
  const rank = new Map<string, number>();
  const counter = new Map<string, number>();
  for (const r of order) {
    const key = `${r.distance}|${r.group}`;
    counter.set(key, (counter.get(key) ?? 0) + 1);
    rank.set(r.id, counter.get(key)!);
  }
  return rank;
}

export function timeToMs(t: string): number {
  const m = t.match(/^(\d+):(\d{2})(?:\.(\d{1,3}))?$/);
  if (!m) return Infinity;
  return Number(m[1]) * 60000 + Number(m[2]) * 1000 + Number(m[3] ?? 0);
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}
