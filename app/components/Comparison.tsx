import { Ghost, PixelTag, PixelCard } from "./arcade";

const oldFlow = [
  "办一场比赛",
  "收一次报名",
  "录一次成绩",
  "比赛结束",
  "系统价值结束",
];

const newFlow = [
  "运动员注册",
  "加入俱乐部",
  "参加赛事",
  "产生成绩",
  "形成个人档案",
  "长期积累运动数据",
];

export default function Comparison() {
  return (
    <section id="comparison" className="border-t-2 border-arcade-line py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
          如果只是报名系统，比赛结束价值就结束了
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
          传统系统跟着一场比赛走，比赛结束、价值结束。桨刻让数据留下来。
        </p>
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <PixelCard className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <PixelTag color="#5a6ac8">GAME OVER</PixelTag>
              <Ghost color="#5a6ac8" size={26} className="opacity-60" />
            </div>
            <div className="flex flex-col gap-3">
              {oldFlow.map((step) => (
                <div key={step} className="flex items-center gap-4">
                  <div className="flex h-10 flex-1 items-center border-2 border-arcade-line bg-arcade-3/60 px-4 text-sm text-slate-500">
                    {step}
                  </div>
                  <span className="text-slate-700">▼</span>
                </div>
              ))}
            </div>
            <p className="pixel-font mt-6 text-center text-[10px] text-slate-500">
              FINAL SCORE · 000000
            </p>
            <p className="mt-2 text-center text-sm font-medium text-slate-500">
              比赛结束 → 系统价值结束
            </p>
          </PixelCard>

          <div className="pixel-border-pac bg-arcade-2 p-8">
            <div className="mb-6 flex items-center justify-between">
              <PixelTag color="#fee100">LEVEL UP!</PixelTag>
              <span className="pixel-font text-[10px] text-pac">+800 PTS</span>
            </div>
            <div className="flex flex-col gap-3">
              {newFlow.map((step, i) => (
                <div key={step} className="flex items-center gap-4">
                  <div
                    className={`flex h-10 flex-1 items-center px-4 text-sm font-medium ${
                      i === newFlow.length - 1
                        ? "bg-pac text-black"
                        : "border-2 border-pac/50 bg-pac/10 text-pac"
                    }`}
                  >
                    {step}
                  </div>
                  <span className="text-pac">▼</span>
                </div>
              ))}
            </div>
            <p className="pixel-font mt-6 text-center text-[10px] text-pac">
              DATA COLLECTED · 001020
            </p>
            <p className="mt-2 text-center text-sm font-medium text-pac">
              比赛会结束，运动员数据不会结束
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
