import Link from "next/link";
import Game from "./Game";
import { CITIES, HENGQIN } from "@/lib/cities";
import {
  Ghost,
  Pacman,
  PacDot,
  PacPellet,
  PixelCard,
  PixelTag,
} from "../components/arcade";

export const metadata = {
  title: "大湾区龙舟漫游 · 9+2+1 · 桨刻",
  description:
    "驾驶小龙舟漫游大湾区：收集浪花点、点亮 11 座城市，生成你的龙舟身份卡。大湾区不只是 9+2 个城市，还有 +1 个你。",
};

export default function DragonPage() {
  return (
    <main className="bg-arcade text-slate-100">
      <Hero />
      <GameSection />
      <CityMatrix />
      <IdentityCta />
      <RaceSection />
      <PartnerCta />
    </main>
  );
}

/* ---------- 1. 9+2+1 首屏 ---------- */

function Hero() {
  return (
    <section className="dot-grid-pac relative overflow-hidden pt-28 pb-20 md:pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,229,255,0.10),transparent_55%)]"
      />
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <PacPellet size={16} />
          <PixelTag color="#00e5ff">9 + 2 + 1 · 龙抬头</PixelTag>
          <PacPellet size={16} />
        </div>
        <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl md:leading-[1.15]">
          大湾区不只是
          <span className="pixel-text-cyan"> 9+2 </span>
          个城市
          <br />
          还有 <span className="pixel-text-pac">+1 个你</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          9 座珠三角城市 + 香港 + 澳门，再加上每一个龙舟人。
          驾驶你的小龙舟漫游大湾区，点亮城市，收集浪花，生成属于你的龙舟身份。
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#game"
            className="pixel-border-pac bg-pac px-8 py-3.5 text-base font-bold text-black transition-transform hover:-translate-y-0.5"
          >
            ▶ 开始漫游
          </a>
          <a
            href="#cities"
            className="pixel-border px-8 py-3.5 text-base font-medium text-slate-200 transition-colors hover:text-pac"
          >
            看看 11 座城市
          </a>
        </div>
        <div className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-3">
          {CITIES.map((c) => (
            <span
              key={c.id}
              className="flex items-center gap-2 border border-arcade-line bg-arcade-2/80 px-3 py-1.5 text-sm text-slate-300"
            >
              <span className="h-2.5 w-2.5" style={{ background: c.color }} />
              {c.name}
            </span>
          ))}
          <span className="flex items-center gap-2 border-2 border-pac bg-pac/10 px-3 py-1.5 text-sm font-bold text-pac">
            <PacDot size={8} />
            +1 你
          </span>
        </div>
      </div>
    </section>
  );
}

/* ---------- 2. 游戏互动区 ---------- */

function GameSection() {
  return (
    <section id="game" className="border-t-2 border-arcade-line py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3">
            <Ghost color="#ff2d55" size={24} />
            <span className="pixel-font text-[10px] tracking-widest text-ghost-pink">
              MINI GAME · 60 SECONDS
            </span>
            <Ghost color="#00e5ff" size={24} />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            大湾区龙舟漫游
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            限时 60 秒：收集浪花点积攒划桨力量，经过城市节点点亮大湾区。
              小心顺风与逆风，把你的名字刻进排行榜。
          </p>
        </div>
        <Game />
      </div>
    </section>
  );
}

/* ---------- 3. 9+2 城市龙舟文化矩阵 ---------- */

function CityMatrix() {
  return (
    <section id="cities" className="border-t-2 border-arcade-line py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <span className="pixel-font text-[10px] tracking-widest text-ghost-orange">
            9 + 2 CITIES
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            十一座城市，十一支桨
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            每座城市都有自己的龙舟故事。你的漫游足迹，将成为这个矩阵的一部分。
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CITIES.map((c) => (
            <PixelCard key={c.id} className="group p-6 transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span
                  className="flex h-10 w-10 items-center justify-center border-2 font-bold text-white"
                  style={{ borderColor: c.color, background: `${c.color}22` }}
                >
                  {c.short}
                </span>
                <span className="pixel-font text-[9px] text-slate-600">{c.color === "#fee100" ? "HONG KONG" : c.id.toUpperCase()}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">{c.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{c.desc}</p>
              <div className="mt-4 flex items-center gap-2">
                <PacDot size={7} />
                <PacDot size={7} />
                <PacDot size={7} />
              </div>
            </PixelCard>
          ))}
          <div className="pixel-border-pac flex flex-col items-center justify-center gap-3 p-6 text-center">
            <Pacman size={30} />
            <h3 className="text-lg font-bold text-pac">+1 你</h3>
            <p className="text-sm leading-6 text-slate-300">
              玩一局《大湾区龙舟漫游》，把你的名字加进这张地图。
            </p>
            <span className="mt-2 border-2 border-pac bg-pac px-4 py-1.5 text-sm font-bold text-black">
              9+2+1
            </span>
          </div>
        </div>
        <div className="mt-8 text-center">
          <span className="pixel-font text-[10px] text-slate-500">
            ★ HENGQIN · 横琴 · 第三届龙抬头赛事所在地 ★
          </span>
          <div className="mt-3 inline-flex items-center gap-2 border border-arcade-line bg-arcade-2 px-5 py-3 text-sm text-slate-300">
            <span className="h-3 w-3 rotate-45 border-2 border-pac bg-pac" />
            {HENGQIN.name} —— 数据入口与品牌样板，全明星对抗的舞台
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. 个人身份卡引导 ---------- */

function IdentityCta() {
  return (
    <section className="border-t-2 border-arcade-line py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="pixel-border-pac grid items-center gap-10 bg-gradient-to-br from-arcade-2 to-arcade-3 p-10 md:grid-cols-2 md:p-14">
          <div>
            <PixelTag color="#ff9ad5">PLAYER 1 · INSERT COIN</PixelTag>
            <h2 className="mt-5 text-3xl font-bold text-white md:text-4xl">
              你的龙舟身份，
              <br />
              <span className="pixel-text-pac">由每一次比赛累积</span>
            </h2>
            <p className="mt-5 leading-8 text-slate-400">
              游戏结束后生成的龙舟身份卡，就是桨刻运动员数字身份的雏形：
              参赛记录、历史成绩、荣誉与成长曲线，全部沉淀进你的长期档案。
              比赛会结束，运动员数据不会结束。
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "解锁的城市 = 你的参赛足迹",
                "浪花值 = 你的划桨力量值",
                "称号 = 你的等级与荣誉",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="text-pac">▶</span>
                  {t}
                </li>
              ))}
            </ul>
            <a
              href="/demo/"
              className="mt-8 inline-block border-2 border-pac bg-pac px-7 py-3 font-bold text-black transition-transform hover:-translate-y-0.5"
            >
              保存我的龙舟身份 →
            </a>
          </div>
          <div className="relative mx-auto w-full max-w-[280px]">
            <div className="pixel-border-pac relative bg-arcade-2 p-6 text-center">
              <span className="pixel-font text-[9px] text-ghost-cyan">
                9+2+1 RANK CARD
              </span>
              <p className="mt-4 text-4xl">🌊</p>
              <p className="mt-3 text-2xl font-bold text-pac">珠江弄潮儿</p>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-white">1120</p>
                  <p className="text-[10px] text-slate-500">浪花值</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-ghost-cyan">7/11</p>
                  <p className="text-[10px] text-slate-500">城市</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-ghost-pink">#12</p>
                  <p className="text-[10px] text-slate-500">排名</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                {["广州", "深圳", "珠海", "佛山", "中山", "江门", "香港"].map((n) => (
                  <span
                    key={n}
                    className="h-3 w-3"
                    style={{ background: CITIES.find((c) => c.name === n)?.color }}
                  />
                ))}
              </div>
              <div className="mt-6 border-t-2 border-arcade-line pt-4">
                <p className="text-xs text-slate-500">保存 → 加入桨刻，长期累积</p>
              </div>
              <Ghost color="#00e5ff" size={24} className="absolute -top-3 -right-3" />
              <PacDot size={10} className="absolute -bottom-2 -left-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 5. 赛事介绍 ---------- */

function RaceSection() {
  const items = [
    { icon: "🏋️", t: "体测", d: "150 米体测，数字化记录每位选手的硬实力" },
    { icon: "🎯", t: "选秀", d: "数据排名生成选秀顺位，老板现场选人" },
    { icon: "⭐", t: "明星选手", d: "顶尖运动员拥有可沉淀的个人档案" },
    { icon: "🚩", t: "品牌战队", d: "企业冠名组队，把赞助变成战绩" },
    { icon: "👔", t: "老板选人", d: "真金白银投入，赛事即人才市场" },
    { icon: "🏆", t: "全明星对抗", d: "数据排名决出全明星，对抗横琴之夜" },
  ];
  return (
    <section className="border-t-2 border-arcade-line py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <div className="flex items-center justify-center gap-3">
            <Ghost color="#ffa52c" size={24} />
            <span className="pixel-font text-[10px] tracking-widest text-ghost-red">
              READY? · 第三届龙抬头
            </span>
            <Ghost color="#ff9ad5" size={24} />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            这不是一场比赛，是一场数据化的选秀
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            第三届横琴龙舟赛：体测、选秀、品牌战队、数据排名、全明星对抗——
            每一桨都有记录，每一位选手都有档案。
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <PixelCard key={it.t} className="flex items-start gap-4 p-6">
              <span className="text-3xl">{it.icon}</span>
              <div>
                <h3 className="font-bold text-white">{it.t}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-400">{it.d}</p>
              </div>
            </PixelCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 6. 招商合作入口 ---------- */

function PartnerCta() {
  return (
    <section className="dot-grid border-t-2 border-arcade-line py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <Ghost color="#ff2d55" size={26} />
          <Ghost color="#ff9ad5" size={22} />
          <Pacman size={30} />
          <Ghost color="#00e5ff" size={22} />
          <Ghost color="#ffa52c" size={26} />
        </div>
        <p className="mt-6 pixel-font text-[10px] text-ghost-cyan blink">
          PARTNER RECRUITING
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold text-white md:text-5xl">
          把品牌，变成大湾区
          <span className="pixel-text-pac">排行榜上的名字</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          品牌战队、城市赛道、全明星之夜：你的 logo 出现在赛场上，
          出现在每个玩家解锁的城市里，出现在百万次分享的身份卡上。
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { v: "9+2+1", l: "城市传播矩阵" },
            { v: "60s", l: "一局即上手" },
            { v: "∞", l: "分享身份卡传播" },
          ].map((s) => (
            <div key={s.l} className="pixel-border bg-arcade-2 py-6">
              <p className="text-3xl font-bold text-pac">{s.v}</p>
              <p className="mt-2 text-sm text-slate-400">{s.l}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="mailto:hello@jiangki.com?subject=湾区龙舟漫游合作"
            className="pixel-border-pac bg-pac px-8 py-3.5 text-base font-bold text-black transition-transform hover:-translate-y-0.5"
          >
            ▶ 成为合作伙伴
          </a>
          <Link
            href="/"
            className="pixel-border px-8 py-3.5 text-base font-medium text-slate-200 transition-colors hover:text-pac"
          >
            了解桨刻平台
          </Link>
        </div>
        <div className="mx-auto mt-8 flex max-w-md items-center gap-3">
          <div className="pixel-divider flex-1" />
          <span className="pixel-font text-[9px] text-slate-500">
            9 + 2 + 1 = EVERY ROWER
          </span>
          <div className="pixel-divider flex-1" />
        </div>
      </div>
    </section>
  );
}
