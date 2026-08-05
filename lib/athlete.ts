import { RaceEvent, rankResults, timeToMs } from "./types";

export interface AthleteRecord {
  eventId: string;
  eventName: string;
  eventDate: string;
  teamId: string;
  teamName: string;
  seat: string;
  distance: string;
  group: string;
  time: string;
  rank: number;
}

export interface AthleteProfile {
  name: string;
  number: string;
  teams: string[];
  seats: string[];
  records: AthleteRecord[];
  eventCount: number;
  firstEventDate: string;
  lastEventDate: string;
  pbs: Record<string, { time: string; eventName: string; eventDate: string }>;
  medals: { gold: number; silver: number; bronze: number };
  avgRank: number;
}

/** 按姓名+号码跨赛事聚合运动员档案（号码相同视为同一人） */
export function buildProfile(
  events: RaceEvent[],
  name: string,
  number: string
): AthleteProfile | null {
  const records: AthleteRecord[] = [];
  const teams = new Set<string>();
  const seats = new Set<string>();
  let firstDate = "";
  let lastDate = "";

  for (const e of events) {
    const ranks = rankResults(e.results);
    for (const t of e.teams) {
      for (const a of t.athletes) {
        if (a.name !== name || (number && a.number !== number)) continue;
        teams.add(t.name);
        if (a.seat) seats.add(a.seat);
        if (!firstDate || e.date < firstDate) firstDate = e.date;
        if (e.date > lastDate) lastDate = e.date;
        for (const r of e.results) {
          if (r.teamId !== t.id) continue;
          records.push({
            eventId: e.id,
            eventName: e.name,
            eventDate: e.date,
            teamId: t.id,
            teamName: t.name,
            seat: a.seat,
            distance: r.distance,
            group: r.group,
            time: r.time,
            rank: ranks.get(r.id) ?? 0,
          });
        }
      }
    }
  }

  if (records.length === 0 && teams.size === 0) return null;

  records.sort(
    (a, b) =>
      a.eventDate.localeCompare(b.eventDate) ||
      a.distance.localeCompare(b.distance)
  );

  const pbs: AthleteProfile["pbs"] = {};
  for (const r of records) {
    const cur = pbs[r.distance];
    if (!cur || timeToMs(r.time) < timeToMs(cur.time)) {
      pbs[r.distance] = { time: r.time, eventName: r.eventName, eventDate: r.eventDate };
    }
  }

  const ranked = records.filter((r) => r.rank > 0);
  const medals = {
    gold: ranked.filter((r) => r.rank === 1).length,
    silver: ranked.filter((r) => r.rank === 2).length,
    bronze: ranked.filter((r) => r.rank === 3).length,
  };
  const avgRank =
    ranked.length > 0
      ? Math.round((ranked.reduce((s, r) => s + r.rank, 0) / ranked.length) * 10) / 10
      : 0;

  return {
    name,
    number,
    teams: [...teams],
    seats: [...seats],
    records,
    eventCount: new Set(records.map((r) => r.eventId)).size,
    firstEventDate: firstDate,
    lastEventDate: lastDate,
    pbs,
    medals,
    avgRank,
  };
}
