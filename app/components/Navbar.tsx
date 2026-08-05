import { Pacman } from "./arcade";

const navLinks = [
  { href: "#platform", label: "平台" },
  { href: "#data", label: "数据资产" },
  { href: "#shift", label: "核心转变" },
  { href: "#roadmap", label: "发展路径" },
  { href: "#case", label: "横琴案例" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-arcade-line bg-arcade/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center border-2 border-pac bg-pac text-sm font-bold text-black">
            桨
          </span>
          <span className="flex items-center gap-1.5 text-lg font-bold tracking-wide text-white">
            桨刻
            <Pacman size={14} />
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-pac"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="/demo/"
          className="border-2 border-pac bg-pac px-4 py-2 text-sm font-bold text-black transition-transform hover:-translate-y-0.5"
        >
          免费创建赛事
        </a>
      </div>
    </header>
  );
}
