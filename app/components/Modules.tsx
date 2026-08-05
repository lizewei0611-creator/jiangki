import { Ghost, PixelCard, PixelTag } from "./arcade";

const ghostColors = ["#ff2d55", "#ff9ad5", "#00e5ff", "#ffa52c"];

const modules = [
  {
    stage: "STAGE 1",
    icon: "🏁",
    title: "赛事管理工具",
    tag: "当前阶段",
    desc: "解决赛事主办方的实际问题，把微信群 + Excel + 人工统计的流程变成数字化系统。",
    points: [
      "发布赛事 · 队伍报名",
      "队员管理 · 成绩录入",
      "成绩发布 · 小程序展示",
      "后台管理 · Excel 导入导出",
    ],
    audience: ["赛事主办方", "龙舟协会", "文旅单位", "政府体育部门", "活动执行公司"],
  },
  {
    stage: "STAGE 2",
    icon: "🏅",
    title: "运动员数字身份平台",
    tag: "第二阶段",
    desc: "每个运动员拥有一个长期身份，参赛不再是「一次性报名」，而是持续积累的个人档案。",
    points: [
      "个人中心 · 运动员档案",
      "多身份体系 · 防重复报名",
      "成绩归档 · 隐私权限",
      "历史荣誉 · 成长曲线",
    ],
    audience: ["注册运动员", "专业俱乐部", "选秀 / 体测体系"],
  },
  {
    stage: "STAGE 3",
    icon: "🚣",
    title: "俱乐部管理平台",
    tag: "第二阶段",
    desc: "让俱乐部沉淀队员名单、参赛记录与实力变化，队伍管理从口头沟通变成数据资产。",
    points: [
      "队员名单 · 领队管理",
      "历史参赛记录",
      "俱乐部成绩 · 荣誉",
      "队伍实力变化追踪",
    ],
    audience: ["龙舟俱乐部", "品牌战队", "高校队伍"],
  },
  {
    stage: "STAGE 4",
    icon: "🗄️",
    title: "赛事数据系统",
    tag: "贯穿全程",
    desc: "比赛会结束，但成绩、名次与官方认证数据永远保留，成为行业的可信数据源。",
    points: [
      "100 / 200 / 500 米成绩",
      "150 米体测成绩",
      "选秀顺位 · 队伍排名",
      "官方认证成绩库",
    ],
    audience: ["官方成绩库", "人才数据库", "赞助商数据服务"],
  },
];

export default function Modules() {
  return (
    <section id="platform" className="border-t-2 border-arcade-line py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <div className="flex items-center justify-center gap-3">
            <Ghost color="#ff2d55" size={24} />
            <span className="pixel-font text-[10px] tracking-widest text-ghost-cyan">
              SELECT YOUR STAGE
            </span>
            <Ghost color="#00e5ff" size={24} />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            一个平台，四层能力
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            从办赛工具起步，逐步成为运动员、俱乐部与赛事数据的共同底座。
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {modules.map((m, i) => (
            <PixelCard
              key={m.title}
              className="group p-8 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className="pixel-font text-[10px]"
                    style={{ color: ghostColors[i % 4] }}
                  >
                    {m.stage}
                  </span>
                  <div className="mt-3 text-3xl">{m.icon}</div>
                </div>
                <div className="flex items-center gap-2">
                  <PixelTag color="#5a6ac8">{m.tag}</PixelTag>
                  <PacDotSmall />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">{m.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{m.desc}</p>
              <ul className="mt-5 space-y-2">
                {m.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-2.5 text-sm text-slate-300"
                  >
                    <span className="h-2 w-2 shrink-0 bg-pac" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2 border-t-2 border-arcade-line pt-5">
                {m.audience.map((a) => (
                  <span
                    key={a}
                    className="border border-arcade-line bg-arcade-3/60 px-2.5 py-1 text-xs text-slate-400"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </PixelCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function PacDotSmall() {
  return <span className="pac-pellet inline-block h-3.5 w-3.5" />;
}
