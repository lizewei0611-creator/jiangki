"use client";

import { useState } from "react";
import { useRanks } from "@/lib/ranks";
import { CITIES, cityColor } from "@/lib/cities";

export default function Leaderboard() {
  const ranks = useRanks();
  const [filter, setFilter] = useState<string>("全部");
  const filters = ["全部", ...CITIES.map((c) => c.name)];
  const list = ranks.filter((r) => filter === "全部" || r.cities.includes(filter));
  return (
    <div className="pixel-border mt-8 bg-arcade-2 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="pixel-font text-[11px] text-pac">
          LEADERBOARD · TOP {list.length}
        </h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border-2 border-arcade-line bg-arcade-3 px-3 py-1.5 text-sm text-slate-200 outline-none focus:border-pac"
        >
          {filters.map((f) => (
            <option key={f} value={f}>
              {f === "全部" ? "全部玩家" : `已解锁 ${f} 的玩家`}
            </option>
          ))}
        </select>
      </div>
      {list.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">
          还没有人上榜，来当第一个冠军！
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="pixel-font text-[9px] text-slate-500">
                <th className="pb-3 pr-4 font-medium">#</th>
                <th className="pb-3 pr-4 font-medium">NAME</th>
                <th className="pb-3 pr-4 font-medium">SCORE</th>
                <th className="pb-3 pr-4 font-medium">SPMS</th>
                <th className="pb-3 pr-4 font-medium">PERFECT</th>
                <th className="pb-3 pr-4 font-medium">CITIES</th>
                <th className="pb-3 font-medium">TITLE</th>
              </tr>
            </thead>
            <tbody>
              {list.slice(0, 20).map((r, i) => (
                <tr key={r.id} className="border-t border-arcade-line">
                  <td className="py-2.5 pr-4">
                    {i === 0 ? (
                      <span className="text-ghost-pink">👑</span>
                    ) : i < 3 ? (
                      <span className="text-pac">★</span>
                    ) : (
                      <span className="text-slate-500">{i + 1}</span>
                    )}
                  </td>
                  <td className="py-2.5 pr-4 font-medium text-white">{r.nick}</td>
                  <td className="py-2.5 pr-4 font-mono text-pac">{r.score}</td>
                  <td className="py-2.5 pr-4 font-mono text-ghost-cyan">
                    {r.spm ? `${r.spm}` : "—"}
                  </td>
                  <td className="py-2.5 pr-4 text-slate-300">
                    {r.perfect != null ? `${r.perfect}%` : "—"}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className="flex flex-wrap gap-1">
                      {r.cities.length === 0 && <span className="text-slate-600">—</span>}
                      {r.cities.map((c) => (
                        <span
                          key={c}
                          className="h-2.5 w-2.5"
                          style={{ background: cityColor(c) }}
                          title={c}
                        />
                      ))}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-300">{r.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function rankMedal(i: number) {
  return i === 0 ? "👑" : i < 3 ? "★" : String(i + 1);
}
