import { Ghost, PacDot, PixelCard, PixelTag } from "./arcade";

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
    icon: "👤",
    title: "运动员数据",
    desc: "运动员 ID · 姓名 · 年龄 · 身高体重 · 所属地区 · 所属俱乐部 · 擅长位置 · 参赛记录 · 历史成绩 · 荣誉记录 · 体测数据 · 成长曲线",
  },
  {
    icon: "🚣",
    title: "俱乐部数据",
    desc: "俱乐部名称 · 队员名单 · 领队/管理员 · 历史参赛记录 · 俱乐部成绩 · 俱乐部荣誉 · 队伍实力变化",
  },
  {
    icon: "🏁",
    title: "赛事数据",
    desc: "赛事名称 · 赛事地点 · 赛事组别 · 报名队伍 · 参赛运动员 · 比赛成绩 · 名次 · 官方认证成绩",
  },
  {
    icon: "🏆",
    title: "成绩与表现数据",
    desc: "100米成绩 · 200米成绩 · 500米成绩 · 150米体测成绩 · 选秀顺位 · 队伍排名 · 个人历史表现",
  },
];

export default function DataAssets() {
  return (
    <section id="data" className="border-t-2 border-arcade-line py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <span className="pixel-font text-[10px] tracking-widest text-ghost-pink">
            PLAYER SELECT
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            桨刻最重要的资产，不是代码，是数据
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            运动员、俱乐部、赛事与成绩数据持续沉淀，最终构成中国龙舟行业的可信数据基础设施。
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-5">
          <PixelCard pac className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <PixelTag color="#fee100">PLAYER 1</PixelTag>
              <PacDot size={8} />
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center border-2 border-pac bg-pac/10 text-2xl font-bold text-pac pixel-pop">
                {profile.name.slice(0, 1)}
              </div>
              <div>
                <p className="text-lg font-bold text-white">{profile.name}</p>
                <p className="pixel-font text-[10px] text-pac">{profile.id}</p>
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
                  className="flex items-center justify-between border-b-2 border-arcade-line pb-3"
                >
                  <dt className="text-slate-400">{k}</dt>
                  <dd className="font-medium text-white">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6">
              <p className="mb-2 pixel-font text-[10px] text-ghost-cyan">
                GROWTH CURVE
              </p>
              <div className="flex h-14 items-end gap-1.5">
                {[30, 45, 38, 60, 55, 75, 70, 90].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="flex-1 border border-pac/40 bg-gradient-to-t from-arcade-3 to-pac/60"
                  />
                ))}
              </div>
            </div>
          </PixelCard>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-3">
            {assets.map((a) => (
              <PixelCard key={a.title} className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center border-2 border-pac/40 bg-arcade-3 text-base">
                    {a.icon}
                  </span>
                  <h3 className="text-base font-bold text-white">{a.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-400">{a.desc}</p>
                <div className="mt-4 flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <PacDot key={i} size={7} />
                  ))}
                </div>
              </PixelCard>
            ))}
            <div className="flex items-center justify-center gap-4 border-2 border-dashed border-arcade-line py-6 sm:col-span-2">
              <Ghost color="#ff9ad5" size={26} />
              <span className="pixel-font text-[10px] text-slate-500">
                MORE DATA · POWER-UP INCOMING
              </span>
              <Ghost color="#ffa52c" size={26} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
