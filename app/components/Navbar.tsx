const navLinks = [
  { href: "#platform", label: "平台" },
  { href: "#data", label: "数据资产" },
  { href: "#shift", label: "核心转变" },
  { href: "#roadmap", label: "发展路径" },
  { href: "#case", label: "横琴案例" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-base text-white">
            🛶
          </span>
          <span className="text-lg font-bold tracking-wide text-white">
            桨刻
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#cta"
          className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500"
        >
          免费创建赛事
        </a>
      </div>
    </header>
  );
}
