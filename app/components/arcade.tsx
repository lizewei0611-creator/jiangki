import { CSSProperties } from "react";

export function Pacman({
  size = 36,
  running = false,
  duration = 6,
  distance = 260,
  className = "",
}: {
  size?: number;
  running?: boolean;
  duration?: number;
  distance?: number;
  className?: string;
}) {
  const style: CSSProperties = {
    width: size,
    height: size,
    ["--pac-distance" as string]: `${distance}px`,
    ["--pac-duration" as string]: `${duration}s`,
  };
  return (
    <span
      aria-hidden
      style={style}
      className={`pacman inline-block shrink-0 ${running ? "pacman-running" : ""} ${className}`}
    />
  );
}

export function Ghost({
  color = "#ff2d55",
  size = 34,
  className = "",
}: {
  color?: string;
  size?: number;
  className?: string;
}) {
  const eyeSize = Math.max(6, size * 0.2);
  const pupilSize = Math.max(2.5, size * 0.09);
  const offset = size * 0.22;
  return (
    <span
      aria-hidden
      className={`ghost-body inline-block shrink-0 ${className}`}
      style={{ width: size, height: size * 0.85, background: color }}
    >
      <span
        className="ghost-eye absolute rounded-full bg-white"
        style={{ width: eyeSize, height: eyeSize, left: offset, top: size * 0.22 }}
      >
        <span
          className="absolute rounded-full"
          style={{
            width: pupilSize,
            height: pupilSize,
            background: "#2436ff",
            right: pupilSize * 0.3,
            bottom: 0,
          }}
        />
      </span>
      <span
        className="ghost-eye absolute rounded-full bg-white"
        style={{ width: eyeSize, height: eyeSize, right: offset, top: size * 0.22 }}
      >
        <span
          className="absolute rounded-full"
          style={{
            width: pupilSize,
            height: pupilSize,
            background: "#2436ff",
            left: pupilSize * 0.3,
            bottom: 0,
          }}
        />
      </span>
    </span>
  );
}

export function PacDot({ size = 9, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className={`pac-dot inline-block shrink-0 ${className}`}
    />
  );
}

export function PacPellet({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className={`pac-pellet inline-block shrink-0 ${className}`}
    />
  );
}

export function DotRow({
  count = 12,
  step = 0.6,
  className = "",
}: {
  count?: number;
  step?: number;
  className?: string;
}) {
  return (
    <span aria-hidden className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="dot-eaten h-2.5 w-2.5 rounded-full bg-pac"
          style={
            {
              "--eat-order": i,
              "--eat-step": `${step}s`,
              "--eat-cycle": `${count * step}s`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}

export function PixelCard({
  children,
  className = "",
  pac = false,
}: {
  children: React.ReactNode;
  className?: string;
  pac?: boolean;
}) {
  return (
    <div className={`${pac ? "pixel-border-pac" : "pixel-border"} bg-arcade-2 ${className}`}>
      {children}
    </div>
  );
}

export function PixelTag({
  children,
  color = "#fee100",
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-block border-2 px-2.5 py-1 pixel-font text-[10px] ${className}`}
      style={{
        borderColor: color,
        color,
        boxShadow: `2px 2px 0 rgba(0,0,0,0.5)`,
      }}
    >
      {children}
    </span>
  );
}
