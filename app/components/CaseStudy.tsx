import { Ghost, PacPellet, PixelTag } from "./arcade";

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
    <section id="case" className="border-t-2 border-arcade-line py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="pixel-border-pac relative bg-gradient-to-br from-arcade-2 via-arcade-2 to-arcade-3 p-10 md:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 opacity-30"
            style={{
              background:
                "repeating-linear-gradient(0deg, #fee100 0 6px, transparent 6px 12px), repeating-linear-gradient(90deg, #fee100 0 6px, transparent 6px 12px)",
            }}
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-3">
                <PacPellet size={14} />
                <PixelTag color="#00e5ff">READY?</PixelTag>
              </div>
              <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
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
                className="mt-8 inline-flex items-center gap-2 border-2 border-pac bg-pac px-6 py-3 text-sm font-bold text-black transition-transform hover:-translate-y-0.5"
              >
                ▶ 与桨刻合作
              </a>
            </div>
            <div className="flex flex-wrap gap-3">
              {features.map((f, i) => (
                <div
                  key={f}
                  className="flex items-center gap-3 border-2 border-arcade-line bg-arcade-3/60 px-5 py-4 transition-colors hover:border-pac/60"
                >
                  <span
                    className="h-2 w-2"
                    style={{
                      background: ["#ff2d55", "#ff9ad5", "#00e5ff", "#ffa52c"][i % 4],
                    }}
                  />
                  <span className="text-sm font-medium text-slate-200">{f}</span>
                </div>
              ))}
              <div className="flex w-full items-center gap-3 px-1">
                <Ghost color="#ff2d55" size={26} />
                <Ghost color="#ff9ad5" size={22} />
                <Ghost color="#00e5ff" size={26} />
                <Ghost color="#ffa52c" size={22} />
                <span className="pixel-font text-[9px] text-slate-500">
                  4 GHOSTS · READY TO RACE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
