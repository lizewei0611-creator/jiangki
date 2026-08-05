import { PacDot, Ghost } from "./arcade";

export default function Footer() {
  return (
    <footer className="border-t-2 border-arcade-line py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center border-2 border-pac bg-pac text-xs font-bold text-black">
            桨
          </span>
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-white">
              桨刻
              <PacDot size={6} />
            </p>
            <p className="text-xs text-slate-500">
              以龙舟赛事为入口的行业数据平台
            </p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
          <a href="#platform" className="transition-colors hover:text-pac">
            平台
          </a>
          <a href="#data" className="transition-colors hover:text-pac">
            数据资产
          </a>
          <a href="#roadmap" className="transition-colors hover:text-pac">
            发展路径
          </a>
          <a
            href="mailto:hello@jiangki.com"
            className="transition-colors hover:text-pac"
          >
            hello@jiangki.com
          </a>
        </nav>
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <Ghost color="#ff2d55" size={16} />
          <span>
            © {new Date().getFullYear()} 桨刻 · 龙舟赛事数字化平台
          </span>
        </div>
      </div>
    </footer>
  );
}
