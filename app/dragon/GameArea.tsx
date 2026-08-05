"use client";

import { useState } from "react";
import RaceMode from "./RaceMode";
import Game from "./Game";
import Leaderboard from "../components/Leaderboard";

export default function GameArea() {
  const [mode, setMode] = useState<"race" | "cruise">("race");
  return (
    <div>
      <div className="mb-6 flex justify-center gap-3">
        <button
          onClick={() => setMode("race")}
          className={`border-2 px-6 py-2.5 text-sm font-bold transition-colors ${
            mode === "race"
              ? "border-pac bg-pac text-black"
              : "border-arcade-line text-slate-400 hover:border-pac hover:text-pac"
          }`}
        >
          🏁 竞渡冲刺
        </button>
        <button
          onClick={() => setMode("cruise")}
          className={`border-2 px-6 py-2.5 text-sm font-bold transition-colors ${
            mode === "cruise"
              ? "border-pac bg-pac text-black"
              : "border-arcade-line text-slate-400 hover:border-pac hover:text-pac"
          }`}
        >
          🗺️ 漫游探索
        </button>
      </div>
      {mode === "race" ? <RaceMode /> : <Game />}
      <Leaderboard />
    </div>
  );
}
