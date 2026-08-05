"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEvents } from "@/lib/storage";
import { buildProfile } from "@/lib/athlete";
import { timeToMs } from "@/lib/types";

export default function AthletePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 py-40 text-center text-slate-500">
          加载中…
        </main>
      }
    >
      <AthleteInner />
    </Suspense>
  );
}

function AthleteInner() {
  const params = useSearchParams();
  const name = params.get("name") ?? "";
  const number = params.get("number") ?? "";
  const events = useEvents();

  const profile = useMemo(
    () => (name ? buildProfile(events, name, number) : null),
    [events, name, number]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/5">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/demo/"
              className="text-slate-400 transition-colors hover:text-white"
            >
              ← 赛事列表
            </Link>
            <span className="h-5 w-px bg-white/10" />
            <span className="font-bold text-white">运动员档案</span>
          </div>
          <p className="hidden text-sm text-slate-400 md:block">
            数据跨赛事自动聚合 · 比赛会结束，数据不会结束
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {!profile ? (
          <div className="py-32 text-center">
            <p className="text-4xl">🏅</p>
            <p className="mt-4 text-slate-300">未找到该运动员的档案</p>
            <Link
              href="/demo/"
              className="mt-6 inline-block text-red-400 hover:text-red-300"
            >
              ← 返回赛事列表
            </Link>
          </div>
        ) : (
          <>
            <ProfileCard profile={profile} />
            <GrowthChart profile={profile} />
            <RecordsTable profile={profile} />
            <Honors profile={profile} />
          </>
        )}
      </main>
    </div>
  );
}

function ProfileCard({ profile }: { profile: NonNullable<ReturnType<typeof buildProfile>> }) {
  const statCards = [
    { label: "参赛赛事", value: profile.eventCount, unit: "场" },
    { label: "最好成绩", value: pbSummary(profile), unit: "" },
    {
      label: "获奖",
      value: `${profile.medals.gold + profile.medals.silver + profile.medals.bronze}`,
      unit: "次",
    },
    { label: "平均名次", value: profile.avgRank ? `${profile.avgRank}` : "—", unit: "" },
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-2xl border border-red-600/30 bg-gradient-to-b from-red-950/40 to-slate-900/60 p-8">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-amber-400 text-3xl font-bold text-white">
            {profile.name.slice(0, 1)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
            <p className="mt-1 font-mono text-xs text-red-300">
              {profile.number ? `CN-${profile.number.padStart(6, "0")}` : "CN-XXXXXX"}
            </p>
          </div>
        </div>
        <dl className="mt-7 space-y-3.5 text-sm">
          {[
            ["所属队伍", profile.teams.join(" / ") || "—"],
            ["擅长位置", profile.seats.join(" / ") || "—"],
            ["首次参赛", profile.firstEventDate || "—"],
            ["最近参赛", profile.lastEventDate || "—"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between border-b border-white/5 pb-3">
              <dt className="text-slate-400">{k}</dt>
              <dd className="font-medium text-white">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6">
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-amber-300">
            🏆 荣誉
            <span className="text-xs text-slate-400">
              🥇{profile.medals.gold} 🥈{profile.medals.silver} 🥉{profile.medals.bronze}
            </span>
          </p>
          {profile.medals.gold + profile.medals.silver + profile.medals.bronze === 0 ? (
            <p className="rounded-lg bg-white/5 px-4 py-3 text-xs text-slate-500">
              暂无站台记录，首座奖杯在下一场比赛！
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: profile.medals.gold }).map((_, i) => (
                <span key={`g${i}`} className="text-xl">🥇</span>
              ))}
              {Array.from({ length: profile.medals.silver }).map((_, i) => (
                <span key={`s${i}`} className="text-xl">🥈</span>
              ))}
              {Array.from({ length: profile.medals.bronze }).map((_, i) => (
                <span key={`b${i}`} className="text-xl">🥉</span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:col-span-2">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
            <p className="text-sm text-slate-400">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {s.value}
              {s.unit && <span className="ml-1 text-base text-slate-500">{s.unit}</span>}
            </p>
          </div>
        ))}
        <div className="col-span-2 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
          <p className="text-sm text-slate-400">个人最好成绩（PB）</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {Object.keys(profile.pbs).length === 0 && (
              <p className="text-sm text-slate-500">暂无成绩记录</p>
            )}
            {Object.entries(profile.pbs).map(([dist, pb]) => (
              <div key={dist} className="rounded-xl bg-white/5 px-4 py-3">
                <p className="text-xs text-slate-500">{dist}</p>
                <p className="mt-1 font-mono text-xl font-bold text-red-300">{pb.time}</p>
                <p className="mt-0.5 truncate text-[11px] text-slate-500">
                  {pb.eventName} · {pb.eventDate}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function pbSummary(profile: NonNullable<ReturnType<typeof buildProfile>>): string {
  const best = Object.values(profile.pbs).sort((a, b) => timeToMs(a.time) - timeToMs(b.time))[0];
  return best ? best.time : "—";
}

function GrowthChart({ profile }: { profile: NonNullable<ReturnType<typeof buildProfile>> }) {
  const byDistance = new Map<string, { time: string; eventDate: string }[]>();
  for (const r of profile.records) {
    const list = byDistance.get(r.distance) ?? [];
    list.push({ time: r.time, eventDate: r.eventDate });
    byDistance.set(r.distance, list);
  }
  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/60 p-8">
      <h2 className="font-bold text-white">成长曲线</h2>
      <p className="mt-1 text-sm text-slate-500">
        各距离成绩随参赛时间的变化 —— 柱越高代表越快，弯道超车看得见
      </p>
      {byDistance.size === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">暂无成绩数据</p>
      ) : (
        <div className="mt-6 grid gap-8 md:grid-cols-3">
          {[...byDistance.entries()].map(([dist, list]) => {
            const times = list.map((l) => timeToMs(l.time));
            const min = Math.min(...times);
            const max = Math.max(...times);
            const range = Math.max(1, max - min);
            return (
              <div key={dist}>
                <p className="mb-4 text-sm font-medium text-slate-300">
                  {dist} <span className="ml-2 text-xs text-slate-500">{list.length} 次参赛</span>
                </p>
                <div className="flex h-40 items-end gap-3">
                  {list.map((l, i) => {
                    const h = range > 0 ? 18 + ((max - timeToMs(l.time)) / range) * 82 : 70;
                    const isBest = timeToMs(l.time) === min;
                    return (
                      <div key={i} className="flex flex-1 flex-col items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400">{l.time}</span>
                        <div
                          className={`w-full rounded-t ${
                            isBest
                              ? "bg-gradient-to-t from-red-700 to-red-400"
                              : "bg-gradient-to-t from-red-900/60 to-red-600/60"
                          }`}
                          style={{ height: `${h}%` }}
                          title={`${l.eventDate} · ${l.time}`}
                        />
                        <span className="text-[10px] text-slate-500">{l.eventDate.slice(5)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RecordsTable({ profile }: { profile: NonNullable<ReturnType<typeof buildProfile>> }) {
  const rows = [...profile.records].sort(
    (a, b) => b.eventDate.localeCompare(a.eventDate) || b.eventId.localeCompare(a.eventId)
  );
  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/60 p-8">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-white">全部成绩记录</h2>
        <span className="text-sm text-slate-500">共 {rows.length} 条</span>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs text-slate-500">
              <th className="pb-3 pr-4 font-medium">日期</th>
              <th className="pb-3 pr-4 font-medium">赛事</th>
              <th className="pb-3 pr-4 font-medium">队伍</th>
              <th className="pb-3 pr-4 font-medium">距离</th>
              <th className="pb-3 pr-4 font-medium">组别</th>
              <th className="pb-3 pr-4 font-medium">成绩</th>
              <th className="pb-3 font-medium">名次</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-white/5">
                <td className="py-3 pr-4 text-slate-400">{r.eventDate}</td>
                <td className="py-3 pr-4 font-medium text-white">{r.eventName}</td>
                <td className="py-3 pr-4 text-slate-300">{r.teamName}</td>
                <td className="py-3 pr-4 text-slate-400">{r.distance}</td>
                <td className="py-3 pr-4 text-slate-400">{r.group}</td>
                <td className="py-3 pr-4 font-mono text-slate-300">{r.time}</td>
                <td className="py-3">
                  {r.rank === 1 ? (
                    <span className="text-amber-400">🥇 第1名</span>
                  ) : r.rank === 2 ? (
                    <span className="text-slate-300">🥈 第2名</span>
                  ) : r.rank === 3 ? (
                    <span className="text-amber-600">🥉 第3名</span>
                  ) : (
                    <span className="text-slate-500">第{r.rank}名</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">暂无成绩记录</p>
        )}
      </div>
    </div>
  );
}

function Honors({ profile }: { profile: NonNullable<ReturnType<typeof buildProfile>> }) {
  const honors = profile.records.filter((r) => r.rank >= 1 && r.rank <= 3);
  if (honors.length === 0) return null;
  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/60 p-8">
      <h2 className="font-bold text-white">荣誉记录</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {honors.map((r, i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 px-5 py-4">
            <span className="text-2xl">{r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : "🥉"}</span>
            <div className="min-w-0">
              <p className="truncate font-medium text-white">{r.eventName}</p>
              <p className="mt-0.5 text-xs text-slate-400">
                {r.distance} · {r.group} · {r.time} · 第{r.rank}名
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
