"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createEvent } from "@/lib/storage";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-600 outline-none transition-colors focus:border-red-600/60";

const labelCls = "mb-1.5 block text-sm font-medium text-slate-300";

export default function NewEvent() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [groups, setGroups] = useState("公开组");
  const [fee, setFee] = useState("2999");
  const [teamLimit, setTeamLimit] = useState("50");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("请填写赛事名称");
      return;
    }
    if (!location.trim()) {
      setError("请填写赛事地点");
      return;
    }
    if (!date) {
      setError("请选择赛事日期");
      return;
    }
    const event = createEvent({
      name: name.trim(),
      location: location.trim(),
      date,
      groups: groups
        .split(/[，,、\n]/)
        .map((g) => g.trim())
        .filter(Boolean),
      fee: Number(fee) || 0,
      teamLimit: Number(teamLimit) || 0,
    });
    router.push(`/demo/event?id=${event.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/5">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-6">
          <Link href="/demo/" className="text-slate-400 transition-colors hover:text-white">
            ← 返回赛事列表
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12">
        <span className="text-sm font-medium tracking-widest text-red-400">
          STEP 1
        </span>
        <h1 className="mt-2 text-3xl font-bold text-white">创建赛事</h1>
        <p className="mt-2 text-slate-400">
          填写基本信息即可创建，队伍、队员和成绩可在创建后继续管理。
        </p>
        <form onSubmit={submit} className="mt-10 space-y-6">
          <div>
            <label htmlFor="name" className={labelCls}>
              赛事名称 *
            </label>
            <input
              id="name"
              className={inputCls}
              placeholder="如：第三届横琴龙舟赛"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="location" className={labelCls}>
              赛事地点 *
            </label>
            <input
              id="location"
              className={inputCls}
              placeholder="如：珠海横琴 · 天沐河"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="date" className={labelCls}>
              赛事日期 *
            </label>
            <input
              id="date"
              type="date"
              className={inputCls}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <label htmlFor="groups" className={labelCls}>
                组别（逗号分隔）
              </label>
              <input
                id="groups"
                className={inputCls}
                placeholder="公开组, 女子组"
                value={groups}
                onChange={(e) => setGroups(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="fee" className={labelCls}>
                报名费（元/队）
              </label>
              <input
                id="fee"
                type="number"
                min="0"
                className={inputCls}
                value={fee}
                onChange={(e) => setFee(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="teamLimit" className={labelCls}>
                队伍上限
              </label>
              <input
                id="teamLimit"
                type="number"
                min="0"
                className={inputCls}
                value={teamLimit}
                onChange={(e) => setTeamLimit(e.target.value)}
              />
            </div>
          </div>
          {error && (
            <p className="rounded-lg border border-red-600/30 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              className="rounded-full bg-red-600 px-8 py-3 font-medium text-white shadow-lg shadow-red-600/25 transition-colors hover:bg-red-500"
            >
              创建赛事 →
            </button>
            <span className="text-sm text-slate-500">
              创建后即可添加队伍、录入成绩
            </span>
          </div>
        </form>
      </main>
    </div>
  );
}
