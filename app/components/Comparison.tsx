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
    <section id="comparison" className="border-t border-white/5 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
          如果只是报名系统，比赛结束价值就结束了
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
          传统系统跟着一场比赛走，比赛结束、价值结束。桨刻让数据留下来。
        </p>
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8">
            <div className="mb-6 flex items-center gap-2">
              <span className="rounded-md bg-slate-700 px-2.5 py-1 text-xs font-medium text-slate-300">
                传统逻辑
              </span>
              <span className="text-sm text-slate-500">赛事中心</span>
            </div>
            <div className="flex flex-col gap-3">
              {oldFlow.map((step) => (
                <div key={step} className="flex items-center gap-4">
                  <div className="flex h-10 flex-1 items-center rounded-lg bg-slate-800/80 px-4 text-sm text-slate-400">
                    {step}
                  </div>
                  <span className="text-slate-600">↓</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-sm font-medium text-slate-500">
              比赛结束 → 系统价值结束
            </p>
          </div>
          <div className="rounded-2xl border border-red-600/30 bg-gradient-to-b from-red-950/40 to-slate-900/60 p-8 shadow-xl shadow-red-950/20">
            <div className="mb-6 flex items-center gap-2">
              <span className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white">
                桨刻逻辑
              </span>
              <span className="text-sm text-slate-400">运动员中心</span>
            </div>
            <div className="flex flex-col gap-3">
              {newFlow.map((step, i) => (
                <div key={step} className="flex items-center gap-4">
                  <div
                    className={`flex h-10 flex-1 items-center rounded-lg px-4 text-sm font-medium ${
                      i === newFlow.length - 1
                        ? "bg-gradient-to-r from-red-600 to-amber-500 text-white"
                        : "bg-red-900/30 text-red-100 ring-1 ring-red-600/30"
                    }`}
                  >
                    {step}
                  </div>
                  <span className="text-red-500">↓</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-sm font-medium text-red-300">
              比赛会结束，运动员数据不会结束
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
