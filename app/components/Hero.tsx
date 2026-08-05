import { Pacman, Ghost, PacPellet, DotRow, PixelTag } from "./arcade";

const flow = ["赛事", "俱乐部", "运动员", "成绩", "长期档案"];

export default function Hero() {
  return (
    <section
      id="top"
      className="dot-grid-pac relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(254,225,0,0.07),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-pac/30 to-transparent"
      />
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <PacPellet size={16} />
          <PixelTag color="#fee100">1-UP · 桨刻 · 龙舟数据平台</PixelTag>
          <PacPellet size={16} />
        </div>
        <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl md:leading-[1.15]">
          比赛会结束，
          <span className="pixel-text-pac">
            运动员数据不会结束
          </span>
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400 md:text-xl">
          桨刻是一个从龙舟赛事切入，帮助赛事主办方办赛、帮助俱乐部管理队员、
          帮助运动员沉淀个人参赛数据的龙舟数字化平台。
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/demo/"
            className="pixel-border-pac group bg-pac px-8 py-3.5 text-base font-bold text-black transition-transform hover:-translate-y-0.5"
          >
            ▶ 免费创建赛事
          </a>
          <a
            href="#platform"
            className="pixel-border px-8 py-3.5 text-base font-medium text-slate-200 transition-colors hover:text-pac"
          >
            了解平台
          </a>
        </div>

        {/* 街机：吃豆人收集能量豆，幽灵巡逻 */}
        <div className="mx-auto mt-16 max-w-3xl">
          <div className="pixel-border bg-arcade-2/90 px-6 py-7">
            <div className="mb-4 flex items-center justify-between">
              <span className="pixel-font text-[10px] text-ghost-cyan">
                SCORE 000100
              </span>
              <span className="pixel-font text-[10px] text-ghost-pink">
                HI-SCORE 000800
              </span>
            </div>
            <div className="pixel-divider mb-6" />
            <div className="relative flex items-center justify-between gap-2">
              <Pacman size={40} running duration={6} distance={230} />
              <DotRow count={10} step={0.6} />
              <Ghost color="#ff2d55" size={36} />
              <Ghost
                color="#00e5ff"
                size={30}
                className="absolute right-6"
              />
            </div>
            <p className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
              <span className="text-pac">●</span>
              每一次办赛都在收集能量豆：成绩、队伍、运动员，统统沉淀下来
            </p>
          </div>
          <p className="mt-3 pixel-font text-center text-[9px] text-slate-600">
            INSERT COIN TO START A NEW EVENT
          </p>
        </div>

        <div className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-3 rounded-none border-2 border-arcade-line bg-arcade-2/80 px-8 py-5 text-sm text-slate-300">
          <span className="pixel-font text-[10px] text-pac">DATA FLOW</span>
          {flow.map((step, i) => (
            <span key={step} className="flex items-center gap-4">
              <span className="font-medium text-slate-200">{step}</span>
              {i < flow.length - 1 && <span className="text-pac">▶</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
