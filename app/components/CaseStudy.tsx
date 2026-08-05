const features = [
  "体测",
  "选秀",
  "明星选手",
  "品牌战队",
  "老板选人",
  "数据排名",
  "全明星对抗",
];

export default function CaseStudy() {
  return (
    <section id="case" className="border-t border-white/5 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/50 p-10 md:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-600/20 blur-3xl"
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="text-sm font-medium tracking-widest text-red-400">
                BENCHMARK CASE
              </span>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                横琴龙舟赛：
                <br />
                桨刻的数据入口与品牌样板
              </h2>
              <p className="mt-5 leading-8 text-slate-400">
                第三届横琴龙舟赛如果采用体测、选秀与品牌战队机制，它就不只是一场比赛，
                而是桨刻验证「运动员数据平台」的机会：沉淀顶尖运动员数据、150米体测成绩、
                选秀顺位、品牌战队数据、赛事成绩与运动员个人档案。
              </p>
              <a
                href="#cta"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-500"
              >
                与桨刻合作
                <span aria-hidden>→</span>
              </a>
            </div>
            <div className="flex flex-wrap gap-3">
              {features.map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur transition-colors hover:border-red-600/40"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span className="text-sm font-medium text-slate-200">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
