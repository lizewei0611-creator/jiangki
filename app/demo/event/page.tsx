"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Athlete,
  RaceEvent,
  RaceResult,
  Team,
  rankResults,
  timeToMs,
  uid,
} from "@/lib/types";
import { useEvents, updateEvent } from "@/lib/storage";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-slate-900 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-red-600/60";

const btnPrimary =
  "rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500";

const btnGhost =
  "rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-white/40 hover:text-white";

const tabs = [
  { id: "overview", label: "概览" },
  { id: "teams", label: "队伍与队员" },
  { id: "results", label: "成绩管理" },
  { id: "portal", label: "门户预览" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function EventAdmin() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 py-40 text-center text-slate-500">
          加载中…
        </main>
      }
    >
      <Admin />
    </Suspense>
  );
}

function Admin() {
  const params = useSearchParams();
  const id = params.get("id");
  const events = useEvents();
  const [tab, setTab] = useState<TabId>("overview");

  const event = useMemo(
    () => (id ? events.find((e) => e.id === id) ?? null : null),
    [id, events]
  );

  const commit = (next: RaceEvent) => {
    updateEvent(next);
  };

  if (!event) {
    return (
      <main className="bg-slate-950 py-40 text-center">
        <p className="text-4xl">🏁</p>
        <p className="mt-4 text-slate-300">赛事不存在或已被删除</p>
        <Link href="/demo/" className="mt-6 inline-block text-red-400 hover:text-red-300">
          ← 返回赛事列表
        </Link>
      </main>
    );
  }

  const athleteCount = event.teams.reduce((n, t) => n + t.athletes.length, 0);
  const ranks = rankResults(event.results);

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
            <span className="font-bold text-white">{event.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400 sm:block">
              {event.location} · {event.date}
            </span>
            <Link
              href={`/demo/portal?id=${event.id}`}
              target="_blank"
              className={btnGhost}
            >
              观众门户 ↗
            </Link>
          </div>
        </div>
      </header>

      <nav className="border-b border-white/5">
        <div className="mx-auto flex max-w-6xl gap-1 px-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3.5 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "border-b-2 border-red-500 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {tab === "overview" && (
          <Overview event={event} athleteCount={athleteCount} />
        )}
        {tab === "teams" && (
          <TeamsTab event={event} commit={commit} />
        )}
        {tab === "results" && (
          <ResultsTab event={event} commit={commit} ranks={ranks} />
        )}
        {tab === "portal" && (
          <PortalPreview event={event} />
        )}
      </main>
    </div>
  );
}

function Overview({
  event,
  athleteCount,
}: {
  event: RaceEvent;
  athleteCount: number;
}) {
  const stats = [
    { label: "队伍数", value: event.teams.length },
    { label: "运动员", value: athleteCount },
    { label: "已录成绩", value: event.results.length },
    { label: "报名费/队", value: `¥${event.fee}` },
  ];
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/10 bg-slate-900/60 p-6"
          >
            <p className="text-sm text-slate-400">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/60 p-8">
        <h3 className="text-lg font-bold text-white">赛事信息</h3>
        <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["赛事名称", event.name],
            ["地点", event.location],
            ["日期", event.date],
            ["组别", event.groups.join(" / ") || "—"],
            ["报名费", `¥${event.fee} / 队`],
            ["队伍上限", `${event.teamLimit} 支`],
          ].map(([k, v]) => (
            <div key={k} className="border-b border-white/5 pb-3">
              <dt className="text-xs text-slate-500">{k}</dt>
              <dd className="mt-1 font-medium text-slate-200">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 border-t border-white/5 pt-6">
          <h4 className="mb-4 text-sm font-medium text-slate-300">下一步</h4>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-white/5 px-3.5 py-1.5 text-slate-300">
              ① 添加报名队伍
            </span>
            <span className="text-slate-600">→</span>
            <span className="rounded-full bg-white/5 px-3.5 py-1.5 text-slate-300">
              ② 补充队员信息
            </span>
            <span className="text-slate-600">→</span>
            <span className="rounded-full bg-white/5 px-3.5 py-1.5 text-slate-300">
              ③ 录入比赛成绩
            </span>
            <span className="text-slate-600">→</span>
            <span className="rounded-full bg-gradient-to-r from-red-600 to-amber-500 px-3.5 py-1.5 text-white">
              ④ 发布，观众门户可看
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamsTab({
  event,
  commit,
}: {
  event: RaceEvent;
  commit: (e: RaceEvent) => void;
}) {
  const [newTeam, setNewTeam] = useState({ name: "", captain: "" });
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newAthlete, setNewAthlete] = useState({ name: "", number: "", seat: "" });

  const addTeam = () => {
    if (!newTeam.name.trim()) return;
    const team: Team = {
      id: uid(),
      name: newTeam.name.trim(),
      captain: newTeam.captain.trim(),
      athletes: [],
    };
    commit({ ...event, teams: [...event.teams, team] });
    setNewTeam({ name: "", captain: "" });
    setExpanded(team.id);
  };

  const removeTeam = (id: string) => {
    if (!confirm("删除该队伍及其队员？")) return;
    commit({
      ...event,
      teams: event.teams.filter((t) => t.id !== id),
      results: event.results.filter((r) => r.teamId !== id),
    });
  };

  const addAthlete = (teamId: string) => {
    if (!newAthlete.name.trim()) return;
    const athlete: Athlete = {
      id: uid(),
      name: newAthlete.name.trim(),
      number: newAthlete.number.trim(),
      seat: newAthlete.seat.trim(),
    };
    commit({
      ...event,
      teams: event.teams.map((t) =>
        t.id === teamId ? { ...t, athletes: [...t.athletes, athlete] } : t
      ),
    });
    setNewAthlete({ name: "", number: "", seat: "" });
  };

  const removeAthlete = (teamId: string, athleteId: string) => {
    commit({
      ...event,
      teams: event.teams.map((t) =>
        t.id === teamId
          ? { ...t, athletes: t.athletes.filter((a) => a.id !== athleteId) }
          : t
      ),
    });
  };

  return (
    <div>
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
        <h3 className="text-sm font-medium text-slate-300">添加队伍</h3>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            className={inputCls}
            placeholder="队伍名称（必填）"
            value={newTeam.name}
            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="领队/管理员"
            value={newTeam.captain}
            onChange={(e) => setNewTeam({ ...newTeam, captain: e.target.value })}
          />
          <button onClick={addTeam} className={btnPrimary}>
            + 添加队伍
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {event.teams.length === 0 && (
          <p className="rounded-2xl border border-dashed border-white/15 py-14 text-center text-slate-500">
            还没有队伍，先添加第一支报名队伍
          </p>
        )}
        {event.teams.map((team) => (
          <div
            key={team.id}
            className="rounded-2xl border border-white/10 bg-slate-900/60"
          >
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/20 text-lg">
                  🚣
                </span>
                <div>
                  <p className="font-bold text-white">{team.name}</p>
                  <p className="text-xs text-slate-500">
                    {team.captain ? `领队 ${team.captain} · ` : ""}
                    {team.athletes.length} 名队员
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setExpanded(expanded === team.id ? null : team.id)}
                  className="text-sm text-slate-400 hover:text-white"
                >
                  {expanded === team.id ? "收起" : "管理队员"}
                </button>
                <button
                  onClick={() => removeTeam(team.id)}
                  className="text-sm text-slate-600 hover:text-red-400"
                >
                  删除
                </button>
              </div>
            </div>
            {expanded === team.id && (
              <div className="border-t border-white/5 px-6 py-5">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    className={inputCls}
                    placeholder="姓名（必填）"
                    value={newAthlete.name}
                    onChange={(e) =>
                      setNewAthlete({ ...newAthlete, name: e.target.value })
                    }
                  />
                  <input
                    className={inputCls}
                    placeholder="号码"
                    value={newAthlete.number}
                    onChange={(e) =>
                      setNewAthlete({ ...newAthlete, number: e.target.value })
                    }
                  />
                  <input
                    className={inputCls}
                    placeholder="位置（如 2号桨/鼓手）"
                    value={newAthlete.seat}
                    onChange={(e) =>
                      setNewAthlete({ ...newAthlete, seat: e.target.value })
                    }
                  />
                  <button onClick={() => addAthlete(team.id)} className={btnPrimary}>
                    + 添加
                  </button>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-xs text-slate-500">
                        <th className="pb-2 pr-4 font-medium">号码</th>
                        <th className="pb-2 pr-4 font-medium">姓名</th>
                        <th className="pb-2 pr-4 font-medium">位置</th>
                        <th className="pb-2 font-medium" />
                      </tr>
                    </thead>
                    <tbody>
                      {team.athletes.map((a) => (
                        <tr key={a.id} className="border-t border-white/5">
                          <td className="py-2.5 pr-4 text-slate-400">
                            {a.number || "—"}
                          </td>
                          <td className="py-2.5 pr-4 font-medium text-white">
                            {a.name}
                          </td>
                          <td className="py-2.5 pr-4 text-slate-400">
                            {a.seat || "—"}
                          </td>
                          <td className="py-2.5 text-right">
                            <div className="flex items-center justify-end gap-4">
                              <Link
                                href={`/demo/athlete/?name=${encodeURIComponent(a.name)}&number=${encodeURIComponent(a.number)}`}
                                className="text-xs text-red-400 hover:text-red-300"
                              >
                                档案
                              </Link>
                              <button
                                onClick={() => removeAthlete(team.id, a.id)}
                                className="text-xs text-slate-600 hover:text-red-400"
                              >
                                移除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {team.athletes.length === 0 && (
                    <p className="py-4 text-sm text-slate-600">
                      该队伍还没有队员
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultsTab({
  event,
  commit,
  ranks,
}: {
  event: RaceEvent;
  commit: (e: RaceEvent) => void;
  ranks: Map<string, number>;
}) {
  const [distance, setDistance] = useState("100米");
  const [group, setGroup] = useState(event.groups[0] ?? "公开组");
  const [teamId, setTeamId] = useState("");
  const [time, setTime] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId || !/^\d{1,3}:\d{2}(\.\d{1,3})?$/.test(time)) {
      alert("请选择队伍并填写正确的时间格式，如 2:10.35");
      return;
    }
    const result: RaceResult = { id: uid(), distance, group, teamId, time };
    commit({ ...event, results: [...event.results, result] });
    setTeamId("");
    setTime("");
  };

  const remove = (id: string) => {
    commit({ ...event, results: event.results.filter((r) => r.id !== id) });
  };

  const teamName = (id: string) =>
    event.teams.find((t) => t.id === id)?.name ?? "已删除队伍";

  const groups = [...new Set([...event.groups, ...event.results.map((r) => r.group)])];
  const distances = [...new Set([...["100米", "200米", "500米"], ...event.results.map((r) => r.distance)])];

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <form
        onSubmit={submit}
        className="h-fit rounded-2xl border border-white/10 bg-slate-900/60 p-6 lg:col-span-2"
      >
        <h3 className="font-bold text-white">录入成绩</h3>
        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-slate-400">距离</label>
            <select
              className={inputCls}
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            >
              {distances.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-400">组别</label>
            <select
              className={inputCls}
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            >
              {groups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-400">队伍</label>
            <select
              className={inputCls}
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
            >
              <option value="">选择队伍…</option>
              {event.teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-400">
              成绩时间（分:秒.毫秒）
            </label>
            <input
              className={inputCls}
              placeholder="如 2:10.35"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-red-600 py-2.5 font-medium text-white transition-colors hover:bg-red-500"
          >
            保存成绩
          </button>
        </div>
      </form>

      <div className="lg:col-span-3">
        {[...new Set(event.results.map((r) => r.distance))].length === 0 && (
          <p className="rounded-2xl border border-dashed border-white/15 py-14 text-center text-slate-500">
            还没有成绩，先录入第一条
          </p>
        )}
        {[...new Set(event.results.map((r) => `${r.distance}|${r.group}`))]
          .sort()
          .map((key) => {
            const [dist, grp] = key.split("|");
            const list = event.results
              .filter((r) => r.distance === dist && r.group === grp)
              .sort((a, b) => timeToMs(a.time) - timeToMs(b.time));
            return (
              <div key={key} className="mb-6">
                <h4 className="mb-3 text-sm font-medium text-slate-300">
                  {dist} · {grp}
                </h4>
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <table className="w-full bg-slate-900/60 text-left text-sm">
                    <tbody>
                      {list.map((r) => {
                        const medal = ranks.get(r.id);
                        return (
                          <tr key={r.id} className="border-b border-white/5 last:border-0">
                            <td className="w-14 px-5 py-3">
                              {medal === 1 ? (
                                <span className="text-amber-400">🥇</span>
                              ) : medal === 2 ? (
                                <span className="text-slate-300">🥈</span>
                              ) : medal === 3 ? (
                                <span className="text-amber-600">🥉</span>
                              ) : (
                                <span className="text-slate-500">{medal}</span>
                              )}
                            </td>
                            <td className="px-3 py-3 font-medium text-white">
                              {teamName(r.teamId)}
                            </td>
                            <td className="px-3 py-3 font-mono text-slate-300">
                              {r.time}
                            </td>
                            <td className="px-5 py-3 text-right">
                              <button
                                onClick={() => remove(r.id)}
                                className="text-xs text-slate-600 hover:text-red-400"
                              >
                                删除
                              </button>
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
}

function PortalPreview({ event }: { event: RaceEvent }) {
  const top = [...event.results]
    .sort((a, b) => timeToMs(a.time) - timeToMs(b.time))
    .slice(0, 3);
  const teamName = (id: string) =>
    event.teams.find((t) => t.id === id)?.name ?? "已删除队伍";
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white">观众门户预览</h3>
        <Link
          href={`/demo/portal?id=${event.id}`}
          target="_blank"
          className={btnPrimary}
        >
          在新窗口打开 ↗
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-red-950/40">
        <div className="px-8 py-10 text-center">
          <p className="text-xs tracking-widest text-red-400">JIANGKI LIVE</p>
          <h4 className="mt-3 text-2xl font-bold text-white">{event.name}</h4>
          <p className="mt-2 text-sm text-slate-400">
            {event.location} · {event.date}
          </p>
          <p className="mt-6 inline-block rounded-full bg-red-600 px-6 py-2.5 text-sm font-medium text-white">
            成绩实时直播中
          </p>
        </div>
        <div className="grid gap-4 border-t border-white/10 px-8 py-6 md:grid-cols-3">
          {top.length === 0 && (
            <p className="col-span-full text-center text-sm text-slate-500">
              录入成绩后，这里将展示实时排行榜
            </p>
          )}
          {top.map((r, i) => (
            <div
              key={r.id}
              className={`rounded-xl px-5 py-4 ${
                i === 0
                  ? "bg-gradient-to-r from-red-600 to-amber-500"
                  : "bg-white/5"
              }`}
            >
              <p className={`text-2xl ${i === 0 ? "text-white" : "text-slate-300"}`}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
              </p>
              <p className={`mt-2 font-bold ${i === 0 ? "text-white" : "text-white"}`}>
                {teamName(r.teamId)}
              </p>
              <p
                className={`font-mono text-sm ${i === 0 ? "text-white/90" : "text-slate-400"}`}
              >
                {r.distance} {r.time}
              </p>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-500">
        数据与真实门户一致：队伍、队员、成绩全部实时同步。预览已展示 {event.results.length} 条成绩，排名按时间自动计算。
      </p>
    </div>
  );
}
