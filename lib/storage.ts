import { useSyncExternalStore } from "react";
import { RaceEvent, uid } from "./types";

const KEY = "jiangki.events.v1";

export function loadEvents(): RaceEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as RaceEvent[]) : [];
  } catch {
    return [];
  }
}

export function saveEvents(events: RaceEvent[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(events));
}

let cache: RaceEvent[] | null = null;
const listeners = new Set<() => void>();

function snapshot(): RaceEvent[] {
  if (cache === null) cache = loadEvents();
  return cache;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useEvents(): RaceEvent[] {
  return useSyncExternalStore(subscribe, snapshot, () => []);
}

function mutate(next: RaceEvent[]): void {
  cache = next;
  saveEvents(next);
  listeners.forEach((l) => l());
}

export function getEvent(id: string): RaceEvent | undefined {
  return snapshot().find((e) => e.id === id);
}

export function createEvent(
  input: Omit<RaceEvent, "id" | "teams" | "results" | "createdAt">
): RaceEvent {
  const event: RaceEvent = {
    ...input,
    id: uid(),
    teams: [],
    results: [],
    createdAt: Date.now(),
  };
  mutate([event, ...snapshot()]);
  return event;
}

export function updateEvent(updated: RaceEvent): void {
  mutate(snapshot().map((e) => (e.id === updated.id ? updated : e)));
}

export function deleteEvent(id: string): void {
  mutate(snapshot().filter((e) => e.id !== id));
}

export function addSampleEvent(): RaceEvent {
  const sample = buildSampleEvent();
  mutate([sample, ...snapshot()]);
  return sample;
}

function a(id: string, name: string, number: string, seat: string) {
  return { id, name, number, seat };
}

function buildSampleEvent(): RaceEvent {
  const teams = [
    {
      id: "t-hq",
      name: "横琴龙舟队",
      captain: "陈伟",
      athletes: [
        a("hq-1", "张三", "01", "2号桨"),
        a("hq-2", "李强", "02", "鼓手"),
        a("hq-3", "王涛", "03", "舵手"),
        a("hq-4", "刘洋", "04", "1号桨"),
        a("hq-5", "赵磊", "05", "3号桨"),
        a("hq-6", "孙浩", "06", "4号桨"),
      ],
    },
    {
      id: "t-macau",
      name: "澳门飞龙队",
      captain: "何俊",
      athletes: [
        a("mac-1", "陈志远", "11", "鼓手"),
        a("mac-2", "吴明", "12", "2号桨"),
        a("mac-3", "郑浩", "13", "1号桨"),
        a("mac-4", "梁宇", "14", "3号桨"),
        a("mac-5", "黄健", "15", "4号桨"),
        a("mac-6", "许峰", "16", "舵手"),
      ],
    },
    {
      id: "t-gba",
      name: "大湾区联队",
      captain: "林珊",
      athletes: [
        a("gba-1", "周平", "21", "1号桨"),
        a("gba-2", "冯远", "22", "2号桨"),
        a("gba-3", "邓超", "23", "鼓手"),
        a("gba-4", "何斌", "24", "3号桨"),
        a("gba-5", "叶青", "25", "4号桨"),
        a("gba-6", "龙腾", "26", "舵手"),
      ],
    },
    {
      id: "t-shenzhen",
      name: "深圳鹏城队",
      captain: "马骏",
      athletes: [
        a("sz-1", "罗勇", "31", "鼓手"),
        a("sz-2", "韩磊", "32", "1号桨"),
        a("sz-3", "蒋涛", "33", "2号桨"),
        a("sz-4", "杜威", "34", "3号桨"),
        a("sz-5", "高翔", "35", "4号桨"),
        a("sz-6", "田飞", "36", "舵手"),
      ],
    },
    {
      id: "t-hk",
      name: "香港维港队",
      captain: "关礼",
      athletes: [
        a("hk-1", "谢明", "41", "1号桨"),
        a("hk-2", "黎平", "42", "2号桨"),
        a("hk-3", "方杰", "43", "鼓手"),
        a("hk-4", "雷震", "44", "3号桨"),
        a("hk-5", "邝亮", "45", "4号桨"),
        a("hk-6", "古天", "46", "舵手"),
      ],
    },
  ];

  const results = [
    { id: "r1", distance: "100米", group: "公开组", teamId: "t-hq", time: "0:24.18" },
    { id: "r2", distance: "100米", group: "公开组", teamId: "t-gba", time: "0:24.72" },
    { id: "r3", distance: "100米", group: "公开组", teamId: "t-macau", time: "0:24.95" },
    { id: "r4", distance: "100米", group: "公开组", teamId: "t-shenzhen", time: "0:25.30" },
    { id: "r5", distance: "100米", group: "公开组", teamId: "t-hk", time: "0:25.64" },
    { id: "r6", distance: "200米", group: "公开组", teamId: "t-hq", time: "0:52.06" },
    { id: "r7", distance: "200米", group: "公开组", teamId: "t-macau", time: "0:52.41" },
    { id: "r8", distance: "200米", group: "公开组", teamId: "t-gba", time: "0:52.88" },
    { id: "r9", distance: "200米", group: "公开组", teamId: "t-shenzhen", time: "0:53.15" },
    { id: "r10", distance: "200米", group: "公开组", teamId: "t-hk", time: "0:53.60" },
    { id: "r11", distance: "500米", group: "公开组", teamId: "t-hq", time: "2:10.35" },
    { id: "r12", distance: "500米", group: "公开组", teamId: "t-gba", time: "2:11.02" },
    { id: "r13", distance: "500米", group: "公开组", teamId: "t-macau", time: "2:11.78" },
    { id: "r14", distance: "500米", group: "公开组", teamId: "t-shenzhen", time: "2:12.44" },
    { id: "r15", distance: "500米", group: "公开组", teamId: "t-hk", time: "2:13.20" },
  ];

  return {
    id: uid(),
    name: "第三届横琴龙舟赛",
    location: "珠海横琴 · 天沐河",
    date: "2026-09-19",
    groups: ["公开组", "女子组"],
    fee: 2999,
    teamLimit: 50,
    teams,
    results,
    createdAt: Date.now(),
  };
}
