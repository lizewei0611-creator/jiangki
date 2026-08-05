export default function CTA() {
  return (
    <section id="cta" className="border-t border-white/5 py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="mx-auto max-w-3xl text-3xl font-bold leading-tight text-white md:text-5xl md:leading-[1.2]">
          桨刻的入口是龙舟赛事，
          <br />
          <span className="bg-gradient-to-r from-red-500 to-amber-400 bg-clip-text text-transparent">
            核心是运动员数字身份
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          资产是赛事与成绩数据，未来目标是成为中国龙舟行业的数据基础设施。
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/demo/"
            className="rounded-full bg-red-600 px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-500"
          >
            免费创建赛事
          </a>
          <a
            href="mailto:hello@jiangki.com"
            className="rounded-full border border-white/15 px-8 py-3.5 text-base font-medium text-slate-200 transition-colors hover:border-white/40 hover:text-white"
          >
            联系销售
          </a>
        </div>
        <p className="mt-6 text-sm text-slate-500">
          无需注册，在线体验完整赛事流程：报名、队伍、成绩、门户与运动员档案
        </p>
      </div>
    </section>
  );
}
