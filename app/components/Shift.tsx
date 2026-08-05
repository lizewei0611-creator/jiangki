import { Ghost, PacDot, PixelCard, PixelTag } from "./arcade";

const oldTree = ["赛事", "队伍", "成员", "成绩"];
const newTree = ["运动员", "俱乐部", "赛事", "成绩", "长期档案"];

export default function Shift() {
  return (
    <section id="shift" className="border-t-2 border-arcade-line py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <span className="pixel-font text-[10px] tracking-widest text-ghost-orange">
            GAME DIRECTION
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            从「赛事中心」转向「运动员中心」
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            桨刻不是只记录「某场比赛有哪些队伍」，而是记录：这个运动员是谁，
            他参加过什么比赛，取得过什么成绩，未来还能如何成长。
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <PixelCard className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <PixelTag color="#5a6ac8">PAST</PixelTag>
              <Ghost color="#5a6ac8" size={22} className="opacity-50" />
            </div>
            <div className="flex flex-col gap-4">
              {oldTree.map((node) => (
                <div key={node} className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center border-2 border-arcade-line bg-arcade-3/60 text-sm text-slate-500">
                    {node.slice(0, 1)}
                  </div>
                  <div className="flex-1 text-sm text-slate-400">{node}</div>
                  <div className="h-0.5 flex-1 bg-arcade-line" />
                  <div className="h-2 w-2 bg-arcade-line" />
                </div>
              ))}
            </div>
            <p className="pixel-font mt-6 text-center text-[10px] text-slate-500">
              DATA RESET · EVERY EVENT
            </p>
          </PixelCard>
          <div className="pixel-border-pac bg-arcade-2 p-8">
            <div className="mb-6 flex items-center justify-between">
              <PixelTag color="#fee100">NEXT</PixelTag>
              <PacDot size={8} />
            </div>
            <div className="flex flex-col gap-4">
              {newTree.map((node, i) => (
                <div key={node} className="flex items-center gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center border-2 text-sm font-bold ${
                      i === 0
                        ? "border-pac bg-pac text-black"
                        : "border-pac/50 bg-pac/10 text-pac"
                    }`}
                  >
                    {node.slice(0, 1)}
                  </div>
                  <div className="flex-1 text-sm font-medium text-slate-200">
                    {node}
                  </div>
                  <div className="h-0.5 flex-1 bg-pac/30" />
                  <div className="h-2 w-2 bg-pac" />
                </div>
              ))}
            </div>
            <p className="pixel-font mt-6 text-center text-[10px] text-pac">
              DATA PERSISTS · FOREVER
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
