const oldTree = ["赛事", "队伍", "成员", "成绩"];
const newTree = ["运动员", "俱乐部", "赛事", "成绩", "长期档案"];

export default function Shift() {
  return (
    <section id="shift" className="border-t border-white/5 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <span className="text-sm font-medium tracking-widest text-red-400">
            THE SHIFT
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            从「赛事中心」转向「运动员中心」
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            桨刻不是只记录「某场比赛有哪些队伍」，而是记录：这个运动员是谁，
            他参加过什么比赛，取得过什么成绩，未来还能如何成长。
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8">
            <p className="mb-6 text-sm font-medium text-slate-500">过去</p>
            <div className="flex flex-col gap-4">
              {oldTree.map((node) => (
                <div key={node} className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-800 text-sm text-slate-500">
                    {node.slice(0, 1)}
                  </div>
                  <div className="flex-1 text-sm text-slate-400">{node}</div>
                  <div className="h-px flex-1 bg-slate-800" />
                  <div className="h-2 w-2 rounded-full bg-slate-700" />
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-slate-500">
              数据跟着比赛走，比赛结束一切清零
            </p>
          </div>
          <div className="relative rounded-2xl border border-red-600/30 bg-gradient-to-b from-red-950/40 to-slate-900/60 p-8">
            <p className="mb-6 text-sm font-medium text-red-400">未来</p>
            <div className="flex flex-col gap-4">
              {newTree.map((node, i) => (
                <div key={node} className="flex items-center gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-lg text-sm font-bold text-white ${
                      i === 0
                        ? "bg-gradient-to-br from-red-500 to-amber-400"
                        : "bg-red-900/40 ring-1 ring-red-600/30"
                    }`}
                  >
                    {node.slice(0, 1)}
                  </div>
                  <div className="flex-1 text-sm font-medium text-red-100">
                    {node}
                  </div>
                  <div className="h-px flex-1 bg-red-800/60" />
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-red-300">
              数据跟着运动员走，长期积累，永不结束
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
