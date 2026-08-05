"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Athlete,
  RaceEvent,
  RaceResult,
  rankResults,
  timeToMs,
} from "@/lib/types";
import { useEvents } from "@/lib/storage";

export default function Portal() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 py-40 text-center text-slate-500">
          加载中…
        </main>
      }
    >
      <PortalInner />
    </Suspense>
  );
}

function PortalInner() {
  const params = useSearchParams();
  const id = params.get("id");
  const allEvents = useEvents();
  const [profile, setProfile] = useState<Athlete | null>(null);

  const event = useMemo(
    () => (id ? allEvents.find((e) => e.id === id) ?? null : null),
    [id, allEvents]
  );

  const ranks = useMemo(
    () => (event ? rankResults(event.results) : new Map()),
    [event]
  );

  if (!event) {
    return (
      <main className="min-h-screen bg-slate-950 py-40 text-center">
        <p className="text-4xl">🏁</p>
        <p className="mt-4 text-slate-300">赛事不存在</p>
        <Link href="/demo/" className="mt-6 inline-block text-red-400 hover:text-red-300">
          ← 返回赛事列表
        </Link>
      </main>
    );
  }

  const teamName = (id: string) =>
    event.teams.find((t) => t.id === id)?.name ?? "已删除队伍";

  const distanceKeys = [...new Set(event.results.map((r) => r.distance))];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/5 bg-gradient-to-r from-red-950/60 to-slate-950">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-base">
              🛶
            </span>
            <span className="font-bold text-white">桨刻 · 赛事门户</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <span className="text-xs text-red-300">成绩实时更新</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/40 p-10 text-center">
          <p className="text-xs tracking-widest text-red-400">
            第三届赛事 · 品牌战队 · 数据直播
          </p>
          <h1 className="mt-4 text-3xl font-bold text-white md:text-5xl">
            {event.name}
          </h1>
          <p className="mt-4 text-slate-400">
            📍 {event.location} · 📅 {event.date}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-center">
            {[
              { v: event.teams.length, l: "报名队伍" },
              {
                v: event.teams.reduce((n, t) => n + t.athletes.length, 0),
                l: "参赛运动员",
              },
              { v: event.results.length, l: "已发布成绩" },
              { v: event.groups.join(" / "), l: "竞赛组别" },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-3xl font-bold text-white">{s.v}</p>
                <p className="mt-1 text-sm text-slate-500">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="mb-4 font-bold text-white">参赛队伍</h2>
            <div className="space-y-3">
              {event.teams.map((team, i) => (
                <div
                  key={team.id}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600/20 text-lg">
                      🚣
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-white">{team.name}</p>
                      <p className="text-xs text-slate-500">
                        {team.athletes.length} 名运动员
                        {team.captain ? ` · 领队 ${team.captain}` : ""}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-slate-600">
                      #{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  {team.athletes.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5 border-t border-white/5 pt-4">
                      {team.athletes.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => setProfile(a)}
                          className="group rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-300 transition-colors hover:bg-red-600/20 hover:text-white"
                          title="查看运动员档案"
                        >
                          {a.name}
                          {a.seat ? (
                            <span className="ml-1 text-slate-600 group-hover:text-red-300">
                              {a.seat}
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {event.teams.length === 0 && (
                <p className="rounded-2xl border border-dashed border-white/15 py-10 text-center text-sm text-slate-500">
                  暂无队伍报名
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className="mb-4 font-bold text-white">成绩榜</h2>
            {distanceKeys.length === 0 && (
              <p className="rounded-2xl border border-dashed border-white/15 py-14 text-center text-slate-500">
                成绩发布后将在此实时展示
              </p>
            )}
            {distanceKeys.map((dist) => {
              const groups = [
                ...new Set(
                  event.results
                    .filter((r) => r.distance === dist)
                    .map((r) => r.group)
                ),
              ];
              return (
                <div key={dist} className="mb-8">
                  <h3 className="mb-3 text-lg font-bold text-red-300">
                    {dist}
                  </h3>
                  <div className="space-y-6">
                    {groups.map((grp) => {
                      const list = event.results
                        .filter((r) => r.distance === dist && r.group === grp)
                        .sort((a, b) => timeToMs(a.time) - timeToMs(b.time));
                      return (
                        <div key={grp}>
                          <p className="mb-2 text-xs text-slate-500">{grp}</p>
                          <div className="overflow-hidden rounded-2xl border border-white/10">
                            <table className="w-full bg-slate-900/60 text-left text-sm">
                              <tbody>
                                {list.map((r: RaceResult) => {
                                  const rank = ranks.get(r.id);
                                  return (
                                    <tr
                                      key={r.id}
                                      className="border-b border-white/5 last:border-0"
                                    >
                                      <td className="w-16 px-5 py-3.5">
                                        {rank === 1 ? (
                                          <span className="text-xl">🥇</span>
                                        ) : rank === 2 ? (
                                          <span className="text-xl">🥈</span>
                                        ) : rank === 3 ? (
                                          <span className="text-xl">🥉</span>
                                        ) : (
                                          <span className="text-slate-500">
                                            {rank}
                                          </span>
                                        )}
                                      </td>
                                      <td className="px-3 py-3.5 font-bold text-white">
                                        {teamName(r.teamId)}
                                      </td>
                                      <td className="px-3 py-3.5 font-mono text-slate-300">
                                        {r.time}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <footer className="mt-16 border-t border-white/5 pt-8 text-center">
          <p className="text-sm text-slate-500">
            由 <span className="font-medium text-slate-300">桨刻</span> 赛事数据系统提供
          </p>
          <Link href="/demo/" className="mt-2 inline-block text-xs text-slate-600 hover:text-slate-400">
            ← 返回管理后台
          </Link>
        </footer>
      </main>

      {profile && (
        <AthleteProfile
          athlete={profile}
          allEvents={allEvents}
          onClose={() => setProfile(null)}
        />
      )}
    </div>
  );
}

function AthleteProfile({
  athlete,
  allEvents,
  onClose,
}: {
  athlete: Athlete;
  allEvents: RaceEvent[];
  onClose: () => void;
}) {
  const records = allEvents
    .flatMap((e) =>
      e.teams
        .flatMap((t) =>
          t.athletes
            .filter((a) => a.name === athlete.name && a.number === athlete.number)
            .map((a) => ({
              event: e,
              team: t,
              athlete: a,
              results: e.results.filter((r) => r.teamId === t.id),
            }))
        )
    )
    .filter((r) => r.results.length > 0);

  const medals = records.flatMap((r) => {
    const ranks = rankResults(r.event.results);
    return r.results.map((res) => ranks.get(res.id) ?? 99);
  });
  const golds = medals.filter((m) => m === 1).length;
  const silvers = medals.filter((m) => m === 2).length;
  const bronzes = medals.filter((m) => m === 3).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-amber-400 text-xl font-bold text-white">
              {athlete.name.slice(0, 1)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{athlete.name}</h3>
              <p className="font-mono text-xs text-red-400">
                {athlete.number ? `CN-${athlete.number.padStart(6, "0")}` : "编号未登记"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 transition-colors hover:text-white"
            aria-label="关闭"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-white/5 py-3">
            <p className="text-2xl font-bold text-amber-400">{golds}</p>
            <p className="mt-0.5 text-xs text-slate-500">冠军</p>
          </div>
          <div className="rounded-xl bg-white/5 py-3">
            <p className="text-2xl font-bold text-slate-300">{silvers}</p>
            <p className="mt-0.5 text-xs text-slate-500">亚军</p>
          </div>
          <div className="rounded-xl bg-white/5 py-3">
            <p className="text-2xl font-bold text-amber-600">{bronzes}</p>
            <p className="mt-0.5 text-xs text-slate-500">季军</p>
          </div>
        </div>

        <p className="mt-6 text-sm font-medium text-slate-300">参赛记录</p>
        {records.length === 0 && (
          <p className="mt-3 text-sm text-slate-500">
            暂无跨赛事参赛记录。该运动员未来参加的所有桨刻赛事，成绩将自动汇入此档案。
          </p>
        )}
        <div className="mt-3 space-y-3">
          {records.map((r) => (
            <div
              key={r.event.id + r.team.id}
              className="rounded-xl border border-white/10 bg-slate-950/60 p-4"
            >
              <p className="text-sm font-bold text-white">{r.event.name}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {r.team.name} · {r.athlete.seat || "位置未登记"} · {r.event.date}
              </p>
              {r.results.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.results.map((res) => {
                    const rank = rankResults(r.event.results).get(res.id);
                    return (
                      <span
                        key={res.id}
                        className="rounded-lg bg-red-600/15 px-2.5 py-1 font-mono text-xs text-red-300"
                      >
                        {res.distance} {res.time} · 第{rank}名
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-6 border-t border-white/5 pt-4 text-xs leading-5 text-slate-600">
          档案由桨刻自动沉淀：运动员的每一次参赛、每一条成绩都会累积到数字身份中。比赛会结束，数据不会结束。
        </p>
      </div>
    </div>
  );
}
