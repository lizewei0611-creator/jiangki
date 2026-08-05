const profile = {
  id: "CN-LZ-000001",
  name: "张三",
  club: "横琴龙舟队",
  events: "8 场",
  best: "500米 2分10秒",
  seat: "2号桨",
  honors: "冠军 ×3",
};

const assets = [
  {
    title: "运动员数据",
    desc: "运动员 ID · 姓名 · 年龄 · 身高体重 · 所属地区 · 所属俱乐部 · 擅长位置 · 参赛记录 · 历史成绩 · 荣誉记录 · 体测数据 · 成长曲线",
  },
  {
    title: "俱乐部数据",
    desc: "俱乐部名称 · 队员名单 · 领队/管理员 · 历史参赛记录 · 俱乐部成绩 · 俱乐部荣誉 · 队伍实力变化",
  },
  {
    title: "赛事数据",
    desc: "赛事名称 · 赛事地点 · 赛事组别 · 报名队伍 · 参赛运动员 · 比赛成绩 · 名次 · 官方认证成绩",
  },
  {
    title: "成绩与表现数据",
    desc: "100米成绩 · 200米成绩 · 500米成绩 · 150米体测成绩 · 选秀顺位 · 队伍排名 · 个人历史表现",
  },
];

export default function DataAssets() {
  return (
    <section id="data" className="border-t border-white/5 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <span className="text-sm font-medium tracking-widest text-red-400">
            DATA ASSETS
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            桨刻最重要的资产，不是代码，是数据
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            运动员、俱乐部、赛事与成绩数据持续沉淀，最终构成中国龙舟行业的可信数据基础设施。
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="rounded-2xl border border-red-600/30 bg-gradient-to-b from-red-950/40 to-slate-900/60 p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium tracking-widest text-red-400">
                运动员数字档案
              </span>
              <span className="rounded-full bg-red-600/20 px-2.5 py-0.5 text-xs text-red-300">
                示例
              </span>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-amber-400 text-2xl font-bold text-white">
                张
              </div>
              <div>
                <p className="text-lg font-bold text-white">{profile.name}</p>
                <p className="font-mono text-xs text-red-300">{profile.id}</p>
              </div>
            </div>
            <dl className="mt-6 space-y-3 text-sm">
              {[
                ["所属俱乐部", profile.club],
                ["参加赛事", profile.events],
                ["最好成绩", profile.best],
                ["擅长位置", profile.seat],
                ["荣誉记录", profile.honors],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between border-b border-white/5 pb-3"
                >
                  <dt className="text-slate-400">{k}</dt>
                  <dd className="font-medium text-white">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6">
              <p className="mb-2 text-xs text-slate-500">成长曲线</p>
              <div className="flex h-14 items-end gap-1.5">
                {[30, 45, 38, 60, 55, 75, 70, 90].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="flex-1 rounded-sm bg-gradient-to-t from-red-700 to-red-400"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-3">
            {assets.map((a) => (
              <div
                key={a.title}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition-colors hover:border-white/20"
              >
                <h3 className="flex items-center gap-2 text-base font-bold text-white">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  {a.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
