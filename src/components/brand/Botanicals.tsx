import { cn } from "@/lib/utils";

/* Original botanical illustrations drawn for StuDeepby (no third-party artwork). */

export function Flower({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const rotations = [0, 72, 144, 216, 288];
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden>
      {rotations.map((r) => (
        <g key={r} transform={`rotate(${r} 100 100)`}>
          <path
            d="M100 100C66 74 64 24 100 6c36 18 34 68 0 94Z"
            fill="#E8F2E4"
            stroke="#78977C"
            strokeOpacity=".55"
            strokeWidth="1.2"
          />
          <path d="M100 96V30" stroke="#78977C" strokeOpacity=".4" strokeWidth="1" />
        </g>
      ))}
      <circle cx="100" cy="100" r="15" fill="#F0F3DF" stroke="#398564" strokeWidth="2" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle key={a} cx={100 + 7 * Math.cos((a * Math.PI) / 180)} cy={100 + 7 * Math.sin((a * Math.PI) / 180)} r="1.8" fill="#246B50" />
      ))}
    </svg>
  );
}

export function Leaf({ className, style, tone = "sage" }: { className?: string; style?: React.CSSProperties; tone?: "sage" | "mint" | "emerald" | "forest" }) {
  const fills = { sage: "#78977C", mint: "#B9D6BD", emerald: "#398564", forest: "#246B50" };
  return (
    <svg viewBox="0 0 160 110" className={className} style={style} aria-hidden>
      <path d="M6 96C14 38 72 6 154 8c-4 62-52 108-148 88Z" fill={fills[tone]} />
      <path d="M6 96C52 70 96 44 148 14" stroke="#F7F8EF" strokeOpacity=".55" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M52 76l-4-20M82 58l-2-20M110 40l2-16" stroke="#F7F8EF" strokeOpacity=".35" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Sprig({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 120 260" className={className} style={style} aria-hidden>
      <path d="M60 256C56 190 62 110 60 14" stroke="#246B50" strokeWidth="3" fill="none" strokeLinecap="round" />
      {[
        [58, 200, -1, "#78977C"],
        [60, 160, 1, "#398564"],
        [58, 118, -1, "#B9D6BD"],
        [60, 80, 1, "#78977C"],
        [60, 46, -1, "#398564"],
      ].map(([y1, y, dir, fill], i) => (
        <path
          key={i}
          d="M0 0C-4-26 16-48 46-52c4 28-14 52-46 52Z"
          fill={fill as string}
          transform={`translate(${y1 as number} ${y as number}) scale(${dir as number} 1) rotate(${(dir as number) * -18})`}
        />
      ))}
    </svg>
  );
}

/** Hero artwork: a stack of study books with a sprout and bloom growing from it. */
export function HeroArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 440" className={className} role="img" aria-label="A sprout with a flower growing out of a stack of books">
      <defs>
        <linearGradient id="bookA" x1="0" x2="1">
          <stop offset="0" stopColor="#174D3C" />
          <stop offset="1" stopColor="#246B50" />
        </linearGradient>
        <linearGradient id="bookB" x1="0" x2="1">
          <stop offset="0" stopColor="#398564" />
          <stop offset="1" stopColor="#78977C" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#E4F1E4" stopOpacity=".55" />
          <stop offset="1" stopColor="#E4F1E4" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bloom" cx="50%" cy="85%" r="90%">
          <stop offset="0" stopColor="#F0F3DF" />
          <stop offset="1" stopColor="#B9D6BD" />
        </radialGradient>
      </defs>
      <circle cx="210" cy="200" r="190" fill="url(#glow)" />
      {/* books */}
      <g>
        <rect x="70" y="330" width="280" height="46" rx="12" fill="url(#bookA)" stroke="#B9D6BD" strokeOpacity=".5" />
        <rect x="82" y="340" width="256" height="8" rx="4" fill="#F0F3DF" opacity=".85" />
        <rect x="96" y="284" width="250" height="46" rx="12" fill="url(#bookB)" stroke="#F7F8EF" strokeOpacity=".5" />
        <rect x="110" y="294" width="224" height="8" rx="4" fill="#F7F8EF" opacity=".8" />
        <rect x="64" y="238" width="236" height="46" rx="12" fill="url(#bookA)" stroke="#B9D6BD" strokeOpacity=".5" />
        <rect x="78" y="248" width="208" height="8" rx="4" fill="#F0F3DF" opacity=".85" />
      </g>
      {/* stem */}
      <path d="M182 240C176 200 190 160 186 112" stroke="#E4F1E4" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* leaves */}
      <path d="M180 212C140 214 112 188 108 150c38-6 70 14 72 62Z" fill="#B9D6BD" />
      <path d="M180 212C142 186 134 150 146 118" stroke="#398564" strokeOpacity=".5" strokeWidth="2" fill="none" />
      <path d="M184 178C226 184 258 158 262 118c-40-4-76 16-78 60Z" fill="#78977C" />
      <path d="M184 150C218 140 226 112 214 84c-30 12-40 40-30 66Z" fill="#E4F1E4" />
      {/* bloom */}
      <g transform="translate(186 96)">
        {[0, 72, 144, 216, 288].map((r) => (
          <path key={r} transform={`rotate(${r})`} d="M0 0C-26-20-26-58 0-76c26 18 26 56 0 76Z" fill="url(#bloom)" stroke="#78977C" strokeOpacity=".6" />
        ))}
        <circle r="12" fill="#F0F3DF" stroke="#398564" strokeWidth="2" />
      </g>
      {/* floating study tags */}
      <g className="animate-float" style={{ ["--r" as string]: "-6deg" }}>
        <rect x="288" y="196" width="102" height="38" rx="19" fill="#F7F8EF" stroke="#C7D9C9" />
        <text x="339" y="220" textAnchor="middle" style={{ fontFamily: "var(--font-sora), sans-serif" }} fontSize="14" fontWeight="700" fill="#174D3C">PYQs</text>
      </g>
      <g className="animate-float" style={{ ["--r" as string]: "5deg", animationDelay: "-3s" }}>
        <rect x="14" y="146" width="92" height="38" rx="19" fill="#F7F8EF" stroke="#C7D9C9" />
        <text x="60" y="170" textAnchor="middle" style={{ fontFamily: "var(--font-sora), sans-serif" }} fontSize="14" fontWeight="700" fill="#174D3C">Notes</text>
      </g>
      <g className="animate-float" style={{ animationDelay: "-5s" }}>
        <rect x="300" y="290" width="104" height="38" rx="19" fill="#B9D6BD" />
        <text x="352" y="314" textAnchor="middle" style={{ fontFamily: "var(--font-sora), sans-serif" }} fontSize="14" fontWeight="700" fill="#174D3C">Videos</text>
      </g>
    </svg>
  );
}

export function FloatingFlower({ className, delay = 0, rotate = 0 }: { className?: string; delay?: number; rotate?: number }) {
  return (
    <Flower
      className={cn("pointer-events-none absolute animate-float drop-shadow-[0_14px_14px_rgba(23,77,60,0.25)]", className)}
      style={{ animationDelay: `${delay}s`, ["--r" as string]: `${rotate}deg` } as React.CSSProperties}
    />
  );
}
