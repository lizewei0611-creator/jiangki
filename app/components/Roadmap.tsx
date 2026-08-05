const phases = [
  {
    phase: "PHASE 1",
    title: "赛事数字化工具",
    status: "现在",
    desc: "先服务赛事主办方：报名系统、队伍管理、成绩管理、小程序展示、后台管理，跑通真实赛事，拿到第一批数据。",
    model: "按场收费 5000 ~ 30000 元/场",
    goals: ["跑通真实赛事", "拿到现金流", "建立标杆案例", "积累首批运动员数据"],
  },
  {
    phase: "PHASE 2",
    title: "运动员数字身份平台",
    status: "下一步",
    desc: "每个运动员拥有一个长期身份：个人中心、多身份体系、俱乐部体系、运动员档案、隐私权限、成绩归档、防重复报名。",
    model: "运动员会员 + 俱乐部 SaaS",
    goals: ["运动员长期档案", "俱乐部管理服务", "防重复报名", "身份认证体系"],
  },
  {
    phase: "PHASE 3",
    title: "行业数据基础设施",
    status: "愿景",
    desc: "数据积累足够后，成为真正意义上的中国龙舟运动数据平台：赛事 SaaS、人才数据库、赞助商数据服务、官方成绩数据库。",
    model: "行业入口 + 数据资产 + 生态关系",
    goals: ["官方认证成绩库", "人才数据库", "赞助商匹配", "城市体育文旅数据"],
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="border-t border-white/5 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <span className="text-sm font-medium tracking-widest text-red-400">
            ROADMAP
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            三个阶段的增长路径
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            近期靠赛事服务费赚钱，中期沉淀俱乐部和运动员数据，长期以行业数据与生态服务变现。
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {phases.map((p) => (
            <div
              key={p.phase}
              className="relative flex flex-col rounded-2xl border border-white/10 bg-slate-900/60 p-8 transition-all hover:-translate-y-1 hover:border-red-600/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-widest text-red-400">
                  {p.phase}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    p.status === "现在"
                      ? "bg-red-600 text-white"
                      : p.status === "下一步"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-white/10 text-slate-400"
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-bold text-white">{p.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-slate-400">
                {p.desc}
              </p>
              <div className="mt-6 rounded-lg border border-red-600/20 bg-red-950/30 px-4 py-3 text-sm font-medium text-red-300">
                {p.model}
              </div>
              <ul className="mt-5 space-y-2.5">
                {p.goals.map((g) => (
                  <li key={g} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <span className="text-red-500">✓</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
