"use client";

import Link from "next/link";
import { useEvents, deleteEvent, addSampleEvent } from "@/lib/storage";

export default function DemoHome() {
  const events = useEvents();

  const handleSample = () => {
    addSampleEvent();
  };

  const handleDelete = (id: string) => {
    if (!confirm("确定删除该赛事？所有数据将一并清除。")) return;
    deleteEvent(id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/5">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-white transition-opacity hover:opacity-80"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-base">
                🛶
              </span>
              <span className="text-lg font-bold">桨刻</span>
            </Link>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-300">
              演示版
            </span>
          </div>
          <p className="hidden text-sm text-slate-400 md:block">
            数据保存在本机浏览器，随时可重置
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold text-white">我的赛事</h1>
            <p className="mt-2 text-slate-400">
              创建赛事、管理队伍与队员、录入成绩，体验桨刻全流程。
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSample}
              className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-white/40 hover:text-white"
            >
              载入示例赛事
            </button>
            <Link
              href="/demo/new"
              className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-500"
            >
              + 免费创建赛事
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-white/15 py-20 text-center">
              <p className="text-4xl">🏁</p>
              <p className="mt-4 text-lg font-medium text-slate-300">
                还没有赛事
              </p>
              <p className="mt-1 text-sm text-slate-500">
                创建一个赛事，或载入示例数据快速体验
              </p>
              <button
                onClick={handleSample}
                className="mt-6 rounded-full border border-red-600/40 px-6 py-2.5 text-sm font-medium text-red-300 transition-colors hover:bg-red-600/10"
              >
                载入「第三届横琴龙舟赛」示例
              </button>
            </div>
          )}
          {events.map((e) => {
            const athleteCount = e.teams.reduce((n, t) => n + t.athletes.length, 0);
            return (
              <div
                key={e.id}
                className="flex flex-col rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition-colors hover:border-red-600/40"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-white">{e.name}</h3>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="text-slate-600 transition-colors hover:text-red-400"
                    aria-label="删除赛事"
                  >
                    ✕
                  </button>
                </div>
                <p className="mt-1.5 text-sm text-slate-400">
                  {e.location} · {e.date}
                </p>
                <div className="mt-4 flex gap-4 text-sm text-slate-400">
                  <span>
                    <b className="text-white">{e.teams.length}</b> 支队伍
                  </span>
                  <span>
                    <b className="text-white">{athleteCount}</b> 名运动员
                  </span>
                  <span>
                    <b className="text-white">{e.results.length}</b> 条成绩
                  </span>
                </div>
                <div className="mt-6 flex gap-2 border-t border-white/5 pt-5">
                  <Link
                    href={`/demo/event?id=${e.id}`}
                    className="flex-1 rounded-full bg-red-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-red-500"
                  >
                    管理赛事
                  </Link>
                  <Link
                    href={`/demo/portal?id=${e.id}`}
                    className="rounded-full border border-white/15 px-4 py-2 text-center text-sm text-slate-200 transition-colors hover:border-white/40"
                  >
                    观众门户
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
