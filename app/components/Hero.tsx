const flow = ["赛事", "俱乐部", "运动员", "成绩", "长期档案"];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.16),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-red-600/40 to-transparent"
      />
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-red-600/30 bg-red-600/10 px-4 py-1.5 text-sm text-red-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
          中国龙舟行业数据基础设施
        </div>
        <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl md:leading-[1.15]">
          比赛会结束，
          <span className="bg-gradient-to-r from-red-500 to-amber-400 bg-clip-text text-transparent">
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
            className="rounded-full bg-red-600 px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-500 hover:shadow-red-500/40"
          >
            免费创建赛事
          </a>
          <a
            href="#platform"
            className="rounded-full border border-white/15 px-8 py-3.5 text-base font-medium text-slate-200 transition-colors hover:border-white/40 hover:text-white"
          >
            了解平台
          </a>
        </div>
        <div className="mx-auto mt-16 flex max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-3 rounded-2xl border border-white/10 bg-white/5 px-8 py-5 text-sm text-slate-300 backdrop-blur">
          <span className="text-slate-500">数据流向</span>
          {flow.map((step, i) => (
            <span key={step} className="flex items-center gap-4">
              <span className="font-medium text-slate-200">{step}</span>
              {i < flow.length - 1 && (
                <span className="text-red-500">→</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
