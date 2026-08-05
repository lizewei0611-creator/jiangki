import { Pacman, Ghost, PacPellet, PixelTag } from "./arcade";

export default function CTA() {
  return (
    <section id="cta" className="dot-grid border-t-2 border-arcade-line py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <Ghost color="#ff2d55" size={28} />
          <PacPellet size={16} />
          <Pacman size={32} />
          <PacPellet size={16} />
          <Ghost color="#00e5ff" size={28} />
        </div>
        <p className="mt-8 pixel-font text-[10px] text-ghost-pink blink">
          INSERT COIN
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold leading-tight text-white md:text-5xl md:leading-[1.2]">
          桨刻的入口是龙舟赛事，
          <br />
          <span className="pixel-text-pac">核心是运动员数字身份</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          资产是赛事与成绩数据，未来目标是成为中国龙舟行业的数据基础设施。
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/demo/"
            className="pixel-border-pac bg-pac px-8 py-3.5 text-base font-bold text-black transition-transform hover:-translate-y-0.5"
          >
            ▶ 免费创建赛事
          </a>
          <a
            href="mailto:hello@jiangki.com"
            className="pixel-border px-8 py-3.5 text-base font-medium text-slate-200 transition-colors hover:text-pac"
          >
            联系销售
          </a>
        </div>
        <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-2">
          <div className="pixel-divider w-full" />
          <p className="pixel-font text-[9px] text-slate-500">
            NO REGISTRATION · NO COIN NEEDED · TRY NOW
          </p>
        </div>
        <p className="mt-3 text-sm text-slate-500">
          无需注册，在线体验完整赛事流程：报名、队伍、成绩、门户与运动员档案
        </p>
        <div className="mt-8">
          <PixelTag color="#5a6ac8">PLAYER 1 READY</PixelTag>
        </div>
      </div>
    </section>
  );
}
